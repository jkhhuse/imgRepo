// 给定一个链表，每个节点包含一个额外增加的随机指针，该指针可以指向链表中的任何节点或空节点。

// 要求返回这个链表的深拷贝。 

// 示例：1 -(next)> 2, 1 -(random)> 2, 2 -(random)> 2, 2 -(next)> null

// 输入：
// {"$id":"1","next":{"$id":"2","next":null,"random":{"$ref":"2"},"val":2},"random":{"$ref":"2"},"val":1}

// 解释：
// 节点 1 的值是 1，它的下一个指针和随机指针都指向节点 2 。
// 节点 2 的值是 2，它的下一个指针指向 null，随机指针指向它自己。

// 思路：

/**
 * // Definition for a Node.
 * function Node(val,next,random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */
/**
 * @param {Node} head
 * @return {Node}
 */

 // Definition for a Node.
function Node(val,next,random) {
  this.val = val;
  this.next = next;
  this.random = random;
};

var copyRandomList = function(head) {
  if(!head) return head;
  const hashMap = new Map();
  let newHead = new Node(0, null, null);
  let cur = head;
  let newCur = newHead;
  while(cur && !hashMap.has(cur)) {
    let node = new Node(cur.val, null, null);
    newHead.next = node;
    newHead = newHead.next;
    hashMap.set(cur, node);
    cur = cur.next;
  }
  for (let [src, dest] of hashMap) {
    dest.random = hashMap.get(src.random) || null;
}
  return newCur.next;
}


// var copyRandomList = function(head) {
//   if(!head) return head;

//   const hashMap = new Map();
//   let current = head;
//   let newHead = new Node(0);
//   let newTail = newHead;

//   while(current) {
//       const node = new Node(current.val, null, null);
//       node.random = current.random;
//       newTail.next = node;
//       newTail = node;
//       hashMap.set(current, node);
//       current = current.next;
//   }

//   current = newHead.next;
//   while (current) {
//       if(current.random) {
//           current.random = hashMap.get(current.random);
//       }
//       current = current.next;
//   }

//   return newHead.next;
// };

var test1 = {
  val: 1,
  next: null,
  random: null
}
test1.random = test1;
var test2 = {
  val: 2,
  next: test1,
  random: test1
}
console.log(copyRandomList(test2));