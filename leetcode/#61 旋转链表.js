// 给定一个链表，旋转链表，将链表每个节点向右移动 k 个位置，其中 k 是非负数。

// 示例 1:

// 输入: 1->2->3->4->5->NULL, k = 2
// 输出: 4->5->1->2->3->NULL
// 解释:
// 向右旋转 1 步: 5->1->2->3->4->NULL
// 向右旋转 2 步: 4->5->1->2->3->NULL
// 示例 2:

// 输入: 0->1->2->NULL, k = 4
// 输出: 2->0->1->NULL
// 解释:
// 向右旋转 1 步: 2->0->1->NULL
// 向右旋转 2 步: 1->2->0->NULL
// 向右旋转 3 步: 0->1->2->NULL
// 向右旋转 4 步: 2->0->1->NULL

// 思路：思路很简单，先把链表转换为循环链表，找到链表的头结点位置，并把循环链表断开为单链表即可。
// 最后提交代码时，时间和空间都较为落后，有点奇怪。。

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */

function ListNode(val) {
  this.val = val;
  this.next = null;
}

var rotateRight = function (head, k) {
  if(!head) {
    return null;
  }
  let len = 1;
  let pre = head;
  // 先构造一个循环链表
  while (pre.next != null) {
    pre = pre.next;
    len++;
  }
  pre.next = head;
  k = k % len;
  const n = len - k;
  let q = pre;
  for(let i=0; i<n; i++) {
    q = q.next;
  }
  // 然后设置头结点，并把循环链表断开
  const result = q.next;
  q.next = null;
  return result;
};
var test = {
  val: 1,
  next: {
    val: 2,
    next: {
      val: 3,
      next: {
        val: 4,
        next: {
          val: 5,
          next: null
        }
      }
    }
  }
}
console.log(rotateRight(test,2));