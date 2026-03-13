export const SKILL_TARGETS = {
    'Frontend Warrior': [
        { name: 'React', level: 80, node: 'Senior Architect' },
        { name: 'JavaScript', level: 75, node: 'Logic Master' },
        { name: 'HTML', level: 60, node: 'Structure Specialist' },
        { name: 'CSS', level: 75, node: 'Visual Artisan' },
        { name: 'TypeScript', level: 70, node: 'Type Sage' },
        { name: 'Tailwind', level: 85, node: 'Utility Ninja' },
        { name: 'Next.js', level: 65, node: 'SSR Specialist' },
        { name: 'Redux', level: 60, node: 'State Governor' }
    ],
    'Data Mage': [
        { name: 'Python', level: 85, node: 'Automator' },
        { name: 'SQL', level: 80, node: 'Query Titan' },
        { name: 'Pandas', level: 75, node: 'Data Wrangler' },
        { name: 'Machine Learning', level: 70, node: 'Model Architect' },
        { name: 'Deep Learning', level: 65, node: 'Neural Weaver' },
        { name: 'Statistics', level: 75, node: 'Probabilistic Oracle' },
        { name: 'Spark', level: 60, node: 'Stream Walker' },
        { name: 'Tableau', level: 70, node: 'Visual Oracle' }
    ],
    'Cloud Engineer': [
        { name: 'Cloud', level: 80, node: 'Sky Warden' },
        { name: 'Docker', level: 75, node: 'Container Captain' },
        { name: 'Kubernetes', level: 70, node: 'Cluster Lord' },
        { name: 'AWS', level: 65, node: 'Amazonian Hero' },
        { name: 'Terraform', level: 80, node: 'Infrastructure Scribe' },
        { name: 'Jenkins', level: 75, node: 'Pipeline Pilot' },
        { name: 'Ansible', level: 70, node: 'Host Harmonizer' },
        { name: 'Azure', level: 65, node: 'Microsoft Cleric' }
    ],
    'Cyber Ninja': [
        { name: 'Cyber', level: 85, node: 'Perimeter Ghost' },
        { name: 'Networking', level: 80, node: 'Packet Striker' },
        { name: 'Encryption', level: 75, node: 'Cipher Smith' },
        { name: 'Pentesting', level: 70, node: 'Vulnerability Ghost' },
        { name: 'Linux', level: 80, node: 'Kernel Spirit' },
        { name: 'Wireshark', level: 75, node: 'Sniffer Phantom' },
        { name: 'Metasploit', level: 70, node: 'Exploit Shadow' },
        { name: 'Firewall', level: 85, node: 'Gateway Guardian' }
    ],
    'AI Architect': [
        { name: 'LLMs', level: 85, node: 'Prompt Master' },
        { name: 'Neural Networks', level: 80, node: 'Synapse Weaver' },
        { name: 'PyTorch', level: 75, node: 'Tensor Sculptor' },
        { name: 'OpenAI API', level: 85, node: 'Token Alchemist' },
        { name: 'LangChain', level: 70, node: 'Agent Commander' },
        { name: 'Vector DBs', level: 75, node: 'Memory Architect' },
        { name: 'TensorFlow', level: 65, node: 'Graph Guardian' },
        { name: 'HuggingFace', level: 80, node: 'Model Librarian' }
    ],
    'DevOps Paladin': [
        { name: 'SRE', level: 85, node: 'Stability Guardian' },
        { name: 'Prometheus', level: 80, node: 'Metric Scribe' },
        { name: 'Grafana', level: 80, node: 'Visual Warden' },
        { name: 'ELK Stack', level: 75, node: 'Log Hunter' },
        { name: 'GitLab CI', level: 85, node: 'Forge Master' },
        { name: 'ArgoCD', level: 75, node: 'GitOps High Priest' },
        { name: 'Nginx', level: 70, node: 'Traffic Controller' },
        { name: 'Helm', level: 80, node: 'Chart Admiral' }
    ],
    'UI/UX Sorcerer': [
        { name: 'Figma', level: 90, node: 'Canvas Sage' },
        { name: 'User Research', level: 85, node: 'Empathy Oracle' },
        { name: 'Prototyping', level: 80, node: 'Flow Weaver' },
        { name: 'Design Systems', level: 85, node: 'Pattern Architect' },
        { name: 'Color Theory', level: 75, node: 'Spectrum Sorcerer' },
        { name: 'Typography', level: 70, node: 'Font Alchemist' },
        { name: 'Webflow', level: 65, node: 'No-Code Knight' },
        { name: 'A/B Testing', level: 75, node: 'Insight Seer' }
    ],
    'Mobile Monk': [
        { name: 'React Native', level: 85, node: 'Bridge Builder' },
        { name: 'Flutter', level: 80, node: 'Dart Disciple' },
        { name: 'Swift', level: 75, node: 'Apple Acolyte' },
        { name: 'Kotlin', level: 75, node: 'Android Artisan' },
        { name: 'Expo', level: 85, node: 'Launch Commander' },
        { name: 'Firebase', level: 80, node: 'Backendless Sage' },
        { name: 'Mobile UX', level: 70, node: 'Touch Designer' },
        { name: 'App Store', level: 65, node: 'Release Specialist' }
    ],
    'Blockchain Bard': [
        { name: 'Solidity', level: 85, node: 'Contract Smith' },
        { name: 'Ethereum', level: 80, node: 'Chain Walker' },
        { name: 'Web3.js', level: 80, node: 'Protocol Linker' },
        { name: 'Ethers.js', level: 75, node: 'Secure Signer' },
        { name: 'Hardhat', level: 85, node: 'Local Miner' },
        { name: 'IPFS', level: 70, node: 'Data Decentralizer' },
        { name: 'DeFi', level: 75, node: 'Finance Mage' },
        { name: 'NFTs', level: 65, node: 'Asset Crafter' }
    ],
    'QA Shadow': [
        { name: 'Jest', level: 85, node: 'Test Specialist' },
        { name: 'Cypress', level: 80, node: 'Automation Ghost' },
        { name: 'Selenium', level: 70, node: 'Legacy Hunter' },
        { name: 'Playwright', level: 85, node: 'Modern Tracer' },
        { name: 'Bug Hunting', level: 90, node: 'Error Reaper' },
        { name: 'Performance', level: 75, node: 'Load Bearer' },
        { name: 'Postman', level: 85, node: 'API Inspector' },
        { name: 'CI Testing', level: 80, node: 'Pipeline Sentinel' }
    ],
    'Data Warden': [
        { name: 'Data Governance', level: 90, node: 'Privacy Protector' },
        { name: 'Airflow', level: 80, node: 'Pipeline Architect' },
        { name: 'Snowflake', level: 75, node: 'Cloud Vault Master' },
        { name: 'Data Privacy', level: 85, node: 'Compliance Guardian' },
        { name: 'ETL', level: 80, node: 'Flow Alchemist' },
        { name: 'Databricks', level: 70, node: 'Delta Lake Lord' },
        { name: 'PostgreSQL', level: 85, node: 'Query Sentinel' },
        { name: 'Data Modeling', level: 75, node: 'Schema Scribe' }
    ],
    'Backend Titan': [
        { name: 'Node.js', level: 90, node: 'Runtime Master' },
        { name: 'Go', level: 80, node: 'Concurrency Titan' },
        { name: 'Microservices', level: 85, node: 'Architecture God' },
        { name: 'System Design', level: 85, node: 'Blueprint Oracle' },
        { name: 'GraphQL', level: 80, node: 'Resolver Sage' },
        { name: 'Redis', level: 80, node: 'Cache Phantom' },
        { name: 'Kafka', level: 75, node: 'Event Commander' },
        { name: 'PostgreSQL', level: 85, node: 'Persistence Giant' }
    ]
};
