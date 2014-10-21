(function() {
  "use strict";

  var postcss = require('postcss');
  var ExtendedNode = require('./extended_node');

  class DataSplit {
    constructor(opts = {}) {
      this.options = {
        minLength: opts.minLength || 500,
        dataRegexp: opts.dataRegexp || /url\(('|")?data/g
      };

      this.inlines = postcss.root();

      this.processor = postcss((css) => {
        css.eachDecl((decl) => {
          if (this.isForMove(decl)) {
            this.moveRule(decl);
          }
        });
      });
    }

    moveRule(rule){
      rule = new ExtendedNode(rule);
      var parent = rule.parent;
      var dup = null;

      rule.remove();

      while (parent.type != 'root') {
        dup = parent.clone(function(){
          this.eachChild((node) => {
            node.remove();
          });
        });
        dup.append(rule);
        rule = dup;
        parent = parent.parent;
      }
      if (!dup.__inserted) {
        this.inlines.append(dup.node);
        dup.__inserted = true;
      }
    }

    isForMove(rule) {
      return rule.value.match(this.options.dataRegexp) &&
        rule.value.length > this.options.minLength;
    }
    process(input) {
      return {
        target: this.processor.process(input),
        inlines: this.inlines
      };
    }
  }


  module.exports = DataSplit;
}());