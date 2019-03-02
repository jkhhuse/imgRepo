// 给定两个大小为 m 和 n 的有序数组 nums1 和 nums2。

// 请你找出这两个有序数组的中位数，并且要求算法的时间复杂度为 O(log(m + n))。

// 你可以假设 nums1 和 nums2 不会同时为空。

// 示例 1:

// nums1 = [1, 3]
// nums2 = [2]

// 则中位数是 2.0
// 示例 2:

// nums1 = [1, 2]
// nums2 = [3, 4]

// 则中位数是 (2 + 3)/2 = 2.5

// 备注：注意时间复杂度有要求，本题使用了 sort 方式合并了数组（快排O(nlog(n))），最后的效率也并不高。
// 看了一下别的答案，这个合并与排序的过程，使用两个指针完成合并就可以了，毕竟都是有序的数组。

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
  var newArr = [...nums1, ...nums2].sort((a,b)=>{ return a-b});
  var mid = 0;
  if(newArr.length===1) {
      return newArr[0];
  }
  if(newArr.length%2 === 0) {
      return (newArr[newArr.length/2] + newArr[newArr.length/2-1])/2;
  } else {
      return newArr[Math.floor(newArr.length/2)];
  }
};