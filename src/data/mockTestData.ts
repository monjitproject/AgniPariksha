export interface MockQuestion {
  id: string;
  text: string;
  hindiText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface MockTestPaper {
  id: string;
  title: string;
  subtitle: string;
  examTag: string;
  durationMinutes: number;
  totalMarks: number;
  negativeMarking: number;
  questions: MockQuestion[];
}

export const MOCK_TEST_PAPERS: MockTestPaper[] = [
  {
    id: "agniveer-army-gd-1",
    title: "Agniveer Army GD - All India Live Mock Exam Paper",
    subtitle: "Complete General Duty (GD) syllabus aligned with Indian Army CEE pattern",
    examTag: "Indian Army GD / Tradesman",
    durationMinutes: 15,
    totalMarks: 30,
    negativeMarking: 0.5,
    questions: [
      {
        id: "agd-1",
        text: "What is the highest peacetime gallantry award in India?",
        hindiText: "भारत में शांति काल का सर्वोच्च वीरता पुरस्कार कौन सा है?",
        options: [
          "Param Vir Chakra / परमवीर चक्र",
          "Ashoka Chakra / अशोक चक्र",
          "Kirti Chakra / कीर्ति चक्र",
          "Vir Chakra / वीर चक्र"
        ],
        correctAnswer: 1,
        explanation: "The Ashoka Chakra is India's highest peacetime military decoration awarded for valor, courageous action or self-sacrifice away from the battlefield. / अशोक चक्र शौर्य, साहसी कार्रवाई या युद्ध के मैदान से दूर आत्म-बलिदान के लिए दिया जाने वाला भारत का शांति काल का सर्वोच्च सैन्य सम्मान है।",
        category: "Defence Knowledge"
      },
      {
        id: "agd-2",
        text: "Which of the following is the oldest paramilitary force in India?",
        hindiText: "निम्नलिखित में से भारत का सबसे पुराना अर्धसैनिक बल कौन सा है?",
        options: [
          "Border Security Force (BSF) / सीमा सुरक्षा बल",
          "Central Reserve Police Force (CRPF) / केन्द्रीय रिजर्व पुलिस बल",
          "Assam Rifles / असम राइफल्स",
          "Central Industrial Security Force (CISF) / केन्द्रीय औद्योगिक सुरक्षा बल"
        ],
        correctAnswer: 2,
        explanation: "Assam Rifles was formed in 1835 under the name 'Cachar Levy' and is India's oldest paramilitary force. / असम राइफल्स की स्थापना 1835 में 'कछार लेवी' के नाम से हुई थी और यह भारत का सबसे पुराना अर्धसैनिक बल है।",
        category: "Defence Knowledge"
      },
      {
        id: "agd-3",
        text: "Which is the highest mountain peak located entirely within India's borders?",
        hindiText: "पूरी तरह से भारतीय सीमाओं के भीतर स्थित सबसे ऊंची पर्वत चोटी कौन सी है?",
        options: [
          "Mount Everest / माउंट एवरेस्ट",
          "K2 (Godwin-Austen) / के2",
          "Kangchenjunga / कंचनजंगा",
          "Nanda Devi / नंदा देवी"
        ],
        correctAnswer: 2,
        explanation: "Kangchenjunga (8,586 m) in Sikkim is the highest peak in India and 3rd highest in the world. / कंचनजंगा (8,586 मीटर) सिक्किम में स्थित भारत की सबसे ऊंची और दुनिया की तीसरी सबसे ऊंची पर्वत चोटी है।",
        category: "Geography"
      },
      {
        id: "agd-4",
        text: "The First Battle of Panipat was fought in 1526 between Babur and whom?",
        hindiText: "पानीपत की पहली लड़ाई 1526 में बाबर और किसके बीच लड़ी गई थी?",
        options: [
          "Ibrahim Lodi / इब्राहिम लोदी",
          "Sher Shah Suri / शेर शाह सूरी",
          "Hemu (Hem Chandra) / हेमू",
          "Rana Sanga / राणा सांगा"
        ],
        correctAnswer: 0,
        explanation: "The First Battle of Panipat took place on 21 April 1526 between Babur and Ibrahim Lodi, establishing the Mughal Empire. / पानीपत की पहली लड़ाई 21 अप्रैल 1526 को बाबर और इब्राहिम लोदी के बीच हुई, जिससे भारत में मुगल साम्राज्य की स्थापना हुई।",
        category: "History"
      },
      {
        id: "agd-5",
        text: "In which medium does sound travel with the highest velocity?",
        hindiText: "दिए गए माध्यमों में से किसमें ध्वनि का वेग सर्वाधिक होता है?",
        options: [
          "Vacuum / निर्वात",
          "Air (Gas) / वायु",
          "Water (Liquid) / जल",
          "Steel (Solid) / स्टील (ठोस)"
        ],
        correctAnswer: 3,
        explanation: "Sound is a mechanical wave that requires a material medium and travels fastest in solids (such as steel ~5960 m/s) due to higher molecular density and elasticity. / ध्वनि एक यांत्रिक तरंग है जो ठोसों (जैसे स्टील में लगभग 5960 मी/से) में सबसे तीव्र गति से चलती है।",
        category: "General Science"
      },
      {
        id: "agd-6",
        text: "Which Article of the Indian Constitution outlines the process for constitutional amendments?",
        hindiText: "भारतीय संविधान का कौन सा अनुच्छेद संविधान संशोधन की प्रक्रिया को निर्धारित करता है?",
        options: [
          "Article 352 / अनुच्छेद 352",
          "Article 360 / अनुच्छेद 360",
          "Article 368 / अनुच्छेद 368",
          "Article 370 / अनुच्छेद 370"
        ],
        correctAnswer: 2,
        explanation: "Article 368 in Part XX of the Constitution of India grants constituent power to Parliament to amend the constitution. / भारतीय संविधान के भाग XX का अनुच्छेद 368 संसद को संविधान में संशोधन करने की शक्ति प्रदान करता है।",
        category: "Indian Polity"
      },
      {
        id: "agd-7",
        text: "Who was the founder of the Indian National Army (Azad Hind Fauj)?",
        hindiText: "आज़ाद हिन्द फ़ौज (INA) की स्थापना का मूल श्रेय किन्हें जाता है?",
        options: [
          "Subhas Chandra Bose / सुभाष चंद्र बोस",
          "Captain Mohan Singh / कैप्टन मोहन सिंह",
          "Rash Behari Bose / रास बिहारी बोस",
          "Bhagat Singh / भगत सिंह"
        ],
        correctAnswer: 1,
        explanation: "The Indian National Army was initially conceived and formed by Captain Mohan Singh in Singapore in 1942 with Japanese support, later reorganized by Netaji Subhas Chandra Bose. / आज़ाद हिन्द फ़ौज की प्रारंभिक स्थापना 1942 में कैप्टन मोहन सिंह द्वारा की गई थी, जिसे बाद में नेताजी सुभाष चंद्र बोस ने पुनर्गठित किया।",
        category: "History"
      },
      {
        id: "agd-8",
        text: "Which gas is primarily responsible for global warming and the greenhouse effect?",
        hindiText: "ग्रीनहाउस प्रभाव और ग्लोबल वार्मिंग के लिए मुख्य रूप से कौन सी गैस उत्तरदायी है?",
        options: [
          "Oxygen (O2) / ऑक्सीजन",
          "Nitrogen (N2) / नाइट्रोजन",
          "Carbon Dioxide (CO2) / कार्बन डाइऑक्साइड",
          "Argon (Ar) / आर्गन"
        ],
        correctAnswer: 2,
        explanation: "Carbon Dioxide (CO2) is the primary greenhouse gas emitted through human activities that traps heat in Earth's atmosphere. / कार्बन डाइऑक्साइड (CO2) प्रमुख ग्रीनहाउस गैस है जो वायुमंडल में ऊष्मा को रोककर वैश्विक तापमान बढ़ाती है।",
        category: "General Science"
      },
      {
        id: "agd-9",
        text: "Where is the Indian Military Academy (IMA) situated?",
        hindiText: "भारतीय सैन्य अकादमी (IMA) कहाँ स्थित है?",
        options: [
          "Khadakwasla, Pune / खड़कवासला, पुणे",
          "Dehradun, Uttarakhand / देहरादून, उत्तराखंड",
          "Gaya, Bihar / गया, बिहार",
          "Mhow, Madhya Pradesh / महू, मध्य प्रदेश"
        ],
        correctAnswer: 1,
        explanation: "The Indian Military Academy (IMA) was established in 1932 in Dehradun, Uttarakhand. / भारतीय सैन्य अकादमी (IMA) की स्थापना 1932 में देहरादून, उत्तराखंड में हुई थी।",
        category: "Defence Knowledge"
      },
      {
        id: "agd-10",
        text: "What is the minimum age requirement to become the President of India?",
        hindiText: "भारत का राष्ट्रपति बनने के लिए न्यूनतम आयु सीमा क्या है?",
        options: [
          "25 Years / 25 वर्ष",
          "30 Years / 30 वर्ष",
          "35 Years / 35 वर्ष",
          "40 Years / 40 वर्ष"
        ],
        correctAnswer: 2,
        explanation: "Under Article 58 of the Indian Constitution, a candidate must be a citizen of India and have completed the age of 35 years. / भारतीय संविधान के अनुच्छेद 58 के अनुसार राष्ट्रपति पद के उम्मीदवार की न्यूनतम आयु 35 वर्ष होनी चाहिए।",
        category: "Indian Polity"
      }
    ]
  },
  {
    id: "ssc-gd-constable-1",
    title: "SSC GD Constable - General Knowledge & Awareness Exam",
    subtitle: "Staff Selection Commission Constable GD full practice standard test paper",
    examTag: "SSC GD / CAPF / Delhi Police",
    durationMinutes: 15,
    totalMarks: 30,
    negativeMarking: 0.25,
    questions: [
      {
        id: "ssc-1",
        text: "Who is known as the 'Grand Old Man of India'?",
        hindiText: "'भारत के वयोवृद्ध पुरुष' (Grand Old Man of India) के रूप में किन्हें जाना जाता है?",
        options: [
          "Gopal Krishna Gokhale / गोपाल कृष्ण गोखले",
          "Dadabhai Naoroji / दादाभाई नौरोजी",
          "Bal Gangadhar Tilak / बाल गंगाधर तिलक",
          "Lala Lajpat Rai / लाला लाजपत राय"
        ],
        correctAnswer: 1,
        explanation: "Dadabhai Naoroji was known as the Grand Old Man of India. He authored 'Poverty and Un-British Rule in India' and formulated the Drain of Wealth theory. / दादाभाई नौरोजी को भारत का वयोवृद्ध पुरुष कहा जाता है। उन्होंने 'धन की निकासी' का सिद्धांत प्रस्तुत किया था।",
        category: "History"
      },
      {
        id: "ssc-2",
        text: "Which chemical compound is commonly known as 'Baking Soda'?",
        hindiText: "किस रासायनिक यौगिक को सामान्यतः 'बेकिंग सोडा' (मीठा सोडा) कहा जाता है?",
        options: [
          "Sodium Carbonate (Na2CO3) / सोडियम कार्बोनेट",
          "Sodium Hydrogen Carbonate (NaHCO3) / सोडियम बाइकार्बोनेट",
          "Calcium Oxychloride (CaOCl2) / ब्लीचिंग पाउडर",
          "Sodium Hydroxide (NaOH) / कास्टिक सोडा"
        ],
        correctAnswer: 1,
        explanation: "Sodium Bicarbonate (NaHCO3) is commonly known as baking soda. / सोडियम बाइकार्बोनेट (NaHCO3) को सामान्यतः खाने का या बेकिंग सोडा कहा जाता है।",
        category: "General Science"
      },
      {
        id: "ssc-3",
        text: "Which state of India has the longest coastline?",
        hindiText: "भारत के किस राज्य की तटरेखा (समुद्री सीमा) सबसे लंबी है?",
        options: [
          "Maharashtra / महाराष्ट्र",
          "Tamil Nadu / तमिलनाडु",
          "Gujarat / गुजरात",
          "Andhra Pradesh / आंध्र प्रदेश"
        ],
        correctAnswer: 2,
        explanation: "Gujarat has the longest mainland coastline in India (~1,600 km), followed by Andhra Pradesh. / गुजरात की तटरेखा भारत में सबसे लंबी (~1,600 किमी) है।",
        category: "Geography"
      },
      {
        id: "ssc-4",
        text: "Which fundamental right is called the 'Heart and Soul of the Indian Constitution' by Dr. B.R. Ambedkar?",
        hindiText: "डॉ. बी.आर. अम्बेडकर ने किस मौलिक अधिकार को 'संविधान का हृदय और आत्मा' कहा था?",
        options: [
          "Right to Equality (Article 14) / समानता का अधिकार",
          "Right to Freedom of Speech (Article 19) / विचार एवं अभिव्यक्ति की स्वतंत्रता",
          "Right to Constitutional Remedies (Article 32) / संवैधानिक उपचारों का अधिकार",
          "Right to Freedom of Religion (Article 25) / धार्मिक स्वतंत्रता का अधिकार"
        ],
        correctAnswer: 2,
        explanation: "Dr. B.R. Ambedkar termed Article 32 (Right to Constitutional Remedies) as the heart and soul of the Constitution because it empowers citizens to approach the Supreme Court directly for enforcement of fundamental rights. / डॉ. अम्बेडकर ने अनुच्छेद 32 को संविधान की आत्मा कहा क्योंकि यह मौलिक अधिकारों के संरक्षण की गारंटी देता है।",
        category: "Indian Polity"
      },
      {
        id: "ssc-5",
        text: "Kaziranga National Park in Assam is famous for which endangered animal?",
        hindiText: "असम का काजीरंगा राष्ट्रीय उद्यान किस संकटग्रस्त प्राणी के संरक्षण के लिए विश्व प्रसिद्ध है?",
        options: [
          "Royal Bengal Tiger / रॉयल बंगाल टाइगर",
          "One-horned Rhinoceros / एक सींग वाला गैंडा",
          "Snow Leopard / हिम तेंदुआ",
          "Asiatic Lion / एशियाई शेर"
        ],
        correctAnswer: 1,
        explanation: "Kaziranga National Park is a UNESCO World Heritage site and home to the world's largest population of great one-horned rhinoceroses. / काजीरंगा राष्ट्रीय उद्यान एक सींग वाले गैंडे की सर्वाधिक आबादी के लिए विश्व विख्यात है।",
        category: "Environment & Geography"
      },
      {
        id: "ssc-6",
        text: "Which organ in the human body produces bile juice?",
        hindiText: "मानव शरीर में पित्त रस (Bile Juice) का निर्माण किस अंग द्वारा होता है?",
        options: [
          "Gallbladder / पित्ताशय",
          "Pancreas / अग्न्याशय",
          "Liver / यकृत",
          "Stomach / आमाशय"
        ],
        correctAnswer: 2,
        explanation: "Bile is continuously produced by the liver and stored in the gallbladder until needed for digesting fats. / पित्त रस का निर्माण यकृत (Liver) द्वारा होता है तथा यह पित्ताशय में संचित रहता है।",
        category: "General Science"
      },
      {
        id: "ssc-7",
        text: "In which year did the Dandi March (Salt Satyagraha) led by Mahatma Gandhi take place?",
        hindiText: "महात्मा गांधी द्वारा दांडी मार्च (नमक सत्याग्रह) किस वर्ष शुरू किया गया था?",
        options: [
          "1920",
          "1930",
          "1931",
          "1942"
        ],
        correctAnswer: 1,
        explanation: "The Salt March (Dandi March) took place from 12 March 1930 to 6 April 1930 from Sabarmati Ashram to Dandi. / दांडी मार्च 12 मार्च 1930 से 6 अप्रैल 1930 तक साबरमती आश्रम से दांडी तक आयोजित हुआ था।",
        category: "History"
      },
      {
        id: "ssc-8",
        text: "Who has the power to issue currency notes of ₹1 in India?",
        hindiText: "भारत में ₹1 के नोट और सभी सिक्कों को जारी करने का अधिकार किसके पास है?",
        options: [
          "Reserve Bank of India (RBI) / भारतीय रिजर्व बैंक",
          "Ministry of Finance (Government of India) / वित्त मंत्रालय",
          "State Bank of India (SBI) / भारतीय स्टेट बैंक",
          "NITI Aayog / नीति आयोग"
        ],
        correctAnswer: 1,
        explanation: "₹1 notes and coins are issued by the Ministry of Finance, Government of India (bearing the Finance Secretary's signature), while notes of ₹2 and above are issued by the RBI. / ₹1 का नोट वित्त मंत्रालय भारत सरकार द्वारा जारी किया जाता है जिस पर वित्त सचिव के हस्ताक्षर होते हैं।",
        category: "Economics"
      }
    ]
  },
  {
    id: "navy-airforce-mock-1",
    title: "Indian Navy & Air Force Agniveer Technical Paper",
    subtitle: "Agniveervayu & Navy SSR / MR focused science and technological awareness",
    examTag: "Indian Navy SSR/MR & IAF Vayu",
    durationMinutes: 15,
    totalMarks: 30,
    negativeMarking: 0.25,
    questions: [
      {
        id: "nav-1",
        text: "Who is celebrated as the 'Father of the Indian Navy' for building a strong maritime coastal fleet?",
        hindiText: "सशक्त नौसैनिक बेड़े के निर्माण के लिए 'भारतीय नौसेना का जनक' किसे माना जाता है?",
        options: [
          "Chhatrapati Shivaji Maharaj / छत्रपति शिवाजी महाराज",
          "Raja Raja Chola I / राजराज चोल प्रथम",
          "Kanhoji Angre / कान्होजी आंग्रे",
          "Samudragupta / समुद्रगुप्त"
        ],
        correctAnswer: 0,
        explanation: "Chhatrapati Shivaji Maharaj is widely revered as the Father of the Indian Navy for recognizing the strategic importance of naval defense and establishing fortified sea ports along the Konkan coast. / छत्रपति शिवाजी महाराज को भारतीय नौसेना का जनक माना जाता है।",
        category: "Navy History"
      },
      {
        id: "nav-2",
        text: "What is the motto of the Indian Navy?",
        hindiText: "भारतीय नौसेना का आधिकारिक आदर्श वाक्य क्या है?",
        options: [
          "Sam No Varunah (शं नो वरुणः)",
          "Nabhal Sprisham Deeptam (नभः स्पृशं दीप्तम्)",
          "Service Before Self (सेवा परमो धर्मः)",
          "Veerta Aur Vivek (वीरता और विवेक)"
        ],
        correctAnswer: 0,
        explanation: "The official motto of the Indian Navy is 'Sam No Varunah' (May the Lord of Oceans be auspicious unto us). / भारतीय नौसेना का आदर्श वाक्य 'शं नो वरुणः' (वरुण देवता हमारे लिए शुभ हों) है।",
        category: "Defence Knowledge"
      },
      {
        id: "nav-3",
        text: "Which is India's first indigenously built nuclear-powered ballistic missile submarine (SSBN)?",
        hindiText: "भारत की पहली स्वदेशी रूप से निर्मित परमाणु ऊर्जा चालित बैलिस्टिक मिसाइल पनडुब्बी कौन सी है?",
        options: [
          "INS Arihant / आईएनएस अरिहंत",
          "INS Vikrant / आईएनएस विक्रांत",
          "INS Chakra / आईएनएस चक्र",
          "INS Kalvari / आईएनएस कलवरी"
        ],
        correctAnswer: 0,
        explanation: "INS Arihant (SSBN 80) is the lead ship of India's Arihant class of nuclear-powered ballistic missile submarines, completing India's nuclear triad. / आईएनएस अरिहंत भारत की पहली स्वदेशी परमाणु पनडुब्बी है जिसने भारत के परमाणु त्रिकोण को पूरा किया।",
        category: "Defence Technology"
      },
      {
        id: "nav-4",
        text: "What is the escape velocity from the surface of the Earth?",
        hindiText: "पृथ्वी की सतह से पलायन वेग (Escape Velocity) का मान कितना होता है?",
        options: [
          "9.8 km/s",
          "11.2 km/s",
          "7.9 km/s",
          "15.4 km/s"
        ],
        correctAnswer: 1,
        explanation: "The escape velocity from Earth's gravitational field is approximately 11.2 km/s (or ~25,000 mph). / पृथ्वी की सतह से पलायन वेग लगभग 11.2 किमी/सेकंड होता है।",
        category: "Physics"
      },
      {
        id: "nav-5",
        text: "Where is the headquarters of the Southern Air Command (SAC) located?",
        hindiText: "भारतीय वायु सेना के दक्षिणी वायु कमान (SAC) का मुख्यालय कहाँ स्थित है?",
        options: [
          "Bengaluru, Karnataka / बेंगलुरु",
          "Thiruvananthapuram, Kerala / तिरुवनंतपुरम",
          "Chennai, Tamil Nadu / चेन्नई",
          "Hyderabad, Telangana / हैदराबाद"
        ],
        correctAnswer: 1,
        explanation: "The Southern Air Command (SAC) of the Indian Air Force is headquartered in Thiruvananthapuram, Kerala. / भारतीय वायु सेना के दक्षिणी वायु कमान का मुख्यालय तिरुवनंतपुरम, केरल में स्थित है।",
        category: "Air Force Knowledge"
      }
    ]
  }
];
