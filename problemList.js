const _supportedLanguages = ['javascript', 'python', 'cpp'];

 const  _allProblems = [
    {
        'title': 'Two Sum',
        'acceptance': 53.1,
        'difficulty': {'level': 'easy', 'color': 'green'}
    },
    {
        'title': 'Add Two Numbers',
        'acceptance': 43.4,
        'difficulty': {'level': 'medium', 'color': 'orange'}
    },
    {
        'title': 'Longest Substring Without Repeating Characters',
        'acceptance': 35.1,
        'difficulty': {'level': 'medium', 'color': 'orange'}
    },
    {
        'title': 'Median of Two Sorted Arrays',
        'acceptance': 40.7,
        'difficulty': {'level': 'hard', 'color': 'red'}
    },
    {
        'title': 'Longest Palindromic Substring',
        'acceptance': 34.1,
        'difficulty': {'level': 'medium', 'color': 'orange'}
    },
    {
        'title': 'Zigzag Conversion',
        'acceptance': 48.6,
        'difficulty': {'level': 'medium', 'color': 'orange'}
    },
    {
        'title': 'Reverse Integer',
        'acceptance': 28.9,
        'difficulty': {'level': 'medium', 'color': 'orange'}
    },
    {
        'title': 'String to Integer (atoi)',
        'acceptance': 17.6,
        'difficulty': {'level': 'medium', 'color': 'orange'}
    },
    {
        'title': 'Palindrome Number',
        'acceptance': 56.9,
        'difficulty': {'level': 'easy', 'color': 'green'}
    },
    {
        'title': 'Regular Expression Matching',
        'acceptance': 28.3,
        'difficulty': {'level': 'hard', 'color': 'red'}
    },
    {
        'title': 'Container With Most Water',
        'acceptance': 55.7,
        'difficulty': {'level': 'medium', 'color': 'orange'}
    },
    {
        'title': 'Integer to Roman',
        'acceptance': 65.5,
        'difficulty': {'level': 'medium', 'color': 'orange'}
    },
    {
        'title': 'Roman to Integer',
        'acceptance': 61.9,
        'difficulty': {'level': 'easy', 'color': 'green'}
    },
    {
        'title': 'Longest Common Prefix',
        'acceptance': 43.2,
        'difficulty': {'level': 'easy', 'color': 'green'}
    },
    {
        'title': '3Sum',
        'acceptance': 34.9,
        'difficulty': {'level': 'medium', 'color': 'orange'}
    },
    {
        'title': '3Sum Closest',
        'acceptance': 45.9,
        'difficulty': {'level': 'medium', 'color': 'orange'}
    },
    {
        'title': 'Letter Combinations of a Phone Number',
        'acceptance': 61.0,
        'difficulty': {'level': 'medium', 'color': 'orange'}
    }
];

const _allProblemsInfo = [
    {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        examples: [
            {
                input: { nums: [2, 7, 11, 15], target: 9 },
                output: [0, 1],
                explanation: "nums[0] + nums[1] = 2 + 7 = 9"
            },
            {
                input: { nums: [3, 2, 4], target: 6 },
                output: [1, 2],
                explanation: "nums[1] + nums[2] = 2 + 4 = 6"
            }
        ],
        code: {
            javascript: `
function twoSum(nums, target) {
    let map = {};
    for (let i = 0; i < nums.length; i++) {
        let complement = target - nums[i];
        if (complement in map) {
            return [map[complement], i];
        }
        map[nums[i]] = i;
    }
    return [];
}
`,
            python: `
# Python equivalent for reference:
class Solution:
    def twoSum(self, nums, target):
        map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in map:
                return [map[complement], i]
            map[num] = i
        return []
`,
            cpp: `
// C++ equivalent for reference:
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (map.count(complement)) {
                return { map[complement], i };
            }
            map[nums[i]] = i;
        }
        return {};
    }
};
`
        }
    },
    {
        title: "Add Two Numbers",
        description: "Given two non-empty linked lists representing two non-negative integers, where each node contains a single digit. Add the two numbers and return the sum as a linked list.",
        examples: [
            {
                input: { l1: { val: 2, next: { val: 4, next: { val: 3, next: null } } }, l2: { val: 5, next: { val: 6, next: { val: 4, next: null } } } },
                output: { val: 7, next: { val: 0, next: { val: 8, next: null } } },
                explanation: "342 + 465 = 807"
            },
            {
                input: { l1: { val: 0, next: null }, l2: { val: 0, next: null } },
                output: { val: 0, next: null },
                explanation: "0 + 0 = 0"
            }
        ],
        code: {
            javascript: `
function addTwoNumbers(l1, l2) {
    let dummy = new ListNode(0);
    let current = dummy;
    let carry = 0;
    while (l1 || l2 || carry) {
        let sum = carry + (l1 ? l1.val : 0) + (l2 ? l2.val : 0);
        carry = Math.floor(sum / 10);
        current.next = new ListNode(sum % 10);
        current = current.next;
        l1 = l1 ? l1.next : null;
        l2 = l2 ? l2.next : null;
    }
    return dummy.next;
}
`,
            // Add Python and C++ equivalents similarly
            python: ``,
            cpp: ``
        }
    },
    {
        title: "Longest Substring Without Repeating Characters",
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        examples: [
            {
                input: "abcabcbb",
                output: 3,
                explanation: "The longest substring without repeating characters is 'abc', which has length 3."
            },
            {
                input: "bbbbb",
                output: 1,
                explanation: "The longest substring without repeating characters is 'b', which has length 1."
            }
        ],
        code: {
            javascript: `
function lengthOfLongestSubstring(s) {
    let map = {};
    let start = 0;
    let maxLength = 0;
    for (let end = 0; end < s.length; end++) {
        if (map[s[end]] !== undefined) {
            start = Math.max(map[s[end]] + 1, start);
        }
        map[s[end]] = end;
        maxLength = Math.max(maxLength, end - start + 1);
    }
    return maxLength;
}
`,
            // Add Python and C++ equivalents similarly
            python: ``,
            cpp: ``
        }
    },
    {
        title: "Median of Two Sorted Arrays",
        description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
        examples: [
            {
                input: { nums1: [1, 3], nums2: [2] },
                output: 2.0,
                explanation: "Merged array = [1, 2, 3], median is 2.0."
            },
            {
                input: { nums1: [1, 2], nums2: [3, 4] },
                output: 2.5,
                explanation: "Merged array = [1, 2, 3, 4], median is (2 + 3) / 2 = 2.5."
            }
        ],
        code: {
            javascript: `
function findMedianSortedArrays(nums1, nums2) {
    let merged = [];
    let i = 0, j = 0;
    while (i < nums1.length && j < nums2.length) {
        if (nums1[i] <= nums2[j]) {
            merged.push(nums1[i]);
            i++;
        } else {
            merged.push(nums2[j]);
            j++;
        }
    }
    while (i < nums1.length) {
        merged.push(nums1[i]);
        i++;
    }
    while (j < nums2.length) {
        merged.push(nums2[j]);
        j++;
    }
    let n = merged.length;
    if (n % 2 === 0) {
        return (merged[n / 2 - 1] + merged[n / 2]) / 2;
    } else {
        return merged[Math.floor(n / 2)];
    }
}
`,
            // Add Python and C++ equivalents similarly
            python: ``,
            cpp: ``
        }
    },
    {
        title: "Longest Palindromic Substring",
        description: "Given a string s, return the longest palindromic substring in s.",
        examples: [
            {
                input: "babad",
                output: "bab",
                explanation: "'bab' is a palindromic substring."
            },
            {
                input: "cbbd",
                output: "bb",
                explanation: "'bb' is a palindromic substring."
            }
        ],
        code: {
            javascript: `
function longestPalindrome(s) {
    if (s.length < 2) return s;
    let start = 0, maxLength = 1;
    function expandAroundCenter(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            let currentLength = right - left + 1;
            if (currentLength > maxLength) {
                maxLength = currentLength;
                start = left;
            }
            left--;
            right++;
        }
    }
    for (let i = 0; i < s.length; i++) {
        expandAroundCenter(i, i);
        expandAroundCenter(i, i + 1);
    }
    return s.substring(start, start + maxLength);
}
`,
            // Add Python and C++ equivalents similarly
            python: ``,
            cpp: ``
        }
    },
    {
        title: "Zigzag Conversion",
        description: "The string 'PAYPALISHIRING' is written in a zigzag pattern on a given number of rows. Return the zigzag pattern as a string.",
        examples: [
            {
                input: { s: "PAYPALISHIRING", numRows: 3 },
                output: "PAHNAPLSIIGYIR",
                explanation: "Rows = 3: P   A   H   N A P L S I I G Y I R"
            },
            {
                input: { s: "PAYPALISHIRING", numRows: 4 },
                output: "PINALSIGYAHRPI",
                explanation: "Rows = 4: P     I    N    A    L S  I G   Y A H   R   P I"
            }
        ],
        code: {
            javascript: `
function convert(s, numRows) {
    if (numRows === 1) return s;
    let rows = new Array(numRows).fill("");
    let currentRow = 0;
    let goingDown = false;
    for (let char of s) {
        rows[currentRow] += char;
        if (currentRow === 0 || currentRow === numRows - 1) goingDown = !goingDown;
        currentRow += goingDown ? 1 : -1;
    }
    return rows.join("");
}
`,
            // Add Python and C++ equivalents similarly
            python: ``,
            cpp: ``
        }
    },
    {
        title: "Reverse Integer",
        description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-231, 231 - 1], return 0.",
        examples: [
            {
                input: 123,
                output: 321,
                explanation: "Reverse of 123 is 321."
            },
            {
                input: -123,
                output: -321,
                explanation: "Reverse of -123 is -321."
            }
        ],
        code: {
            javascript: `
function reverse(x) {
    let reversed = parseInt(Math.abs(x).toString().split('').reverse().join('')) * Math.sign(x);
    if (reversed < Math.pow(-2, 31) || reversed > Math.pow(2, 31) - 1) return 0;
    return reversed;
}
`,
            // Add Python and C++ equivalents similarly
            python: ``,
            cpp: ``
        }
    },
    {
        title: "String to Integer (atoi)",
        description: "Implement the atoi function, which converts a string to an integer. The function first discards as many whitespace characters as necessary until the first non-whitespace character is found. Then, starting from this character takes an optional initial plus or minus sign, followed by as many numerical digits as possible, and interprets them as a numerical value.",
        examples: [
            {
                input: "42",
                output: 42,
                explanation: "The input string '42' is converted to the integer 42."
            },
            {
                input: "   -42",
                output: -42,
                explanation: "The input string '   -42' is converted to the integer -42."
            }
        ],
        code: {
            javascript: `
function myAtoi(s) {
    let sign = 1, i = 0, result = 0;
    while (s[i] === ' ') i++;
    if (s[i] === '+' || s[i] === '-') {
        sign = s[i++] === '-' ? -1 : 1;
    }
    while (i < s.length && s[i] >= '0' && s[i] <= '9') {
        result = result * 10 + (s[i++] - '0');
        if (result * sign >= Math.pow(2, 31) - 1) return Math.pow(2, 31) - 1;
        if (result * sign <= Math.pow(-2, 31)) return Math.pow(-2, 31);
    }
    return result * sign;
}
`,
            // Add Python and C++ equivalents similarly
            python: ``,
            cpp: ``
        }
    },
    {
        title: "Palindrome Number",
        description: "Determine whether an integer x is a palindrome. An integer is a palindrome when it reads the same backward as forward.",
        examples: [
            {
                input: 121,
                output: true,
                explanation: "121 is a palindrome."
            },
            {
                input: -121,
                output: false,
                explanation: "-121 is not a palindrome (reads as '121-')."
            }
        ],
        code: {
            javascript: `
function isPalindrome(x) {
    if (x < 0) return false;
    let reversed = parseInt(x.toString().split('').reverse().join(''));
    return x === reversed;
}
`,
            // Add Python and C++ equivalents similarly
            python: ``,
            cpp: ``
        }
    }
    // Add more problems as needed
];

module.exports = { _allProblemsInfo, _allProblems};