// 给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。

// 示例 1：

// 输入: "babad"
// 输出: "bab"
// 注意: "aba" 也是一个有效答案。
// 示例 2：

// 输入: "cbbd"
// 输出: "bb"

// 备注：这题一开始没有特别好的思路，遂看了一下评论区，关注到有一个算法叫：马拉车算法。
// 遂尝试了一下，效率比之前自己构思的要好不少。

// 关键点：利用 # 号填充，把字符串数组都转化为奇数数组。
// 用一次循环，比较当前坐标的左右是否对称，并记录最大对称的长度及坐标。
// 最后再利用记录的长度及坐标，来还原出最大子串。

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    if(s.length<=1) {
      return s;
    }
    var p = [], mx = 0, mi = 0;
    var split = "#";
    p.push(split);
    for(var i=0; i< s.length; i++) {
        p.push(s[i]);
        p.push("#");
    }
    for(var i=1; i<p.length-1; i++) {
      var t = 1;
      var r = 0;
      while(p[i-t]===p[i+t]) {
          if(i-t<0 || i+t>p.length) {
              break;
          }
          r++;
          t++;
      }
      if(r>=mx) {
          mx = r;
          mi = i;
      }
    }
    var str = "";
    for(var i=mi-mx; i<=mi+mx; i=i+1) {
        if(p[i] !== "#") {
          str += p[i];
        }
    }
    return str;
  };
  