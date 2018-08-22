// 二叉树的层次遍历

// 给定一个二叉树，返回其按层次遍历的节点值。 （即逐层地，从左到右访问所有节点）。

// 例如:
// 给定二叉树: [3,9,20,null,null,15,7],

//     3
//    / \
//   9  20
//     /  \
//    15   7
// 返回其层次遍历结果：

// [
//   [3],
//   [9,20],
//   [15,7]
// ]

// 思路：广度优先遍历，利用队列（js使用array 与 splice(0, 1)来模拟队列）来存储每次遍历的left child及right child，记录其元素，并继续放入队列中
// 下一层元素的获取则可以从队列中移出第一个元素，以此类推，直至队列中没有元素。

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if(root===null) {
        return [];
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
    return list;
};