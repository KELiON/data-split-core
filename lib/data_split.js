(function () {
   'use strict';

   function DataSplit(opts){
     opts = opts || {};

     var options = {
       maxLength: opts.maxLength || 500,
       DATA_REGEXP: opts.dataRegexp || /url\(('|")?data/g
     };

     var postcss  = require('postcss');
     var inlines = postcss.root();

     var clone = function(rule){
       if (!rule.__dup) {
         // cache clones to prevent duplicates in inlines target
         rule.__dup = rule.clone();
       }
       return rule.__dup;
     };

     var isEmpty = function(rule) {
       return (rule.decls && rule.decls.length === 0) ||
         (rule.rules && rule.rules.length === 0);
     };

     var removeRule = function(rule) {
       var parent = rule.parent;
       rule.removeSelf();
       if (parent && isEmpty(parent)){
         // remove empty selectors
         removeRule(parent);
       }
     };

     var moveRule = function(rule){
       var parent = rule.parent;
       var dup = null;

       removeRule(rule);

       while (parent.type != 'root') {
         if (!parent.__dup) {
           parent.__dup = parent.clone();
           var fn = 'eachDecl';
           if (parent.__dup.rules) {
             fn = 'eachRule';
           }
           parent.__dup[fn](removeRule);
         }
         dup = parent.__dup;
         dup.append(rule);
         rule = dup;
         parent = parent.parent;
       }
       if (!dup.__inserted) {
         inlines.append(dup);
         dup.__inserted = true;
       }
     };

     var isForMove = function(rule){
       return rule.value.match(options.dataRegexp) && rule.value.length > options.maxLength;
     };

     var processor = postcss(function(css){
       css.eachDecl(function(decl){
         if (isForMove(decl)) {
           moveRule(decl);
         }
       });
     });

     this.process = function(input){
       return {
         target: processor.process(input),
         inlines: inlines
       };
     };
   }

   module.exports = DataSplit;
}());