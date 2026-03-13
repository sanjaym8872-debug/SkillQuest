const SKILL_TARGETS = {
    'Frontend Warrior': [
        { name: 'React', level: 80 },
        { name: 'JavaScript', level: 75 },
        { name: 'HTML', level: 60 },
        { name: 'CSS', level: 75 },
        { name: 'TypeScript', level: 70 },
        { name: 'Tailwind', level: 85 },
        { name: 'Next.js', level: 65 },
        { name: 'Redux', level: 60 }
    ],
    'Data Mage': [
        { name: 'Python', level: 85 },
        { name: 'SQL', level: 80 },
        { name: 'Pandas', level: 75 },
        { name: 'Machine Learning', level: 70 },
        { name: 'Deep Learning', level: 65 },
        { name: 'Statistics', level: 75 },
        { name: 'Spark', level: 60 },
        { name: 'Tableau', level: 70 }
    ],
    'Cloud Engineer': [
        { name: 'Cloud', level: 80 },
        { name: 'Docker', level: 75 },
        { name: 'Kubernetes', level: 70 },
        { name: 'AWS', level: 65 },
        { name: 'Terraform', level: 80 },
        { name: 'Jenkins', level: 75 },
        { name: 'Ansible', level: 70 },
        { name: 'Azure', level: 65 }
    ],
    'Cyber Ninja': [
        { name: 'Cyber', level: 85 },
        { name: 'Networking', level: 80 },
        { name: 'Encryption', level: 75 },
        { name: 'Pentesting', level: 70 },
        { name: 'Linux', level: 80 },
        { name: 'Wireshark', level: 75 },
        { name: 'Metasploit', level: 70 },
        { name: 'Firewall', level: 85 }
    ],
    'AI Architect': [
        { name: 'LLMs', level: 85 },
        { name: 'Neural Networks', level: 80 },
        { name: 'PyTorch', level: 75 },
        { name: 'OpenAI API', level: 85 },
        { name: 'LangChain', level: 70 },
        { name: 'Vector DBs', level: 75 },
        { name: 'TensorFlow', level: 65 },
        { name: 'HuggingFace', level: 80 }
    ],
    'DevOps Paladin': [
        { name: 'SRE', level: 85 },
        { name: 'Prometheus', level: 80 },
        { name: 'Grafana', level: 80 },
        { name: 'ELK Stack', level: 75 },
        { name: 'GitLab CI', level: 85 },
        { name: 'ArgoCD', level: 75 },
        { name: 'Nginx', level: 70 },
        { name: 'Helm', level: 80 }
    ],
    'UI/UX Sorcerer': [
        { name: 'Figma', level: 90 },
        { name: 'User Research', level: 85 },
        { name: 'Prototyping', level: 80 },
        { name: 'Design Systems', level: 85 },
        { name: 'Color Theory', level: 75 },
        { name: 'Typography', level: 70 },
        { name: 'Webflow', level: 65 },
        { name: 'A/B Testing', level: 75 }
    ],
    'Mobile Monk': [
        { name: 'React Native', level: 85 },
        { name: 'Flutter', level: 80 },
        { name: 'Swift', level: 75 },
        { name: 'Kotlin', level: 75 },
        { name: 'Expo', level: 85 },
        { name: 'Firebase', level: 80 },
        { name: 'Mobile UX', level: 70 },
        { name: 'App Store', level: 65 }
    ],
    'Blockchain Bard': [
        { name: 'Solidity', level: 85 },
        { name: 'Ethereum', level: 80 },
        { name: 'Web3.js', level: 80 },
        { name: 'Ethers.js', level: 75 },
        { name: 'Hardhat', level: 85 },
        { name: 'IPFS', level: 70 },
        { name: 'DeFi', level: 75 },
        { name: 'NFTs', level: 65 }
    ],
    'QA Shadow': [
        { name: 'Jest', level: 85 },
        { name: 'Cypress', level: 80 },
        { name: 'Selenium', level: 70 },
        { name: 'Playwright', level: 85 },
        { name: 'Bug Hunting', level: 90 },
        { name: 'Performance', level: 75 },
        { name: 'Postman', level: 85 },
        { name: 'CI Testing', level: 80 }
    ],
    'Data Warden': [
        { name: 'Data Governance', level: 90 },
        { name: 'Airflow', level: 80 },
        { name: 'Snowflake', level: 75 },
        { name: 'Data Privacy', level: 85 },
        { name: 'ETL', level: 80 },
        { name: 'Databricks', level: 70 },
        { name: 'PostgreSQL', level: 85 },
        { name: 'Data Modeling', level: 75 }
    ],
    'Backend Titan': [
        { name: 'Node.js', level: 90 },
        { name: 'Go', level: 80 },
        { name: 'Microservices', level: 85 },
        { name: 'System Design', level: 85 },
        { name: 'GraphQL', level: 80 },
        { name: 'Redis', level: 80 },
        { name: 'Kafka', level: 75 },
        { name: 'PostgreSQL', level: 85 }
    ]
};

module.exports = { SKILL_TARGETS };
