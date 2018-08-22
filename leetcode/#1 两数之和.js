// 两数之和

// 给定一个整数数组和一个目标值，找出数组中和为目标值的两个数。
// 你可以假设每个输入只对应一种答案，且同样的元素不能被重复利用。

// 示例:
// 给定 nums = [2, 7, 11, 15], target = 9
// 因为 nums[0] + nums[1] = 2 + 7 = 9
// 所以返回 [0, 1]


// 思路: 简单遍历，不过也有其他更优解


/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    for (var i=0; i < nums.length; i++) {
        for (var j=i+1; j < nums.length; j++) {
            if(nums[i]+nums[j] === target) {
                return [i,j];
            }
        }
    }
};
