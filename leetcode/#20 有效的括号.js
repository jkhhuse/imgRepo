// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。

// 有效字符串需满足：

// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
// 注意空字符串可被认为是有效字符串。

// 示例 1:

// 输入: "()"
// 输出: true
// 示例 2:

// 输入: "()[]{}"
// 输出: true
// 示例 3:

// 输入: "(]"
// 输出: false
// 示例 4:

// 输入: "([)]"
// 输出: false
// 示例 5:

// 输入: "{[]}"
// 输出: true

// 备注：利用栈的先进后出特性解决

/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  const map = {
      ')': '(',
      ']': '[',
      '}': '{'
  }
  const stack = [];
  for(const k of s) {
      if(stack.length > 0 && map[k] === stack[stack.length-1]) {
          stack.pop();
      } else {
          stack.push(k);
      }
  }
  return stack.length === 0;
};