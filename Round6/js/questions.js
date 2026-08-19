/**
 * QUESTIONS.JS - 15 Custom Image Connections Questions
 * Round 6: CONNECTIONS Technical Competition
 */

const CONNECTIONS_QUESTIONS = [
    {
        id: 1,
        difficulty: "Challenging",
        points: 100,
        timeLimit: 100,
        correctAnswer: "PyTorch",
        acceptedAnswers: ["pytorch", "torch", "py torch"],
        imageSrc: "assets/images/PyTorch.png",
        title: "Connection #1"
    },
    {
        id: 2,
        difficulty: "Challenging",
        points: 100,
        timeLimit: 100,
        correctAnswer: "SQLite",
        acceptedAnswers: ["sqlite", "sqlite3", "sql lite"],
        imageSrc: "assets/images/SQLite.png",
        title: "Connection #2"
    },
    {
        id: 3,
        difficulty: "Challenging",
        points: 100,
        timeLimit: 100,
        correctAnswer: "Arduino",
        acceptedAnswers: ["arduino"],
        imageSrc: "assets/images/arduino.png",
        title: "Connection #3"
    },
    {
        id: 4,
        difficulty: "Very Challenging",
        points: 125,
        timeLimit: 100,
        correctAnswer: "Binary Tree",
        acceptedAnswers: ["binarytree", "binary tree"],
        imageSrc: "assets/images/binary_tree.png",
        title: "Connection #4"
    },
    {
        id: 5,
        difficulty: "Very Challenging",
        points: 125,
        timeLimit: 100,
        correctAnswer: "Command Prompt",
        acceptedAnswers: ["commandprompt", "cmd", "command prompt"],
        imageSrc: "assets/images/command_prompt.png",
        title: "Connection #5"
    },
    {
        id: 6,
        difficulty: "Very Challenging",
        points: 125,
        timeLimit: 100,
        correctAnswer: "Computer Security",
        acceptedAnswers: ["computersecurity", "cybersecurity", "cyber security", "computer security"],
        imageSrc: "assets/images/computer_security.jpeg",
        title: "Connection #6"
    },
    {
        id: 7,
        difficulty: "Very Challenging",
        points: 125,
        timeLimit: 100,
        correctAnswer: "Database Configuration",
        acceptedAnswers: ["databaseconfiguration", "db configuration", "database config", "db config"],
        imageSrc: "assets/images/database_configuration.jpeg",
        title: "Connection #7"
    },
    {
        id: 8,
        difficulty: "Difficult",
        points: 150,
        timeLimit: 100,
        correctAnswer: "Heap Sort",
        acceptedAnswers: ["heapsort", "heap sort"],
        imageSrc: "assets/images/heap_sort.png",
        title: "Connection #8"
    },
    {
        id: 9,
        difficulty: "Difficult",
        points: 150,
        timeLimit: 100,
        correctAnswer: "Microsoft",
        acceptedAnswers: ["microsoft", "ms"],
        imageSrc: "assets/images/microsoft.png",
        title: "Connection #9"
    },
    {
        id: 10,
        difficulty: "Difficult",
        points: 150,
        timeLimit: 100,
        correctAnswer: "Minecraft",
        acceptedAnswers: ["minecraft", "mine craft"],
        imageSrc: "assets/images/minecraft.png",
        title: "Connection #10"
    },
    {
        id: 11,
        difficulty: "Difficult",
        points: 150,
        timeLimit: 100,
        correctAnswer: "NIC",
        acceptedAnswers: ["nic", "networkinterfacecard", "network interface card"],
        imageSrc: "assets/images/nic.png",
        title: "Connection #11"
    },
    {
        id: 12,
        difficulty: "Expert",
        points: 175,
        timeLimit: 100,
        correctAnswer: "Notion",
        acceptedAnswers: ["notion"],
        imageSrc: "assets/images/notion.png",
        title: "Connection #12"
    },
    {
        id: 13,
        difficulty: "Expert",
        points: 175,
        timeLimit: 100,
        correctAnswer: "Outlook",
        acceptedAnswers: ["outlook", "ms outlook", "microsoft outlook"],
        imageSrc: "assets/images/outlook.png",
        title: "Connection #13"
    },
    {
        id: 14,
        difficulty: "Expert",
        points: 175,
        timeLimit: 100,
        correctAnswer: "TensorFlow",
        acceptedAnswers: ["tensorflow", "tensor flow"],
        imageSrc: "assets/images/tensorflow.png",
        title: "Connection #14"
    },
    {
        id: 15,
        difficulty: "Final Challenge",
        points: 200,
        timeLimit: 100,
        correctAnswer: "World Wide Web",
        acceptedAnswers: ["www", "world wide web", "worldwideweb"],
        imageSrc: "assets/images/www.png",
        title: "Connection #15"
    }
];

if (typeof window !== 'undefined') {
    window.CONNECTIONS_QUESTIONS = CONNECTIONS_QUESTIONS;
} else if (typeof globalThis !== 'undefined') {
    globalThis.CONNECTIONS_QUESTIONS = CONNECTIONS_QUESTIONS;
}
