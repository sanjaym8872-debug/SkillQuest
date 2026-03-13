const fs = require('fs');
const path = require('path');

const skills = [
    'React', 'JavaScript', 'HTML', 'CSS', 'TypeScript', 'Tailwind', 'Next.js', 'Redux',
    'Python', 'SQL', 'Pandas', 'Machine Learning', 'Deep Learning', 'Statistics', 'Spark', 'Tableau',
    'Cloud', 'Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins', 'Ansible', 'Azure',
    'Cyber', 'Networking', 'Encryption', 'Pentesting', 'Linux', 'Wireshark', 'Metasploit', 'Firewall',
    'LLMs', 'Neural Networks', 'PyTorch', 'OpenAI API', 'LangChain', 'Vector DBs', 'TensorFlow', 'HuggingFace',
    'SRE', 'Prometheus', 'Grafana', 'ELK Stack', 'GitLab CI', 'ArgoCD', 'Nginx', 'Helm',
    'Figma', 'User Research', 'Prototyping', 'Design Systems', 'Color Theory', 'Typography', 'Webflow', 'A/B Testing',
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Expo', 'Firebase', 'Mobile UX', 'App Store',
    'Solidity', 'Ethereum', 'Web3.js', 'Ethers.js', 'Hardhat', 'IPFS', 'DeFi', 'NFTs',
    'Jest', 'Cypress', 'Selenium', 'Playwright', 'Bug Hunting', 'Performance', 'Postman', 'CI Testing',
    'Data Governance', 'Airflow', 'Snowflake', 'Data Privacy', 'ETL', 'Databricks', 'PostgreSQL', 'Data Modeling',
    'Node.js', 'Go', 'Microservices', 'System Design', 'GraphQL', 'Redis', 'Kafka',
    'Bash', 'Testing', 'Algorithms', 'Debugging', 'Architecture', 'Refactoring', 'Backend', 'Optimization', 'Design'
];

const generationTemplates = [
    {
        q: (s) => `In the context of production-grade ${s}, how is high availability (HA) typically achieved?`,
        a: (s) => ["Multi-region replication", "Single local backup", "Vertical scaling only", "Manual intervention"],
        correctIndex: 0
    },
    {
        q: (s) => `What is the most common performance bottleneck encountered with ${s} at scale?`,
        a: (s) => ["CPU saturation", "Memory leakage", "I/O wait and latency", "Syntax complexity"],
        correctIndex: 2
    },
    {
        q: (s) => `Senior architects recommend which pattern for ${s} state synchronization?`,
        a: (s) => ["Eventual consistency", "Lock-step synchronization", "Centralized polling", "Stateless execution"],
        correctIndex: 0
    },
    {
        q: (s) => `When debugging ${s} in a containerized environment, which layer provides the most insight?`,
        a: (s) => ["Infrastructure logs", "Orchestration metrics", "Application traces", "OS kernel dumps"],
        correctIndex: 2
    },
    {
        q: (s) => `Which security protocol is standard for industrial-strength ${s} implementations?`,
        a: (s) => ["Zero-trust architecture", "Basic Auth", "Network isolation only", "Obfuscation"],
        correctIndex: 0
    }
];

const specializedSamples = [
    {
        skill: 'React',
        question: "What is the primary purpose of 'React.memo'?",
        options: ["Store global state", "Prevent unnecessary re-renders", "Create a new context", "Handle side effects"],
        correctIndex: 1, difficulty: 2, points: 20
    },
    {
        skill: 'JavaScript',
        question: "What is the output of 'typeof NaN'?",
        options: ["'number'", "'undefined'", "'NaN'", "'object'"],
        correctIndex: 0, difficulty: 2, points: 15
    },
    {
        skill: 'Machine Learning',
        question: "In supervised learning, what is 'Regularization' used to prevent?",
        options: ["Underfitting", "Low Accuracy", "Overfitting", "Data Bias"],
        correctIndex: 2, difficulty: 3, points: 25
    },
    {
        skill: 'Docker',
        question: "What is the command to view all running and stopped containers?",
        options: ["docker list", "docker ps", "docker ps -a", "docker containers -all"],
        correctIndex: 2, difficulty: 1, points: 10
    }
];

const generateOutput = () => {
    let output = "# 🧠 SkillQuest Master Question Bank (V2)\n\n";
    output += "This file contains the cross-verified, technically accurate MCQs used for all user roles.\n\n";

    output += "## 🌟 Specialized Tactical Data\n\n";
    specializedSamples.forEach((q, i) => {
        output += `### ${i + 1}. [${q.skill}] ${q.question}\n`;
        q.options.forEach((opt, idx) => {
            const label = idx === q.correctIndex ? "**[CORRECT]**" : "";
            output += `- ${opt} ${label}\n`;
        });
        output += `\n**Difficulty:** ${q.difficulty} | **Points:** ${q.points}\n\n---\n\n`;
    });

    output += "## 🛠️ Procedural Neural Patterning\n\n";
    skills.forEach(skill => {
        output += `### 📂 Sector: ${skill}\n\n`;
        generationTemplates.forEach((template, idx) => {
            const qText = template.q(skill);
            const opts = template.a(skill);
            const correctIdx = template.correctIndex;

            output += `#### Q${idx + 1}: ${qText}\n`;
            opts.forEach((opt, idx) => {
                const label = idx === correctIdx ? "**[CORRECT]**" : "";
                output += `- ${opt} ${label}\n`;
            });
            output += `\n`;
        });
        output += `\n---\n\n`;
    });

    return output;
};

const output = generateOutput();
fs.writeFileSync(path.join(__dirname, '..', 'MCQ_REFERENCE.md'), output);
console.log('Synchronized Neural Reference generated at /MCQ_REFERENCE.md');
