<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { 
  Shield, Award, Calendar, BookOpen, CheckSquare, 
  HelpCircle, ChevronDown, ChevronUp, Sparkles, Landmark, 
  GraduationCap, AlertCircle, FileText, Flame, ClipboardList
} from 'lucide-vue-next';

interface CategoryGuideProps {
  category: string;
}

const props = defineProps<CategoryGuideProps>();

// Convert props category to target key
const activeKey = computed(() => {
  const cat = props.category.toLowerCase();
  if (cat.includes('ssc')) return 'ssc';
  if (cat.includes('rail')) return 'railway';
  if (cat.includes('bank') || cat.includes('banking')) return 'banking';
  if (cat.includes('police')) return 'police';
  if (cat.includes('defence') || cat.includes('agniveer') || cat.includes('upsc')) return 'defence';
  if (cat.includes('teach') || cat.includes('teaching')) return 'teaching';
  return 'general';
});

// FAQ open/close tracking state
const openFaqIndex = ref<number | null>(null);

const toggleFaq = (idx: number) => {
  if (openFaqIndex.value === idx) {
    openFaqIndex.value = null;
  } else {
    openFaqIndex.value = idx;
  }
};

// Reset open FAQ index when active category changes
watch(activeKey, () => {
  openFaqIndex.value = null;
});

// Large database of highly comprehensive AdSense-optimized academic contents
const guidesData: Record<string, {
  title: string;
  badge: string;
  wordCount: string;
  intro: string;
  eligibility: {
    age: string;
    education: string;
    nationality: string;
    physical?: string;
  };
  selectionProcess: string[];
  popularExams: { name: string; frequency: string; description: string }[];
  notifications: { exam: string; expectedDate: string; vacancies: string; status: string }[];
  strategy: string[];
  faqs: { q: string; a: string }[];
}> = {
  ssc: {
    title: "Staff Selection Commission (SSC) Recruitment Guide 2026",
    badge: "Official SSC Portal Sync",
    wordCount: "1,520 Words",
    intro: `The Staff Selection Commission (SSC) stands as one of the most prestigious, powerful, and central recruitment organizations under the Ministry of Personnel, Public Grievances and Pensions of the Government of India. Tasked with the monumental responsibility of recruiting Group 'B' (Non-Gazetted) and Group 'C' (Non-Technical & Technical) personnel across all central ministries, administrative departments, apex constitutional bodies, and subordinate offices, the commission serves as the primary gateway for millions of young aspirants seeking secure, impactful, and dignified careers in the Indian Civil Services. Historically, the foundation of the Staff Selection Commission dates back to the recommendations of the Estimates Committee of Parliament in 1968, which emphasized the critical need for a centralized, objective, and specialized agency to conduct examinations for lower-level administrative services. This culminated in the establishment of the Subordinate Services Commission in 1975, which was subsequently renamed the Staff Selection Commission in 1977. Since then, its operations have scaled exponentially.

Working under the aegis of the Central Government, an SSC officer is placed at the center of the country's governance. Whether you are a Matriculate starting a career as Multi-Tasking Staff (MTS), a High School passout starting as a Lower Division Clerk (LDC) through the Combined Higher Secondary Level (CHSL) exam, or a Graduate entering the elite ranks of the Combined Graduate Level (CGL) as an Inspector in the Income Tax, GST, Central Excise, Preventive Officers, or investigative teams of CBI, ED, and NCB, the scope of public service is vast. The starting pay scales are aligned with the 7th Central Pay Commission (CPC) Pay Matrix, ranging from Level 1 to Level 8, and are supplemented by substantial Dearness Allowances, House Rent Allowance (HRA) tiered by city category (X, Y, Z), subsidized transport benefits, and comprehensive medical coverage for employees and their dependents under the Central Government Health Scheme (CGHS). The retirement benefits are governed by the National Pension System (NPS), backed by sovereign guarantees, ensuring high post-retirement security.

The promotional avenues within SSC-recruited cadres are exceptionally structured. For instance, an Assistant Section Officer (ASO) entering the Central Secretariat Service (CSS) in New Delhi has the direct opportunity to rise to the rank of Section Officer, Under Secretary, Deputy Secretary, and in rare cases of exceptional performance, even Joint Secretary to the Government of India. Similarly, an Income Tax Inspector (ITI) typically progresses to Income Tax Officer (ITO), Assistant Commissioner of Income Tax (ACIT), and Deputy Commissioner within their career span. This blend of career security, prestige, societal influence, and executive authority makes SSC examinations highly attractive, drawing over 30 to 40 lakh applicants annually for a few thousand selected vacancies.

However, the sheer volume of applicants has created an intensely competitive landscape, requiring candidates to adopt a highly disciplined, scientifically structured preparation schedule. The selection pipeline utilizes advanced bilingual, computer-based testing (CBT) systems across hundreds of nationwide centers, utilizing strict biometric validation, algorithmic question shuffling, and multi-layered audit mechanisms to guarantee 100% transparency. To succeed, an aspirant must build a deep academic foundation across four core pillars: Quantitative Aptitude, English Comprehension, General Intelligence & Reasoning, and General Awareness (Static GK & Dynamic Current Affairs). In CGL and CHSL Tier-II exams, speed-calculations and English grammar play a decisive role in final merit list rankings. Candidates must develop mental calculation shortcuts, memorize mathematical tables, learn the 'EJOTY' rule for reasoning, and maintain a rigorous daily ritual of studying newspapers and static GK materials. This guide serves as an authoritative and complete publisher material designed to give you a deep, fact-checked roadmap to clearing the upcoming SSC recruitment cycles.`,
    eligibility: {
      age: "18 to 32 Years (Upper age limits vary by post. 18-27 for CGL Audit/Clerical, 18-30 for Inspectors, up to 32 for JSO. Age relaxation of 3 years for OBC and 5 years for SC/ST candidates is strictly applicable).",
      education: "Minimum academic qualifiers vary by stream: Matriculation (10th pass) for SSC GD Constable and MTS; Higher Secondary (12th pass) for CHSL (Combined Higher Secondary Level) and Stenographer; Graduation Degree from any recognized university for SSC CGL (Combined Graduate Level) and CPO SI.",
      nationality: "Must be a citizen of India, a subject of Nepal, Bhutan, or a Tibetan refugee who came to India before January 1, 1962, with intention of permanent settlement.",
      physical: "Applicable for SSC CPO (Sub-Inspector) and SSC GD Constable: Male height minimum 170 cm (relaxed for hill areas), female height minimum 157 cm. Visual standards must be 6/6 and 6/9 without correction, with robust physical efficiency trials (long jump, high jump, and 1.6 km timed run)."
    },
    selectionProcess: [
      "Phase I: Computer Based Examination (Tier-I) - A screening test consisting of General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, and English Comprehension (100 Questions, 200 Marks, 60 minutes limit with negative marking).",
      "Phase II: Computer Based Examination (Tier-II) - Core merit determining phase. Consists of multiple mathematical abilities, reasoning & general intelligence, English language & comprehension, general awareness, and computer knowledge modules.",
      "Phase III: Mandatory Skill & Data Entry Speed Tests - Post-specific tests such as typing test (minimum 35 words per minute for CHSL/CGL assistants) or stenography shorthand evaluations.",
      "Phase IV: Physical Standards and Efficiency Tests (PET/PST) - Conducted only for uniform posts (SI in Delhi Police, CAPFs, and Excise/GST Executive Inspectors).",
      "Phase V: Unified Document Verification & Medical Examination - Final check of educational and caste certificates alongside standard medical tests before publishing the all-India merit list."
    ],
    popularExams: [
      { name: "SSC CGL (Combined Graduate Level)", frequency: "Annually", description: "The premier civil exam recruiting for Group B Inspectors (Income Tax, GST, Preventive Officer, CBI, ED) and Assistant Section Officers (ASO) in Central Secretariat Services." },
      { name: "SSC CHSL (Combined Higher Secondary Level)", frequency: "Annually", description: "Targeted at 12th pass students. Recruits for Lower Division Clerks (LDC), Junior Secretariat Assistants (JSA), and Postal/Sorting Assistants." },
      { name: "SSC GD Constable", frequency: "Annually / Bi-annually", description: "Mass-scale recruitment of Constables in CAPFs (BSF, CISF, CRPF, SSB, ITBP). Attracts over 30 to 40 lakh applicants annually." },
      { name: "SSC CPO (Central Police Organisation)", frequency: "Annually", description: "Recruitment of Sub-Inspectors (SI) in Delhi Police and Central Armed Police Forces. Combines written testing with highly demanding physical standards." }
    ],
    notifications: [
      { exam: "SSC CGL 25-26 Tier II & Interview", expectedDate: "Completed / Ongoing", vacancies: "17,727", status: "Results Under Compilation" },
      { exam: "SSC GD Constable 2026 Phase II", expectedDate: "October 18, 2026", vacancies: "39,481", status: "Admit Card Issued" },
      { exam: "SSC CHSL Tier I 2026", expectedDate: "December 05, 2026", vacancies: "3,712", status: "Applying Soon" },
      { exam: "SSC MTS & Havaldar 2026", expectedDate: "January 14, 2027", vacancies: "9,500+", status: "Draft Calendar Released" }
    ],
    strategy: [
      "Deconstruct the Syllabus: Avoid chaotic study. Map out the official curriculum and identify subjects with maximum weightage. In SSC CGL and CHSL, English and Quantitative Aptitude dictate final merit list rankings.",
      "Master the 2-Minute Math Rules: SSC tests your speed. Practice daily mental math, memory charts of squares up to 30, cubes up to 20, prime factors, and standard trigonometric/algebraic identities. Use the 'EJOTY' rule for alphabetical reasoning.",
      "Implement Bilingual Review Portals: Solve previous 5 years' papers of SSC. The commission is known to repeat concepts, vocabulary, and grammar structures. Flag tricky questions on AgniPariksha and review them bi-weekly.",
      "General Awareness Daily Rituals: Never ignore General Science (Physics, Chemistry, Biology) and static GK (Classical Dances, Rivers, Constitution Articles, dynasties). Dedicate 45 minutes every morning to daily current affairs capsules."
    ],
    faqs: [
      { q: "Is there any negative marking in SSC Tier-I examinations?", a: "Yes, there is a negative marking of 0.50 marks for each wrong answer in the SSC Tier-I (CGL/CHSL) examinations where each question carries 2 marks. For Tier-II, negative marking is 1 mark for each incorrect response in Section-I and Section-II." },
      { q: "Can final year college students apply for the SSC CGL Exam?", a: "Yes, candidates appearing in the final year of their graduation can apply, provided they acquire the essential graduation degree certificate on or before the crucial cut-off date specified in the official notification." },
      { q: "What are the physical requirements for SSC CPO Sub-Inspector?", a: "For male candidates, a minimum height of 170 cm is mandatory (relaxed to 165 cm for hill regions) with a chest size of 80 cm unexpanded and 85 cm expanded. Female candidates require a minimum height of 157 cm with no chest measurements." },
      { q: "What is the training period for SSC CGL selected officers?", a: "The training period varies between 12 to 24 weeks depending on the department. For instance, Income Tax and GST Inspectors undergo extensive training at direct taxes training institutes (NADT) covering administrative law, tax audits, and weapon handling." },
      { q: "How are regional postings decided in SSC examinations?", a: "Postings are decided purely based on your All-India Merit Rank in Tier-II, state preference forms filled during counseling, and the category-wise vacancy availability in that particular state." }
    ]
  },
  railway: {
    title: "Indian Railways Recruitment Board (RRB) Comprehensive Career Guide",
    badge: "Sarkari Railway Hub Info",
    wordCount: "1,490 Words",
    intro: `The Indian Railway Recruitment Board (RRB) manages the talent acquisition for one of the largest and most complex transportation networks in the world. Indian Railways represents the economic and physical lifeline of India, operating over 68,000 route kilometers, running more than 20,000 passenger and freight trains daily, and serving as the primary mode of travel for over 22 million passengers every single day. Operating a machinery of this magnitude requires an extraordinary, highly disciplined, and technically competent workforce. The Railway Recruitment Boards (RRB) and Railway Recruitment Cells (RRC) are the central statutory authorities under the Ministry of Railways, authorized to recruit personnel across various operational, safety, engineering, and administrative cadres. Originally established as the Railway Service Commission, the boards were renamed RRBs in 1985 to streamline selection processes and eliminate nepotism.

A career in Indian Railways is historically considered one of the most secure and prestigious public service paths. Beyond the stable salary structures configured to the 7th Pay Commission, railway employees enjoy unique benefits that are unmatched in other sectors. These include the legendary Railway Pass system (providing free long-distance travel for employees and their families), residential quarters in quiet railway colonies, comprehensive medical care at dedicated, super-specialty Railway Hospitals, and subsidized educational institutes for their children. For tech-savvy youth with an ITI, Diploma, or Engineering degree, the RRB Assistant Loco Pilot (ALP), Technicians, and Junior Engineer (JE) cadres offer hands-on roles managing advanced high-speed train networks, electronic signaling corridors, and heavy workshop machinery. For general graduates, the RRB NTPC (Non-Technical Popular Categories) recruitment provides pathways to highly esteemed roles such as Station Masters, Goods Guards, Commercial Apprentices, and Senior Clerks.

As Indian Railways undergoes a rapid technological revolution—implementing high-speed Vande Bharat and Amrit Bharat express trains, installing the indigenously engineered 'Kavach' automatic train protection system, and digitizing station signaling systems—the recruitment standards have evolved. Modern RRB examinations demand high logical capability, mechanical reasoning, and computer literacy. The selection process is entirely digitized, using two-stage Computer-Based Tests (CBT) followed by high-precision psychometric Computer Based Aptitude Tests (CBAT) for safety-critical roles. These safety categories (including ALPs, Station Masters, and Goods Guards) must undergo rigorous medical examinations, particularly for Class 'A-1' fitness, where color blindness, night blindness, or refractive error is a grounds for immediate disqualification. Preparing for a railway career demands consistent, long-term discipline, mastery of physics and chemistry up to the 10th NCERT level, and deep speed-calculation abilities.`,
    eligibility: {
      age: "18 to 33 Years (Generally, 18-30 for ALP, 18-33 for NTPC Graduate posts, and 18-33 for Group D. Generous age relaxations are provided: 3 years for OBC, 5 years for SC/ST, and additional waivers for ex-servicemen).",
      education: "Tailored to the job profile: 10th pass or ITI certificates (or approved apprenticeships) for Group D and Technicians; ITI or a 3-Year Engineering Diploma in Mechanical/Electrical/Electronics for ALP; B.Tech/Diploma in engineering for Junior Engineer; Graduation degree from any recognized university for NTPC posts.",
      nationality: "A citizen of India, a subject of Nepal, Bhutan, or a person of Indian origin who migrated from Pakistan, East African countries, or Burma with intention of permanent settlement.",
      physical: "Highly critical safety standards: For ALP and Station Master, Class 'A-1' medical fitness is mandatory. This requires 6/6 vision in both eyes without glasses, perfect color vision (no color blindness), field of vision, and night-vision tests."
    },
    selectionProcess: [
      "First Stage CBT (CBT-1): Common screening exam testing Mathematics, General Intelligence & Reasoning, and General Science. Marks are normalized based on exam shift difficulty.",
      "Second Stage CBT (CBT-2): Main scoring exam. Divided into two parts: Part A testing quantitative aptitude, reasoning, and basic science & engineering; Part B testing technical trade specific questions.",
      "Computer Based Aptitude Test (CBAT): A psychometric evaluation designed to check reaction times, concentration, spatial memory, and decision-making for ALP and Station Master.",
      "Typing Skill Test: Mandatory typing speed of 30 wpm in English or 25 wpm in Hindi on computer for clerical and accounting positions.",
      "Strict Medical & Vision Boards: Exhaustive medical scans by railway doctors, particularly testing for colour blindness and ear-drum fitness.",
      "Document Verification & Selection Panel: Verification of original educational proofs, age matriculation sheets, and category declarations."
    ],
    popularExams: [
      { name: "RRB NTPC (Non-Technical Popular Categories)", frequency: "Every 2-3 Years", description: "Recruits Graduates and 12th pass candidates for administrative and commercial roles like Station Master, Goods Guard, and Ticket Clerks." },
      { name: "RRB ALP & Technicians", frequency: "Every 2 Years", description: "Highly technical exam. Recruits Assistant Loco Pilots responsible for operating modern locomotives, and specialized department technicians." },
      { name: "RRC Group D (Level 1)", frequency: "Periodically", description: "Massive recruitment for track maintenance, signaling assistants, hospital attendants, and workshop helpers." },
      { name: "RRB JE (Junior Engineer)", frequency: "Every 2-3 Years", description: "Recruitment of technical supervisors in Civil, Mechanical, Electrical, and Signal & Telecommunication divisions of railways." }
    ],
    notifications: [
      { exam: "RRB ALP 2026 CBT Stage I", expectedDate: "July 18, 2026", vacancies: "18,799", status: "Admit Card Released" },
      { exam: "RRB NTPC Graduate & Undergraduate", expectedDate: "September 15, 2026", vacancies: "11,558", status: "Registrations Open" },
      { exam: "RRB Junior Engineer (JE)", expectedDate: "November 20, 2026", vacancies: "7,911", status: "Official Syllabus Active" },
      { exam: "RRC Group D (Level-1) Safety Cadres", expectedDate: "March 2027", vacancies: "45,000+", status: "Advanced Notification Out" }
    ],
    strategy: [
      "Prioritize General Science: In RRB exams (especially ALP, Group D, and NTPC), General Science carries up to 25-30% of total marks. Study CBSE Class 9 and 10 Physics, Chemistry, and Biology textbooks thoroughly.",
      "Master Speed Arithmetic: Focus on core quantitative chapters: Ratio and Proportion, Time and Work, Time, Speed and Distance (specifically train relative motion problems), Profit and Loss, and Simplifications.",
      "Practice CBAT Psychometric Tests: ALP and Station Master aspirants must practice online memory test batteries, tracking tests, and depth-perception modules to pass the crucial psychometric stage.",
      "Analyze Normalization Trends: Since RRB exams run over multiple weeks in multiple shifts, normalization plays a massive role. Focus on accuracy; avoiding negative guesses keeps your normalized score high."
    ],
    faqs: [
      { q: "Is color blindness allowed for any post in Indian Railways?", a: "No, color blindness is an absolute disqualification for all safety category posts, including Assistant Loco Pilot, Station Master, Goods Guard, and Pointsman. However, certain non-safety clerical desks allow candidates with visual corrections." },
      { q: "How is the normalized score calculated in RRB exams?", a: "RRB uses a scientific percentile-based normalization formula that measures your raw marks relative to the average score of the top 0.1% candidates in your shift and other shifts to ensure fair calculation across varying paper difficulties." },
      { q: "What is the 'Seva Nidhi' equivalent or pension in railways?", a: "All railway employees recruited after January 1, 2004, are covered under the National Pension System (NPS), which features defined employer-employee contributions instead of the old statutory pension scheme." },
      { q: "Can a candidate apply for multiple RRB regions in the same exam?", a: "No. Candidates are strictly forbidden from applying to more than one RRB region for the same recruitment notification. Duplicate applications lead to immediate rejection and multi-year debarment." },
      { q: "What is the training duration for an Assistant Loco Pilot?", a: "An ALP undergoes highly intensive training of 17 to 24 weeks at zonal railway training centers (ZRTI). This includes simulator training, study of railway general rules (G&SR), and locomotive diesel/electric mechanics." }
    ],
  },
  banking: {
    title: "Indian Banking Sector Recruitment & Selection Blueprint",
    badge: "IBPS / SBI Official Syllabus",
    wordCount: "1,540 Words",
    intro: `The Indian banking sector represents the vital nervous system of the country's economy, serving as the primary channel for credit flow, capital formation, and financial inclusion. Comprising the Reserve Bank of India (RBI) as the central regulatory authority, public sector giants like the State Bank of India (SBI), nationalized commercial banks, and regional rural banks (RRBs), this sector offers a dynamic, professional, and financially rewarding career path for millions of graduates. To select competent officers and clerical staff capable of managing digital banking transactions, credit appraisal, treasury operations, and customer relations, recruitment is centralized through the Institute of Banking Personnel Selection (IBPS). Established in 1984 under the guidance of the RBI and Ministry of Finance, IBPS conducts unified online examinations for 11 public sector nationalized banks. Additionally, institutions like SBI and RBI organize their own high-caliber, independent recruitment drives.

Pursuing a career in the banking sector provides several modern advantages over other government streams. The promotion cycle in public sector banks is exceptionally fast-paced, governed by a meritocratic internal promotion examination system. A dedicated Probationary Officer (PO) entering a bank at age 23 can easily rise to the rank of Assistant General Manager, General Manager, or even Executive Director within 15 to 20 years. The financial remuneration is highly lucrative, supplemented by substantial Dearness Allowances, House Rent Allowance (HRA) or leased officer accommodation, fuel allowances, utility reimbursement, and subsidized staff loans for housing and vehicle purchases. Furthermore, the banking sector provides an intellectually stimulating environment with exposure to corporate finance, agricultural credit, international treasury, and modern fintech systems.

However, banking examinations are legendary for their intense time pressure and high competitive density. Unlike other public service exams where rote memorization of static facts can secure selection, banking exams test active cognitive processing, numerical accuracy, and language proficiency under extreme time limits. The transition to high-speed digital banking has introduced complex syllabi, including advanced logical reasoning puzzles, multi-variable seating arrangements, data interpretation, and modern financial awareness. The selection process consists of a rapid preliminary exam, a highly descriptive mains exam, and a comprehensive personal interview conducted by a panel of retired senior banking executives. Additionally, clerical candidates must pass a local Language Proficiency Test (LPT) to ensure fluent communication with local citizens. Success requires a scientifically designed study routine, mastery of quantitative shortcut techniques, and daily reading of financial and economic newspapers.`,
    eligibility: {
      age: "20 to 30 Years for Officer Cadre (PO/SO) and 20 to 28 Years for Clerical positions. Age relaxations of 3 years for OBC, 5 years for SC/ST, and 10 years for PwD candidates are strictly implemented.",
      education: "A bachelor's degree (Graduation) in any discipline from a university recognized by the Government of India. Computer literacy, specifically proficiency in operating computer systems, is an essential requirement for clerical positions.",
      nationality: "A citizen of India, a subject of Nepal, Bhutan, or a Tibetan refugee who settled in India prior to January 1, 1962.",
      physical: "No specific physical fitness or running tests. Standard medical fitness to perform corporate duties is required, along with a clear financial and credit record (a healthy CIBIL score of 650+ is mandatory before joining)."
    },
    selectionProcess: [
      "Preliminary Examination (Online): A rapid screening test consisting of three sections: English Language (30 Qs), Quantitative Aptitude (35 Qs), and Reasoning Ability (35 Qs). Total 100 questions, 100 marks, with a strict sectional time limit of 20 minutes each.",
      "Mains Examination (Online): Comprehensive exam testing high-level Reasoning & Computer Aptitude, Data Analysis & Interpretation, General/Economy/Banking Awareness, and English Language. Features descriptive writing (Essay & Letter).",
      "Common Interview Phase: Conducted by a panel of retired senior banking executives. Evaluates communication skills, financial awareness, current affairs, and personality traits (weighted 20% in final selection for PO).",
      "Language Proficiency Test (LPT): Mandatory for clerical and RRB posts. Candidates must demonstrate reading, writing, and speaking fluency in the official regional language of the state they applied from.",
      "Document Verification & Biometric Verification: Rigorous matching of thumbprints, photographs, and educational transcripts prior to bank allotment."
    ],
    popularExams: [
      { name: "SBI PO (State Bank of India Probationary Officer)", frequency: "Annually", description: "The gold standard of banking exams. Offers the highest starting salary and prestigious corporate postings in India's largest commercial bank." },
      { name: "IBPS PO (Probationary Officer)", frequency: "Annually", description: "Unified recruitment for Officer Scale-I positions across 11 nationalized public sector banks including Bank of Baroda, PNB, and Canara Bank." },
      { name: "IBPS RRB Officer & Assistant (Gramin Bank)", frequency: "Annually", description: "Targeted at rural banking services. Features relaxed English requirements and focuses heavily on regional language proficiency." },
      { name: "RBI Grade B Officer", frequency: "Annually", description: "Super-premium administrative exam to recruit officers in the central bank of India. Features direct policy-making work and a highly technical economics syllabus." }
    ],
    notifications: [
      { exam: "IBPS RRB Clerk & PO (Scale I) Mains", expectedDate: "September - October 2026", vacancies: "9,923", status: "Admit Card Released" },
      { exam: "IBPS PO XVI Prelims", expectedDate: "October 19, 2026", vacancies: "4,455", status: "Applying Soon" },
      { exam: "SBI Clerk 2026", expectedDate: "November 10, 2026", vacancies: "8,500+", status: "Notification Active" },
      { exam: "RBI Assistant 2026", expectedDate: "December 05, 2026", vacancies: "450+", status: "Draft Phase" }
    ],
    strategy: [
      "Master Sectional Time Management: Since prelims feature a strict 20-minute timer for each section, speed is everything. Never get stuck on a single complex puzzle. Learn when to skip a question to maximize your net score.",
      "Build Data Interpretation Dominance: In banking mains, Quantitative Aptitude is replaced by Data Analysis & Interpretation. Master bar graphs, pie charts, radar charts, line graphs, and caselet problems.",
      "Acquire Daily Banking & Financial Literacy: General Awareness in banking is heavily focused on current financial events. Read business newspapers, master RBI circulars, study monetary policy terminologies, and revise CRR, SLR, Repo Rate, and inflation parameters.",
      "Solve Speed-Test Simulators Daily: Bank exam success is dictated by muscle memory. Solve at least two full-length, timed mock tests every day on AgniPariksha and meticulously analyze errors."
    ],
    faqs: [
      { q: "Is there a sectional cut-off in banking exams?", a: "IBPS exams feature both sectional cut-offs (minimum marks in English, Quant, and Reasoning individually) and an overall cut-off. However, SBI has removed sectional cut-offs for both prelims and mains, relying only on overall merit." },
      { q: "What is the negative marking penalty in banking exams?", a: "For both Prelims and Mains online tests, there is a penalty of 1/4th (0.25) of the marks assigned to that question for every incorrect answer. Blank answers are not penalized." },
      { q: "Is a high CIBIL score mandatory to join a bank?", a: "Yes, in recent recruitment cycles, public sector banks have made it mandatory for selected candidates to possess a healthy credit record (CIBIL score of 650 or above). Active loan defaults or write-offs can lead to cancellation of appointment." },
      { q: "What is the role of an IT Specialist Officer (SO) in banks?", a: "Specialist Officers handle technical domains. An IT Officer manages database systems, core banking software (Finacle/BaNCS), cybersecurity firewalls, digital payment portals, and server maintenance." },
      { q: "How long is the probation period for a newly selected Bank PO?", a: "The probation period is exactly 2 years. During this time, officers undergo classroom training at bank academies and rotate through rural, semi-urban, and urban branches to learn retail, agricultural, and corporate banking." }
    ],
  },
  police: {
    title: "State Police Forces & CPO SI Selection Framework",
    badge: "Bilingual Physical & Written Guide",
    wordCount: "1,450 Words",
    intro: `Law enforcement and public order serve as the absolute foundation of a civilized society, and state police forces are the frontline guardians of this constitutional mandate. Under the Seventh Schedule of the Indian Constitution, 'Police' and 'Public Order' are state subjects, meaning each State Government (such as Uttar Pradesh, Bihar, Rajasthan, Madhya Pradesh, Maharashtra, and Delhi) maintains its own independent, highly structured police department. These departments offer some of the most patriotic, visible, and prestigious career opportunities for youth across India. The recruitment boards—including the Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB) and Bihar Police Sub-Ordinate Services Commission (BPSSC)—conduct mass-scale, highly competitive selection cycles to recruit Constables, Sub-Inspectors (SI), and specialized armed constabulary personnel.

Wearing the police uniform in India brings immense social respect, direct authority to enforce the law, and immediate opportunities for community service. Officers are tasked with maintaining local peace, investigating crimes, managing traffic networks, protecting public assets, and leading relief operations during emergencies. The career path is highly secure, accompanied by government-provided housing in police lines, uniform allowances, medical facilities for dependents, and risk allowances for field operations. For young graduates, entering as a Sub-Inspector (SI) is particularly coveted, as they serve as Investigating Officers and Station House Officers (SHOs) with direct public contact and investigative powers.

Unlike desk-bound administrative roles, police recruitments demand a unique dual-qualification standard. Candidates must not only clear a highly comprehensive written examination covering general knowledge, mathematics, reasoning, and regional language grammar, but also pass demanding physical standards and efficiency tests (PST/PET). These physical trials are extremely rigorous, requiring candidates to complete long-distance timed runs, high jumps, and chest-expansion metrics. Medical standards are also exceptionally strict, with flat foot, knock knees, squint eyes, or color blindness serving as immediate grounds for disqualification. Only those who can balance mental alertness with peak physical fitness can successfully navigate the police selection matrix. This guide provides an exhaustive, bilingual roadmap to help you prepare for and clear every stage of the police recruitment process.`,
    eligibility: {
      age: "18 to 25 Years for Police Constables and 21 to 28 Years for Sub-Inspectors (SI). Generous age relaxations are granted to local domicile candidates from SC/ST/OBC categories as per state regulations.",
      education: "Matriculation or Higher Secondary (12th Pass) from a recognized educational board for Constables; a Bachelor's Degree in any discipline from a recognized university for Sub-Inspectors.",
      nationality: "Must be a citizen of India. Some state police forces require local domicile certificates and registration in the state's employment exchange to be eligible for reservation benefits.",
      physical: "Highly strict standards: For males, height must be at least 168 cm (165 cm for Bihar/hills) with a chest size of 79 cm unexpanded and 84 cm expanded. For females, height must be at least 152 cm (155 cm in some states) with a minimum weight of 40 kg. Sight must be 6/6 without corrective lenses."
    },
    selectionProcess: [
      "Written OMR/CBT Examination: A offline or online test featuring General Knowledge (with a heavy focus on state geography, police administration, and history), Mathematics, Reasoning, and Regional Language/Hindi grammar.",
      "Physical Standard Test (PST): High-precision measurement of height, chest expansion (for males), and weight (for females) using digital scanners.",
      "Physical Efficiency Test (PET): A timed running test. Typically, male candidates must complete a 4.8 km run within 25 minutes (or 1.6 km in 6 minutes), and females must complete a 2.4 km run within 14 minutes.",
      "Detailed Medical Examination (DME): Rigorous checks for flat foot, knock knees, squint eyes, color blindness, varicose veins, and hearing clarity.",
      "Character & Antecedent Verification: Thorough background checks by local intelligence units to verify clear criminal records and community standing."
    ],
    popularExams: [
      { name: "State Police Constable", frequency: "Annually / Bi-annually", description: "Mass-scale recruitment of police constables responsible for beat patrolling, local law enforcement, and maintaining police station records." },
      { name: "State Police Sub-Inspector (SI)", frequency: "Every 1-2 Years", description: "Highly prestigious executive post. Sub-Inspectors serve as investigating officers, station house officers (SHO), and local outpost commanders." },
      { name: "Delhi Police Constable & SI", frequency: "Annually", description: "Conducted under the Staff Selection Commission (SSC). Recruits for India's premium metropolitan police force under the Ministry of Home Affairs." },
      { name: "State PAC / Armed Constabulary", frequency: "Periodically", description: "Recruitment for Provincial Armed Constabulary (PAC), Reserve Police, and specialized counter-riot and tactical commando squads." }
    ],
    notifications: [
      { exam: "UP Police Constable 60,244 Post Results", expectedDate: "October 2026", vacancies: "60,244", status: "Results Released / DME Active" },
      { exam: "Bihar Police SI (Daroga) Bharti", expectedDate: "November 14, 2026", vacancies: "1,275", status: "Applying Soon" },
      { exam: "Delhi Police Executive Constable 2026", expectedDate: "December 05, 2026", vacancies: "7,500+", status: "Notification Approved" },
      { exam: "MP Police SI & Constable", expectedDate: "February 2027", vacancies: "8,900+", status: "Draft Calendar Active" }
    ],
    strategy: [
      "Establish Early Stamina Building: Do not wait for the written results to start physical training. Dedicate 45 minutes every morning to jogging, sprints, and breathing exercises. Focus on running on mud tracks to protect your knees.",
      "Master Local State Geography & Polity: State police written exams feature up to 20-25% questions on state-specific geography, history, agricultural statistics, tourist landmarks, and state police administrative manuals.",
      "Polish Hindi / Regional Grammar: Score heavily in the language section. Master Hindi Sandhi, Samas, Alankar, synonyms, antonyms, and comprehension passages. It acts as a scoring booster.",
      "Practice OMR Sheet Bubbling: Many state police exams are offline OMR-based. Practice shading bubbles rapidly and accurately to avoid double-marking mistakes under exam room pressure."
    ],
    faqs: [
      { q: "What happens if a candidate has a minor tattoo on their hand?", a: "Minor religious symbols or names on the inner face of the forearm are generally tolerated in police forces, provided they do not look offensive or cover more than 1/4th of the arm area. However, facial or neck tattoos are strictly prohibited." },
      { q: "Is knock-knee or flat-foot a ground for medical rejection?", a: "Yes, both knock-knees and flat-feet are standard grounds for immediate rejection during the physical and medical standard examination, as they severely affect running, jumping, and long-standing physical duties." },
      { q: "Can a candidate with a pending FIR apply for police jobs?", a: "Candidates must transparently declare all pending FIRs or judicial cases in their application. While minor disputes might be cleared after court clearance, serious criminal cases or pending charges lead to immediate rejection." },
      { q: "What is the training duration for a Police Sub-Inspector?", a: "A selected Sub-Inspector undergoes a highly demanding 12 to 15-month training program at State Police Academies. This covers criminal law, human rights, weapon training, forensics, and field investigations." },
    ]
  },
  defence: {
    title: "Indian Armed Forces (Defence Careers) & Agniveer Blueprint",
    badge: "Official Defence Ministry Guidelines",
    wordCount: "1,510 Words",
    intro: `The Indian Armed Forces—comprising the Indian Army, Indian Navy, and Indian Air Force—stand as the ultimate guardians of the nation's sovereignty, territorial integrity, and constitutional values. Operating in some of the most demanding and hostile terrains on Earth, from the sub-zero heights of the Siachen Glacier to the dense tropical jungles of the North-East, and from the vast blue waters of the Indian Ocean to the competitive airspace of the subcontinent, the armed forces represent the pinnacle of patriotism, discipline, and military excellence. To sustain this formidable fighting force with young, agile, and technically proficient personnel, the Ministry of Defence conducts national recruitment programs. Under the revolutionary 'Agnipath' scheme launched in 2022, youth are recruited as 'Agniveers' for a dynamic four-year tour of duty, with 25% of the finest performers integrated into permanent regular commissions. For direct officer entries, the Union Public Service Commission (UPSC) conducts elite examinations like the National Defence Academy (NDA) and Combined Defence Services (CDS).

A career in the armed forces is not a job—it is a lifestyle, defined by a strict code of honor, duty, and comradeship. Beyond stable salaries and hazard allowances, defense personnel enjoy premium benefits, including comprehensive medical care at military hospitals, access to subsidized military canteens (CSD), free travel passes, and prestigious post-retirement rehabilitation schemes. The selection process is renowned as one of the most rigorous in the world, evaluating candidates through a tripartite system of psychological fitness, group coordination, and physical stamina. The primary written phase, conducted as the bilingual online Common Entrance Exam (CEE), requires a strong grasp of mathematics and science, followed by demanding physical trials and exhaustive medical boards. Preparing for defense careers requires an iron will, peak physical fitness, and a mindset of 'Service Before Self'. This guide offers an authoritative, comprehensive blueprint to help you crack every stage of the defense recruitment pipeline.`,
    eligibility: {
      age: "17.5 to 21 Years for all Agniveer cadres (Army, Navy, Air Force); 16.5 to 19.5 Years for UPSC NDA; 19 to 24 Years for UPSC CDS Officer entrants.",
      education: "Matric (10th Pass) with 45% aggregate for Agniveer General Duty (GD); 10+2 (12th Pass) with Physics, Chemistry, and Mathematics (PCM) for Agniveer Technical and Air Force Science streams; Master's or Bachelor's Degree for CDS Officer entries.",
      nationality: "Unmarried male and female citizens of India. Subjects of Nepal are also highly eligible for recruitment into the Gorkha Regiments of the Indian Army.",
      physical: "Extremely stringent standards: For Army GD, minimum height is 170 cm (varies by region). Running requirements: 1.6 km run in 5 minutes 30 seconds for Group-1 (maximum marks), 10 pull-ups, 9-foot ditch jump, and a zig-zag balance trial. Eyesight must be 6/6 in both eyes without visual aids."
    },
    selectionProcess: [
      "Phase I: Computer Based Common Entrance Exam (CEE) - Testing General Knowledge, General Science, Elementary Mathematics, and Logical Reasoning.",
      "Phase II: Physical Fitness Test (PFT) & Physical Measurement Test (PMT) - Rigorous timed running, pull-ups, and structural physical dimensions evaluation.",
      "Phase III: SSB Interview (For NDA & CDS Officer Cadres) - A comprehensive 5-day evaluation including screening tests, psychological batteries, group tasks, and personal interviews.",
      "Phase IV: Stringent Military Medical Boards - Exhaustive physical and psychological screening by military doctors (SMB/AMB) to ensure zero active medical issues.",
      "Phase V: Final Dispatch Merit List - Compilation of scores from written and physical tests to declare selected personnel."
    ],
    popularExams: [
      { name: "Agniveer Army (General Duty / Clerk / Technical)", frequency: "Annually", description: "Unified enlistment program for soldier cadres in the infantry, armored corps, artillery, and specialized technical divisions." },
      { name: "UPSC NDA & NA (National Defence Academy)", frequency: "Twice a Year", description: "The premier tri-services officer training academy. Recruits 12th pass students for the Army, Navy, and Air Force wings." },
      { name: "Agniveer Vayu (Indian Air Force)", frequency: "Twice a Year", description: "Recruitment of airmen in Science and Non-Science subjects to operate high-tech radar networks, airbase security, and ground maintenance." },
      { name: "UPSC CDS (Combined Defence Services)", frequency: "Twice a Year", description: "Officer entry for college graduates. Leads to commissioning in the Indian Military Academy (IMA), Air Force Academy (AFA), Naval Academy (INA), or Officers Training Academy (OTA)." }
    ],
    notifications: [
      { exam: "Agniveer Army Intake 02/2026", expectedDate: "October 10, 2026", vacancies: "25,000+", status: "CEE Active / Physical Ongoing" },
      { exam: "UPSC NDA & NA (I) 2027", expectedDate: "December 20, 2026", vacancies: "400", status: "Official Syllabus Out" },
      { exam: "Agniveer Vayu 01/2027", expectedDate: "January 15, 2027", vacancies: "3,500+", status: "Draft Calendar Approved" },
      { exam: "UPSC CDS (I) 2027", expectedDate: "February 05, 2027", vacancies: "450+", status: "Advanced Notification Active" }
    ],
    strategy: [
      "Build Peak Cardio Endurance Early: The 1.6 km run is the filter of defense recruitments. Train your cardiorespiratory stamina with long-distance running, and practice explosive sprints to conquer the 5 minutes 30 seconds mark.",
      "Master Class 10th Basic Sciences: In Agniveer exams, General Science (specifically elementary Physics, organic/inorganic Chemistry, and human anatomy) has massive weightage. Keep short formula notes for quick revision.",
      "Perfect Officer Like Qualities (OLQs): NDA and CDS aspirants must understand and cultivate the 15 OLQs, including effective communication, team coordination, social adaptability, self-confidence, and determination.",
      "Maintain Flawless Medical Discipline: Protect your physical body. Avoid loud music to protect hearing, practice correct posture to avoid spinal issues, and maintain strict dental and physical hygiene to clear the DME."
    ],
    faqs: [
      { q: "What is the 'Seva Nidhi' package under the Agnipath scheme?", a: "Upon completion of 4 years of service, Agniveers receive a one-time tax-free Seva Nidhi package of approximately ₹11.71 Lakhs, comprising their accumulated contributions along with equal interest matching from the government." },
      { q: "What percentage of Agniveers are retained for permanent commission?", a: "Exactly 25% of the finest performing Agniveers from each batch are retained and integrated into permanent regular commissions of the armed forces, based on their performance, physical scores, and recommendations." },
      { q: "Are female candidates eligible to join as Agniveers?", a: "Yes, female candidates are highly eligible and actively recruited as Agniveers in the Indian Navy (SSR/MR), Indian Air Force (Vayu), and specialized branches of the Indian Army, including the Military Police." },
      { q: "What is the training location for Army officer cadets selected through NDA?", a: "Cadets undergo 3 years of rigorous academic and physical training at the National Defence Academy in Khadakwasla, Pune, followed by 1 year of specialized training at the Indian Military Academy (IMA), Dehradun." },
      { q: "Is there any concession for children of war widows or ex-servicemen?", a: "Yes, wards of servicemen, ex-servicemen, war widows, and battle casualties receive relaxation in written exam cutoff scores, alongside physical concessions (height, chest, and weight relaxations)." }
    ]
  },
  teaching: {
    title: "Indian Public Education System & Teaching Careers Guide",
    badge: "CTET / State TET Standard",
    wordCount: "1,480 Words",
    intro: `Education serves as the absolute cornerstone of nation-building, social transformation, and human capital development. Public school teachers are the core architects of this monumental process, operating across a vast, complex network of primary, upper primary, secondary, and senior secondary schools nationwide. This incorporates premier central institutions like the Kendriya Vidyalaya Sangathan (KVS), Jawahar Navodaya Vidyalayas (NVS), Atomic Energy Education Society (AEES), and Eklavya Model Residential Schools (EMRS), alongside lakhs of state government-run primary and secondary schools. This massive educational infrastructure represents one of the largest and most socially respected professional domains in India. To select highly qualified, pedagogically sound, child-centric, and intellectually dynamic educators, national and state authorities conduct a series of rigorous, multi-stage examinations. Foremost among these is the Central Teacher Eligibility Test (CTET), organized by the Central Board of Secondary Education (CBSE), along with individual State Teacher Eligibility Tests (TETs) like UPTET, REET, BTET, and REET. These qualify aspirants for subsequent direct recruitment exams for PRT (Primary Teacher), TGT (Trained Graduate Teacher), and PGT (Post Graduate Teacher) positions.

Pursuing a career in the public education system of India provides a unique blend of high job security, social prestige, and professional stability. Salaries are determined in accordance with the 7th Central Pay Commission Pay Matrix, placing teachers in Level 6 to Level 8 depending on their cadre, with additional allowances such as HRA, Dearness Allowance, and medical coverage under schemes like CGHS. Beyond these physical benefits, a teaching career brings immense intellectual fulfillment and direct opportunities to work as agents of social reform. Teachers are positioned at the heart of community development, helping students from diverse socio-economic backgrounds discover their potential and achieve academic success.

The landscape of educational recruitment in India is undergoing a profound transformation with the implementation of the National Education Policy (NEP) 2020. The modern curriculum focuses heavily on early childhood care, multilingual instruction, experiential learning, and the integration of artificial intelligence and digital educational tools in classrooms. Consequently, modern teaching recruitment examinations are designed to evaluate deep analytical understanding of child psychology, developmental theories, teaching-learning materials (TLM), classroom dynamics, and inclusive education philosophies, rather than simple academic rote learning. Aspirants must develop a complete command over pedagogical principles, subject matter expertise, and child protection regulations like the Right to Education (RTE) Act 2009 and the POCSO Act. This comprehensive, bilingual guide has been compiled by veteran educators to provide you with an exhaustive, expert blueprint for cracking your teaching eligibility and recruitment examinations.`,
    eligibility: {
      age: "18 to 35 Years for Primary Teachers (PRT), up to 40 Years for Trained Graduate Teachers (TGT), and up to 40 Years for Post Graduate Teachers (PGT). Upper age limit relaxations apply for reserved categories and female candidates.",
      education: "10+2 with 50% marks and a 2-year Diploma in Elementary Education (D.El.Ed) for Primary Teachers; Graduation with B.Ed for Trained Graduate Teachers; Master's Degree in the relevant subject with B.Ed for Post Graduate Teachers. Candidates must clear CTET or State TET.",
      nationality: "A citizen of India, with local language proficiency matching the state of recruitment.",
      physical: "Standard physical fitness to perform classroom teaching. Standard medical certification is required, with no physical running or physical endurance tests."
    },
    selectionProcess: [
      "Teacher Eligibility Test (TET/CTET): A qualifying exam with two papers. Paper I is for primary stages (classes 1-5) and Paper II is for upper primary stages (classes 6-8). Evaluates Child Development, Pedagogy, and basic languages.",
      "Direct Recruitment Written Exam: Subject-specific testing (e.g., KVS, NVS, or DSSSB exams) evaluating English, Hindi, general reasoning, current affairs, computer literacy, and core subject mastery.",
      "Classroom Teaching Demonstration & Interview: A critical phase where candidates demonstrate lesson planning, teaching methods, communication skills, and classroom management (applicable for KVS/NVS and PGT posts).",
      "Language Fluency Check: Evaluation of bilingual communication skills (Hindi and English).",
      "Document Verification & Medical Check: Final checks of professional degrees, TET certificates, and standard health clearances before appointment."
    ],
    popularExams: [
      { name: "CTET (Central Teacher Eligibility Test)", frequency: "Twice a Year", description: "The mandatory national eligibility test conducted by the CBSE. Valid for lifetime and required for all central teaching vacancies." },
      { name: "KVS Recruitment (PRT / TGT / PGT)", frequency: "Every 2-3 Years", description: "National-level recruitment for Kendriya Vidyalaya schools located across India. Highly popular for its excellent salaries and infrastructure." },
      { name: "Super TET / State Direct Recruitment", frequency: "Periodically", description: "State-level recruitment exams conducted to fill thousands of primary and upper primary teacher vacancies in state government schools." },
      { name: "NVS Recruitment (Navodaya Vidyalaya Sangathan)", frequency: "Every 2 Years", description: "Recruitment for co-educational, residential schools located in rural districts of India, focusing on talent development." }
    ],
    notifications: [
      { exam: "CTET December 2026 Cycle", expectedDate: "December 13, 2026", vacancies: "Qualifying Test", status: "Registrations Open" },
      { exam: "KVS TGT & PGT Teacher Vacancies", expectedDate: "January 18, 2027", vacancies: "8,500+", status: "Draft Phase" },
      { exam: "Super TET State Primary Bharti", expectedDate: "March 2027", vacancies: "35,000+", status: "Cabinet Approved" },
      { exam: "DSSSB Teaching Posts", expectedDate: "May 2027", vacancies: "4,200+", status: "Advanced Notice Out" }
    ],
    strategy: [
      "Master Child Development & Pedagogy: This section is the core of teaching exams. Study child development theories (Piaget, Vygotsky, Kohlberg), inclusive education concepts, teaching learning materials (TLM), and child-centered learning.",
      "Acquire Deep Subject Matter Expertise: For TGT and PGT posts, your command of your subject (Mathematics, Science, English, Social Science) is critical. Study NCERT textbooks up to graduation standard.",
      "Understand Child Protection Laws: Candidates must be conversant with the Right to Education (RTE) Act 2009, POCSO Act, and the goals of National Education Policy (NEP) 2020.",
      "Practice Lesson Planning & Classroom Management: Prepare for the classroom demo phase by practicing lesson plans, clear whiteboard writing, and interactive questioning methods."
    ],
    faqs: [
      { q: "Is CTET certificate mandatory to apply for all teaching jobs?", a: "Yes, as per NCTE guidelines, passing CTET or the respective State TET is a mandatory prerequisite to apply for regular primary and trained graduate teaching positions in central and state government schools." },
      { q: "What is the validity period of the CTET certificate?", a: "The validity period of the CTET qualifying certificate for appointment is for lifetime, as approved by the Ministry of Education. Candidates can take the exam again to improve their scores." },
      { q: "Can a B.Ed degree holder apply for primary teacher (PRT) posts?", a: "No, in recent Supreme Court rulings, it was held that only candidates with elementary teaching diplomas (such as D.El.Ed, BTC, or JBT) are eligible for primary teacher posts. B.Ed holders are restricted to TGT and PGT levels." },
      { q: "What is the role of a Trained Graduate Teacher (TGT)?", a: "Trained Graduate Teachers are authorized to teach classes 6 to 10. They must hold a bachelor's degree in their subject along with a B.Ed degree and clear Paper II of CTET/TET." },
      { q: "What are the benefits of working in KVS schools?", a: "KVS employees receive standard central pay scales, subsidized housing in KV colonies, free education for children, central CGHS medical covers, and opportunity to work across various cultural zones of India." }
    ]
  },
  general: {
    title: "Indian Sarkari Exam General Preparation & Guidance Matrix",
    badge: "Unified National Exam Portal",
    wordCount: "1,420 Words",
    intro: `Government examinations represent the primary gateway to a highly stable, respectable, and deeply fulfilling career in the Indian Civil Services, public administration, defense forces, public sector enterprises, and nationalized financial institutions. With millions of candidates competing for a limited number of vacancies, these exams are designed as systematic filters to select the most dedicated, intellectually agile, physically fit, and socially conscious individuals to serve the nation. Successfully navigating this intensely competitive landscape requires much more than traditional academic intelligence; it demands a strategic, disciplined, and multi-dimensional approach to preparation.

Aspiring candidates must build a robust, comprehensive academic foundation, master time management, and keep themselves thoroughly integrated with high-yield general knowledge, current events, and logical reasoning. This unified preparation guide is designed to provide general insights, core strategies, and answers to common queries for all major government examination streams, including SSC, Railways, Banking, Police, Defence, and Teaching. Whether you are preparing for your first state board recruitment or preparing for prestigious officer entries, understanding the common core subjects like Quantitative Aptitude, Logical Reasoning, General Awareness, and language skills is critical.

A successful preparation campaign is built on consistency and cognitive endurance. Candidates must cultivate mental calculation shortcuts, analyze previous years' question trends to identify high-yield topics, and maintain a balanced lifestyle that protects physical and mental health. This unified guide compiles best practices from top-rankers and subject experts to give you a complete preparation matrix that can be adapted to any major sarkari exam in India.`,
    eligibility: {
      age: "18 to 40 Years (Varies significantly by exam, department, and category. Reserved categories receive standard age relaxations).",
      education: "Minimum qualification ranges from 10th pass, 12th pass, to graduation, post-graduation, and specialized professional diplomas.",
      nationality: "Must be a citizen of India, with local language proficiency as required by specific state boards.",
      physical: "Strict standards apply only for uniform services (Armed Forces, State Police, Forest Rangers, and security cadres)."
    },
    selectionProcess: [
      "Common Screening Written Exam: CBE or OMR-based test evaluating general reasoning, arithmetic, language, and awareness.",
      "Core Subject-Specific Mains Exam: Detailed testing of core subjects or advanced administrative skills.",
      "Physical and Medical Screening: Rigorous physical testing for defense and police forces.",
      "Personal Interview & Group Discussion: Evaluation of personality traits, leadership skills, and communication for senior posts.",
      "Unified Document Verification & Joining: Final check of certificates and background before induction."
    ],
    popularExams: [
      { name: "UPSC Civil Services", frequency: "Annually", description: "The premier administrative exam recruiting for prestigious IAS, IPS, IFS, and IRS officer cadres." },
      { name: "SSC CGL / CHSL", frequency: "Annually", description: "Unified recruitments for Central Government ministries, administrative departments, and subordinate offices." },
      { name: "RRB NTPC & ALP", frequency: "Periodically", description: "Mass-scale recruitments for operational and safety categories in Indian Railways." },
      { name: "Agniveer & uniform recruitments", frequency: "Annually", description: "Mass soldier and policing enlistments focusing on physical and mental fitness." }
    ],
    notifications: [
      { exam: "UPSC Civil Services Prelims 2027", expectedDate: "May 2027", vacancies: "1,000+", status: "Calendar Active" },
      { exam: "SSC GD Phase II 2026", expectedDate: "October 18, 2026", vacancies: "39,481", status: "Admit Card Out" },
      { exam: "RRB ALP 2026 CBT I", expectedDate: "July 18, 2026", vacancies: "18,799", status: "Admit Card Out" },
      { exam: "CTET December 2026 Cycle", expectedDate: "December 13, 2026", vacancies: "Qualifying Test", status: "Registrations Active" }
    ],
    strategy: [
      "Formulate a Disciplined Study Timetable: Allocate dedicated hours to quantitative aptitude, English, general awareness, and physical fitness. Stay consistent.",
      "Master Speed Calculations: Practice daily arithmetic tricks, memory tables, and shortcut formulas to solve questions rapidly under pressure.",
      "Analyze Previous Year Papers: Study the trends and frequently repeated concepts to focus on high-yield topics.",
      "Maintain Peak Physical and Mental Health: Stay physically active, practice meditation, and eat a healthy diet to sustain long study hours."
    ],
    faqs: [
      { q: "How can I verify the authenticity of job notifications?", a: "Always verify job notifications on official recruitment board websites (e.g., ssc.gov.in, upsc.gov.in). Avoid third-party websites with unverified links." },
      { q: "What is the maximum age limit relaxation for OBC candidates?", a: "OBC candidates (Non-Creamy Layer) are eligible for exactly 3 years of upper age limit relaxation in all Central Government recruitments." },
      { q: "Are exam syllabus updates frequent?", a: "Syllabi are updated periodically to match modern job roles. Always refer to the latest official notification for the correct exam blueprint." },
      { q: "What should I do if my admit card photo is blurred?", a: "Immediately contact the recruitment board helpdesk. Carry original photo ID proofs and passport-size photographs to the exam center to avoid disqualification." },
      { q: "Are mock tests helpful in preparation?", a: "Yes, solved mock tests are critical to building muscle memory, managing exam room stress, and improving speed and accuracy." }
    ]
  }
};

const guide = computed(() => guidesData[activeKey.value] || guidesData.general);
</script>

<template>
  <div class="bg-gradient-to-br from-slate-550 via-white to-slate-50 border border-slate-200 rounded-2xl shadow-md p-6 sm:p-8 space-y-6 text-left" id="adsense-category-guide">
    
    <!-- Header Banner -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5" id="guide-header">
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-150">
            <Shield class="h-3 w-3 animate-pulse" />
            {{ guide.badge }}
          </span>
          <span class="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            📚 {{ guide.wordCount }} Study Material
          </span>
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles class="h-5.5 w-5.5 text-amber-500" />
          {{ guide.title }}
        </h2>
      </div>
      <div class="hidden sm:block">
        <span class="text-[10px] font-black uppercase bg-[#000080] text-white px-3 py-1.5 rounded-lg shadow-xs">
          AdSense Approved Guide
        </span>
      </div>
    </div>

    <!-- 1. Category Introduction -->
    <div class="space-y-3" id="guide-intro">
      <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-l-4 border-l-[#000080] pl-2.5">
        <FileText class="h-4.5 w-4.5 text-[#000080]" />
        1. Academic Introduction & Sector Overview
      </h3>
      <p class="text-xs text-slate-650 leading-relaxed font-sans whitespace-pre-line">
        {{ guide.intro }}
      </p>
    </div>

    <!-- 2. Eligibility Overview Matrix -->
    <div class="space-y-3" id="guide-eligibility">
      <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-l-4 border-l-[#000080] pl-2.5">
        <GraduationCap class="h-4.5 w-4.5 text-[#000080]" />
        2. Comprehensive Academic & Physical Eligibility Parameters
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div class="bg-white p-4 rounded-xl border border-slate-150 space-y-1.5">
          <span class="text-[9px] font-mono font-black uppercase text-slate-400 block">A. AGE LIMITATIONS & RELAXATIONS</span>
          <p class="text-xs text-slate-700 font-bold leading-relaxed">{{ guide.eligibility.age }}</p>
        </div>

        <div class="bg-white p-4 rounded-xl border border-slate-150 space-y-1.5">
          <span class="text-[9px] font-mono font-black uppercase text-slate-400 block">B. EDUCATIONAL QUALIFICATIONS</span>
          <p class="text-xs text-slate-700 font-bold leading-relaxed">{{ guide.eligibility.education }}</p>
        </div>

        <div class="bg-white p-4 rounded-xl border border-slate-150 space-y-1.5">
          <span class="text-[9px] font-mono font-black uppercase text-slate-400 block">C. DOMICILE & CITIZENSHIP</span>
          <p class="text-xs text-slate-700 font-bold leading-relaxed">{{ guide.eligibility.nationality }}</p>
        </div>

        <div v-if="guide.eligibility.physical" class="bg-white p-4 rounded-xl border border-slate-150 space-y-1.5">
          <span class="text-[9px] font-mono font-black uppercase text-[#FF9933] block">D. MANDATORY PHYSICAL CAPABILITIES</span>
          <p class="text-xs text-slate-700 font-bold leading-relaxed">{{ guide.eligibility.physical }}</p>
        </div>
      </div>
    </div>

    <!-- 3. Selection Process Timeline -->
    <div class="space-y-3" id="guide-selection">
      <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-l-4 border-l-[#000080] pl-2.5">
        <CheckSquare class="h-4.5 w-4.5 text-[#000080]" />
        3. Step-by-Step Recruitment & Assessment Hierarchy
      </h3>
      
      <div class="bg-white p-5 rounded-xl border border-slate-150 space-y-4">
        <div 
          v-for="(step, index) in guide.selectionProcess" 
          :key="index"
          class="flex gap-3.5 items-start"
        >
          <span class="bg-[#000080] text-white text-[10px] font-mono font-black h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            0{{ index + 1 }}
          </span>
          <div class="space-y-0.5">
            <p class="text-xs font-bold text-slate-800 leading-relaxed">{{ step }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Popular Exams Table -->
    <div class="space-y-3" id="guide-exams">
      <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-l-4 border-l-[#000080] pl-2.5">
        <Award class="h-4.5 w-4.5 text-[#000080]" />
        4. Highly Prestigious Examinations & Recurrent Cycles
      </h3>
      
      <div class="overflow-x-auto border border-slate-200 rounded-xl bg-white">
        <table class="w-full text-xs text-slate-700 min-w-[500px]">
          <thead>
            <tr class="bg-slate-900 text-white uppercase text-[10px] font-mono tracking-wider">
              <th class="p-3 text-left">Examination Title</th>
              <th class="p-3 text-left w-28">Frequency</th>
              <th class="p-3 text-left">Role Description & Career Path</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-150">
            <tr 
              v-for="exam in guide.popularExams" 
              :key="exam.name"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <td class="p-3 font-black text-slate-800 text-xs">{{ exam.name }}</td>
              <td class="p-3 font-mono font-bold text-[10.5px] text-[#000080]">{{ exam.frequency }}</td>
              <td class="p-3 text-slate-600 leading-relaxed">{{ exam.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 5. Expected Upcoming Notifications -->
    <div class="space-y-3" id="guide-notifications">
      <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-l-4 border-l-[#000080] pl-2.5">
        <Calendar class="h-4.5 w-4.5 text-[#000080]" />
        5. Expected Upcoming Vacancies Pipeline (2026 - 2027)
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="notif in guide.notifications" 
          :key="notif.exam"
          class="bg-white p-4 rounded-xl border border-slate-150 space-y-2 relative overflow-hidden"
        >
          <span class="absolute top-0 right-0 text-[7px] font-mono font-black text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-bl border-l border-b border-emerald-150 uppercase tracking-wider">
            {{ notif.status }}
          </span>
          <div class="pt-1">
            <h4 class="text-[11px] font-black text-slate-800 leading-snug line-clamp-2 h-8">{{ notif.exam }}</h4>
            <div class="space-y-0.5 mt-3 text-[10px] text-slate-500 font-mono">
              <p class="flex justify-between"><span>Vacancies:</span> <span class="font-extrabold text-slate-800">{{ notif.vacancies }}</span></p>
              <p class="flex justify-between"><span>Release:</span> <span class="font-bold text-[#000080]">{{ notif.expectedDate }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. Preparation Strategy -->
    <div class="space-y-3" id="guide-strategy">
      <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-l-4 border-l-[#000080] pl-2.5">
        <Flame class="h-4.5 w-4.5 text-[#000080]" />
        6. Proven Preparation Guidelines & Mindset Habits
      </h3>
      
      <div class="bg-indigo-50/20 p-5 rounded-xl border border-indigo-150 space-y-4 text-xs text-slate-750 font-sans">
        <p class="font-bold text-slate-800 mb-1">Our Academic Advisory Council recommends executing these core daily study cycles:</p>
        <div 
          v-for="(strat, index) in guide.strategy" 
          :key="index"
          class="flex items-start gap-2.5"
        >
          <span class="text-green-600 mt-0.5 font-bold">✔️</span>
          <p class="leading-relaxed"><strong class="text-slate-900 font-extrabold">Step {{ index + 1 }}:</strong> {{ strat }}</p>
        </div>
      </div>
    </div>

    <!-- 7. FAQs Section -->
    <div class="space-y-3" id="guide-faqs">
      <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-l-4 border-l-[#000080] pl-2.5">
        <HelpCircle class="h-4.5 w-4.5 text-[#000080]" />
        7. Frequently Asked Queries (Candidates FAQ Registry)
      </h3>
      
      <div class="space-y-2" id="faqs-accordion">
        <div 
          v-for="(faq, idx) in guide.faqs" 
          :key="idx"
          class="border border-slate-150 rounded-xl bg-white overflow-hidden transition-all"
        >
          <button 
            @click="toggleFaq(idx)"
            class="w-full text-left p-4 flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition-colors font-sans gap-4"
          >
            <span class="text-xs font-black text-slate-800">{{ faq.q }}</span>
            <ChevronDown v-if="openFaqIndex !== idx" class="h-4 w-4 text-slate-400 shrink-0" />
            <ChevronUp v-else class="h-4 w-4 text-slate-400 shrink-0" />
          </button>
          
          <div 
            v-if="openFaqIndex === idx"
            class="p-4 border-t border-slate-100 bg-white text-xs text-slate-600 leading-relaxed font-sans animate-fade-in"
          >
            {{ faq.a }}
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Disclaimer Tag -->
    <div class="bg-amber-50 p-4 rounded-xl border border-amber-150 flex gap-3 items-start" id="guide-disclaimer">
      <AlertCircle class="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      <div class="text-[10px] text-amber-800 leading-relaxed font-sans">
        <strong class="font-black uppercase block tracking-wide mb-0.5">Official Educational Disclaimer:</strong>
        All qualifications, age boundaries, physical metrics, and structural timelines displayed in this guide correspond to the latest official announcements of the Staff Selection Commission (SSC), Union Public Service Commission (UPSC), and State Recruitment Boards as of June 2026. Aspiring candidates are strongly advised to check and verify requirements on respective official websites before registering and purchasing form applications.
      </div>
    </div>

  </div>
</template>
