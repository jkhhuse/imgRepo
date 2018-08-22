// 对称二叉树

// 给定一个二叉树，检查它是否是镜像对称的。

// 例如，二叉树 [1,2,2,3,4,4,3] 是对称的。

//     1
//    / \
//   2   2
//  / \ / \
// 3  4 4  3
// 但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:

//     1
//    / \
//   2   2
//    \   \
//    3    3
// 说明:

// 如果你可以运用递归和迭代两种方法解决这个问题，会很加分。

// 思路：把数从root处，拆分为左子树和右子树两个部分，左子树和右子树对称，那么在遍历（前序遍历与中序遍历）时右子树变更right与left顺序。
// 本算法还是比较笨拙，利用了前序+中序或者中序+后序=>唯一树的方式来递归。其实可以做到再一次递归中解决，即把null值也考虑进来。

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
  if(root===null) {
    return true;
  }
  var rootPreLeft = [];
  var rootPreRight = [];
  var rootInLeft = [];
  var rootInRight = [];
  cyclePreLeft(rootPreLeft, root.left);
  cyclePreRight(rootPreRight, root.right);
  cycleInLeft(rootInLeft, root.left);
  cycleInRight(rootInRight, root.right);
  var i = 0;
  var j = 0;
  if(rootPreLeft.length!=rootPreRight.length) {
    return false;
  }
  if(rootInLeft.length!=rootInRight.length) {
    return false;
  }
  while(i<rootPreLeft.length) {
    if(rootPreLeft[i]!==rootPreRight[i]) {
      return false;
    }
    i++;
  }
  while(j<rootInLeft.length) {
    if(rootInLeft[j]!==rootInRight[j]) {
      return false;
    }
    j++;
  }
  return true;
};

var cyclePreLeft = function(res, node) {
  if(node==null){
      return;
  }
  res.push(node.val);
  cyclePreLeft(res, node.left);
  cyclePreLeft(res, node.right);
  return res;
}

var cyclePreRight = function(res, node) {
  if(node==null){
      return;
  }
  res.push(node.val);
  cyclePreRight(res, node.right);
  cyclePreRight(res, node.left);
  return res;
}

var cycleInLeft = function(res, node) {
  if(node==null){
      return;
  }
  cycleInLeft(res, node.left);
  res.push(node.val);
  cycleInLeft(res, node.right);
  return res;
}

var cycleInRight = function(res, node) {
  if(node==null){
      return;
  }
  cycleInRight(res, node.right);
  res.push(node.val);
  cycleInRight(res, node.left);
  return res;
}
