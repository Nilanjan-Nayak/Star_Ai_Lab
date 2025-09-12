// Sample project data for the enhanced design system
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  stars?: number;
  views?: number;
  createdAt: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Analytics Dashboard',
    description: 'Real-time data visualization with machine learning insights',
    longDescription: 'A comprehensive analytics platform that leverages artificial intelligence to provide real-time insights, predictive analytics, and automated reporting. Features include interactive dashboards, custom visualizations, and intelligent data processing.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    technologies: ['React', 'TypeScript', 'Python', 'TensorFlow', 'D3.js', 'Node.js'],
    category: 'AI & Machine Learning',
    githubUrl: 'https://github.com/star-ai-labs/analytics-dashboard',
    liveUrl: 'https://analytics.star-ai-labs.com',
    featured: true,
    stars: 245,
    views: 1250,
    createdAt: '2024-01-15',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Smart IoT Management System',
    description: 'Intelligent device management with predictive maintenance',
    longDescription: 'An advanced IoT management platform that uses machine learning algorithms to predict device failures, optimize performance, and automate maintenance schedules. Includes real-time monitoring, alert systems, and comprehensive device analytics.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
    technologies: ['Vue.js', 'Python', 'MQTT', 'InfluxDB', 'Docker', 'Kubernetes'],
    category: 'IoT Solutions',
    githubUrl: 'https://github.com/star-ai-labs/iot-management',
    liveUrl: 'https://iot.star-ai-labs.com',
    featured: true,
    stars: 189,
    views: 890,
    createdAt: '2024-02-20',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Neural Network Visualizer',
    description: 'Interactive tool for understanding deep learning models',
    longDescription: 'A powerful visualization tool that helps developers and researchers understand neural network architectures, training processes, and model behavior. Features include interactive network diagrams, real-time training visualization, and performance metrics.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
    technologies: ['React', 'Three.js', 'Python', 'PyTorch', 'WebGL', 'FastAPI'],
    category: 'AI & Machine Learning',
    githubUrl: 'https://github.com/star-ai-labs/neural-visualizer',
    liveUrl: 'https://visualizer.star-ai-labs.com',
    featured: false,
    stars: 156,
    views: 670,
    createdAt: '2024-03-10',
    status: 'in-progress'
  },
  {
    id: '4',
    title: 'Blockchain Security Auditor',
    description: 'Automated smart contract vulnerability detection',
    longDescription: 'An intelligent security auditing tool that automatically scans smart contracts for vulnerabilities, security flaws, and optimization opportunities. Uses advanced static analysis and machine learning to identify potential issues.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    technologies: ['Solidity', 'Node.js', 'Web3.js', 'Python', 'MongoDB', 'Express'],
    category: 'Blockchain',
    githubUrl: 'https://github.com/star-ai-labs/blockchain-auditor',
    featured: false,
    stars: 98,
    views: 445,
    createdAt: '2024-04-05',
    status: 'completed'
  },
  {
    id: '5',
    title: 'Quantum Computing Simulator',
    description: 'Web-based quantum circuit design and simulation',
    longDescription: 'A comprehensive quantum computing simulator that allows users to design, test, and visualize quantum circuits. Features include drag-and-drop circuit builder, quantum state visualization, and educational resources.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
    technologies: ['React', 'TypeScript', 'Qiskit', 'Python', 'WebAssembly', 'Canvas API'],
    category: 'Quantum Computing',
    githubUrl: 'https://github.com/star-ai-labs/quantum-simulator',
    liveUrl: 'https://quantum.star-ai-labs.com',
    featured: false,
    stars: 234,
    views: 1100,
    createdAt: '2024-05-12',
    status: 'in-progress'
  },
  {
    id: '6',
    title: 'AR/VR Development Platform',
    description: 'Cross-platform immersive experience builder',
    longDescription: 'A comprehensive development platform for creating augmented and virtual reality experiences. Includes visual scripting, asset management, cross-platform deployment, and collaborative development tools.',
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=800&h=400&fit=crop',
    technologies: ['Unity', 'C#', 'WebXR', 'Three.js', 'ARCore', 'ARKit'],
    category: 'AR/VR',
    githubUrl: 'https://github.com/star-ai-labs/arvr-platform',
    featured: false,
    stars: 167,
    views: 780,
    createdAt: '2024-06-18',
    status: 'planned'
  },
  {
    id: '7',
    title: 'Cloud Infrastructure Optimizer',
    description: 'AI-driven cloud cost optimization and resource management',
    longDescription: 'An intelligent cloud management platform that uses machine learning to optimize resource allocation, reduce costs, and improve performance across multiple cloud providers. Features automated scaling, cost prediction, and resource recommendations.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
    technologies: ['Go', 'Kubernetes', 'Terraform', 'AWS', 'Azure', 'GCP'],
    category: 'Cloud Computing',
    githubUrl: 'https://github.com/star-ai-labs/cloud-optimizer',
    featured: false,
    stars: 123,
    views: 560,
    createdAt: '2024-07-22',
    status: 'in-progress'
  },
  {
    id: '8',
    title: 'Cybersecurity Threat Hunter',
    description: 'AI-powered threat detection and response system',
    longDescription: 'An advanced cybersecurity platform that uses artificial intelligence and machine learning to detect, analyze, and respond to security threats in real-time. Features include behavioral analysis, automated incident response, and threat intelligence integration.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
    technologies: ['Python', 'Elasticsearch', 'Kibana', 'TensorFlow', 'Docker', 'Redis'],
    category: 'Cybersecurity',
    githubUrl: 'https://github.com/star-ai-labs/threat-hunter',
    featured: false,
    stars: 201,
    views: 920,
    createdAt: '2024-08-30',
    status: 'completed'
  },
  {
    id: '9',
    title: 'Edge AI Processing Engine',
    description: 'Lightweight AI inference for edge devices',
    longDescription: 'A high-performance AI processing engine optimized for edge devices and IoT applications. Features model compression, hardware acceleration, and real-time inference capabilities with minimal resource usage.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
    technologies: ['C++', 'CUDA', 'OpenVINO', 'TensorRT', 'ARM', 'FPGA'],
    category: 'Edge Computing',
    githubUrl: 'https://github.com/star-ai-labs/edge-ai-engine',
    featured: false,
    stars: 178,
    views: 650,
    createdAt: '2024-09-15',
    status: 'in-progress'
  }
];

export const projectCategories = [
  'AI & Machine Learning',
  'IoT Solutions',
  'Blockchain',
  'Quantum Computing',
  'AR/VR',
  'Cloud Computing',
  'Cybersecurity',
  'Edge Computing'
];

export const technologyTags = [
  'React', 'TypeScript', 'Python', 'TensorFlow', 'PyTorch', 'Node.js',
  'Vue.js', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Solidity', 'Web3.js', 'MongoDB', 'PostgreSQL', 'Redis',
  'Unity', 'C#', 'WebXR', 'Three.js', 'WebGL',
  'Go', 'Rust', 'C++', 'CUDA', 'OpenVINO'
];