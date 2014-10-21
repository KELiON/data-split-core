(function(){
  "use strict";

  var WeakMap = require('weak-map');

  class ExtendedNode {
    constructor(node) {
      this.node = node;
      this.parent = node.parent ? new ExtendedNode(node.parent) : null;
      ["type", "value"].forEach((method) => this[method] = node[method]);
    }
    clone(onClone){
      var node = this.node;
      var clonesCache = ExtendedNode.clonesCache;
      if (!clonesCache.get(node)) {
        // cache clones to prevent duplicates in inlines target
        var dup = new ExtendedNode(node.clone());
        clonesCache.set(node, dup);
        onClone.apply(dup);
      }
      return clonesCache.get(node);
    }
    isEmpty() {
      return (this.node.decls && this.node.decls.length === 0) ||
        (this.node.rules && this.node.rules.length === 0);
    }
    remove() {
      var parent = this.parent;
      this.node.removeSelf();
      if (parent && parent.isEmpty()) {
        // remove empty selectors
        parent.remove();
      }
    }
    append(extNode) {
      this.node.append(extNode.node);
    }
    eachChild(callback){
      var fn = 'eachDecl';
      if (this.node.rules) {
        fn = 'eachRule';
      }
      this.node[fn](function(node){
        callback(new ExtendedNode(node));
      });
    }
  }
  ExtendedNode.clonesCache = new WeakMap();

  module.exports = ExtendedNode;
})();