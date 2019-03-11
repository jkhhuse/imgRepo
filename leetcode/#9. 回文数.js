// 判断一个整数是否是回文数。回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。

// 示例 1:

// 输入: 121
// 输出: true
// 示例 2:

// 输入: -121
// 输出: false
// 解释: 从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。
// 示例 3:

// 输入: 10
// 输出: false
// 解释: 从右向左读, 为 01 。因此它不是一个回文数。

// 备注：先转成 string，再用双指针对比，不过执行条件，可以考虑到负数一定不是回文数等情况，可以优化一下。
// 此外，不转成字符串，使用循环取余的方式，效率也会比直接处理字符串更快。

/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
  var m = new String(x);
  if(m.length===0) {
      return false;
  }
  var i = 0, j = m.length-1;
  while(i<j) {
      debugger;
      if(m[i]!==m[j]) {
          return false;
      } else {
          i++;
          j--;
      }
  }
  return true;
};

console.log(isPalindrome(121));