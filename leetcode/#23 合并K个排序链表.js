// 合并 k 个排序链表，返回合并后的排序链表。请分析和描述算法的复杂度。

// 示例:

// 输入:
// [
//   1->4->5,
//   1->3->4,
//   2->6
// ]
// 输出: 1->1->2->3->4->4->5->6

// 备注：这题花了近2个小时才做对，边界值卡了很多的时间
// 1. [] 这个输入返回的结果，应该是leecode做了一些设置（或者是我对链表题规律的把握不够），直接返回[]是不对的，会显示为：
//    [undefined]，所以使用了 new ListNode(null).next 来作为返回值。
// 2. 这题的思路是归并排序思想，所以会产生几个边界：归并几次？每层归并的 first 与 end 下标的确认？
//    我用 loop 代表归并的次数，例如 0,1,2,3,4,5（下标） => 0,1,2 => 0,1 -> 0，所以是 log() 
//    此外，每次归并的 first 应该是 0， 那么 end 下标就应该是 floor(len/2)
// 理顺了其实这题比较简单。

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */

var mergeKLists = function(lists) {
  if(lists.length === 0) {
    return new ListNode(null).next;
  }
  if(lists.length === 1) {
    return lists[0];
  }
  var i = 0, k = lists.length-1, loop = Math.floor(Math.sqrt(lists.length))+1;
  for(var j=0; j<loop; j++) {
    var len = k;
    while(i < k) {
      lists[i] = mergeTwoList(lists[i], lists[k]);
      i++;
      k--;
    }
    i = 0;
    k = Math.floor(len/2);
  }
  return lists[0];
};

function mergeTwoList(list1, list2) {
var i = 0, j = 0;
var node = new ListNode(null);
var newList = node;
while(list1 !== null && list2 !== null) {
  if(list1.val > list2.val) {
    newList.next = list2;
    newList = newList.next;
    list2 = list2.next;
  } else {
    newList.next = list1;
    newList = newList.next;
    list1 = list1.next;
  }
}
if(list1 !== null) {
  newList.next = list1;
} else {
  newList.next = list2;
}
return node.next;
}

// var a = {
//     val : 2,
//     next: null
// };

// var b = {
//   val: -1,
//   next: null
// }

var a = {
  val: 1,
  next: {
    val: 4,
    next: {
      val: 5,
      next: null
    }
  }
};

var b = {
  val: 1,
  next: {
    val: 3,
    next: {
      val: 4,
      next: null
    }
  }
};

var c = {
  val: 2,
  next: {
    val: 6,
    next: null
  }
}

console.log(mergeKLists([a,b,c]));