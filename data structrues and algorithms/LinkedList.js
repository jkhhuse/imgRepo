/**
 * 单向链表
 */
function Node(data) {
  this.data = data;
  this.next = null;
}

function LinkedList() {
  this.head = null;
  this.length = 0;

  this.add = function(data) {
    var node = new Node(data);
    var nodeCheck = this.head;

    // 是否存在头结点
    while(!nodeCheck) {
      this.head = node;
      this.length++;
      return node;
    }

    // 遍历到
    while(!!nodeCheck.next) {
      nodeCheck = nodeCheck.next;
    }
    nodeCheck.next = node;
    this.length++;
    return node;
  }
}

/**
 * 获得对应位置的节点信息
 * @param {*} position 位置
 */
LinkedList.prototype.get = function(position) {
  var count = 0; 
  var nodeCheck = this.head;
  if(position>this.length) {
    return 'not exist!';
  }
  while(count<position) {
    nodeCheck = nodeCheck.next;
    count++;
  }
  return nodeCheck;
}

/**
 * 删除对应位置的节点
 * @param {*} position 位置
 */
LinkedList.prototype.remove = function(position) {
  var count = 0; 
  var nodeCheck = this.head;
  var prevNode = null;

  if(position>this.length-1) {
    return 'not exist!';
  }
  if(position === 0) {
    this.head = nodeToCheck.next;
    this.length--;
    return this.head;
  }
  while(count<position) {
    prevNode = nodeCheck;
    nodeCheck = nodeCheck.next;
    count++;
  }
  prevNode.next = nodeCheck.next;
  nodeCheck = null;
  this.length--;
  return this.head;
}

/**
 * 在对应位置之后加入一个节点
 * @param {*} position 位置
 * @param {*} node 节点
 */
LinkedList.prototype.insert = function(position, node) {
  var count = 0; 
  var nodeCheck = this.head;
  var nextNode = null;
  var currentNode = null;
  if(position>this.length-1) {
    return 'not exist!';
  }
  while(count<position) {
    nodeCheck = nodeCheck.next;
    count++;
  }
  nextNode = nodeCheck.next;
  nodeCheck.next = node;
  node.next = nextNode;
  this.length++;
  return node;
}

var linkedList = new LinkedList();
linkedList.add(1);
linkedList.add(2);
linkedList.add(3);
linkedList.add(4);
console.log(linkedList);
console.log(linkedList.get(2));
linkedList.remove(2);
console.log(linkedList);
var _node = new Node(0);
linkedList.insert(2, _node);
console.log(linkedList);
