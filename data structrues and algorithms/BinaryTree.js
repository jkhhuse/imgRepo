/**
 * 二叉树
 * @author jkhhuse
 * @description binary tree in javascript
 */

// 以前序方式递归创建二叉树，例如二叉树如下：
//       1
//     /   \
//    2     3
//     \   / 
//      4 5   
// 以一个数组表示顺序表示二叉树的结构为:[1,2,3,null,4,5]，前序则为node->left->right
// 而left可以用index*2+1来表示，right可以使用index*2+2来表示。

// 引用的使用
// this.root为二叉树的根节点, 引出node -> this.leftChild 与 node -> this.rightChild 的节点引用链，this.root作为头结点，获得整个二叉链表的数据结构信息。

function BinaryTreeNode(val) {
    this.data = val;
    this.leftChild = null;
    this.rightChild = null;
}

function BinaryTree(tree) {
    if (tree===null) {
        return;
    }
    this.root = new BinaryTreeNode(tree[0]);
    // 创建二叉树
    this.createBinaryTree = function() {
        var node = this.root;
        var x = 0;
        this.preOrderTraverse(node ,x);
        return this.root; 
    }
    // 递归创建节点
    this.preOrderTraverse = function(node, x) {
        if(tree[x*2 + 1]) {
            this.preOrderTraverse(node.leftChild = new BinaryTreeNode(tree[x*2+1]), x*2+1);
        }
        if(tree[x*2 + 2]) {
            this.preOrderTraverse(node.rightChild = new BinaryTreeNode(tree[x*2+2]), x*2+2);
        }
    };
}


var tree = [1,2,3,4,5,,6,,,7];
var binaryTree = new BinaryTree(tree);
var btInfo = binaryTree.createBinaryTree();
console.log(btInfo);