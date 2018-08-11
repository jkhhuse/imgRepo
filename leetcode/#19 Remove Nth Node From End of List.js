// 删除链表的倒数第N个节点

// 给定一个链表，删除链表的倒数第 n 个节点，并且返回链表的头结点。

// 示例：

// 给定一个链表: 1->2->3->4->5, 和 n = 2.

// 当删除了倒数第二个节点后，链表变为 1->2->3->5.
// 说明：

// 给定的 n 保证是有效的。

// 进阶：

// 你能尝试使用一趟扫描实现吗？

// 思路：两段遍历，第一段求出链表length（因为OJ中定义的链表，没有定义length，只能自己遍历），此外需要注意head不为空时length即为1；第二段遍历，则是常规的删除指定位置操作。
// 题目提示了可以使用一次遍历解决，暂时未去求解，等待二刷给出解答。

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
    var length = 1;
    var fake = new ListNode(0);
    fake.next = head;
    var nodeCheck = head;
    while(nodeCheck.next!=null) {
       length++;
       nodeCheck = nodeCheck.next;
    }
    length = length-n;
    nodeCheck = fake;
    while(length>0) {
        length--;
        nodeCheck = nodeCheck.next;
    }
    nodeCheck.next = nodeCheck.next.next;
    return fake.next;
};