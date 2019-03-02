// 给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。

// 如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。

// 您可以假设除了数字 0 之外，这两个数都不会以 0 开头。

// 示例：

// 输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
// 输出：7 -> 0 -> 8
// 原因：342 + 465 = 807

// 备注：下面的写法太过原始，有点乱。主要是没有搞清楚 js 中引用的指向问题，所以在插入那里，仍然是从头结点开始查找到后，然后插入。
// 其实，可以直接复制一个头结点的引用，然后，利用这个引用来实现 next 链接连接，最后头结点即可以拿到完整链表。

function ListNode(val) {
  this.val = val;
  this.next = null;
}

var addTwoNumbers = function(l1, l2) {
 var mask = 0;
 var l = new ListNode(0);
  while(l1!=null || l2!=null) {
    var x = (l1 != null) ? l1.val : 0;
    var y = (l2 != null) ? l2.val : 0;
    var sum = x + y + mask;
    mask = Math.floor(sum /10);
    l.next = new ListNode(sum%10);
    l = l.next;
    if (l1 != null) l1 = l1.next;
        if (l2 != null) l2 = l2.next;
  }
  if (mask > 0) {
        l.next = new ListNode(mask);
    }
  return l;
};

l1 = {
  val: 9,
  next: {
    val: 9,
    next:null
  }
};

l2 = {
  val: 1,
  next: null
};
console.log(addTwoNumbers(l1,l2));






