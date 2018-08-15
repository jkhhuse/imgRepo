// 环形链表

// 给定一个链表，判断链表中是否有环。

// 思路1：如果是循环链表，那么可以给链表中的节点加上一个flag，如果循环遍历时该flag重新被发现，那么可以证明此链表为循环链表
// 循环链表的结构为：
// var l1 = {
//   val: 1,
//   next: {
//     val: 3,
//     next: {
//       val: 2,
//       next: l
//     }
//   }
// }
// var l = l1;
// l1.next.next.next = l;


/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
  var node = head;
  while(node!=null) {
    if(node.flag) {
      return true;
    }
    node.flag = true;
    node = node.next;
  }
  return false;
};


// 思路2：类似思路1，如何找出循环链表中的元素存在，方法就是把所有元素放入Set集合之中，如果Set集合中已经包含了节点，那么则使用set.has方法可以找出该节点。

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
  var set = new Set();
  while (head != null) {
      if (set.has(head)) {
          return true;
      } else {
        set.add(head);
      }
      head = head.next;
  }
  return false;
};