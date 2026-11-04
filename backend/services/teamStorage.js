const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TEAM_STORE_PATH = path.join(__dirname, '../data/team_store.json');

const ensureDataDir = () => {
  const dir = path.dirname(TEAM_STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const seedTeamMembers = () => [
  {
    id: 'nilanjan-nayak',
    name: 'Nilanjan Nayak',
    isMainLeader: true,
    role: 'Founder & Chief AI Architect',
    category: 'founder',
    badge: 'Founder & Principal Architect',
    badgeColor: 'border-amber-400/50 bg-amber-500/10 text-amber-300',
    tagline: 'Architect of Star AI Lab and creator of its flagship intelligent neural prototypes.',
    avatarUrl: 'https://github.com/Nilanjan-Nayak.png',
    fallbackInitials: 'NN',
    bio: 'Pioneering founder and lead AI engineer behind Star AI Lab. Sole creator and primary architect of the lab\'s core AI models, multimodal RAG systems, and distributed telemetry. Guides students, collaborators, and team members to represent Star AI Lab across national hackathons and agricultural summits.',
    competitions: [
      {
        name: 'National Agro-Tech Innovation Expo',
        year: '2024 - 2025',
        roleInCompetition: 'Team Lead & Model Architect (Representing Star AI Lab)',
        track: 'AgriVision AI — Deep Vision Crop Diagnostics & Multilingual RAG',
        outcome: 'Top National Finalist & Live Field Showcase'
      },
      {
        name: 'National AI & Developer Tools Hackathon',
        year: '2024',
        roleInCompetition: 'Lead Innovator (Solo Developer under Star AI Lab)',
        track: 'Star Interview Preparation — Real-Time Evaluation Engine',
        outcome: 'Featured AI Prototype & High Distinction'
      },
      {
        name: 'Web3 & Campus Innovation Summit',
        year: '2024',
        roleInCompetition: 'Smart Contract & Architecture Lead (Star AI Lab Team)',
        track: 'CareerKick — Decentralized Student Credentialing & Verification',
        outcome: 'Recognized Innovation in Tamper-Proof Portfolio Credentials'
      },
      {
        name: 'Smart Hardware & IoT Tech Expo',
        year: '2024',
        roleInCompetition: 'IoT Systems Architect (Star AI Lab)',
        track: 'Smart Storage Telemetry — InfluxDB Time-Series Pipeline',
        outcome: 'High-Throughput Distributed Telemetry Finalist'
      }
    ],
    projectContributions: [
      {
        project: 'AgriVision AI',
        role: 'AI Architect & Lead Developer',
        highlights: 'Trained CNN/Vision models reaching 97.8% diagnostic accuracy, engineered voice-first multilingual RAG advisory pipeline.'
      },
      {
        project: 'Star Interview Preparation',
        role: 'Creator & Solo Developer',
        highlights: 'Engineered real-time audio and speech analysis, adaptive technical question generation, and instant feedback algorithms.'
      },
      {
        project: 'Star AI Assistant',
        role: 'Lead Architect',
        highlights: 'Context-aware conversational intelligence, task execution toolchain, and low-latency client integration.'
      },
      {
        project: 'Smart Storage Telemetry',
        role: 'End-to-End Systems Architect',
        highlights: 'Designed edge-to-cloud telemetry ingest pipeline with AWS IoT, InfluxDB time-series storage, and Grafana dashboarding.'
      },
      {
        project: 'CareerKick',
        role: 'Smart Contract & Web3 Architect',
        highlights: 'Authored audited Solidity smart contracts for tamper-proof digital certificates and client Web3 wallet bridge.'
      }
    ],
    skills: [
      'Deep Learning (PyTorch)',
      'Computer Vision',
      'Multilingual RAG',
      'Full-Stack Architecture (React/TS/Node)',
      'Solidity & Web3',
      'IoT Telemetry',
      'Vector Databases'
    ],
    socials: {
      github: 'https://github.com/Nilanjan-Nayak',
      linkedin: 'https://www.linkedin.com/in/nilanjan-nayak-73b475322/',
      unstop: 'https://unstop.com/u/nilannay77458',
      portfolio: 'https://nilanjan-nayak.my-board.org',
      email: 'starailab.info@gmail.com'
    }
  },
  {
    id: 'suman-rana',
    name: 'Suman Rana',
    isMainLeader: false,
    role: 'CareerKick Co-Creator & Full-Stack Web3 Developer',
    category: 'hackathon',
    badge: 'CareerKick Co-Creator',
    badgeColor: 'border-cyan-400/50 bg-cyan-500/10 text-cyan-300',
    tagline: 'Co-created CareerKick and represented Star AI Lab at Web3 & Campus Innovation Summit.',
    avatarUrl: 'https://github.com/RanaSuman.png',
    fallbackInitials: 'SR',
    bio: 'Full-Stack and Web3 engineer who partnered with Star AI Lab to build CareerKick. Architected responsive student portfolio interfaces, mapped recruiter verification workflows, and integrated client-side Web3 application components for tamper-proof credentials.',
    competitions: [
      {
        name: 'Web3 & Campus Innovation Summit',
        year: '2024',
        roleInCompetition: 'Co-Creator & Web3 Full-Stack Developer (Star AI Lab)',
        track: 'CareerKick — Decentralized Student Credentialing & Verification',
        outcome: 'Finalist Prototype & Credentialing Showcase'
      }
    ],
    projectContributions: [
      {
        project: 'CareerKick',
        role: 'Co-Creator & Full-Stack Web3 Developer',
        highlights: 'Engineered student portfolio dashboard, designed responsive recruiter verification interfaces, and co-developed Web3 client integration.'
      }
    ],
    skills: [
      'Full-Stack Web Development',
      'React & JavaScript',
      'Web3 Application UX',
      'UI/UX Architecture',
      'Responsive Frontend Design'
    ],
    socials: {
      portfolio: 'https://suman-rana.netlify.app/',
      github: 'https://github.com/RanaSuman',
      linkedin: 'https://www.linkedin.com/in/suman-rana-champ/',
      email: 'ranasuman6699@gmail.com',
      unstop: 'https://unstop.com/u/nilannay77458'
    }
  },
  {
    id: 'ankan-sen',
    name: 'Ankan Sen',
    isMainLeader: false,
    role: 'Field Testing & Agricultural ML Contributor',
    category: 'hackathon',
    badge: 'Hackathon Squad & ML Researcher',
    badgeColor: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-300',
    tagline: 'Represented Star AI Lab at National Agro-Tech Innovation Expo & Field Dataset Lead.',
    avatarUrl: 'https://github.com/Nilanjan-Nayak.png',
    fallbackInitials: 'AS',
    bio: 'Key agricultural field researcher and dataset contributor who represented Star AI Lab in national hackathon initiatives. Conducted field studies across regional farmlands, collecting and labeling over 15,000 crop disease leaf samples to calibrate AgriVision AI\'s vision models with real-world accuracy.',
    competitions: [
      {
        name: 'National Agro-Tech Innovation Expo',
        year: '2024 - 2025',
        roleInCompetition: 'Field ML & Validation Track (Star AI Lab Delegation)',
        track: 'AgriVision AI — Field Pathology Testing & Vernacular Evaluation',
        outcome: 'Top National Finalist & Farmer Demonstration'
      }
    ],
    projectContributions: [
      {
        project: 'AgriVision AI',
        role: 'Field Testing & Dataset Validation',
        highlights: 'Curated 15,000+ crop leaves across rural regions, validated vernacular linguistic nuances (Bengali/Hindi), and tested real farmer UX.'
      }
    ],
    skills: [
      'Field Data Collection',
      'Crop Pathology Labeling',
      'Vernacular NLP Testing',
      'Ground-Truth Validation'
    ],
    socials: {
      github: 'https://github.com/Nilanjan-Nayak',
      unstop: 'https://unstop.com/u/nilannay77458'
    }
  }
];

const getLocalTeam = () => {
  ensureDataDir();
  if (fs.existsSync(TEAM_STORE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(TEAM_STORE_PATH, 'utf8'));
    } catch (e) {
      console.error('Error reading local team store:', e);
    }
  }
  const seeded = seedTeamMembers();
  saveLocalTeam(seeded);
  return seeded;
};

const saveLocalTeam = (members) => {
  ensureDataDir();
  try {
    fs.writeFileSync(TEAM_STORE_PATH, JSON.stringify(members, null, 2));
  } catch (e) {
    console.error('Error saving local team store:', e);
  }
};

const getAllMembers = async () => {
  return getLocalTeam();
};

const getMemberById = async (id) => {
  const members = getLocalTeam();
  return members.find(m => m.id === id) || null;
};

const addMember = async (memberData) => {
  const members = getLocalTeam();
  const id = memberData.id || (memberData.name ? memberData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : crypto.randomBytes(4).toString('hex'));
  
  const newMember = {
    ...memberData,
    id,
    isMainLeader: !!memberData.isMainLeader,
    category: memberData.category || 'hackathon',
    competitions: Array.isArray(memberData.competitions) ? memberData.competitions : [],
    projectContributions: Array.isArray(memberData.projectContributions) ? memberData.projectContributions : [],
    skills: Array.isArray(memberData.skills) ? memberData.skills : (typeof memberData.skills === 'string' ? memberData.skills.split(',').map(s => s.trim()).filter(Boolean) : []),
    socials: memberData.socials || {}
  };

  members.push(newMember);
  saveLocalTeam(members);
  return newMember;
};

const updateMember = async (id, updateData) => {
  const members = getLocalTeam();
  const index = members.findIndex(m => m.id === id);
  if (index === -1) {
    return null;
  }

  const existing = members[index];
  const updated = {
    ...existing,
    ...updateData,
    id: existing.id, // Preserve id
    competitions: Array.isArray(updateData.competitions) ? updateData.competitions : existing.competitions,
    projectContributions: Array.isArray(updateData.projectContributions) ? updateData.projectContributions : existing.projectContributions,
    skills: Array.isArray(updateData.skills) ? updateData.skills : (typeof updateData.skills === 'string' ? updateData.skills.split(',').map(s => s.trim()).filter(Boolean) : existing.skills),
    socials: updateData.socials ? { ...existing.socials, ...updateData.socials } : existing.socials
  };

  members[index] = updated;
  saveLocalTeam(members);
  return updated;
};

const deleteMember = async (id) => {
  const members = getLocalTeam();
  const index = members.findIndex(m => m.id === id);
  if (index === -1) {
    return false;
  }
  members.splice(index, 1);
  saveLocalTeam(members);
  return true;
};

module.exports = {
  getAllMembers,
  getMemberById,
  addMember,
  updateMember,
  deleteMember
};

