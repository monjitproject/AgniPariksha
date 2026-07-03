export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // index of options (0-3)
  explanation: string;
  category: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  questions: Question[];
  difficulty: "Easy" | "Medium" | "Hard";
  iconName: string;
  timeLimit: number; // in seconds
}

export interface JobPost {
  id: string;
  title: string;
  category: "Army" | "Navy" | "Air Force" | "Agniveer" | "SSC" | "UPSC" | "Railway" | "Police" | "Banking" | "State Gov";
  eligibility: string;
  ageLimit: string;
  qualification: string;
  salary: string;
  selectionProcess: string;
  importantDates: {
    start: string;
    end: string;
    exam: string;
  };
  applyLink: string;
  isCustom?: boolean;
}

export interface StudyNote {
  id: string;
  category: string;
  title: string;
  content: string;
  author: string;
  date: string;
}

export interface PdfDoc {
  id: string;
  title: string;
  category: string;
  type: "Notes" | "Syllabus" | "Job Alert" | "Previous Paper" | "Answer Key";
  publishDate: string;
  downloadCount: number;
  size: string;
  contentSnippet?: string; // Content of simulated PDF
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  quizzesCompleted: number;
  badge: string;
}

export interface QuizHistoryItem {
  quizId: string;
  quizTitle: string;
  scorePercentage: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: string;
  date: string;
}

export interface UserCertificate {
  id: string;
  userName: string;
  quizTitle: string;
  scorePercentage: number;
  date: string;
}

export interface UserProfile {
  name: string;
  email: string;
  points: number;
  completedQuizzes: number;
  savedPDFIds: string[];
  bookmarkedQuestionIds: string[];
  history: QuizHistoryItem[];
  certificates: UserCertificate[];
}
