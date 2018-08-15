// 回文链表

// 请判断一个链表是否为回文链表。

// 示例 1:

// 输入: 1->2
// 输出: false
// 示例 2:

// 输入: 1->2->2->1
// 输出: true

// 思路：使用一个数组存放前半部分链表，i指针从0指向回文链表中间位置，
// 当回文链表到达后半部分时，i指针再从中间位置遍历回0，遍历过程中进行链表与数组中的值比较。
// 假如比较过程中存在不相等的情况则直接返回false
// 注意：head=[]的情况是返回true


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
var isPalindrome = function(head) {
  if(head===null) {
    return true;
  }
  var linkLen = 1;
  var nodeCheck = head;
  while(nodeCheck.next != null) {
    nodeCheck = nodeCheck.next;
    linkLen++;
  }

  var nc = head;
  var i = 0, j = 0;
  var array = [];
  var len = 0;
  len = Math.floor(linkLen/2);
  if(linkLen%2===0) {
    while(nc.next != null) {
      if(i<len) {
        array.push(nc.val);
        j++;
      }
      i++;
      nc = nc.next;
      if(i>=len) {
         j--;
        if(array[j]!==nc.val) {
          return false;
        }
      }
   }
  } else {
    while(nc.next != null) {
      if(i<len) {
        array.push(nc.val);
        j++;
      }
      i++;
      nc = nc.next;
      if(i>len) {
         j--;
        if(array[j]!==nc.val) {
          return false;
        }
      }
   }
  }
return true;
};