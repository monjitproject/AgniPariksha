import { Quiz, JobPost, StudyNote, PdfDoc, BlogPost, LeaderboardEntry } from "../types";

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: "armed-forces-gk-1",
    title: "Indian Armed Forces - Core GK Quiz",
    category: "Indian Armed Forces GK",
    difficulty: "Medium",
    iconName: "Shield",
    timeLimit: 120,
    questions: [
      {
        id: "af-1",
        text: "Who is the Supreme Commander of the Indian Armed Forces?",
        options: [
          "Prime Minister of India",
          "President of India",
          "Chief of Defence Staff (CDS)",
          "Defence Minister of India"
        ],
        correctAnswer: 1,
        explanation: "Article 53 of the Constitution of India provides that the Supreme Command of the Defence Forces of the Union shall be vested in the President of India.",
        category: "Indian Armed Forces GK"
      },
      {
        id: "af-2",
        text: "Where is the Indian Military Academy (IMA) situated?",
        options: [
          "Dehradun, Uttarakhand",
          "Khadakwasla, Pune",
          "Chennai, Tamil Nadu",
          "Mhow, Madhya Pradesh"
        ],
        correctAnswer: 0,
        explanation: "The Indian Military Academy (IMA) was established in 1932 and is located in Dehradun, Uttarakhand.",
        category: "Indian Armed Forces GK"
      },
      {
        id: "af-3",
        text: "What is the motto of the Indian Army?",
        options: [
          "Sam No Varunah",
          "Nabhal Sprisham Deeptam",
          "Service Before Self",
          "Valour and Wisdom"
        ],
        correctAnswer: 2,
        explanation: "The official motto of the Indian Army is 'Service Before Self' ('Seva Parmo Dharma').",
        category: "Indian Armed Forces GK"
      },
      {
        id: "af-4",
        text: "Which of the following describes the ranks correct sequence from lowest to highest in the Indian Navy?",
        options: [
          "Sub-Lieutenant, Lieutenant, Lieutenant Commander, Commander",
          "Lieutenant, Sub-Lieutenant, Commander, Lieutenant Commander",
          "Commander, Lieutenant Commander, Lieutenant, Sub-Lieutenant",
          "Sub-Lieutenant, Commander, Lieutenant, Lieutenant Commander"
        ],
        correctAnswer: 0,
        explanation: "The commissioned naval rank sequence from lowest to highest starts with Sub-Lieutenant, Lieutenant, Lieutenant Commander, then Commander.",
        category: "Indian Armed Forces GK"
      },
      {
        id: "af-5",
        text: "Under the Agniveer scheme, for how many years are youths recruited into the armed forces?",
        options: [
          "3 Years",
          "15 Years",
          "4 Years",
          "5 Years"
        ],
        correctAnswer: 2,
        explanation: "The Agniveer recruitment under Agnipath scheme is a tour of duty style enrollment for a duration of 4 years.",
        category: "Indian Armed Forces GK"
      }
    ]
  },
  {
    id: "navy-gk-1",
    title: "Indian Navy GK & Maritime History",
    category: "Indian Navy GK Quiz",
    difficulty: "Hard",
    iconName: "Anchor",
    timeLimit: 120,
    questions: [
      {
        id: "navy-1",
        text: "Who is considered as the 'Father of the Indian Navy'?",
        options: [
          "Chhatrapati Shivaji Maharaj",
          "Kanhoji Angre",
          "Raja Raja Chola I",
          "Samudragupta"
        ],
        correctAnswer: 0,
        explanation: "Chhatrapati Shivaji Maharaj, the Maratha emperor, is considered the Father of the Indian Navy due to his visionary creation of a formidable coastal naval fleet to combat foreign invaders.",
        category: "Indian Navy"
      },
      {
        id: "navy-2",
        text: "Which is the first indigenously designed and built aircraft carrier of India?",
        options: [
          "INS Vikramaditya",
          "INS Vikrant",
          "INS Virat",
          "INS Arihant"
        ],
        correctAnswer: 1,
        explanation: "INS Vikrant (IAC-1) is the first aircraft carrier designed by the Warship Design Bureau of the Indian Navy and constructed by Cochin Shipyard.",
        category: "Indian Navy"
      },
      {
        id: "navy-3",
        text: "Where is the Southern Naval Command (SNC) headquartered?",
        options: [
          "Visakhapatnam",
          "Mumbai",
          "Kochi",
          "Karwar"
        ],
        correctAnswer: 2,
        explanation: "The Southern Naval Command of the Indian Navy is headquartered at Kochi, Kerala.",
        category: "Indian Navy"
      }
    ]
  },
  {
    id: "airforce-gk-1",
    title: "Indian Air Force - Tech & Ranks Quiz",
    category: "Indian Air Force GK Quiz",
    difficulty: "Medium",
    iconName: "CloudLightning",
    timeLimit: 90,
    questions: [
      {
        id: "af-tech-1",
        text: "Who was the first and only Marshal of the Indian Air Force?",
        options: [
          "Subroto Mukerjee",
          "Arjan Singh",
          "Rakesh Sharma",
          "Arup Raha"
        ],
        correctAnswer: 1,
        explanation: "Marshal of the Indian Air Force Arjan Singh DFC was the first five-star rank officer and the only Marshal of the IAF.",
        category: "Indian Air Force"
      },
      {
        id: "af-tech-2",
        text: "From which country did India procure Rafale fighter jets?",
        options: [
          "Russia",
          "United States",
          "France",
          "Israel"
        ],
        correctAnswer: 2,
        explanation: "India purchased the Rafale multi-role combat fighter aircraft from Dassault Aviation of France.",
        category: "Indian Air Force"
      }
    ]
  },
  {
    id: "polity-gk-1",
    title: "Indian Constitution & Polity Essentials",
    category: "Indian Constitution Quiz",
    difficulty: "Easy",
    iconName: "BookOpen",
    timeLimit: 150,
    questions: [
      {
        id: "polity-1",
        text: "Who was the Chairman of the Drafting Committee of the Indian Constitution?",
        options: [
          "Dr. Rajendra Prasad",
          "Dr. B.R. Ambedkar",
          "Jawaharlal Nehru",
          "Sardar Vallabhbhai Patel"
        ],
        correctAnswer: 1,
        explanation: "Dr. Bhimrao Ramji Ambedkar served as the chairman of the Drafting Committee which prepared the Constitution of India.",
        category: "Indian Polity"
      },
      {
        id: "polity-2",
        text: "Which Article of the Constitution guarantees the 'Right to Equality'?",
        options: [
          "Article 14 - 18",
          "Article 19 - 22",
          "Article 21",
          "Article 32"
        ],
        correctAnswer: 0,
        explanation: "Articles 14 to 18 of the Constitution of India guarantee the Right to Equality as a fundamental right.",
        category: "Indian Polity"
      },
      {
        id: "polity-3",
        text: "How many schedules are there in the Indian Constitution currently?",
        options: [
          "8 Schedules",
          "10 Schedules",
          "12 Schedules",
          "14 Schedules"
        ],
        correctAnswer: 2,
        explanation: "Originally, there were 8 schedules. Currently, the Constitution of India has 12 schedules after various amendments.",
        category: "Indian Polity"
      }
    ]
  },
  {
    id: "current-affairs-1",
    title: "Daily Current Affairs Dynamic Booster Quiz",
    category: "Current Affairs Quiz",
    difficulty: "Medium",
    iconName: "Globe",
    timeLimit: 120,
    questions: [
      {
        id: "ca-1",
        text: "Which country hosted the G20 Summit in late 2025?",
        options: [
          "India",
          "Brazil",
          "South Africa",
          "Saudi Arabia"
        ],
        correctAnswer: 2,
        explanation: "The 20th G20 summit was hosted by South Africa in late 2025 as the presidency rotated, continuing diplomatic cooperation.",
        category: "Current Affairs"
      },
      {
        id: "ca-2",
        text: "Which Indian public sector defense enterprise produces the K9 Vajra-T self-propelled howitzers?",
        options: [
          "Larsen & Toubro (L&T) Defense",
          "Hindustan Aeronautics Limited (HAL)",
          "Bharat Electronics Limited (BEL)",
          "Advanced Weapons and Equipment India Limited"
        ],
        correctAnswer: 0,
        explanation: "The K9 Vajra-T tracked self-propelled Howitzer gun system is manufactured by Larsen & Toubro in India with Korean technology transfer.",
        category: "Current Affairs"
      }
    ]
  },
  {
    id: "ssc-gd-hindi-1",
    title: "SSC GD Constable General Knowledge and Hindi Quiz / एसएससी जीडी सामान्य ज्ञान व हिन्दी मॉक टेस्ट",
    category: "SSC GD Exam",
    difficulty: "Medium",
    iconName: "Shield",
    timeLimit: 300,
    questions: [
      {
        id: "ssc-gd-1",
        text: "Who set up the Maurya Empire in ancient India? / प्राचीन भारत में मौर्य साम्राज्य की स्थापना किसने की थी?",
        options: [
          "Chandragupta Maurya / चन्द्रगुप्त मौर्य",
          "Samrat Ashoka / सम्राट अशोक",
          "Bindusara / बिन्दुसार",
          "Chandragupta II / चन्द्रगुप्त द्वितीय"
        ],
        correctAnswer: 0,
        explanation: "Chandragupta Maurya established the Maurya Empire in 322 BCE after defeating Dhanananda. / चन्द्रगुप्त मौर्य ने 322 ईसा पूर्व में धनानंद को हराकर मौर्य साम्राज्य की स्थापना की थी।",
        category: "SSC GD GK"
      },
      {
        id: "ssc-gd-2",
        text: "Which article of the Indian Constitution is related to the abolition of untouchability? / भारतीय संविधान का कौन सा अनुच्छेद अस्पृश्यता के उन्मूलन से संबंधित है?",
        options: [
          "Article 14 / अनुच्छेद 14",
          "Article 15 / अनुच्छेद 15",
          "Article 17 / अनुच्छेद 17",
          "Article 19 / अनुच्छेद 19"
        ],
        correctAnswer: 2,
        explanation: "Article 17 of the Constitution of India abolishes 'untouchability' and forbids its practice. / भारतीय संविधान का अनुच्छेद 17 अस्पृश्यता को समाप्त करता है और इसका अभ्यास निषिद्ध है।",
        category: "SSC GD GK"
      },
      {
        id: "ssc-gd-3",
        text: "The capital of India was shifted from Calcutta to Delhi in which year? / भारत की राजधानी कलकत्ता से दिल्ली किस वर्ष स्थानांतरित की गई थी?",
        options: [
          "1911 / 1911",
          "1905 / 1905",
          "1915 / 1915",
          "1920 / 1920"
        ],
        correctAnswer: 0,
        explanation: "The capital of India was shifted from Calcutta to Delhi in 1911 during the Delhi Durbar. / दिल्ली दरबार के दौरान 1911 में भारत की राजधानी कलकत्ता से दिल्ली स्थानांतरित की गई थी।",
        category: "SSC GD GK"
      },
      {
        id: "ssc-gd-4",
        text: "What is the antonym of the Hindi word 'Sankshipt' (संक्षिप्त)? / हिंदी शब्द 'संक्षिप्त' का विलोम शब्द क्या है?",
        options: [
          "Vistrit / विस्तृत",
          "Chhota / छोटा",
          "Sankuchit / संकुचित",
          "Apoorva / अपूर्व"
        ],
        correctAnswer: 0,
        explanation: "The antonym of 'Sankshipt' (brief) is 'Vistrit' (detailed). / 'संक्षिप्त' का विलोम शब्द 'विस्तृत' होता है।",
        category: "SSC GD Hindi"
      }
    ]
  },
  {
    id: "rrb-ntpc-hindi-1",
    title: "Railway RRB NTPC General Awareness Mock Quiz / रेलवे एनटीपीसी सामान्य जागरूकता मॉक टेस्ट",
    category: "Railway RRB",
    difficulty: "Medium",
    iconName: "Award",
    timeLimit: 240,
    questions: [
      {
        id: "rrb-1",
        text: "Which is the longest railway platform in India currently? / भारत में वर्तमान में सबसे लंबा रेलवे प्लेटफॉर्म कौन सा है?",
        options: [
          "Gorakhpur Station / गोरखपुर स्टेशन",
          "Kollam Junction / कोल्लम जंक्शन",
          "Hubballi Station / श्री सिद्धारूढ़ स्वामीजी हुबली स्टेशन",
          "Kharagpur Junction / खड़गपुर जंक्शन"
        ],
        correctAnswer: 2,
        explanation: "Shree Siddharoodha Swamiji Hubballi Station platform in Karnataka is the longest in the world (1507m). / कर्नाटक का श्री सिद्धारूढ़ स्वामीजी हुबली स्टेशन प्लेटफॉर्म दुनिया का सबसे लंबा (1507 मीटर) है।",
        category: "Railway GK"
      },
      {
        id: "rrb-2",
        text: "The first commercial train in India ran between Bombay and Thane in which year? / भारत में पहली व्यावसायिक ट्रेन बॉम्बे और ठाणे के बीच किस वर्ष चली थी?",
        options: [
          "1853 / 1853",
          "1850 / 1850",
          "1857 / 1857",
          "1862 / 1862"
        ],
        correctAnswer: 0,
        explanation: "The first passenger train ran on April 16, 1853, covering 34 km with 400 passengers. / भारत की पहली यात्री ट्रेन 16 अप्रैल 1853 को चली जिसने 400 यात्रियों के साथ 34 किमी की दूरी तय की।",
        category: "Railway History"
      }
    ]
  },
  {
    id: "uppolice-lekhpal-1",
    title: "UP Police Constable & Lekhpal Consolidated Hindi & GS / यूपी पुलिस व लेखपाल सामान्य ज्ञान व हिंदी",
    category: "State Police Exams",
    difficulty: "Medium",
    iconName: "Shield",
    timeLimit: 300,
    questions: [
      {
        id: "up-ex-1",
        text: "Which of the following rivers joins the Ganga at Prayagraj (UP)? / निम्नलिखित में से कौन सी नदी प्रयागराज में गंगा से मिलती है?",
        options: [
          "Yamuna / यमुना",
          "Gomti / गोमती",
          "Kosi / कोसी",
          "Son / सोन"
        ],
        correctAnswer: 0,
        explanation: "The holy confluence (Triveni Sangam) at Prayagraj is formed by the Ganga, Yamuna, and mythical Saraswati. / प्रयागराज में पावन त्रिवेणी संगम गंगा, यमुना और गुप्त सरस्वती से मिलकर बनता है।",
        category: "UP Geography"
      },
      {
        id: "up-ex-2",
        text: "Which समास (Samas) is present in the word 'Chandra-mukh' (चंद्रमुख)? / 'चंद्रमुख' शब्द में कौन सा समास है?",
        options: [
          "Tatpurush Samas / तत्पुरुष समास",
          "Karmadharaya Samas / कर्मधारय समास",
          "Dvigu Samas / द्विगु समास",
          "Bahuvrihi Samas / बहुव्रीहि समास"
        ],
        correctAnswer: 1,
        explanation: "Since the face is compared to the Moon (Moon-like face), it is a Karmadharaya Samas. / चूंकि मुख की तुलना चंद्रमा से की गई है (चंद्रमा के समान मुख), अतः यह कर्मधारय समास है।",
        category: "Hindi Samas"
      }
    ]
  },
  {
    id: "bank-po-clerk-1",
    title: "Banking PO & Clerk Financial Terms Challenge / बैंकिंग सामान्य परीक्षा एवं अर्थव्यवस्था प्रणाली",
    category: "Banking Exams",
    difficulty: "Hard",
    iconName: "Award",
    timeLimit: 180,
    questions: [
      {
        id: "bank-1",
        text: "Which regulatory body regulates the monetary policy of India? / भारत में मौद्रिक नीति को कौन सी नियामक संस्था नियंत्रित करती है?",
        options: [
          "SEBI / सेबी",
          "Reserve Bank of India (RBI) / भारतीय रिजर्व बैंक (आरबीआई)",
          "Ministry of Finance / वित्त मंत्रालय",
          "State Bank of India (SBI) / भारतीय स्टेट बैंक"
        ],
        correctAnswer: 1,
        explanation: "The Reserve Bank of India (RBI) has sole authority to control currency supply and govern monetary policies. / भारतीय रिजर्व बैंक को मुद्रा आपूर्ति नियंत्रित करने और मौद्रिक नीतियों को संचालित करने का एकमात्र अधिकार है।",
        category: "Banking GK"
      },
      {
        id: "bank-2",
        text: "What is the full form of 'NPA' in banking terms? / बैंकिंग भाषा में 'NPA' का पूर्ण रूप क्या होता है?",
        options: [
          "Net Profit Allocation / शुद्ध लाभ आवंटन",
          "National Payment Authority / राष्ट्रीय भुगतान प्राधिकरण",
          "Non-Performing Asset / गैर-निष्पादित परिसंपत्ति",
          "Normal Pension Account / सामान्य पेंशन खाता"
        ],
        correctAnswer: 2,
        explanation: "An asset becomes non-performing when it ceases to generate income for the bank, typically past due for 90 days. / एक परिसंपत्ति गैर-निष्पादित हो जाती है जब वह बैंक के लिए आय उत्पन्न करना बंद कर देती है, आमतौर पर 90 दिनों से अधिक बकाया होने पर।",
        category: "Banking Economics"
      }
    ]
  },
  {
    id: "civil-upsc-pcs",
    title: "UPSC & State PCS General Studies Paper-I Simulator / लोक सेवा आयोग प्रारंभिक परीक्षा सामान्य अध्ययन",
    category: "UPSC Civil Services",
    difficulty: "Hard",
    iconName: "BookOpen",
    timeLimit: 360,
    questions: [
      {
        id: "civils-1",
        text: "The conceptual plan of Fundamental Rights in the Indian Constitution was inspired by which nation? / भारतीय संविधान में मौलिक अधिकारों की अवधारणा किस देश से प्रेरित होकर ली गई थी?",
        options: [
          "United States of America (USA) / संयुक्त राज्य अमेरिका (यूएसए)",
          "United Kingdom / यूनाइटेड किंगडम (ब्रिटेन)",
          "Republic of Ireland / आयरलैंड",
          "Soviet Union (USSR) / सोवियत संघ"
        ],
        correctAnswer: 0,
        explanation: "The Bill of Rights of the United States Constitution inspired the Drafting Committee to implement Part III Fundamental Rights. / संयुक्त राज्य अमेरिका के 'बिल ऑफ राइट्स' ने मसौदा समिति को भाग III में मौलिक अधिकारों को शामिल करने हेतु प्रेरित किया।",
        category: "Civils Polity"
      },
      {
        id: "civils-2",
        text: "Who established the servant-centric 'Brahmo Samaj' in 1828? / 1828 में जन-कल्याणकारी 'ब्रह्म समाज' की स्थापना किसने की थी?",
        options: [
          "Raja Ram Mohan Roy / राजा राम मोहन राय",
          "Swami Dayanand Saraswati / स्वामी दयानंद सरस्वती",
          "Swami Vivekananda / स्वामी विवेकानंद",
          "Keshab Chandra Sen / केशव चंद्र सेन"
        ],
        correctAnswer: 0,
        explanation: "Raja Ram Mohan Roy founded Brahmo Samaj in Calcutta in 1828 to fight social evils like Sati. / राजा राम मोहन राय ने सती प्रथा जैसी सामाजिक बुराइयों के खिलाफ लड़ने के लिए 1828 में कलकत्ता में ब्रह्म समाज की स्थापना की।",
        category: "Civils History"
      }
    ]
  },
  {
    id: "bihar-police-gk",
    title: "Bihar Police & Sub-Inspector general merit quiz / बिहार पुलिस कांस्टेबल एवं सब-इंस्पेक्टर लिखित परीक्षा",
    category: "State Police Exams",
    difficulty: "Medium",
    iconName: "Shield",
    timeLimit: 200,
    questions: [
      {
        id: "bihar-p-1",
        text: "Which of the following rivers is traditionally referred to as the 'Sorrow of Bihar'? / निम्नलिखित में से किस नदी को पारंपरिक रूप से 'बिहार का शोक' कहा जाता है?",
        options: [
          "Gandak / गंडक नदी",
          "Bagmati / बागमती नदी",
          "Kosi River / कोसी नदी",
          "Son River / सोन नदी"
        ],
        correctAnswer: 2,
        explanation: "Kosi is known as Sorrow of Bihar because its frequent course changes cause extreme seasonal floods. / कोसी नदी को इसका मार्ग बदलने और विनाशकारी बाढ़ लाने के कारण बिहार का शोक कहा जाता है।",
        category: "Bihar Geography"
      }
    ]
  }
];

export const MOCK_JOBS: JobPost[] = [
  {
    id: "job-army-1",
    title: "Indian Army Agniveer General Duty (GD) Recruitment 2026",
    category: "Agniveer",
    eligibility: "Male & Female citizens residing in India.",
    ageLimit: "17.5 to 21 Years (Born between 01 Oct 2005 to 01 April 2009)",
    qualification: "Class 10th/Matric pass with 45% marks in aggregate and 33% in each subject.",
    salary: "₹30,000 to ₹40,000/month (with Seva Nidhi Package worth ₹11.71 Lakhs after completion)",
    selectionProcess: "Phase I: Common Entrance Exam (CEE) Online, Phase II: Physical Fitness Test (PFT), Physical Measurement Test (PMT), Medical Examination.",
    importantDates: {
      start: "2026-06-01",
      end: "2026-06-30",
      exam: "2026-08-15"
    },
    applyLink: "https://joinindianarmy.nic.in"
  },
  {
    id: "job-nda-1",
    title: "UPSC NDA & NA Exam II 2026 Notification",
    category: "UPSC",
    eligibility: "Unmarried male & female candidates who have completed or appearing in 10+2.",
    ageLimit: "16.5 to 19.5 Years",
    qualification: "12th Class Pass of 10+2 pattern of School Education or equivalent with Physics and Mathematics (for Air Force & Navy Wing).",
    salary: "₹56,100 to ₹2,50,000 /month (Sub-Lieutenant/Lieutenant Starting pay matrix scale 10)",
    selectionProcess: "UPSC Written Examination (900 Marks) followed by Service Selection Board (SSB) Interview tests (900 Marks).",
    importantDates: {
      start: "2026-05-15",
      end: "2026-06-10",
      exam: "2026-09-06"
    },
    applyLink: "https://upsc.gov.in"
  },
  {
    id: "job-ssc-gd-1",
    title: "SSC GD Constable Recruitment 2026 (CISF, BSF, CRPF, ITBP)",
    category: "SSC",
    eligibility: "Indian nationality with respective physical and medical measurements.",
    ageLimit: "18 to 23 Years (Relaxation as per government norms for OBC/SC/ST)",
    qualification: "Matriculation (10th Class) pass from a recognized Board/University.",
    salary: "₹21,700 - ₹69,100 (Pay Level 3)",
    selectionProcess: "Computer-Based Examination (CBE), Physical Efficiency Test (PET), Physical Standard Test (PST) and Detailed Medical Exam.",
    importantDates: {
      start: "2026-06-10",
      end: "2026-07-15",
      exam: "2026-11-20"
    },
    applyLink: "https://ssc.gov.in"
  },
  {
    id: "job-rail-1",
    title: "RRB Assistant Loco Pilot (ALP) Vacancies 2026",
    category: "Railway",
    eligibility: "Indian Nationals with active ITI or diploma courses.",
    ageLimit: "18 to 30 Years",
    qualification: "Matriculation/SSLC plus ITI/Course Completed Act Apprentices OR 3 Years Diploma in Mechanical/Electrical/Electronics/Automobile Engineering.",
    salary: "₹19,900/month basic (Starting Scale, Level 2 plus DA & allowances)",
    selectionProcess: "CBT Stage I, CBT Stage II, Computer-Based Aptitude Test (CBAT), Document Verification and Medical Fitness.",
    importantDates: {
      start: "2026-04-10",
      end: "2026-05-30",
      exam: "2026-07-25"
    },
    applyLink: "https://indianrailways.gov.in"
  }
];

export const MOCK_NOTES: StudyNote[] = [
  {
    id: "note-army-1",
    category: "Indian Army Notes",
    title: "Regiments and Battle Cries of the Indian Army",
    author: "Col. R.S. Rathore (Retd.)",
    date: "2026-06-10",
    content: `The Indian Army operates with historical regiments carrying distinct traditions, honors, and localized war cries reflecting their pride:

1. **Gorkha Rifles**: Battle Cry is "Jai Mahakali, Ayo Gorkhali!" (Victory to Goddess Kali, the Gorkhas are here!). Famous for using the 'Khukuri' knife.
2. **Rajputana Rifles**: Battle Cry is "Raja Ramchandra Ki Jai!" (Victory to King Ramchandra). It is the oldest rifle regiment of the Indian Army.
3. **Sikh Regiment**: Battle Cry is "Jo Bole So Nihal, Sat Sri Akal!" (Blessed is the person who says God is the Ultimate Truth). One of the most decorated regiments.
4. **Madras Regiment**: Battle Cry is "Veer Madrasi, Adi Kollu, Adi Kollu!" (Brave Madrasi, Strike and Kill!). The oldest infantry regiment of India.
5. **Garhwal Rifles**: Battle Cry is "Badri Vishal Lal Ki Jai!" (Victory to Lord Badri Nath). Known for their unmatched determination in high altitude zones.`
  },
  {
    id: "note-current-affairs",
    category: "Current Affairs Notes",
    title: "India's Indigenous Defense Acquisitions 2026",
    author: "Defense Analyst S. Dixit",
    date: "2026-06-16",
    content: `India is making major strides in the 'Aatmanirbhar Bharat' (Self-Reliant India) drive within military forces. Key updates:

- **Tejas Mark-1A Fighter Jet**: Indigenuous combat planes built by HAL equipped with indigenously designed Active Electronically Scanned Array (AESA) radar and advanced EW suites.
- **Arjun Mk-1A Main Battle Tank**: Upgraded with 72 new features including computerized fire control system and superior explosive reactive protection (ERA) armor.
- **Prithvi and Agni Missiles**: Successfully tested modern series updates incorporating canisterized tactical launcher systems for rapid mobile deployment.
- **Project 17A Frigates**: Stealth guided-missile warships launched recently by Indian shipyards MDL and GRSE, designed completely using native resources.`
  },
  {
    id: "note-polity-1",
    category: "Polity Notes",
    title: "Fundamental Duties of Indian Citizens (Part IV-A)",
    author: "Prof. Animesh Sen",
    date: "2026-05-28",
    content: `Fundamental Duties were incorporated in the Indian Constitution under Article 51A in Part IV-A by the 42nd Amendment Act in 1976. They were recommended by the Swaran Singh Committee.

Key Fundamental Duties encompass:
1. To abide by the Constitution and respect its ideals, institutions, the National Flag, and National Anthem.
2. To cherish and follow the noble ideals that inspired the national struggle for independence.
3. To uphold and protect the sovereignty, unity, and integrity of India.
4. To defend the nation and render national service when called upon.
5. To promote harmony and the spirit of common brotherhood among all people.
6. To value and preserve the rich heritage of the country's composite culture.
7. To protect natural ecosystems (forests, lakes, wildlife) and cultivate compassion for living creatures.`
  },
  {
    id: "note-ssc-reasoning",
    category: "SSC Exam Notes",
    title: "SSC CGL & GD General Intelligence & Logical Reasoning Quick Guide",
    author: "Shyam Verma (Reasoning Head)",
    date: "2026-06-17",
    content: `This structured PDF notes covers the essential concepts and shortcuts of Logical Reasoning for SSC exams:

1. **Analogy & Classification**:
   - Compare relationship properties (eg: Country-Capital, State-Governor, Tool-User).
   - Find the odd one out from given pairs.

2. **Coding-Decoding**:
   - Letter-to-Letter, Letter-to-Number, and Matrix models.
   - Master the forward and backward index of alphabets (e.g., A=1, Z=26, and opposites like A-Z, B-Y, C-X). Shortcut: EJOTY (5, 10, 15, 20, 25).

3. **Blood Relations**:
   - Construct a generation tree: Represent males with '+', females with '-', same generation as horizontal bond, and married partners with double horizontal lines.

4. **Syllogisms**:
   - Use Venn Diagrams to draw standard regions: 'All A are B' (concentric), 'Some A are B' (overlapping), and 'No A are B' (separated).`
  },
  {
    id: "note-railway-science",
    category: "Railway Exam Notes",
    title: "Railway RRB NTPC General Science & Physics Formulas Revision Guide",
    author: "Dr. K. Raghavan",
    date: "2026-06-16",
    content: `Important general science notes and physical law equations frequently appearing in RRB NTPC & Group D exams:

1. **Newton's Laws of Motion**:
   - 1st Law: Law of Inertia (defines inertia).
   - 2nd Law: F = dp/dt = ma (force equals rate of change of momentum).
   - 3rd Law: To every action, there is an equal and opposite reaction (rocket propulsion, firing bullet).

2. **Work, Power and Energy**:
   - Work (W) = F * s * cos(θ)
   - Kinetic Energy (KE) = 1/2 * m * v²
   - Potential Energy (PE) = m * g * h
   - Power (P) = Work / Time = Force * Velocity (Unit: Watt, 1 Horsepower = 746 Watts).

3. **Sound and Waves**:
   - Frequency (ν) = 1 / T. Wave velocity (v) = ν * λ.
   - Audibility range of human ear: 20 Hz to 20,000 Hz. Below 20 Hz is Infrasonic; Above 20,000 Hz is Ultrasonic.`
  },
  {
    id: "note-uppolice-hindi",
    category: "UP Police & State Notes",
    title: "General Hindi Grammar (अलंकार, समास, संधि व कारक) for Police Exams",
    author: "Acharya Ramdev Shastri",
    date: "2026-06-15",
    content: `यह हिंदी व्याकरण गाइड उत्तर प्रदेश पुलिस कांस्टेबल, सब-इंस्पेक्टर और राजस्व लेखपाल मुख्य परीक्षा हेतु अत्यंत महत्वपूर्ण है:

1. **समास (Compound Words)**:
   - अव्ययीभाव: प्रथम पद प्रधान तथा अव्यय (यथाशक्ति, आजन्म)।
   - तत्पुरुष: उत्तर पद प्रधान, विभक्तियों का लोप (राजपुत्र, स्वर्गप्राप्त)।
   - कर्मधारय: विशेषण-विशेष्य या उपमेय-उपमान का संबंध (नीलकमल, चंद्रमुख)।
   - बहुव्रीहि: दोनों पद अप्रधान, कोई तीसरा अर्थ निकले (लंबोदर - गणेश)।

2. **अलंकार (Ornaments of Language)**:
   - अनुप्रास: वर्णों की बार-बार आवृत्ति (चारु चंद्र की चंचल किरणें)।
   - यमक: एक ही शब्द दो बार आए और अर्थ भिन्न हों (कनक कनक ते सौ गुनी मादकता अधिकाय)।
   - रूपक: उपमेय और उपमान में भेद मिटा दिया जाए (चरन कमल बंदौ हरिराई)।

3. **संधि (Joints)**:
   - स्वर संधि (दीर्घ, गुण, वृद्धि, यण, अयादि), व्यंजन संधि और विसर्ग संधि।`
  },
  {
    id: "note-banking-eco",
    category: "Banking Exam Notes",
    title: "Banking Awareness: Monetary Policy Instruments & Reserve Rates Guide",
    author: "Siddharth Senapati (CFA)",
    date: "2026-06-14",
    content: `Comprehensive guide on central banking systems, Indian economy, and monetary tools used by the Reserve Bank of India (RBI) for IBPS/SBI PO:

1. **Policy Rates**:
   - Repo Rate: The rate at which the central bank lends money to commercial banks in the event of any shortfall of funds.
   - Reverse Repo Rate: The rate at which the RBI borrows funds from commercial banks.
   - Bank Rate: Long term lending rate without collateral.

2. **Reserve Ratios**:
   - CRR (Cash Reserve Ratio): Share of Net Demand and Time Liabilities (NDTL) that commercial banks must maintain in liquid cash form with the RBI.
   - SLR (Statutory Liquidity Ratio): Share of NDTL that banks must maintain in gold, cash, or government-approved securities before lending.`
  },
  {
    id: "note-upsc-history",
    category: "UPSC Civil Services",
    title: "UPSC Modern Indian History - Indian National Movement (1885-1947)",
    author: "Maj. Gen. Alok Sen (Retd.)",
    date: "2026-06-12",
    content: `Important timeline and key milestones of the Indian Independence Struggle for IAS / Civil Services preliminary evaluations:

1. **Establishment of Indian National Congress (1885)**:
   - Founded by A.O. Hume in Bombay. First President was W.C. Bonnerjee with 72 delegates.

2. **Partition of Bengal & Swadeshi Movement (1905)**:
   - Decided by Lord Curzon. Sparked anti-partition movements across Bengal and promoted Swadeshi goods.

3. **Gandhian Era Milestones**:
   - Champaran Satyagraha (1917): Gandhi's first civil disobedience in India against Indigo planters.
   - Non-Cooperation Movement (1920-1922): Launched after Jallianwala Bagh Massacre. Suspended due to Chauri Chaura incident.
   - Civil Disobedience Movement & Dandi March (1930): Broke salt taxes in Gujarat.
   - Quit India Movement (1942): 'Do or Die' (करो या मरो) slogan issued.`
  },
  {
    id: "note-bihar-gk",
    category: "Bihar Exams Notes",
    title: "Bihar General Knowledge: Historical & Geographical Fast-Track PDF",
    author: "Dr. Kameshwar Thakur",
    date: "2026-06-11",
    content: `बिहार लोक सेवा आयोग (BPSC), बिहार पुलिस और दरोगा भर्ती हेतु बिहार सामान्य ज्ञान का संक्षिप्त सारांश पत्र:

1. **ऐतिहासिक महत्व**:
   - मगध: प्राचीन भारत का सबसे शक्तिशाली साम्राज्य।
   - बौद्ध व जैन धर्म: भगवान बुद्ध को बोधगया में ज्ञान प्राप्त हुआ और भगवान महावीर का जन्म वैशाली में हुआ।
   - नालंदा विश्वविद्यालय: प्राचीन विश्व का प्रसिद्ध ज्ञान केंद्र।

2. **भौगोलिक संरचना**:
   - बिहार गंगा नदी के मैदानी भाग में स्थित है। गंगा नदी बिहार को लगभग दो बराबर भागों (उत्तर बिहार और दक्षिण बिहार) में विभाजित करती है।
   - प्रमुख नदियाँ: गंगा, गंडक, सोन, बागमती, कोसी (बिहार का शोक) और पुनपुन।`
  }
];

export const MOCK_PDFS: PdfDoc[] = [
  {
    id: "pdf-army-gd-paper",
    title: "Indian Army Agniveer GD 2026 - Official Model Mock Paper",
    category: "Agniveer Notes",
    type: "Previous Paper",
    publishDate: "2026-06-12",
    downloadCount: 4210,
    size: "1.4 MB",
    contentSnippet: "SECTION A: General Knowledge (15 Questions, 30 Marks)\nSECTION B: General Science (15 Questions, 30 Marks)\nSECTION C: Mathematics (15 Questions, 30 Marks)\nSECTION D: Logical Reasoning (5 Questions, 10 Marks)\nContains complete solutions and explanations to help Agniveer aspirants."
  },
  {
    id: "pdf-current-affairs-june",
    title: "June 2026 GK & Current Affairs Capsule (AgniPariksha Edition)",
    category: "Current Affairs Notes",
    type: "Notes",
    publishDate: "2026-06-15",
    downloadCount: 7850,
    size: "3.2 MB",
    contentSnippet: "Important monthly bulletins of international relations, sports meets, national defense agreements, awards, science updates, and government scheme changes for June 2026."
  },
  {
    id: "pdf-nda-syllabus",
    title: "UPSC NDA & NA Exam - Complete Revised Syllabus & Exam Pattern",
    category: "NDA Notes",
    type: "Syllabus",
    publishDate: "2026-05-20",
    downloadCount: 3125,
    size: "0.8 MB",
    contentSnippet: "Comprehensive coverage of NDA Mathematics syllabus (Algebra, Matrices, Trigonometry, Calculus) and General Ability Test (GAT) parts A & B (English, Physics, Chemistry, History, Geography)."
  },
  {
    id: "pdf-army-gd-syllabus",
    title: "Indian Army Agniveer GD (General Duty) Official Syllabus & Blueprints",
    category: "Agniveer Notes",
    type: "Syllabus",
    publishDate: "2026-06-10",
    downloadCount: 9540,
    size: "1.1 MB",
    contentSnippet: "Revised Agniveer GD exam layout. Section A: General Knowledge (15 questions - Soil, Rivers, Mountains, Awards, Terminology, Sports). Section B: General Science (15 questions - Physics, Chemistry, Biology at Class 10/Matric standard). Section C: Mathematics (15 questions - Ratio, Proportion, Percentage, Interest, Algebra, Trigonometry). Section D: Simple Logical Reasoning (5 questions)."
  },
  {
    id: "pdf-army-clerk-syllabus",
    title: "Indian Army Agniveer Clerk & Store Keeper Technical (SKT) Official Syllabus",
    category: "Agniveer Notes",
    type: "Syllabus",
    publishDate: "2026-06-11",
    downloadCount: 7420,
    size: "1.3 MB",
    contentSnippet: "Official notification with syllabus for Clerk/SKT exam. Consists of Part 1 (GK, General Science, Mathematics, Computer Science) and Part 2 (General English covering Parts of Speech, Common Errors, Idioms & Phrases, Comprehension passages). Total 50 Questions, Passing Score: 80 Marks."
  },
  {
    id: "pdf-navy-ssr-syllabus",
    title: "Indian Navy Agniveer SSR (Senior Secondary Recruit) Comprehensive Syllabus",
    category: "Navy Notes",
    type: "Syllabus",
    publishDate: "2026-06-05",
    downloadCount: 8890,
    size: "1.5 MB",
    contentSnippet: "Syllabus for Navik SSR exam. Section A (Science: Kinematics, Energy, Fluids, Thermodynamics, Electricity, Optics). Section B (Mathematics: Relations, Complex Numbers, Calculus, Vectors, 3D Geometry, Statistics). Section C (English: Active/Passive Voice, Direct/Indirect, Prepositions, Cloze Test). Section D (General GK: History, National Ports, Heritage, Culture, Civics)."
  },
  {
    id: "pdf-navy-mr-syllabus",
    title: "Indian Navy Agniveer MR (Matric Recruit) Exam Syllabus & Sectional Layout",
    category: "Navy Notes",
    type: "Syllabus",
    publishDate: "2026-06-06",
    downloadCount: 5120,
    size: "0.9 MB",
    contentSnippet: "Official Matric Recruit (MR) syllabus details for Chef, Steward, and Hygienist. Divided into Science & Mathematics (Class 10 level Algebra, Geometry, Basic Physics, Heat, Energy) and General Awareness (Indian Geography, Freedom Movement, Important Days, Sports, Abbreviations, Personalities)."
  },
  {
    id: "pdf-iaf-science-syllabus",
    title: "Indian Air Force Agniveer Vayu (Science Subjects) Complete PDF Scheme",
    category: "Airforce Notes",
    type: "Syllabus",
    publishDate: "2026-06-14",
    downloadCount: 9110,
    size: "1.7 MB",
    contentSnippet: "Detailed curriculum for Airforce Vayu Technical. Section 1 (English Class 12 standard, reading passages, synonyms/antonyms). Section 2 (Physics: Dynamics, Laws of Motion, Solids, Gravitation, Waves, Optics, modern physics parameters). Section 3 (Mathematics: Class 11th and 12th coordinate geometry, limits, continuity, statistics)."
  },
  {
    id: "pdf-iaf-nonscience-syllabus",
    title: "Indian Air Force Agniveer Vayu (Other Than Science / RAGA) Official Syllabus",
    category: "Airforce Notes",
    type: "Syllabus",
    publishDate: "2026-06-15",
    downloadCount: 8430,
    size: "1.2 MB",
    contentSnippet: "Official exam layout for IAF Vayu Non-Science. English curriculum combined with the extensive Reasoning & General Awareness (RAGA) block. RAGA covers: Verbal & Non-Verbal Reasoning, Numerical Ability (ratios, LCM, average, profit/loss), and General Knowledge (Defense, Constitution, Current Affairs as of 2026)."
  },
  {
    id: "pdf-icg-navik-syllabus",
    title: "Indian Coast Guard Navik (GD/DB) and Yantrik Official Recruitment Syllabus",
    category: "Coast Guard Notes",
    type: "Syllabus",
    publishDate: "2026-06-01",
    downloadCount: 6510,
    size: "1.8 MB",
    contentSnippet: "Official criteria for coast guard induction. Section I (Class 10 standard Maths, Science, English, GK, Reasoning for DB and GD). Section II (GD branch unique Mathematics & Physics of Class 12 CBSE level). Section III/IV/V (Yantrik Diploma Electrical, Mechanical, and Electronics core engineering papers syllabus)."
  },
  {
    id: "pdf-cds-upsc-syllabus",
    title: "UPSC Combined Defence Services (CDS) Exam - Detailed Syllabus & Pattern",
    category: "CDS Notes",
    type: "Syllabus",
    publishDate: "2026-05-18",
    downloadCount: 4120,
    size: "2.1 MB",
    contentSnippet: "Unified defense officer exam checklist. General English (Reading Comprehension, Spotting Errors, Ordering of Sentences). General Knowledge (Defensive arrangements, space technologies, geo-politics, Indian Independence, bio-diversity zones). Elementary Mathematics (Number system, unitary method, trigonometry, log, mensuration)."
  }
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "How to Crack Agniveer Written Exam in 60 Days: Complete Routine",
    excerpt: "Learn the secrets of planning, subject categorization, high-volume review habits, and physical preparation balance to secure your Agniveer selection.",
    category: "Exam Strategies",
    author: "Subedar Major Jaswant Singh (Retd.)",
    date: "2026-06-14",
    readTime: "5 min read",
    content: `The Agniveer written examination calls for an intelligent blend of consistency, basic concepts, and rapid-fire mock workouts.

Here are 5 core strategies compiled directly from top army training command recruiters:

1. **Strengthen Static GK & National Symbols**: Ensure you can comfortably recognize rankings, command headquarters, national treaties, battle battlefields of pre-indepedence India, and current defense ministers.
2. **Master Standard Class 10th General Science**: Questions in Army Agniveer GD heavily lean on fundamental physics, chemical formulas, and anatomy basics. Keep a concise journal of key constant terms.
3. **Daily Timer-Based Mathematics Drills**: Work on 20-30 basic algebra, percentages, ratio, simple/compound interest, and speed-time calculations daily under dynamic pressure.
4. **Regular Bookmarking and Revision**: Use AgniPariksha's question bookmark system to store problematic mock questions and review them weekly so you do not repeat errors.
5. **Physical-Written Coordination**: Do not completely ignore physical fitness. Maintain light, active cardiovascular endurance training in the morning while putting high-intensity exam study blocks during afternoon hours.`
  },
  {
    id: "blog-2",
    title: "Why Self-Reliant India (Aatmanirbharta) is Changing Defense GK Boards",
    excerpt: "Military test boards are shifting weight towards indigenous technology like Tejas, INS Vikrant, Vikrant-class, and modern missile development notes.",
    category: "GK Articles",
    author: "Shaurya Chakra Awardee Major Amit Kaul",
    date: "2026-06-08",
    readTime: "7 min read",
    content: "If you are appearing for UPSC NDA, CDS, or SSB interviews, a notable shift is current boards specifically examining your understanding of native engineering initiatives. Aspirants must be conversant with DRDO developments, private sector integrations in weapon systems, and key indigenization lists published by the Ministry of Defence."
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Aarav Sharma", score: 4520, quizzesCompleted: 48, badge: "Param Vir Champion" },
  { rank: 2, name: "Manpreet Singh", score: 4310, quizzesCompleted: 42, badge: "Agni Captain" },
  { rank: 3, name: "Prerna Yadav", score: 4120, quizzesCompleted: 39, badge: "Maha Vir Scholar" },
  { rank: 4, name: "Abhishek Mishra", score: 3950, quizzesCompleted: 45, badge: "Veer Guard" },
  { rank: 5, name: "Anjali Deshmukh", score: 3820, quizzesCompleted: 35, badge: "Veer Guard" },
  { rank: 6, name: "Rahul Nair", score: 3650, quizzesCompleted: 30, badge: "Agniveer Star" },
  { rank: 7, name: "Suresh Bisht", score: 3510, quizzesCompleted: 31, badge: "Agniveer Star" }
];

export const ARMY_PREV_QUESTIONS = [
  {
    englishQ: "Who was the first Indian Commander-in-Chief (C-in-C) of the Indian Army?",
    hindiQ: "भारतीय सेना के पहले भारतीय कमांडर-इन-चीफ (C-in-C) कौन थे?",
    options: [
      { key: "A", text: "Field Marshal Sam Manekshaw / फील्ड मार्शल सैम मानेकशॉ" },
      { key: "B", text: "General K. M. Cariappa / जनरल के. एम. करियप्पा", isCorrect: true },
      { key: "C", text: "General Pran Nath Thapar / जनरल प्राण नाथ थापर" },
      { key: "D", text: "Field Marshal K. M. Cariappa / फील्ड मार्शल के. एम. करियप्पा" }
    ],
    explanationEng: "General K. M. Cariappa took over as the first Commander-in-Chief of the Indian Army on January 15, 1949, celebrated today as Army Day.",
    explanationHin: "जनरल के. एम. करियप्पा ने 15 जनवरी 1949 को भारतीय सेना के पहले भारतीय कमांडर-इन-चीफ का पदभार संभाला था, जिसे आज सेना दिवस के रूप में मनाया जाता है।"
  },
  {
    englishQ: "Which is the deepest ocean in the world?",
    hindiQ: "विश्व का सबसे गहरा महासागर कौन सा है?",
    options: [
      { key: "A", text: "Pacific Ocean / प्रशांत महासागर", isCorrect: true },
      { key: "B", text: "Atlantic Ocean / अटलांटिक महासागर" },
      { key: "C", text: "Indian Ocean / हिंद महासागर" },
      { key: "D", text: "Arctic Ocean / आर्किटिक महासागर" }
    ],
    explanationEng: "The Pacific Ocean is the largest and deepest of Earth's oceanic divisions, containing the Mariana Trench.",
    explanationHin: "प्रशांत महासागर पृथ्वी का सबसे बड़ा और गहरा महासागर है, जिसमें मारियाना ट्रेंच (गर्त) स्थित है।"
  },
  {
    englishQ: "The first Battle of Panipat was fought between whom?",
    hindiQ: "पानीपत की पहली लड़ाई किसके बीच लड़ी गई थी?",
    options: [
      { key: "A", text: "Babur and Ibrahim Lodi / बाबर और इब्राहिम लोदी", isCorrect: true },
      { key: "B", text: "Akbar and Hemu / अकबर और हेमू" },
      { key: "C", text: "Humayun and Sher Shah Suri / हुमायूं और शेरशाह सूरी" },
      { key: "D", text: "Marathas and Ahmad Shah Abdali / मराठा और अहमद शाह अब्दाली" }
    ],
    explanationEng: "The First Battle of Panipat was fought on 21 April 1526 between Babur and the Lodi dynasty, marking the beginning of the Mughal Empire.",
    explanationHin: "पानीपत की पहली लड़ाई 21 अप्रैल 1526 को बाबर और लोदी राजवंश के बीच लड़ी गई थी, जिसने मुगल साम्राज्य की शुरुआत की थी।"
  },
  {
    englishQ: "Which vitamin is obtained from Sunlight?",
    hindiQ: "सूर्य की रोशनी से कौन सा विटामिन प्राप्त होता है?",
    options: [
      { key: "A", text: "Vitamin A / विटामिन A" },
      { key: "B", text: "Vitamin B / विटामिन B" },
      { key: "C", text: "Vitamin C / विटामिन C" },
      { key: "D", text: "Vitamin D / विटामिन D", isCorrect: true }
    ],
    explanationEng: "Sunlight triggers the synthesis of Vitamin D in human skin.",
    explanationHin: "सूर्य का प्रकाश मानव त्वचा में विटामिन D के संश्लेषण को सक्रिय करता है।"
  },
  {
    englishQ: "Who is the Supreme Commander of the Indian Armed Forces?",
    hindiQ: "भारतीय सशस्त्र बलों के सर्वोच्च कमांडर कौन हैं?",
    options: [
      { key: "A", text: "Prime Minister / प्रधानमंत्री" },
      { key: "B", text: "Chief of Defence Staff / चीफ ऑफ डिफेंस स्टाफ" },
      { key: "C", text: "President of India / भारत के राष्ट्रपति", isCorrect: true },
      { key: "D", text: "Defence Minister / रक्षा मंत्री" }
    ],
    explanationEng: "Under Article 53 of the Constitution of India, the supreme command of the Defence Forces of the Union is vested in the President.",
    explanationHin: "भारत के संविधान के अनुच्छेद 53 के तहत, संघ के रक्षा बलों की सर्वोच्च कमान राष्ट्रपति में निहित होती है।"
  },
  {
    englishQ: "Which river is called the 'Sorrow of Bihar'?",
    hindiQ: "किस नदी को 'बिहार का शोक' कहा जाता है?",
    options: [
      { key: "A", text: "Kosi River / कोसी नदी", isCorrect: true },
      { key: "B", text: "Ganga River / गंगा नदी" },
      { key: "C", text: "Gandak River / गंडक नदी" },
      { key: "D", text: "Son River / सोन नदी" }
    ],
    explanationEng: "The Kosi River is known as the Sorrow of Bihar due to its frequent and devastating floods which damage agriculture and infrastructure.",
    explanationHin: "कोसी नदी को इसकी विनाशकारी बाढ़ के कारण बिहार का शोक कहा जाता है, जिससे कृषि और अवसंरचना को भारी नुकसान होता है।"
  },
  {
    englishQ: "Who was the first recipient of the Param Vir Chakra?",
    hindiQ: "परमवीर चक्र के पहले प्राप्तकर्ता कौन थे?",
    options: [
      { key: "A", text: "Major Somnath Sharma / मेजर सोमनाथ शर्मा", isCorrect: true },
      { key: "B", text: "Captain Vikram Batra / कैप्टन विक्रम बत्रा" },
      { key: "C", text: "Subedar Sanjay Kumar / सूबेदार संजय कुमार" },
      { key: "D", text: "Naik Jadunath Singh / नायक जदुनाथ सिंह" }
    ],
    explanationEng: "Major Somnath Sharma was posthumously awarded the Param Vir Chakra for his exceptional bravery during the 1947 Indo-Pak war in Budgam.",
    explanationHin: "मेजर सोमनाथ शर्मा को बडगाम में 1947 के भारत-पाक युद्ध के दौरान उनकी असाधारण बहादुरी के लिए मरणोपरांत परमवीर चक्र से सम्मानित किया गया था।"
  },
  {
    englishQ: "Where is the Indian Military Academy (IMA) situated?",
    hindiQ: "भारतीय सैन्य अकादमी (IMA) कहाँ स्थित है?",
    options: [
      { key: "A", text: "Pune / पुणे" },
      { key: "B", text: "Dehradun / देहरादून", isCorrect: true },
      { key: "C", text: "Chennai / चेन्नई" },
      { key: "D", text: "New Delhi / नई दिल्ली" }
    ],
    explanationEng: "The Indian Military Academy (IMA) was formed in Dehradun, Uttarakhand, in 1932 to train officer cadets.",
    explanationHin: "भारतीय सैन्य अकादमी (IMA) की स्थापना सैन्य अधिकारियों को प्रशिक्षित करने के लिए 1932 में देहरादून, उत्तराखंड में की गई थी।"
  },
  {
    englishQ: "'Satyameva Jayate' inscribed on our national emblem is taken from which Upanishad?",
    hindiQ: "हमारे राष्ट्रीय प्रतीक पर अंकित 'सत्यमेव जयते' किस उपनिषद से लिया गया है?",
    options: [
      { key: "A", text: "Mundaka Upanishad / मुंडकोपनिषद", isCorrect: true },
      { key: "B", text: "Katha Upanishad / कठोपनिषद" },
      { key: "C", text: "Chandogya Upanishad / छांदोग्य उपनिषद" },
      { key: "D", text: "Mandukya Upanishad / मांडूक्योपनिषद" }
    ],
    explanationEng: "'Satyameva Jayate' (Truth alone triumphs) is a mantra from the ancient Hindu scripture Mundaka Upanishad.",
    explanationHin: "'Satyameva Jayate' (केवल सत्य की ही विजय होती है) प्राचीन हिंदू उपनिषद मुंडकोपनिषद से लिया गया एक मंत्र है।"
  },
  {
    englishQ: "What is the official motto of the Indian Army?",
    hindiQ: "भारतीय सेना का आधिकारिक आदर्श वाक्य क्या है?",
    options: [
      { key: "A", text: "Touch the Sky with Glory / नभः स्पृशं दीप्तम्" },
      { key: "B", text: "Service Before Self / सेवा परमो धर्मः", isCorrect: true },
      { key: "C", text: "Shaano Varuna / शं नो वरुणः" },
      { key: "D", text: "Valour and Faith / शौर्य और निष्ठा" }
    ],
    explanationEng: "The motto is 'Service Before Self' (Seva Paramo Dharma), emphasizing altruistic military service.",
    explanationHin: "आधिकारिक ध्येय वाक्य 'सेवा परमो धर्मः' (Service Before Self) है, जो निस्वार्थ सैन्य सेवा को दर्शाता है।"
  }
];
