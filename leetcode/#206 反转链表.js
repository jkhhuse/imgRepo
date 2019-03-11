
// 反转一个单链表。

// 示例:

// 输入: 1->2->3->4->5->NULL
// 输出: 5->4->3->2->1->NULL
// 进阶:
// 你可以迭代或递归地反转链表。你能否用两种方法解决这道题？

// 思路：用两个指针，分别指向头节点和第二节点（及之后的节点组成的链表）
// 随后：把第二个指针的链表的头元素不断与头结点组成新链表。

var reverseList = function(head) {
  if(head===null && head.next!==null) {
      return head;    
  }
  var p1 = head;
  var p2 = head.next;
  p1.next = null;
  while(p2) {
      var temp = p2;
      p2 = p2.next;
      temp.next = p1;
      p1 = temp;
  }
  return p1;
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

console.log(reverseList(test));