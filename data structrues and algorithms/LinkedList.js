/**
 * 实现线性表
 */

function LinkedList() {
    this.head = null;
    this.length = 0;
    this.add = function(data) {
        var node = new Node(data);
        var nodeToCheck = this.head;
        if(!nodeToCheck) {
            this.head = node;
            this.length++;
            return node;
        }
        while(nodeToCheck.next) {
            nodeToCheck = nodeToCheck.next;
        }
        nodeToCheck.next = node;
        this.length++;
        return node;
    }
}

function Node(data) {
    this.data = value;
    this.next = null;
}