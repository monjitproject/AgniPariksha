export interface Author {
  id: string; // e.g. "jaswant-singh"
  name: string;
  role: string;
  bio: string;
  experience: string;
  avatarColor: string; // Tailwind bg-class for background
  reviewedByEditorial: boolean;
  joinedDate: string;
  credentials: string[];
}

export const AUTHORS: Author[] = [
  {
    id: "jaswant-singh",
    name: "Subedar Major Jaswant Singh (Retd.)",
    role: "Chief Defense Careers Mentor",
    bio: "Subedar Major Jaswant Singh (Retd.) served for over 32 years in the Indian Army. He was a senior instructor at tactical training centers and has personally coached thousands of defense aspirants through physical standard tests, physical efficiency routines, and written syllabi vetting.",
    experience: "32+ Years of Active Service & Recruiting Board Analyst",
    avatarColor: "bg-orange-600 text-white",
    reviewedByEditorial: true,
    joinedDate: "January 2024",
    credentials: ["Senior Recruiting Officer", "Presidential Medal Recipient"]
  },
  {
    id: "amit-kaul",
    name: "Shaurya Chakra Awardee Major Amit Kaul",
    role: "Senior National Security & Defense GK Expert",
    bio: "Major Amit Kaul was decorated with the Shaurya Chakra for gallantry during active field operations. After retirement, he dedicated his expertise to mentoring candidates for UPSC NDA, CDS, and SSB interviews, specializing in geopolitical security developments and personal interview coaching.",
    experience: "15+ Years Active Field Operations & SSB Panel Advisor",
    avatarColor: "bg-indigo-600 text-white",
    reviewedByEditorial: true,
    joinedDate: "March 2024",
    credentials: ["Shaurya Chakra Awardee", "Ex-SSB Panel GTO"]
  },
  {
    id: "rs-rathore",
    name: "Col. R.S. Rathore (Retd.)",
    role: "Chief Academic Officer (CAPF & Police)",
    bio: "Col. R.S. Rathore (Retd.) has supervised border management forces and central recruitment drives for CAPFs. He provides authoritative reviews on constable eligibility, physical standard test guidelines, and exam strategies.",
    experience: "25+ Years Border Management & CAPF Recruitment Chairman",
    avatarColor: "bg-emerald-600 text-white",
    reviewedByEditorial: true,
    joinedDate: "February 2024",
    credentials: ["Ex-CAPF Selection Board Chairman", "Strategic Careers Counselor"]
  },
  {
    id: "s-dixit",
    name: "Defense Analyst S. Dixit",
    role: "Senior Syllabus & Exam Strategy Consultant",
    bio: "Shalini Dixit is a prominent defense analyst and competitive exam researcher. She analyzes exam patterns, negative marking weights, and syllabus variations across CAPF, SSC GD, and Agniveer entries.",
    experience: "12+ Years Exam Analytics & Syllabus Optimization",
    avatarColor: "bg-blue-800 text-white",
    reviewedByEditorial: true,
    joinedDate: "May 2024",
    credentials: ["Defense Research Fellow", "AgniPariksha Core Panelist"]
  },
  {
    id: "animesh-sen",
    name: "Prof. Animesh Sen",
    role: "Senior Academic Advisor & GK/English Vetting Authority",
    bio: "Professor Animesh Sen is a retired Head of Department with over 28 years of academic teaching. He specializes in English grammar structures, constitutional history, and verbal ability modules.",
    experience: "28+ Years of Academic Teaching & Pedagogy Vetting",
    avatarColor: "bg-teal-700 text-white",
    reviewedByEditorial: true,
    joinedDate: "October 2023",
    credentials: ["Ph.D. in English Literature", "UPSC Qualifying Panel Member"]
  },
  {
    id: "siddharth-senapati",
    name: "Siddharth Senapati (CFA)",
    role: "Chief Financial Careers Analyst",
    bio: "Siddharth Senapati is a CFA charterholder with extensive experience in economic policy analysis. He advises banking career aspirants on quantitative aptitude, banking awareness, and macroeconomic indicators.",
    experience: "14+ Years Core Banking & Financial Markets Advisory",
    avatarColor: "bg-amber-800 text-white",
    reviewedByEditorial: true,
    joinedDate: "November 2023",
    credentials: ["CFA Charterholder", "Ex-SBI Credit Officer"]
  },
  {
    id: "ramdev-shastri",
    name: "Acharya Ramdev Shastri",
    role: "Chief Hindi GK Researcher & Historian",
    bio: "Acharya Ramdev Shastri is a prominent Hindi scholar and researcher of ancient and modern Indian history. He edits our comprehensive Hindi study notes and general knowledge digests.",
    experience: "20+ Years in Sanskrit & Indological Studies Research",
    avatarColor: "bg-red-700 text-white",
    reviewedByEditorial: true,
    joinedDate: "December 2023",
    credentials: ["Vyakaranacharya", "Bilingual GK Text Editor"]
  },
  {
    id: "shyam-verma",
    name: "Shyam Verma (Reasoning Head)",
    role: "Head of Logical Reasoning & Quantitative Aptitude",
    bio: "Shyam Verma is a master reasoning trainer with over 14 years of coaching experience. He developed the EJOTY formulas and Vedic math integration models for AgniPariksha and MAIC India.",
    experience: "14+ Years of High-Tier Competitive Aptitude Coaching",
    avatarColor: "bg-purple-700 text-white",
    reviewedByEditorial: true,
    joinedDate: "July 2023",
    credentials: ["Author of Aptitude Hacks", "Vedic Mathematics Scholar"]
  }
];

export function getAuthorByIdOrName(query: string | null | undefined): Author {
  if (!query) return AUTHORS[3]; // default to Shalini Dixit
  const normalized = query.toLowerCase();
  const match = AUTHORS.find(a => 
    a.id === query || 
    a.name.toLowerCase().includes(normalized) || 
    normalized.includes(a.id) ||
    normalized.includes(a.name.toLowerCase())
  );
  return match || AUTHORS[3]; // default
}
