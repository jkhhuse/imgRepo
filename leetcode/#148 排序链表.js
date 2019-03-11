// 在 O(n log n) 时间复杂度和常数级空间复杂度下，对链表进行排序。

// 示例 1:

// 输入: 4->2->1->3
// 输出: 1->2->3->4
// 示例 2:

// 输入: -1->5->3->4->0
// 输出: -1->0->3->4->5

// 思路：最初是比较困惑的，也是看了解答才顺利写出。
// 总结一下：使用归并排序来做，那么时间复杂度就是 O(nlogn)、空间复杂度为O(n)，不过改进型归并（原地归并），应该可以做到 O(1)
// 最后这题当时卡住很久的地方就是，快慢指针把链表切割成两个部分的指针确定。（head/p），这里老是会搞错引用的地址。。

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */

function ListNode(val) {
  this.val = val;
  this.next = null;
}

var sortList = function(head) {
  return head === null ? head : mergeSort(head);
};

var mergeSort = function(head) {
  if(head.next === null) {
    return head;
  }
  var q = head, p = head, pre = null;
  while(q !== null && q.next !== null) {
    pre = p;
    p = p.next;
    q = q.next.next;
  }
  pre.next = null;
  var l = mergeSort(head);
  var r = mergeSort(p);
  return merge(l, r);
}

var merge = function(l, r) {
  var newHead = new ListNode(0);
  var cur = newHead;
  while(l !== null && r!== null) {
    if(l.val <= r.val) {
      cur.next = l;
      cur = cur.next;
      l = l.next;
    } else {
      cur.next = r;
      cur = cur.next;
      r = r.next;
    }
  }
  if(l !== null) {
    cur.next = l;
  }
  if(r !== null) {
    cur.next = r;
  }
  return newHead.next;
}

var test = {
  val: 4,
  next: {
    val: 3,
    next: {
      val: 1,
      next: {
        val: 2,
        next: {
          val: 5,
          next: null
        }
      }
    }
  }
}

console.log(sortList(test));
