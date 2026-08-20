import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { XMLParser } from 'fast-xml-parser';
import { 
  VerifiedPdfDocument, 
  RssSourceConfig, 
  IngestionLog, 
  CopyrightIssueReport, 
  DocumentType, 
  DocumentLanguage 
} from '../types/pdf';

const DATA_DIR = path.join(process.cwd(), 'data');
const DOCUMENTS_FILE = path.join(DATA_DIR, 'pdf_documents.json');
const SOURCES_FILE = path.join(DATA_DIR, 'rss_sources.json');
const LOGS_FILE = path.join(DATA_DIR, 'ingestion_logs.json');
const REPORTS_FILE = path.join(DATA_DIR, 'copyright_reports.json');

// Ensure storage files exist
function ensureFilesExist() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DOCUMENTS_FILE)) {
    fs.writeFileSync(DOCUMENTS_FILE, '[]', 'utf8');
  }
  if (!fs.existsSync(SOURCES_FILE)) {
    fs.writeFileSync(SOURCES_FILE, '[]', 'utf8');
  }
  if (!fs.existsSync(LOGS_FILE)) {
    fs.writeFileSync(LOGS_FILE, '[]', 'utf8');
  }
  if (!fs.existsSync(REPORTS_FILE)) {
    fs.writeFileSync(REPORTS_FILE, '[]', 'utf8');
  }
}

// Read and write helpers with safety
export function getDocuments(): VerifiedPdfDocument[] {
  ensureFilesExist();
  try {
    const raw = fs.readFileSync(DOCUMENTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading pdf_documents.json:', err);
    return [];
  }
}

export function saveDocuments(docs: VerifiedPdfDocument[]): void {
  ensureFilesExist();
  fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(docs, null, 2), 'utf8');
}

export function getRssSources(): RssSourceConfig[] {
  ensureFilesExist();
  try {
    const raw = fs.readFileSync(SOURCES_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading rss_sources.json:', err);
    return [];
  }
}

export function saveRssSources(sources: RssSourceConfig[]): void {
  ensureFilesExist();
  fs.writeFileSync(SOURCES_FILE, JSON.stringify(sources, null, 2), 'utf8');
}

export function getIngestionLogs(): IngestionLog[] {
  ensureFilesExist();
  try {
    const raw = fs.readFileSync(LOGS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading ingestion_logs.json:', err);
    return [];
  }
}

export function logIngestion(log: Omit<IngestionLog, 'id' | 'timestamp'>): void {
  ensureFilesExist();
  try {
    const logs = getIngestionLogs();
    const newLog: IngestionLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    logs.unshift(newLog);
    // Keep last 300 logs for cleanliness
    const trimmed = logs.slice(0, 300);
    fs.writeFileSync(LOGS_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving ingestion log:', err);
  }
}

export function getCopyrightReports(): CopyrightIssueReport[] {
  ensureFilesExist();
  try {
    const raw = fs.readFileSync(REPORTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading copyright_reports.json:', err);
    return [];
  }
}

export function saveCopyrightReport(report: Omit<CopyrightIssueReport, 'id' | 'createdAt' | 'status'>): CopyrightIssueReport {
  ensureFilesExist();
  const reports = getCopyrightReports();
  const newReport: CopyrightIssueReport = {
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    ...report
  };
  reports.unshift(newReport);
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2), 'utf8');
  return newReport;
}

// -------------------------------------------------------------
// Security & SSRF Protection
// -------------------------------------------------------------
export function isSafeUrl(targetUrl: string): { safe: boolean; reason?: string } {
  try {
    const parsed = new URL(targetUrl);
    
    // Only permit standard HTTP / HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, reason: 'Invalid URL protocol. Only HTTP and HTTPS are permitted.' };
    }

    const host = parsed.hostname.toLowerCase();

    // Disallow loopback, internal hosts, or metadata services
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      host === '169.254.169.254' ||
      host === 'metadata.google.internal' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)
    ) {
      return { safe: false, reason: 'Target URL resolves to an internal or non-routable network address.' };
    }

    return { safe: true };
  } catch (err) {
    return { safe: false, reason: 'Malformed or unparseable URL.' };
  }
}

// -------------------------------------------------------------
// Classification & Metadata Extraction Engine (Rule-based & Exact)
// -------------------------------------------------------------
export function classifyExamDocument(title: string, description: string, url: string): {
  isPreviousYearPaper: boolean;
  documentType: DocumentType;
  exam: string;
  organization: string;
  year: string;
  shift?: string;
  language: DocumentLanguage;
  hindiTitle?: string;
} {
  const combined = `${title} ${description} ${url}`.toLowerCase();
  const rawText = `${title} ${description}`;

  // 1. Detect Language (Priority for Hindi)
  let language: DocumentLanguage = 'English';
  const hasDevanagari = /[\u0900-\u097F]/.test(rawText);
  const hasHindiKeywords = combined.includes('hindi') || combined.includes('हिंदी') || combined.includes('हिन्दी') || combined.includes('samanya gyan');
  const hasEnglishKeywords = combined.includes('english') || combined.includes('अंग्रेजी');

  if (hasDevanagari || hasHindiKeywords) {
    if (hasEnglishKeywords && hasDevanagari) {
      language = 'Hindi + English';
    } else {
      language = 'Hindi';
    }
  }

  // 2. Detect Document Type
  let documentType: DocumentType = 'UNKNOWN';
  let isPreviousYearPaper = false;

  const isPYP = 
    combined.includes('previous year') || 
    combined.includes('pyp') || 
    combined.includes('question paper') || 
    combined.includes('solved paper') || 
    combined.includes('पूर्व वर्ष') || 
    combined.includes('प्रश्न पत्र') || 
    combined.includes('प्रश्नपत्र') || 
    combined.includes('हल प्रश्न') || 
    combined.includes('model question paper') || 
    combined.includes('master question paper');

  const isAnswerKey = 
    combined.includes('answer key') || 
    combined.includes('उत्तर कुंजी') || 
    combined.includes('उत्तर तालिका') || 
    combined.includes('response sheet');

  const isSyllabus = 
    combined.includes('syllabus') || 
    combined.includes('पाठ्यक्रम') || 
    combined.includes('exam pattern') || 
    combined.includes('blueprint');

  const isNotification = 
    combined.includes('notification') || 
    combined.includes('advertisement') || 
    combined.includes('विज्ञप्ति') || 
    combined.includes('भर्ती सूचना') || 
    combined.includes('circular');

  if (isPYP) {
    documentType = 'PREVIOUS_YEAR_PAPER';
    isPreviousYearPaper = true;
  } else if (isAnswerKey) {
    documentType = 'ANSWER_KEY';
  } else if (isSyllabus) {
    documentType = 'SYLLABUS';
  } else if (isNotification) {
    documentType = 'NOTIFICATION';
  } else {
    documentType = 'STUDY_NOTES';
  }

  // 3. Detect Exam & Organization
  let exam = 'Government Recruitment Exam';
  let organization = 'Government Recruitment Board';

  if (combined.includes('ssc gd') || combined.includes('gd constable') || combined.includes('जीडी')) {
    exam = 'SSC GD Constable';
    organization = 'Staff Selection Commission (SSC)';
  } else if (combined.includes('ssc cgl') || combined.includes('कंबाइंड ग्रेजुएट')) {
    exam = 'SSC CGL';
    organization = 'Staff Selection Commission (SSC)';
  } else if (combined.includes('ssc chsl')) {
    exam = 'SSC CHSL';
    organization = 'Staff Selection Commission (SSC)';
  } else if (combined.includes('ssc mts')) {
    exam = 'SSC MTS';
    organization = 'Staff Selection Commission (SSC)';
  } else if (combined.includes('ssc cpo')) {
    exam = 'SSC CPO';
    organization = 'Staff Selection Commission (SSC)';
  } else if (combined.includes('rrb ntpc') || combined.includes('ntpc')) {
    exam = 'RRB NTPC';
    organization = 'Railway Recruitment Boards (RRBs)';
  } else if (combined.includes('rrb alp') || combined.includes('loco pilot')) {
    exam = 'RRB ALP';
    organization = 'Railway Recruitment Boards (RRBs)';
  } else if (combined.includes('rrb group d') || combined.includes('railway group d')) {
    exam = 'RRB Group D';
    organization = 'Railway Recruitment Boards (RRBs)';
  } else if (combined.includes('rpf')) {
    exam = 'RPF Constable & SI';
    organization = 'Railway Protection Force (RPF)';
  } else if (combined.includes('up police') || combined.includes('यूपी पुलिस') || combined.includes('उत्तर प्रदेश पुलिस')) {
    exam = 'UP Police Constable';
    organization = 'Uttar Pradesh Police Recruitment Board (UPPRPB)';
  } else if (combined.includes('bihar police') || combined.includes('बिहार पुलिस')) {
    exam = 'Bihar Police Constable';
    organization = 'Central Selection Board of Constable (CSBC)';
  } else if (combined.includes('agniveer') || combined.includes('indian army') || combined.includes('भारतीय सेना')) {
    exam = 'Agniveer Army GD';
    organization = 'Indian Army Recruiting Directorate (MoD)';
  } else if (combined.includes('navy') || combined.includes('नौसेना') || combined.includes('ssr')) {
    exam = 'Indian Navy Agniveer SSR';
    organization = 'Indian Navy Recruitment Portal';
  } else if (combined.includes('airforce') || combined.includes('वायुसेना') || combined.includes('agnipathvayu')) {
    exam = 'Indian Air Force Agniveer Vayu';
    organization = 'Indian Air Force (IAF)';
  } else if (combined.includes('upsc civil') || combined.includes('ias') || combined.includes('cse')) {
    exam = 'UPSC Civil Services (CSE)';
    organization = 'Union Public Service Commission (UPSC)';
  } else if (combined.includes('nda') || combined.includes('cds')) {
    exam = 'UPSC NDA / CDS';
    organization = 'Union Public Service Commission (UPSC)';
  } else if (combined.includes('ctet') || combined.includes('सीटेट')) {
    exam = 'CTET (Central Teacher Eligibility Test)';
    organization = 'Central Board of Secondary Education (CBSE)';
  } else if (combined.includes('bpsc') || combined.includes('बीपीएससी')) {
    exam = 'BPSC Civil Services';
    organization = 'Bihar Public Service Commission (BPSC)';
  } else if (combined.includes('uppsc') || combined.includes('यूपीपीएससी')) {
    exam = 'UPPSC Combined State Exam';
    organization = 'Uttar Pradesh Public Service Commission (UPPSC)';
  } else if (combined.includes('ibps') || combined.includes('sbi')) {
    exam = 'Banking Examination (IBPS/SBI)';
    organization = 'Institute of Banking Personnel Selection';
  }

  // 4. Extract Year (Do not guess)
  let year = 'Unknown';
  const yearMatch = combined.match(/\b(202[0-7]|201[5-9])\b/);
  if (yearMatch) {
    year = yearMatch[1];
  }

  // 5. Extract Shift (if available)
  let shift: string | undefined = undefined;
  const shiftMatch = combined.match(/shift\s*([1-4]|i{1,3}|morning|evening|afternoon)/i) || 
                     combined.match(/(प्रथम|द्वितीय|तृतीय|सुबह|शाम)\s*पाली/i);
  if (shiftMatch) {
    shift = shiftMatch[0].toUpperCase();
  }

  return {
    isPreviousYearPaper,
    documentType,
    exam,
    organization,
    year,
    shift,
    language,
    hindiTitle: hasDevanagari ? title : undefined
  };
}

// -------------------------------------------------------------
// RSS & Atom Feed Parser
// -------------------------------------------------------------
export async function parseRssFeed(feedUrl: string): Promise<{
  title: string;
  items: Array<{
    title: string;
    link: string;
    description: string;
    pubDate?: string;
    pdfUrl?: string;
    enclosureUrl?: string;
  }>;
}> {
  const urlCheck = isSafeUrl(feedUrl);
  if (!urlCheck.safe) {
    throw new Error(`SSRF Security Violation: ${urlCheck.reason}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Agnipariksha-Document-Validator/1.0 (+https://maicindia.com/pdf-library)',
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });

    const parsed = parser.parse(xmlText);
    const items: Array<any> = [];

    // Handle RSS 2.0
    if (parsed.rss && parsed.rss.channel) {
      const channel = parsed.rss.channel;
      const rawItems = Array.isArray(channel.item) ? channel.item : (channel.item ? [channel.item] : []);

      rawItems.forEach((it: any) => {
        let pdfUrl: string | undefined = undefined;
        if (it.enclosure && it.enclosure['@_url'] && it.enclosure['@_url'].toLowerCase().includes('.pdf')) {
          pdfUrl = it.enclosure['@_url'];
        } else if (typeof it.link === 'string' && it.link.toLowerCase().includes('.pdf')) {
          pdfUrl = it.link;
        }

        items.push({
          title: String(it.title || ''),
          link: typeof it.link === 'string' ? it.link : (it.link?.['#text'] || it.guid?.['#text'] || ''),
          description: String(it.description || it['content:encoded'] || ''),
          pubDate: it.pubDate || it.date || undefined,
          pdfUrl,
          enclosureUrl: it.enclosure?.['@_url']
        });
      });

      return {
        title: channel.title || 'RSS Feed',
        items
      };
    }

    // Handle Atom Feeds
    if (parsed.feed) {
      const feed = parsed.feed;
      const rawEntries = Array.isArray(feed.entry) ? feed.entry : (feed.entry ? [feed.entry] : []);

      rawEntries.forEach((entry: any) => {
        let link = '';
        if (typeof entry.link === 'string') {
          link = entry.link;
        } else if (Array.isArray(entry.link)) {
          const alt = entry.link.find((l: any) => l['@_rel'] === 'alternate') || entry.link[0];
          link = alt?.['@_href'] || '';
        } else if (entry.link?.['@_href']) {
          link = entry.link['@_href'];
        }

        let pdfUrl: string | undefined = undefined;
        if (link.toLowerCase().includes('.pdf')) {
          pdfUrl = link;
        }

        items.push({
          title: String(entry.title?.['#text'] || entry.title || ''),
          link,
          description: String(entry.summary?.['#text'] || entry.summary || entry.content?.['#text'] || entry.content || ''),
          pubDate: entry.updated || entry.published || undefined,
          pdfUrl
        });
      });

      return {
        title: feed.title?.['#text'] || feed.title || 'Atom Feed',
        items
      };
    }

    throw new Error('Unsupported feed format. Missing <rss> or <feed> root element.');
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// -------------------------------------------------------------
// Live RSS Sync Pipeline (Run via Scheduler or On-Demand)
// -------------------------------------------------------------
export async function syncAllRssSources(): Promise<{
  totalSources: number;
  successfulSources: number;
  failedSources: number;
  newDocumentsCount: number;
  sourceOnlyCount: number;
  duplicatesCount: number;
  errors: Array<{ sourceName: string; message: string }>;
}> {
  const sources = getRssSources();
  const currentDocs = getDocuments();
  const existingUrls = new Set<string>();
  const existingTitles = new Set<string>();

  currentDocs.forEach(doc => {
    if (doc.sourceUrl) existingUrls.add(doc.sourceUrl.toLowerCase());
    if (doc.pdfUrl) existingUrls.add(doc.pdfUrl.toLowerCase());
    if (doc.title) existingTitles.add(doc.title.toLowerCase().trim());
  });

  let successfulSources = 0;
  let failedSources = 0;
  let newDocumentsCount = 0;
  let sourceOnlyCount = 0;
  let duplicatesCount = 0;
  const errors: Array<{ sourceName: string; message: string }> = [];

  for (const source of sources) {
    if (!source.enabled) continue;

    try {
      source.lastFetchedAt = new Date().toISOString();
      const feedResult = await parseRssFeed(source.feedUrl);
      source.lastSuccessAt = new Date().toISOString();
      source.lastError = undefined;
      source.itemCount = feedResult.items.length;
      successfulSources++;

      for (const item of feedResult.items) {
        const itemUrl = item.link || item.pdfUrl || '';
        const itemTitle = item.title.trim();

        if (!itemTitle || !itemUrl) continue;

        // Duplicate check
        if (existingUrls.has(itemUrl.toLowerCase()) || existingTitles.has(itemTitle.toLowerCase())) {
          duplicatesCount++;
          continue;
        }

        // Classify the item
        const classification = classifyExamDocument(itemTitle, item.description, itemUrl);

        // Security check on candidate URL
        const safeCheck = isSafeUrl(itemUrl);
        if (!safeCheck.safe) {
          logIngestion({
            sourceId: source.id,
            sourceName: source.name,
            feedItemUrl: itemUrl,
            documentTitle: itemTitle,
            status: 'REJECTED',
            reason: `SSRF Violation: ${safeCheck.reason}`
          });
          continue;
        }

        const isDirectPdf = itemUrl.toLowerCase().includes('.pdf') || Boolean(item.pdfUrl);
        const slug = itemTitle
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .substring(0, 80);

        const newDoc: VerifiedPdfDocument = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          slug: `${slug}-${Math.random().toString(36).substring(2, 5)}`,
          title: itemTitle,
          hindiTitle: classification.hindiTitle,
          exam: classification.exam,
          organization: classification.organization,
          year: classification.year,
          shift: classification.shift,
          language: classification.language,
          documentType: classification.documentType,
          sourceName: source.name,
          sourceUrl: itemUrl,
          pdfUrl: isDirectPdf ? (item.pdfUrl || itemUrl) : undefined,
          license: source.trustLevel === 'HIGH' ? 'Public Domain / Official Government Notice' : 'Public Educational Resource',
          publiclyAccessible: true,
          redistributionAllowed: source.redistributionAllowed && isDirectPdf,
          status: isDirectPdf ? 'VERIFIED' : 'SOURCE_ONLY',
          isFeatured: false,
          viewCount: 0,
          downloadCount: 0,
          publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          extractedSnippet: item.description.replace(/<[^>]*>?/gm, '').slice(0, 400)
        };

        currentDocs.unshift(newDoc);
        existingUrls.add(itemUrl.toLowerCase());
        existingTitles.add(itemTitle.toLowerCase());

        if (isDirectPdf) {
          newDocumentsCount++;
        } else {
          sourceOnlyCount++;
        }

        logIngestion({
          sourceId: source.id,
          sourceName: source.name,
          feedItemUrl: itemUrl,
          documentTitle: itemTitle,
          documentUrl: newDoc.pdfUrl,
          status: isDirectPdf ? 'SUCCESS' : 'SOURCE_ONLY',
          reason: isDirectPdf ? 'Discovered verified public PDF document' : 'Discovered original source article (no direct PDF attached)'
        });
      }
    } catch (err: any) {
      failedSources++;
      source.lastError = err.message || 'Unknown network or parsing error';
      errors.push({
        sourceName: source.name,
        message: source.lastError
      });

      logIngestion({
        sourceId: source.id,
        sourceName: source.name,
        status: 'ERROR',
        errorMessage: source.lastError
      });
    }
  }

  saveRssSources(sources);
  saveDocuments(currentDocs);

  return {
    totalSources: sources.length,
    successfulSources,
    failedSources,
    newDocumentsCount,
    sourceOnlyCount,
    duplicatesCount,
    errors
  };
}
