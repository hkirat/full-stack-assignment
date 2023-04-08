# Leetcode Backend

## Routes

### GET
1. `/problems`: Get all problems
2. `/submissions`: Get all submissions for a problem submitted by the currently logged in user
3. `/logout`: Logout

### POST
1. `/signup`: Sign up as new user. Sample payload:
    ```JSON
    {
        "username": "sampleuser",
        "name": "Sample User",
        "email": "su@example.com",
        "password": "sampleuser446"
    }
    ```
2. `/login`: Login for existing users. Sample payload:
    ```JSON
    {
        "username": "sampleuser",
        "password": "sampleuser446"
    }
    ```
    OR
    ```JSON
    {
        "email": "su@example.com",
        "password": "sampleuser446"
    }
    ```
3. `/submissions`: Create a new submission for a problem
    ```json
    {
        "problem_id": "palindrome-number",
        "language": "Java",
        "solution": "class Solution {\n    public boolean isPalindrome(int x) {\n        if (x < 0) {\n            return false;\n        }\n        int original = x;\n        int rev = 0;\n        while (x != 0) {\n            int digit = x % 10;\n            rev = rev * 10 + digit;\n            x /= 10;\n        }\n        return original == rev;\n    }\n}\n\nint x = 12321;\nSolution s = new Solution();\nSystem.out.println(s.isPalindrome(x));",
        "result": "Accepted",
        "runtime": "45 ms"
    }
    ```
4. `/problems`: Create a new problem. This is only available to admins. Sample payload:
    ```json
    {
        "title": "Merge Intervals",
        "difficulty": "Medium",
        "description": "Given a collection of intervals, merge overlapping intervals.",
        "solution": "https://leetcode.com/problems/merge-intervals/solution/",
        "topic": "Array, Sort",
        "testCases": [
            {
            "input": [
                [1,3],
                [2,6],
                [8,10],
                [15,18]
            ],
            "output": [
                [1,6],
                [8,10],
                [15,18]
            ]
            },
            {
            "input": [
                [1,4],
                [4,5]
            ],
            "output": [
                [1,5]
            ]
            },
            {
            "input": [
                [1,2],
                [3,6],
                [2,8]
            ],
            "output": [
                [1,8]
            ]
            },
            {
            "input": [
                [1,3],
                [2,3],
                [8,10],
                [15,18]
            ],
            "output": [
                [1,3],
                [8,10],
                [15,18]
            ]
            }
        ]
    }
    ```