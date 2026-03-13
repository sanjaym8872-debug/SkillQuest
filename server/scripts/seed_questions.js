const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const Question = require('../models/Question');

const QUESTIONS = [
    // --- FRONTEND ---
    {
        skill: 'React',
        question: "What is the primary purpose of 'React.memo'?",
        options: ["Store global state", "Prevent unnecessary re-renders", "Create a new context", "Handle side effects"],
        correctIndex: 1, difficulty: 2, points: 20
    },
    {
        skill: 'React',
        question: "Which hook is used for direct manual DOM manipulation in React?",
        options: ["useDOM", "useRef", "useManual", "useEffect"],
        correctIndex: 1, difficulty: 1, points: 15
    },
    {
        skill: 'JavaScript',
        question: "What is the output of 'typeof NaN'?",
        options: ["'number'", "'undefined'", "'NaN'", "'object'"],
        correctIndex: 0, difficulty: 2, points: 15
    },
    {
        skill: 'JavaScript',
        question: "Which keyword is used to prevent an object from being modified in ES6?",
        options: ["const", "Object.freeze()", "Object.lock()", "static"],
        correctIndex: 1, difficulty: 1, points: 10
    },
    {
        skill: 'HTML',
        question: "Which HTML5 element is used for drawing graphics via scripting?",
        options: ["<svg>", "<canvas>", "<paint>", "<gfx>"],
        correctIndex: 1, difficulty: 1, points: 10
    },
    {
        skill: 'CSS',
        question: "What does the 'flex-shrink' property do in Flexbox?",
        options: ["Shrinks the container", "Determines if an item grows", "Enables item shrinking when space is low", "Sets the initial size"],
        correctIndex: 2, difficulty: 2, points: 15
    },
    {
        skill: 'TypeScript',
        question: "What is 'Partial<T>' in TypeScript?",
        options: ["A type that only allows partial strings", "Makes all properties of T optional", "Removes properties from T", "Ensures T is a class"],
        correctIndex: 1, difficulty: 2, points: 20
    },

    // --- DATA SCIENCE / AI ---
    {
        skill: 'Python',
        question: "How do you define a generator function in Python?",
        options: ["Using 'return'", "Using 'yield'", "Using 'gen'", "Using 'async'"],
        correctIndex: 1, difficulty: 1, points: 10
    },
    {
        skill: 'SQL',
        question: "Which SQL command is used to remove all records from a table without deleting the schema?",
        options: ["DELETE", "TRUNCATE", "DROP", "CLEAR"],
        correctIndex: 1, difficulty: 2, points: 20
    },
    {
        skill: 'Machine Learning',
        question: "In supervised learning, what is 'Regularization' used to prevent?",
        options: ["Underfitting", "Low Accuracy", "Overfitting", "Data Bias"],
        correctIndex: 2, difficulty: 3, points: 25
    },
    {
        skill: 'Neural Networks',
        question: "What is the primary function of an 'Activation Function' in a neuron?",
        options: ["Initialize weights", "Introduce non-linearity", "Calculate loss", "Update bias"],
        correctIndex: 1, difficulty: 3, points: 30
    },
    {
        skill: 'Pandas',
        question: "Which method is used to drop missing values in a DataFrame?",
        options: ["df.remove_nan()", "df.dropna()", "df.clean()", "df.drop_null()"],
        correctIndex: 1, difficulty: 1, points: 15
    },

    // --- CLOUD / DEVOPS ---
    {
        skill: 'Docker',
        question: "What is the command to view all running and stopped containers?",
        options: ["docker list", "docker ps", "docker ps -a", "docker containers -all"],
        correctIndex: 2, difficulty: 1, points: 10
    },
    {
        skill: 'Kubernetes',
        question: "Which K8s object is used to manage stateless applications?",
        options: ["Pod", "Deployment", "StatefulSet", "DaemonSet"],
        correctIndex: 1, difficulty: 2, points: 20
    },
    {
        skill: 'AWS',
        question: "Which AWS service provides serverless compute capacity?",
        options: ["EC2", "S3", "Lambda", "RDS"],
        correctIndex: 2, difficulty: 1, points: 15
    },
    {
        skill: 'Terraform',
        question: "In Terraform, where is the information about your infrastructure state stored?",
        options: [".tf files", "terraform.state", "Environment variables", "Terraform Cloud only"],
        correctIndex: 1, difficulty: 2, points: 20
    },

    // --- CYBER SECURITY ---
    {
        skill: 'Cyber',
        question: "What is 'SQL Injection' primarily used for?",
        options: ["Encrypting data", "Manipulating DB queries", "Crashing the web server", "Speeding up searches"],
        correctIndex: 1, difficulty: 2, points: 20
    },
    {
        skill: 'Encryption',
        question: "Which type of encryption uses a Public Key and a Private Key?",
        options: ["Symmetric", "Asymmetric", "Hash-based", "Circular"],
        correctIndex: 1, difficulty: 1, points: 15
    },
    {
        skill: 'Linux',
        question: "Which command is used to change file permissions in Linux?",
        options: ["chdown", "chmod", "chown", "permit"],
        correctIndex: 1, difficulty: 1, points: 10
    },

    // --- BACKEND / SYSTEM DESIGN ---
    {
        skill: 'Node.js',
        question: "Is Node.js single-threaded or multi-threaded for its main execution loop?",
        options: ["Multi-threaded", "Single-threaded", "It depends on the CPU", "Hybrid"],
        correctIndex: 1, difficulty: 2, points: 20
    },
    {
        skill: 'Redis',
        question: "What is the primary data structure of Redis?",
        options: ["Relational Table", "Graph", "Key-Value Store", "Document-based"],
        correctIndex: 2, difficulty: 1, points: 15
    },
    {
        skill: 'Microservices',
        question: "What does 'SAGA' represent in microservice transaction management?",
        options: ["Serverless Gateway", "Service-to-Service API", "Sequence of local transactions", "Stateful Application"],
        correctIndex: 2, difficulty: 3, points: 30
    },

    // --- QA / TESTING ---
    {
        skill: 'Jest',
        question: "Which function is used to define a test case in Jest?",
        options: ["case()", "verify()", "it() or test()", "run()"],
        correctIndex: 2, difficulty: 1, points: 10
    },
    {
        skill: 'Cypress',
        question: "What makes Cypress unique compared to Selenium?",
        options: ["Runs in the browser", "Requires no installation", "Only works for Python", "Supports only IE"],
        correctIndex: 0, difficulty: 2, points: 20
    }
];

// 🔄 ADDING PROCEDURAL FALLBACKS (To ensure coverage for all 100+ skills mentioned)
const proceduralSkills = [
    'Tailwind', 'Next.js', 'Redux', 'Statistics', 'Spark', 'Tableau',
    'Cloud', 'Jenkins', 'Ansible', 'Azure', 'Networking', 'Pentesting',
    'Wireshark', 'Metasploit', 'Firewall', 'LLMs', 'PyTorch', 'OpenAI API',
    'LangChain', 'Vector DBs', 'TensorFlow', 'HuggingFace', 'SRE', 'Prometheus',
    'Grafana', 'ELK Stack', 'GitLab CI', 'ArgoCD', 'Nginx', 'Helm', 'Figma',
    'User Research', 'Prototyping', 'Design Systems', 'Color Theory', 'Typography',
    'Webflow', 'A/B Testing', 'React Native', 'Flutter', 'Swift', 'Kotlin', 'Expo',
    'Firebase', 'Mobile UX', 'App Store', 'Solidity', 'Ethereum', 'Web3.js',
    'Ethers.js', 'Hardhat', 'IPFS', 'DeFi', 'NFTs', 'Playwright', 'Bug Hunting',
    'Performance', 'Postman', 'CI Testing', 'Data Governance', 'Airflow', 'Snowflake',
    'Data Privacy', 'ETL', 'Databricks', 'PostgreSQL', 'Data Modeling', 'Go',
    'GraphQL', 'Kafka', 'Bash', 'Testing', 'Algorithms', 'Debugging', 'Architecture',
    'Refactoring', 'Optimization', 'Design'
];

proceduralSkills.forEach(s => {
    QUESTIONS.push({
        skill: s,
        question: `In the context of production-grade ${s}, how is high availability (HA) typically achieved?`,
        options: ["Multi-region replication", "Single local backup", "Vertical scaling only", "Manual intervention"],
        correctIndex: 0, difficulty: 2, points: 20
    });
    QUESTIONS.push({
        skill: s,
        question: `What is the most common performance bottleneck encountered with ${s} at scale?`,
        options: ["CPU saturation", "Memory leakage", "I/O wait and latency", "Syntax complexity"],
        correctIndex: 2, difficulty: 2, points: 20
    });
    QUESTIONS.push({
        skill: s,
        question: `Senior architects recommend which pattern for ${s} state synchronization?`,
        options: ["Eventual consistency", "Lock-step synchronization", "Centralized polling", "Stateless execution"],
        correctIndex: 0, difficulty: 3, points: 30
    });
    QUESTIONS.push({
        skill: s,
        question: `When debugging ${s} in a containerized environment, which layer provides the most insight?`,
        options: ["Infrastructure logs", "Orchestration metrics", "Application traces", "OS kernel dumps"],
        correctIndex: 2, difficulty: 2, points: 20
    });
    QUESTIONS.push({
        skill: s,
        question: `Which security protocol is standard for industrial-strength ${s} implementations?`,
        options: ["Zero-trust architecture", "Basic Auth", "Network isolation only", "Obfuscation"],
        correctIndex: 0, difficulty: 3, points: 30
    });
});

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- SEEDING NEURAL DATA CORE ---');

        await Question.deleteMany({});
        console.log('Sectors cleared.');

        const inserted = await Question.insertMany(QUESTIONS);
        console.log(`${inserted.length} questions synchronized successfully.`);

        process.exit(0);
    } catch (err) {
        console.error('Neural Sync Failed:', err);
        process.exit(1);
    }
}

seed();
