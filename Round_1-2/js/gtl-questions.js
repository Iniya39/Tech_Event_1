/**
 * CHAPTER 2: GUESS THE LOGIC — Round 2 Java Question Bank (16 Questions)
 * Code-tracing challenges for CSE/CSD students written in Java.
 */

const GTL_QUESTION_BANK = [
    {
        id: 1,
        category: "Recursion + Condition",
        difficulty: "Medium",
        prompt: "What is the output?",
        code: `class Main {
    static int mystery(int n) {
        if (n <= 1)
            return 1;
        return mystery(n - 1) + mystery(n - 2);
    }

    public static void main(String[] args) {
        System.out.println(mystery(5));
    }
}`,
        correctAnswer: "8",
        acceptedAnswers: ["8"],
        points: 100
    },
    {
        id: 2,
        category: "Nested Loops",
        difficulty: "Medium",
        prompt: "What is the output?",
        code: `class Main {
    public static void main(String[] args) {
        int sum = 0;

        for (int i = 1; i <= 4; i++) {
            for (int j = i; j <= 4; j++) {
                sum++;
            }
        }

        System.out.println(sum);
    }
}`,
        correctAnswer: "10",
        acceptedAnswers: ["10"],
        points: 100
    },
    {
        id: 3,
        category: "Array Manipulation",
        difficulty: "Medium",
        prompt: "What is the output?",
        code: `import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        int[] A = {2, 4, 6, 8, 10};

        for (int i = 0; i < 5; i++) {
            if (A[i] % 4 == 0)
                A[i] = A[i] / 2;
        }

        System.out.println(Arrays.toString(A));
    }
}`,
        correctAnswer: "[2, 2, 6, 4, 10]",
        acceptedAnswers: ["[2, 2, 6, 4, 10]", "[2,2,6,4,10]", "2,2,6,4,10", "2, 2, 6, 4, 10", "2 2 6 4 10"],
        points: 100
    },
    {
        id: 4,
        category: "Recursion + Multiplication",
        difficulty: "Medium-Hard",
        prompt: "What is the output?",
        code: `class Main {
    static int calc(int n) {
        if (n <= 1)
            return 1;
        return n * calc(n - 2);
    }

    public static void main(String[] args) {
        System.out.println(calc(7));
    }
}`,
        correctAnswer: "105",
        acceptedAnswers: ["105"],
        points: 100
    },
    {
        id: 5,
        category: "Bit Manipulation",
        difficulty: "Hard",
        prompt: "What is the output?",
        code: `class Main {
    public static void main(String[] args) {
        int x = 13;
        int y = 7;

        int result = (x & y) ^ (x | y);

        System.out.println(result);
    }
}`,
        correctAnswer: "9",
        acceptedAnswers: ["9"],
        points: 100
    },
    {
        id: 6,
        category: "Loop with Changing Variables",
        difficulty: "Medium-Hard",
        prompt: "What is the output?",
        code: `class Main {
    public static void main(String[] args) {
        int x = 1;
        int y = 2;

        for (int i = 1; i <= 4; i++) {
            x = x + y;
            y = x - y;
        }

        System.out.println(x + " " + y);
    }
}`,
        correctAnswer: "21 13",
        acceptedAnswers: ["21 13", "21, 13", "21,13"],
        points: 100
    },
    {
        id: 7,
        category: "String Manipulation",
        difficulty: "Hard",
        prompt: "What is the output?",
        code: `class Main {
    public static void main(String[] args) {
        String s = "COMPUTER";
        String result = "";

        for (int i = s.length() - 1; i >= 0; i--) {
            if (i % 2 == 0)
                result = result + s.charAt(i);
        }

        System.out.println(result);
    }
}`,
        correctAnswer: "RTPC",
        acceptedAnswers: ["RTPC", "rtpc", "R T P C", "r t p c"],
        points: 100
    },
    {
        id: 8,
        category: "Recursion + String",
        difficulty: "Hard",
        prompt: "What is the output?",
        code: `class Main {
    static String mystery(String s) {
        if (s.length() == 1)
            return s;

        return mystery(s.substring(1)) + s.charAt(0);
    }

    public static void main(String[] args) {
        System.out.println(mystery("CODE"));
    }
}`,
        correctAnswer: "EDOC",
        acceptedAnswers: ["EDOC", "edoc"],
        points: 100
    },
    {
        id: 9,
        category: "Array + Nested Loop",
        difficulty: "Hard",
        prompt: "What is the output?",
        code: `import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        int[] A = {3, 1, 4, 1, 5};

        for (int i = 0; i < 5; i++) {
            for (int j = i + 1; j < 5; j++) {
                if (A[i] > A[j]) {
                    int temp = A[i];
                    A[i] = A[j];
                    A[j] = temp;
                }
            }
        }

        System.out.println(Arrays.toString(A));
    }
}`,
        correctAnswer: "[1, 1, 3, 4, 5]",
        acceptedAnswers: ["[1, 1, 3, 4, 5]", "[1,1,3,4,5]", "1,1,3,4,5", "1, 1, 3, 4, 5", "1 1 3 4 5"],
        points: 100
    },
    {
        id: 10,
        category: "Stack Behaviour",
        difficulty: "Medium-Hard",
        prompt: "What is the output?",
        code: `import java.util.Stack;

class Main {
    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>();

        stack.push(10);
        stack.push(20);
        stack.pop();
        stack.push(30);
        stack.push(40);
        stack.pop();
        stack.push(50);

        System.out.println(stack.peek());
    }
}`,
        correctAnswer: "50",
        acceptedAnswers: ["50"],
        points: 100
    },
    {
        id: 11,
        category: "Queue Behaviour",
        difficulty: "Medium-Hard",
        prompt: "What is the output?",
        code: `import java.util.LinkedList;
import java.util.Queue;

class Main {
    public static void main(String[] args) {
        Queue<Integer> queue = new LinkedList<>();

        queue.add(10);
        queue.add(20);
        queue.remove();
        queue.add(30);
        queue.remove();
        queue.add(40);

        System.out.println(queue.peek());
    }
}`,
        correctAnswer: "30",
        acceptedAnswers: ["30"],
        points: 100
    },
    {
        id: 12,
        category: "Tricky Recursion",
        difficulty: "Hard",
        prompt: "What is the output?",
        code: `class Main {
    static int mystery(int n) {
        if (n <= 0)
            return 0;

        if (n % 2 == 0)
            return n + mystery(n / 2);

        return n + mystery(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(mystery(10));
    }
}`,
        correctAnswer: "22",
        acceptedAnswers: ["22"],
        points: 100
    },
    {
        id: 13,
        category: "Loop + Condition",
        difficulty: "Medium-Hard",
        prompt: "What is the output?",
        code: `class Main {
    public static void main(String[] args) {
        int count = 0;

        for (int i = 1; i <= 20; i++) {
            if (i % 3 == 0)
                count += i;
            else if (i % 5 == 0)
                count -= i;
        }

        System.out.println(count);
    }
}`,
        correctAnswer: "48",
        acceptedAnswers: ["48"],
        points: 100
    },
    {
        id: 14,
        category: "Reference-Based Tracing",
        difficulty: "Hard",
        prompt: "What is the output?",
        code: `class Main {
    public static void main(String[] args) {
        int[] a = {10};
        int[] b = {20};

        a[0] = a[0] + 5;
        b[0] = a[0] + b[0];

        System.out.println(a[0] + " " + b[0]);
    }
}`,
        correctAnswer: "15 35",
        acceptedAnswers: ["15 35", "15, 35", "15,35"],
        points: 100
    },
    {
        id: 15,
        category: "Algorithm Behaviour",
        difficulty: "Hard",
        prompt: "What is the output?",
        code: `import java.util.Arrays;

class Main {
    static int[] mystery(int[] A) {
        int n = A.length;

        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (A[j] < A[j + 1]) {
                    int temp = A[j];
                    A[j] = A[j + 1];
                    A[j + 1] = temp;
                }
            }
        }

        return A;
    }

    public static void main(String[] args) {
        int[] A = {4, 1, 7, 3, 2};

        System.out.println(Arrays.toString(mystery(A)));
    }
}`,
        correctAnswer: "[7, 4, 3, 2, 1]",
        acceptedAnswers: ["[7, 4, 3, 2, 1]", "[7,4,3,2,1]", "7,4,3,2,1", "7, 4, 3, 2, 1", "7 4 3 2 1"],
        points: 100
    },
    {
        id: 16,
        category: "Recursion + Conditional Logic",
        difficulty: "Very Hard",
        prompt: "What is the output?",
        code: `class Main {
    static int solve(int n) {
        if (n <= 1)
            return n;

        if (n % 2 == 0)
            return solve(n / 2) + n;

        return solve(n - 1) - 1;
    }

    public static void main(String[] args) {
        System.out.println(solve(10));
    }
}`,
        correctAnswer: "16",
        acceptedAnswers: ["16"],
        points: 100
    }
];

if (typeof window !== 'undefined') window.GTL_QUESTION_BANK = GTL_QUESTION_BANK;
if (typeof globalThis !== 'undefined') globalThis.GTL_QUESTION_BANK = GTL_QUESTION_BANK;

