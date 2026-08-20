export type DocumentType = 
  | 'PREVIOUS_YEAR_PAPER'
  | 'ANSWER_KEY'
  | 'SYLLABUS'
  | 'NOTIFICATION'
  | 'ADMIT_CARD'
  | 'STUDY_NOTES'
  | 'CURRENT_AFFAIRS'
  | 'PRACTICE_SET'
  | 'UNKNOWN';

export type DocumentLanguage = 
  | 'Hindi'
  | 'Hindi + English'
  | 'English'
  | 'Other'
  | 'Unknown';

export type DocumentStatus = 
  | 'VERIFIED'
  | 'SOURCE_ONLY'
  | 'PENDING'
  | 'REJECTED'
  | 'DUPLICATE'
  | 'BROKEN';

export type TrustLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'BLOCKED';

export interface VerifiedPdfDocument {
  id: string;
  slug: string;
  title: string;
  hindiTitle?: string;
  exam: string;
  organization: string;
  year: string;
  examDate?: string;
  shift?: string;
  subject?: string;
  language: DocumentLanguage;
  documentType: DocumentType;
  sourceName: string;
  sourceUrl: string;
  pdfUrl?: string;
  storageUrl?: string;
  license?: string;
  publiclyAccessible: boolean;
  redistributionAllowed: boolean;
  thumbnailUrl?: string;
  fileSize?: string;
  pageCount?: number;
  contentHash?: string;
  status: DocumentStatus;
  isFeatured?: boolean;
  viewCount: number;
  downloadCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  extractedSnippet?: string;
}

export interface RssSourceConfig {
  id: string;
  name: string;
  feedUrl: string;
  category: 'SSC' | 'Railway' | 'Banking' | 'UPSC' | 'Teaching' | 'Police' | 'Defence' | 'State Exams';
  language: DocumentLanguage;
  trustLevel: TrustLevel;
  enabled: boolean;
  redistributionAllowed: boolean;
  lastFetchedAt?: string;
  lastSuccessAt?: string;
  lastError?: string;
  itemCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IngestionLog {
  id: string;
  timestamp: string;
  sourceId?: string;
  sourceName?: string;
  feedItemUrl?: string;
  documentTitle?: string;
  documentUrl?: string;
  status: 'SUCCESS' | 'SOURCE_ONLY' | 'DUPLICATE' | 'REJECTED' | 'ERROR';
  reason?: string;
  errorMessage?: string;
}

export interface CopyrightIssueReport {
  id: string;
  documentId: string;
  documentTitle: string;
  reporterEmail: string;
  issueType: 'copyright' | 'wrong_exam' | 'broken_link' | 'misleading_info' | 'other';
  description: string;
  status: 'PENDING' | 'REVIEWED' | 'REMOVED' | 'KEPT';
  createdAt: string;
}
