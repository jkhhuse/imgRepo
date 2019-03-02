// 二叉树的最大深度

// 给定一个二叉树，找出其最大深度。

// 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

// 说明: 叶子节点是指没有子节点的节点。

// 示例：
// 给定二叉树 [3,9,20,null,null,15,7]，

//     3
//    / \
//   9  20
//     /  \
//    15   7
// 返回它的最大深度 3 。

// 思路：可以使用递归的方式来做此题，每次递归的时候比较当前递归的leftChild与rightChild深度，并且取其大值。最终返回最大的深度。
// 在第一次做该题时，利用的方法是#102 层次递归的方法，然后统计层次数量，算法如下。

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
  if(root===null) {
    return 0;
  }
  var queue = [];
  queue.push(root);
  var list = [];
  list.push([root.val]);
  while(queue.length>0) {
      var len = queue.length;
      var temp = [];
     for(var i=0; i<len; i++) {
         var node = queue.splice(0, 1)[0];
         if(node.left) {
             queue.push(node.left);
             temp.push(node.left.val);
         }
         if(node.right) {
             queue.push(node.right);
             temp.push(node.right.val);
         }
     }
     if(temp.length>0) {
      list.push(temp);
     }
  }
  return list.length;
};

// 递归求深度方法待补充