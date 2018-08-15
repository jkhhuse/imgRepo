// 合并两个有序链表

// 将两个有序链表合并为一个新的有序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 

// 示例：

// 输入：1->2->4, 1->3->4
// 输出：1->1->2->3->4->4

// 思路：新建一个新链表，带有头结点，比较两个已经排好序的链表，按顺序插入到头结点后面，最后取出head->next作为新链表返回。
// 此处需要注意对象的引用问题，链表next对应的是一个引用，
// var linkedlist = oldLinkedlist; linkedlist = linkedlist->next，只是子属性引用的改变，不会改变原始oldLinkedlist的引用。

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function(l1, l2) {
  var newList = new ListNode(-1);
  var l3 = newList;

  while(l1 !== null && l2 !== null) {
      if(l1.val <= l2.val) {
        l3.next = l1;
          l1 = l1.next;
      } else {
        l3.next = l2;
          l2 = l2.next;
      }
      l3 = l3.next;
  }
  while(l1!=null) {
    l3.next = l1;
      l1 = l1.next;
      l3 = l3.next;
  }
  while(l2!=null) {
    l3.next = l2;
    l2 = l2.next;
    l3 = l3.next;
  }
  return newList.next;
};