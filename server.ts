import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini AI Client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
  }
} else {
  console.log("GEMINI_API_KEY not found or using placeholder. Running in Offline/Simulated mode for AI Chat.");
}

// Ensure database folders and dynamic blogs JSON storage exist
const STORAGE_PATH = path.join(process.cwd(), "data", "automated_content.json");

// Local fallback database structured by timeline index for 100% offline accuracy
const LOCAL_FALLBACK_STOCKS = [
  {
    blogs: [
      {
        title: "UP Police Constable Exam GK Revision 2026 / यूपी पुलिस जीके संशोधन",
        excerpt: "उत्तर प्रदेश पुलिस भर्ती के लिए महत्वपूर्ण भौगोलिक, राजनीतिक और प्रशासनिक सामान्य ज्ञान के उत्कृष्ट नोट्स।",
        category: "GK Articles",
        content: `यूपी पुलिस कांस्टेबल परीक्षा के लिए सामान्य ज्ञान (GS) अनुभाग अत्यंत महत्वपूर्ण है। इस लेख में हम उत्तर प्रदेश के बारे में परीक्षा-केंद्रित बिंदु प्रस्तुत कर रहे हैं:

### 1. उत्तर प्रदेश का प्रशासनिक ढांचा
* **मंडलों की संख्या**: 18
* **जिलों की संख्या**: 75
* **प्रथम मुख्यमंत्री**: श्री गोविंद वल्लभ पंत
* **राज्य पशु**: बारहसिंगा (Swamp Deer)
* **राज्य पक्षी**: सारस क्रेन (Sarus Crane)

### 2. महत्वपूर्ण राष्ट्रीय उद्यान व अभ्यारण्य
* **दुधवा राष्ट्रीय उद्यान**: लखीमपुर खीरी जिले में स्थित है और यह बाघों तथा बारहसिंगा के लिए प्रसिद्ध है।
* **कतरनियाघाट वन्यजीव विहार**: बहराइच जिले में स्थित है जो गंगा डॉल्फिन और घड़ियालों का प्रमुख निवास स्थान है।

### 3. हालिया योजनाएं एवं करंट अफेयर्स (2026)
* **डिजिटल सारथी पहल**: डिजिटल साक्षरता और ग्रामीण क्षेत्र की महिलाओं को सुरक्षा व उद्यमिता प्रदान करने हेतु उत्तर प्रदेश सूचना प्रभाग की नवीनतम योजना।
* **गंगा एक्सप्रेसवे**: मेरठ से प्रयागराज तक (लगभग 594 किमी) तीव्र यातायात संपर्क स्थापित करने हेतु निर्माणाधीन है।

**परीक्षा की टिप**: राज्य की नदियों और उनके उद्गम स्थलों पर 2 प्रश्न निश्चित रूप से पूछे जाते हैं। गंगा, यमुना और घाघरा नदियों के मार्ग को अच्छे से याद करें।`,
        author: "आचार्य सुधीर वाजपेयी (GS Expert)",
        readTime: "6 min read"
      },
      {
        title: "Agniveer & SSC Science: Physics Electricity Formulas / भौतिक विज्ञान विद्युत सूत्र",
        excerpt: "विद्युत धारा, प्रतिरोध, ओह्म नियम और उनके व्यावहारिक प्रश्नों को हल करने के सरल सूत्र हिंदी में सीखें।",
        category: "Study Tips",
        content: `अग्निवीर लिखित परीक्षा और SSC GD विज्ञान में विद्युतिकी (Electricity) से संबंधित सूत्रों पर आधारित संख्यात्मक प्रश्न लगभग हर सेट में पूछे जाते हैं। यहाँ प्रमुख सूत्रों और अवधारणाओं का संकलन दिया गया है:

### 1. विद्युत आवेश और धारा (Charge & Current)
* सूत्र: $Q = I \\times t$
  * जहाँ, $Q$ = आवेश (कूलॉम - C)
  * $I$ = धारा (एम्पियर - A)
  * $t$ = समय (सेकंड - s)
* *एक इलेक्ट्रॉन पर आवेश*: $1.6 \\times 10^{-19}$ कूलॉम।

### 2. ओह्म का नियम (Ohm's Law)
* सूत्र: $V = I \\times R$
  * $V$ = विभवांतर (वोल्ट - V)
  * $R$ = प्रतिरोध (ओह्म - $\\Omega$)
* प्रतिरोधकता का सूत्र: $R = \\rho \\frac{l}{A}$

### 3. प्रतिरोधों का संयोजन (Combination of Resistors)
* **श्रेणीक्रम (Series)**: $R_{total} = R_1 + R_2 + R_3 + \\dots$
* **सामनांतरक्रम (Parallel)**: $\\frac{1}{R_{total}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3} + \\dots$

### 4. विद्युत शक्ति (Electric Power)
* सूत्र: $P = V \\times I = I^2 \\times R = \\frac{V^2}{R}$
  * मात्रक: वाट (W) या किलोवाट (kW)।

**अग्निवीर विशेष टिप**: बिजली के घरेलू कनेक्शन हमेशा समांतरक्रम में जुड़े होते हैं ताकि प्रत्येक उपकरण को समान वोल्टेज प्राप्त हो सके और एक के खराब होने पर अन्य चलते रहें।`,
        author: "डॉ. रमन सिंह (Agniveer Science Coach)",
        readTime: "5 min read"
      }
    ],
    studyNotes: [
      {
        category: "UP Police & State Notes",
        title: "उत्तर प्रदेश का बजट और आर्थिक समीक्षा 2026 (Official Quick PDF Revision Note)",
        content: `उत्तर प्रदेश सरकार द्वारा वर्ष 2026-27 के लिए घोषित हालिया बजट की प्रमुख घोषणाएं और परीक्षा-केंद्रित बिंदु निम्नलिखित हैं। इस अध्ययन पत्र को प्रिंट करके अवश्य दोहराएं:

### 1. मुख्य वित्तीय आवंटन
* **कुल बजट आकार**: ₹7.9 लाख करोड़ से अधिक, जो इतिहास में अब तक का सबसे बड़ा राज्य बजट है।
* **राजकोषीय घाटा लक्ष्य**: राज्य सकल घरेलू उत्पाद (GSDP) का लगभग 3.1% होने का अनुमान है।

### 2. सड़क एवं एक्सप्रेसवे नेटवर्क योजनाएं
* **बुंदेलखंड एक्सप्रेसवे विस्तार**: झांसी से लिंक करने के लिए विशेष ₹1,500 करोड़ का आवंटन।
* **जेवर अंतर्राष्ट्रीय हवाई अड्डा (नोएडा)**: प्रथम चरण की शुरुआत के साथ ही रनवे-2 के निर्माण को गति देने के लिए कोष आवंटित।

### 3. शिक्षा और रोजगार पहल
* **अग्निवीर प्रोत्साहन योजना**: उत्तर प्रदेश के सेवानिवृत्त अग्निवीरों को उत्तर प्रदेश पुलिस और प्रादेशिक सशस्त्र बलों (PAC) में 10% सीधी आरक्षण वरीयता देने हेतु विशेष कानून पारित।
* **मुख्यमंत्री युवा स्वरोजगार योजना**: ₹5 लाख तक के ब्याज-मुक्त ऋण के लिए पात्रताओं का सरलीकरण।

### 4. कृषि क्षेत्र
* **नि:शुल्क बिजली**: निजी नलकूपों (Tubewells) का उपयोग करने वाले किसानों को शत-प्रतिशत मुफ्त विद्युत आपूर्ति जारी रखने के लिए अतिरिक्त बजटीय प्रावधान।`,
        author: "डॉ. आलोक अवस्थी (Economy Head)",
      },
      {
        category: "Railway Exam Notes",
        title: "रेलवे गणित अंकगणित: समय और दूरी (Time, Speed and Distance Formula Cheat Sheet)",
        content: `रेलवे भर्ती बोर्ड (RRB NTPC, Group D, ALP) परीक्षाओं में समय, दूरी और चाल से संबंधित 3 से 4 प्रश्न अवश्य पूछे जाते हैं। यह अध्ययन पत्र आपको रेलगाड़ी और प्लेटफॉर्म वाली उलझन दूर करने में मदद करेगा:

### 1. मूलभूत इकाइयाँ और रूपांतरण
* **चाल का मूल सूत्र**: $चाल = \\frac{दूरी}{समय}$
* **km/h से m/s में बदलाव**: चाल गुणा $\\frac{5}{18}$ करें।
* **m/s से km/h में बदलाव**: चाल गुणा $\\frac{18}{5}$ करें。

### 2. सापेक्ष चाल (Relative Speed)
* **समान दिशा**: यदि दो गाड़ियाँ $u$ और $v$ की चाल से एक ही दिशा में जा रही हैं, तो सापेक्ष चाल = $u - v$ (जहाँ $u > v$).
* **विपरीत दिशा**: यदि वे एक-दूसरे की ओर अलग-अलग दिशाओं से आ रही हैं, तो सापेक्ष चाल = $u + v$.

### 3. रेलगाड़ी आधारित विशेष नियम (Train Cases)
* **केस A**: जब रेलगाड़ी किसी खंभे या खड़े व्यक्ति को पार करती है:   
  आवश्यक दूरी = रेलगाड़ी की स्वयं की लम्बाई।
* **केस B**: जब रेलगाड़ी किसी पुल, सुरंग या प्लेटफॉर्म को पार करती है:   
  आवश्यक दूरी = (रेलगाड़ी की लम्बाई + पूल/प्लेटफॉर्म की लम्बाई)।

### 4. औसत चाल (Average Speed)
*  औसत चाल सूत्र: जब कोई निश्चित दूरी दो अलग-अलग चाल $x$ and $y$ से तय की जाती है:   
  $औसत चाल = \\frac{2xy}{x + y}$`,
        author: "इंजी. सत्य प्रकाश (Maths Faculty)"
      }
    ]
  },
  {
    blogs: [
      {
        title: "Indian Constitution Important Articles Revision / भारतीय संविधान के महत्वपूर्ण अनुच्छेद",
        excerpt: "भाग 3 मौलिक अधिकार, भाग 4 नीति निदेशक तत्व, और आपातकाल से संबंधित शीर्ष परीक्षा-केंद्रित अनुच्छेदों का त्वरित सारांश।",
        category: "GK Articles",
        content: `UPSC, SSC CGL और राष्ट्रीय सुरक्षा रक्षा बलों की परीक्षाओं में भारतीय संविधान के अनुच्छेदों पर लगातार प्रश्न आते हैं। यहाँ संक्षेप में उन अनुच्छेदों की सूची दी गई है जिनपर आपको पूर्ण पकड़ होनी चाहिए:

### 1. भाग III: मौलिक अधिकार (Articles 12 to 35)
* **अनुच्छेद 14**: कानून के समक्ष समानता (Equality before law).
* **अनुच्छेद 17**: अस्पृश्यता का अंत (Abolition of untouchability) - इसपर 20 से अधिक बार प्रश्न बन चुका है।
* **अनुच्छेद 19**: भाषण और अभिव्यक्ति की स्वतंत्रताओं सहित छह अधिकारों की गारंटी।
* **अनुच्छेद 21**: प्राण और दैहिक स्वतंत्रता का संरक्षण (Right to life and personal liberty).
* **अनुच्छेद 21A**: शिक्षा का अधिकार (6 से 14 वर्ष तक के बच्चों को निशुल्क शिक्षा)।
* **अनुच्छेद 32**: संवैधानिक उपचारों का अधिकार (Right to constitutional remedies), जिसे डॉ. अंबेडकर ने संविधान की 'आत्मा' कहा था।

### 2. भाग IV: राज्य के नीति निदेशक तत्व (DPSPs - Articles 36 to 51)
* **अनुच्छेद 40**: ग्राम पंचायतों का संगठन।
* **अनुच्छेद 44**: समान नागरिक संहिता (Uniform Civil Code) - वर्तमान में अत्यंत चर्चा में।
* **अनुच्छेद 50**: कार्यपालिका से न्यायपालिका का पृथक्करण।

### 3. भाग IV-A: मूल कर्तव्य (Fundamental Duties)
* **अनुच्छेद 51A**: 42वें संशोधन द्वारा जोड़े गए 11 मौलिक कर्तव्यों का उल्लेख।

### 4. आपातकालीन प्रावधान (Emergency Provisions)
* **अनुच्छेद 352**: राष्ट्रीय आपातकाल (National Emergency).
* **अनुच्छेद 356**: राज्यों में राष्ट्रपति शासन (President's Rule).
* **अनुच्छेद 360**: वित्तीय आपातकाल (Financial Emergency) - भारत में आज तक कभी लागू नहीं हुआ।`,
        author: "प्रो. सतीश चंद्र (Polity Head)",
        readTime: "7 min read"
      },
      {
        title: "Latest Military Exercises of India 2026 / भारत के प्रमुख सैन्य अभ्यास 2026",
        excerpt: "वरुण, गरुड़, सूर्य किरण, सिम्बेक्स और हालिया अभ्यास सदा तन्सीक से जुड़े नवीनतम रक्षा करंट अफेयर्स नोट्स।",
        category: "GK Articles",
        content: `डिफेंस परीक्षाओं (NDA, CDS, AFCAT, Agniveer) के लिए भारतीय सेनाओं द्वारा किए जाने वाले संयुक्त युद्धाभ्यास रक्षा जीके का रीढ़ की हड्डी हैं। आइए प्रमुख राष्ट्रीय और अंतर्राष्ट्रीय अभ्यासों का पुनरीक्षण करें:

### 1. द्विपक्षीय सैन्य अभ्यास (Bilateral Army Exercises)
* **सूर्य किरण**: भारत और नेपाल की थल सेनाओं के मध्य प्रतिवर्ष होने वाला अभ्यास।
* **मित्र शक्ति**: भारत और श्रीलंका।
* **हरिमऊ शक्ति**: भारत और मलेशिया की नौसेना व थलसेना।
* **सदा तन्सीक**: भारत और सऊदी अरब के मध्य आयोजित होने वाला विशेष थल सेना अभ्यास (2026 में अत्यंत सुर्खियों में रहा)।

### 2. नौसैनिक अभ्यास (Naval Exercises)
* **वरुण**: भारत और फ्रांस की नौसेनाओं के बीच।
* **सिम्बेक्स (SIMBEX)**: भारत और सिंगापुर के बीच द्विपक्षीय समुद्री अभ्यास।
* **मालाबार अभ्यास**: भारत, अमेरिका, जापान और ऑस्ट्रेलिया (क्वाड देश) के मध्य बहुपक्षीय नौसैनिक शक्ति प्रदर्शन अभ्यास।

### 3. वायुसेना अभ्यास (Air Force Exercises)
* **वरुण**: भारत और फ्रांस की वायुसेना।
* **गरुड़**: भारत और फ्रांस की वायुसेना।
* **इंद्रधनुष**: भारत और ब्रिटेन की वायु सेना के मध्य अभ्यास।
* **पूर्वी ब्रिज (Eastern Bridge)**: भारत और ओमान की वायु सेना।

**तैयारी का सूत्र**: परीक्षा से ठीक पहले आयोजित हालिया 3 महीनों के अभ्यासों के स्थानों (Venue) को ज़रूर नोट करें, क्योंकि कभी-कभी अभ्यास का नाम न पूछकर उसके आयोजन स्थल का नाम पूछ लिया जाता है।`,
        author: "विंग कमांडर आर. के. शर्मा (सेवानिवृत्त)",
        readTime: "5 min read"
      }
    ],
    studyNotes: [
      {
        category: "UPSC Civil Services",
        title: "भारत की प्रमुख नदियाँ एवं उनकी सहायक नदियाँ (River Systems of India Detailed Notes)",
        content: `भूगोल सामान्य अध्ययन का एक बड़ा हिस्सा भारतीय अपवाह तंत्र (River Drainage System) है। इस नोट में हिमालयी और प्रायद्वीपीय नदी तंत्रों के महत्वपूर्ण तथ्यात्मक बिन्दुओं का संकलन है:

### 1. गंगा नदी तंत्र (The Ganga River System)
* **उद्गम**: देवप्रयाग में भागीरथी और अलकनंदा के संगम से गंगा बनती है।
* **लम्बाई**: 2,525 किमी (भारत की सबसे लम्बी नदी)।
* **दाहिने किनारे की सहायक नदियाँ**: यमुना, सोन, और पुनपुन।
* **बाएं किनारे की सहायक नदियाँ**: रामगंगा, गोमती, घाघरा, गंडक, कोसी, बागमती।

### 2. सिंधु नदी तंत्र (The Indus River System)
* **उद्गम**: मानसरोवर झील के पास बोखर चू ग्लेशियर (तिब्बत)।
* **पंचनद (प्रमुख भारत में बहने वाली सहायक नदियाँ)**: झेलम, चिनाब, रावी, ब्यास, और सतलुज।
* **सिंधु जल समझौता**: 1960 में भारत और पाकिस्तान के बीच हुआ था।

### 3. ब्रह्मपुत्र नदी तंत्र (The Brahmaputra System)
* **उद्गम**: कैलास पर्वत श्रेणी में चेमायुंगडुंग हिमनद।
* **अन्य नाम**: तिब्बत में 'सांगपो' (Tsangpo), अरुणाचल प्रदेश में 'दिहांग', असम में 'ब्रह्मपुत्र' तथा बांग्लादेश में 'जमुना'।
* **प्रसिद्ध द्वीप**: माजुली द्वीप (दुनिया का सबसे बड़ा नदी द्वीप, असम)।

### 4. प्रायद्वीपीय नदियाँ (Peninsular Rivers)
* **पूर्व की ओर बहने वाली (बंगाल की खाड़ी में गिरने वाली)**: महानदी, गोदावरी (वृद्ध गंगा - प्रायद्वीपीय भारत की सबसे लम्बी नदी), कृष्णा, कावेरी।
* **पश्चिम की ओर बहने वाली (अरब सागर में गिरने वाली / एस्टुअरी बनाने वाली)**: नर्मदा (अमरकंटक से उद्गम) और तापी।`,
        author: "डॉ. मीनाक्षी सुब्रमण्यम",
      },
      {
        category: "SSC Exam Notes",
        title: "सामान्य विज्ञान: विटामिन्स और उनके रासायनिक नाम एवं कमी से होने वाले रोग",
        content: `जीव विज्ञान सामान्य विज्ञान अनुभाग का अत्यंत महत्वपूर्ण हिस्सा है। विटामिंस का यह चार्ट याद करके आप किसी भी सरकारी परीक्षा में कम से कम 1 से 2 अंक पक्के कर सकते हैं:

### 1. जल में घुलनशील विटामिन्स
* **विटामिन B1 (थायमिन)**
  * कमी से रोग: बेरी-बेरी
  * मुख्य स्रोत: मूंगफली, बिना पॉलिश वाले चावल, अनाज।
* **विटामिन C (एस्कॉर्बिक एसिड)**
  * कमी से रोग: स्कर्वी, मसूड़ों का फूलना
  * मुख्य स्रोत: खट्टे फल जैसे आँवला, नींबू, संतरा।

### 2. वसा (Fat) में घुलनशील विटामिन्स
* **विटामिन A (रेटिनॉल)**
  * कमी से रोग: रतौंधी (Night Blindness)
  * मुख्य स्रोत: गाजर, दूध, अंडा, हरी सब्जियां।
* **विटामिन D (कैल्सीफेरॉल)**
  * कमी से रोग: रिकेट्स (सूखा रोग - बच्चों में), ऑस्टियोमलेशिया (वयस्कों में)
  * मुख्य स्रोत: सूर्य का प्रकाश, मछली के यकृत का तेल।
* **विटामिन E (टोकोफेरॉल)**
  * कमी से रोग: जनन शक्ति का कम होना
  * मुख्य स्रोत: अंकुरित गेहूं, हरी पत्तीदार सब्जियां।
* **विटामिन K (फिलोक्यूनोन)**
  * कमी से रोग: रक्त का थक्का (Blood Clot) न बनना।
  * मुख्य स्रोत: टमाटर, हरी सब्जियां।`,
        author: "प्रो. रमेश मेहता",
      }
    ]
  }
];

// Server-side dynamic automated compiler & publisher (checks every 12 hours)
async function checkAndGenerateAutomatedContent(force = false) {
  let existingData = { lastGenerated: 0, blogs: [], studyNotes: [] };

  try {
    if (fs.existsSync(STORAGE_PATH)) {
      const fileContent = fs.readFileSync(STORAGE_PATH, "utf-8");
      existingData = JSON.parse(fileContent);
    }
  } catch (e) {
    console.error("No existing database found; starting a clean automated catalog file.");
  }

  const now = Date.now();
  const lastGen = existingData.lastGenerated || 0;
  const GAP_MS = 12 * 60 * 60 * 1000; // 12 Hours exactly

  if (force || !existingData.blogs.length || (now - lastGen >= GAP_MS)) {
    console.log("Starting research of trending Indian examinations and writing dynamic blogs/PDF study notes...");
    let newBlogs: any[] = [];
    let newStudyNotes: any[] = [];
    let success = false;

    if (ai) {
      try {
        const promptString = `You are a professional educational journalist and exam material compiler.
Research the absolute latest trending competitive government examinations in India (such as SSC CGL, SSC GD, Railway Recruitment RRB, Bank exams, State Civil/Police Forces like UP or Bihar, IAS, NDA, CDS) for current date June 2026.
Generate exactly 2 high-quality, authentic study notes/articles written in pure Hindi language.

Provide the response in raw JSON format matching this EXACT structure:
{
  "blogs": [
    {
      "title": "A highly premium, precise, relevant exam header in Hindi with English translations (e.g. 'SSC GD Static General Knowledge Revision / सामान्य ज्ञान संशोधन')",
      "excerpt": "A short, engaging 2-sentence summary in Hindi outlining this study note guide.",
      "category": "This MUST be exactly one of: 'GK Articles' or 'Exam Strategies' or 'Jobs Updates' or 'Study Tips' or 'Current Affairs' or 'Motivation'",
      "content": "A detailed, highly comprehensive study article written in Hindi, covering syllabus, historical dates, key laws, lists, or steps. Focus deeply on accuracy. Must be at least 250 words.",
      "author": "An authoritative tutor/analyst name (e.g. 'प्रोफेसर राम सिंह')",
      "date": "${new Date().toISOString().split("T")[0]}",
      "readTime": "6 min read"
    },
    {
      "title": "Another unique, trendy title in Hindi & English (e.g. 'Railway NTPC Science Core Chemistry / रसायन मुख्य सूत्र')",
      "excerpt": "A short summary of this article in Hindi.",
      "category": "This MUST be exactly one of: 'GK Articles' or 'Exam Strategies' or 'Jobs Updates' or 'Study Tips' or 'Current Affairs' or 'Motivation'",
      "content": "A detailed structured scientific or historical study chapter written in Hindi, at least 250 words.",
      "author": "An authoritative expert name",
      "date": "${new Date().toISOString().split("T")[0]}",
      "readTime": "7 min read"
    }
  ],
  "studyNotes": [
    {
      "category": "E.g. 'SSC Exam Notes', 'Railway Exam Notes', 'UP Police & State Notes', 'UPSC Civil Services' or 'Banking Exam Notes'",
      "title": "A precise exam revision sheet title in Hindi (e.g., 'भारतीय इतिहास: गुप्त साम्राज्य के पतन के कारण')",
      "content": "A high-quality textbook revision document written in Hindi, structured with clear subheadings, formulas, solved question prompts, and memory shortcuts. Must be at least 300 words.",
      "author": "A realistic tutor name, e.g., 'डॉ. शिखा सिन्हा'",
      "date": "${new Date().toISOString().split("T")[0]}"
    },
    {
      "category": "Another fitting dynamic category string e.g. 'Railway Exam Notes' or 'UPSC Civil Services'",
      "title": "Another study revision sheet title in Hindi",
      "content": "A comprehensive revision study notes text in Hindi, covering important syllabus topics in details. Must be at least 300 words.",
      "author": "Another realistic tutor name",
      "date": "${new Date().toISOString().split("T")[0]}"
    }
  ]
}

Make sure that the output is only valid JSON, do NOT wrap it in backticks like \`\`\`json. Return only raw JSON string output.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptString,
          config: {
            tools: [{ googleSearch: {} }],
            temperature: 0.8,
            responseMimeType: "application/json"
          }
        });

        let cleanText = response.text || "";
        if (cleanText.includes("```json")) {
          cleanText = cleanText.split("```json")[1].split("```")[0];
        } else if (cleanText.includes("```")) {
          cleanText = cleanText.split("```")[1].split("```")[0];
        }
        cleanText = cleanText.trim();

        const parsed = JSON.parse(cleanText);
        if (parsed.blogs && parsed.studyNotes) {
          newBlogs = parsed.blogs.map((b: any, index: number) => ({
            ...b,
            id: `auto-blog-gemini-${Date.now()}-${index}`
          }));
          newStudyNotes = parsed.studyNotes.map((n: any, index: number) => ({
            ...n,
            id: `auto-note-gemini-${Date.now()}-${index}`
          }));
          success = true;
          console.log("Dynamic content published via real-time Gemini search grounding insights successfully!");
        }
      } catch (err) {
        console.error("Failed to generate content using live Gemini API, falling back to local pre-authored cycle...", err);
      }
    }

    if (!success) {
      // Offline fallback: Use the stock array cycled based on timestamp
      const cycleId = Math.floor(now / GAP_MS);
      const stock = LOCAL_FALLBACK_STOCKS[cycleId % LOCAL_FALLBACK_STOCKS.length];
      
      newBlogs = stock.blogs.map((b, index) => ({
        ...b,
        id: `auto-blog-local-${cycleId}-${index}`,
        date: new Date().toISOString().split("T")[0]
      }));

      newStudyNotes = stock.studyNotes.map((n, index) => ({
        ...n,
        id: `auto-note-local-${cycleId}-${index}`,
        date: new Date().toISOString().split("T")[0]
      }));
      console.log(`Dynamic fallback activated: Cycled mock study materials loaded from group index ${cycleId % LOCAL_FALLBACK_STOCKS.length}.`);
    }

    // Keep all histories and prepend the new 2 notes/blogs
    const combinedBlogs = [...newBlogs, ...existingData.blogs];
    const combinedStudyNotes = [...newStudyNotes, ...existingData.studyNotes];

    // Filter duplicates out
    const uniqueBlogsMap = new Map();
    combinedBlogs.forEach((b: any) => uniqueBlogsMap.set(b.id, b));

    const uniqueNotesMap = new Map();
    combinedStudyNotes.forEach((n: any) => uniqueNotesMap.set(n.id, n));

    const finalData = {
      lastGenerated: force ? (existingData.lastGenerated || now) : now,
      blogs: Array.from(uniqueBlogsMap.values()),
      studyNotes: Array.from(uniqueNotesMap.values())
    };

    // Save back to JSON Database
    try {
      const dirPath = path.dirname(STORAGE_PATH);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(STORAGE_PATH, JSON.stringify(finalData, null, 2), "utf-8");
      console.log(`Successfully completed daily publisher cycle. Database contains: ${finalData.blogs.length} blogs, ${finalData.studyNotes.length} study notes.`);
    } catch (saveError) {
      console.error("Failed to record articles inside dynamic file store:", saveError);
    }
  }
}

// API: Daily GK/Current Affairs Quiz Revision questions
app.get("/api/daily-quiz", async (req: express.Request, res: express.Response) => {
  const forceBypassCache = req.query.force === "true";
  const now = Date.now();

  let success = false;
  if (ai) {
    try {
      console.log("Analyzing live RSS current affairs/quiz content or researching trending GK questions for today's daily revision check...");
      const promptString = `Research 5 highly challenging and accurate GK/Current Affairs revision questions for Indian Defence & Civil jobs aspirants (such as Agniveer, NDA, CDS, Army, Police, SSC GD/CGL) in year 2026.
For each question, provide:
1. "englishQ": The full precise question in English.
2. "hindiQ": The equivalent accurate translation/question in Hindi.
3. "options": Array of 4 strategic option objects:
   - {"key": "A", "text": "Option text clearly containing A. in English with Hindi equivalent in parentheses", "isCorrect": boolean}
   - {"key": "B", "text": "Option text clearly containing B. in English with Hindi equivalent in parentheses", "isCorrect": boolean}
   - {"key": "C", "text": "Option text clearly containing C. in English with Hindi equivalent in parentheses", "isCorrect": boolean}
   - {"key": "D", "text": "Option text clearly containing D. in English with Hindi equivalent in parentheses", "isCorrect": boolean}
4. "explanationEng": Detailed professional educational explanation in English.
5. "explanationHin": Detailed professional educational explanation in Hindi.

Return raw JSON strictly matching the structure below. Do NOT use markdown code blocks on the outer wrapper:
[
  {
    "englishQ": "string",
    "hindiQ": "string",
    "options": [
      { "key": "A", "text": "A. Text (पाठ)", "isCorrect": false },
      { "key": "B", "text": "B. Text (पाठ)", "isCorrect": true },
      { "key": "C", "text": "C. Text (पाठ)", "isCorrect": false },
      { "key": "D", "text": "D. Text (पाठ)", "isCorrect": false }
    ],
    "explanationEng": "string",
    "explanationHin": "string"
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptString,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.75,
          responseMimeType: "application/json"
        }
      });

      let jsonText = response.text || "";
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
      }
      jsonText = jsonText.trim();

      const decoded = JSON.parse(jsonText);
      if (Array.isArray(decoded) && decoded.length > 0) {
        res.json({ questions: decoded.slice(0, 5) });
        success = true;
        console.log("Streamed dynamic active revision quiz via Gemini grounding!");
      }
    } catch (err: any) {
      console.log("[INFO] Daily dynamic quiz compilation rate-limited or failed, reverting to robust local stock revision pool: ", err?.message || err);
    }
  }

  if (!success) {
    // Robust, extensive 10-question localized offline pool
    const pool = [
      {
        "englishQ": "Who is known as the Father of the Indian Constitution?",
        "hindiQ": "भारतीय संविधान के जनक के रूप में किसे जाना जाता है?",
        "options": [
          { "key": "A", "text": "A. Mahatma Gandhi (महात्मा गांधी)", "isCorrect": false },
          { "key": "B", "text": "B. Dr. B.R. Ambedkar (डॉ. बी.आर. आंबेडकर)", "isCorrect": true },
          { "key": "C", "text": "C. Jawaharlal Nehru (जवाहरलाल नेहरू)", "isCorrect": false },
          { "key": "D", "text": "D. Dr. Rajendra Prasad (डॉ. राजेंद्र प्रसाद)", "isCorrect": false }
        ],
        "explanationEng": "Dr. Bhimrao Ramji Ambedkar served as the chairman of the Drafting Committee which drafted the Constitution of India.",
        "explanationHin": "डॉ. भीमराव Ramji आंबेडकर ने भारतीय संविधान का प्रारूप तैयार करने वाली प्रारूप समिति के अध्यक्ष के रूप में कार्य किया।"
      },
      {
        "englishQ": "The headquarter of the Southern Command of the Indian Army is located at:",
        "hindiQ": "भारतीय सेना की दक्षिणी कमान का मुख्यालय कहाँ स्थित है?",
        "options": [
          { "key": "A", "text": "A. Pune (पुणे)", "isCorrect": true },
          { "key": "B", "text": "B. Chennai (चेन्नई)", "isCorrect": false },
          { "key": "C", "text": "C. Kochi (कोच्चि)", "isCorrect": false },
          { "key": "D", "text": "D. Mumbai (मुंबई)", "isCorrect": false }
        ],
        "explanationEng": "The Southern Command of the Indian Army is headquartered at Pune, Maharashtra.",
        "explanationHin": "भारतीय सेना की दक्षिणी कमान का मुख्यालय पुणे, महाराष्ट्र में स्थित है।"
      },
      {
        "englishQ": "Which schedule of the Indian Constitution was added by the 1st Amendment Act of 1951?",
        "hindiQ": "1951 के पहले संशोधन अधिनियम द्वारा भारतीय संविधान में कौन सी अनुसूची जोड़ी गई थी?",
        "options": [
          { "key": "A", "text": "A. 9th Schedule (9वीं अनुसूची)", "isCorrect": true },
          { "key": "B", "text": "B. 10th Schedule (10वीं अनुसूची)", "isCorrect": false },
          { "key": "C", "text": "C. 11th Schedule (11वीं अनुसूची)", "isCorrect": false },
          { "key": "D", "text": "D. 12th Schedule (12वीं अनुसूची)", "isCorrect": false }
        ],
        "explanationEng": "The Ninth Schedule was added by the first amendment in 1951 to protect laws related to land reforms from judicial review.",
        "explanationHin": "भूमि सुधारों से संबंधित कानूनों को न्यायिक समीक्षा से बचाने के लिए 1951 में पहले संशोधन द्वारा नौवीं अनुसूची जोड़ी गई थी।"
      },
      {
        "englishQ": "Which of the following is the highest peacetime gallantry award in India?",
        "hindiQ": "निम्नलिखित में से कौन भारत में सर्वोच्च शांतिकालीन वीरता पुरस्कार है?",
        "options": [
          { "key": "A", "text": "A. Param Vir Chakra (परमवीर चक्र)", "isCorrect": false },
          { "key": "B", "text": "B. Ashoka Chakra (अशोक चक्र)", "isCorrect": true },
          { "key": "C", "text": "C. Shaurya Chakra (शौर्य चक्र)", "isCorrect": false },
          { "key": "D", "text": "D. Kirti Chakra (कीर्ति चक्र)", "isCorrect": false }
        ],
        "explanationEng": "The Ashoka Chakra is India's highest peacetime military decoration awarded for valor, courageous action or self-sacrifice away from the battlefield.",
        "explanationHin": "अशोक चक्र भारत का सर्वोच्च शांतिकालीन सैन्य अलंकरण है जो युद्ध के मैदान से दूर वीरता, साहसी कार्रवाई या आत्म-बलिदान के लिए प्रदान किया जाता है।"
      },
      {
        "englishQ": "In which state is the famous National Defence Academy (NDA) situated?",
        "hindiQ": "प्रसिद्ध राष्ट्रीय रक्षा अकादमी (NDA) किस राज्य में स्थित है?",
        "options": [
          { "key": "A", "text": "A. Uttarakhand (उत्तराखंड)", "isCorrect": false },
          { "key": "B", "text": "B. Maharashtra (महाराष्ट्र)", "isCorrect": true },
          { "key": "C", "text": "C. Kerala (केरल)", "isCorrect": false },
          { "key": "D", "text": "D. Haryana (हरियाणा)", "isCorrect": false }
        ],
        "explanationEng": "The National Defence Academy (NDA) is situated at Khadakwasla near Pune, Maharashtra.",
        "explanationHin": "राष्ट्रीय रक्षा अकादमी (NDA) महाराष्ट्र के पुणे के निकट खड़कवासला में स्थित है।"
      },
      {
        "englishQ": "Which of the following is India's first indigenously built aircraft carrier?",
        "hindiQ": "निम्नलिखित में से कौन भारत का पहला स्वदेश निर्मित विमानवाहक पोत है?",
        "options": [
          { "key": "A", "text": "A. INS Vikramaditya (आईएनएस विक्रमादित्य)", "isCorrect": false },
          { "key": "B", "text": "B. INS Vikrant (आईएनएस विक्रांत)", "isCorrect": true },
          { "key": "C", "text": "C. INS Arihant (आईएनएस अरिहंत)", "isCorrect": false },
          { "key": "D", "text": "D. INS Virat (आईएनएस विराट)", "isCorrect": false }
        ],
        "explanationEng": "INS Vikrant is India's first indigenously designed and built aircraft carrier, commissioned in 2022.",
        "explanationHin": "आईएनएस विक्रांत भारत का पहला स्वदेश में डिजाइन और निर्मित विमानवाहक पोत है, जिसे 2022 में नौसेना में शामिल किया गया था।"
      },
      {
        "englishQ": "What is the official motto of the Indian Army?",
        "hindiQ": "भारतीय सेना का आधिकारिक आदर्श वाक्य (Motto) क्या है?",
        "options": [
          { "key": "A", "text": "A. Touch the Sky with Glory (नभः स्पृशं दीप्तम्)", "isCorrect": false },
          { "key": "B", "text": "B. Service Before Self (सेवा परमो धर्मः)", "isCorrect": true },
          { "key": "C", "text": "C. Sham No Varunah (शं नो वरुणः)", "isCorrect": false },
          { "key": "D", "text": "D. Valour and Faith (सौर्य और निष्ठा)", "isCorrect": false }
        ],
        "explanationEng": "The official motto of the Indian Army is 'Service Before Self' (Seva Parmo Dharma).",
        "explanationHin": "भारतीय सेना का आधिकारिक आदर्श वाक्य 'सेवा परमो धर्मः' (सैलफलेस सर्विस) है।"
      },
      {
        "englishQ": "Which river is widely known as the 'Dakshin Ganga' (Ganges of the South)?",
        "hindiQ": "किस नदी को 'दक्षिण Ganga' (दक्षिण की गंगा) के रूप में जाना जाता है?",
        "options": [
          { "key": "A", "text": "A. Krishna River (कृष्णा नदी)", "isCorrect": false },
          { "key": "B", "text": "B. Kaveri River (कावेरी नदी)", "isCorrect": false },
          { "key": "C", "text": "C. Godavari River (गोदावरी नदी)", "isCorrect": true },
          { "key": "D", "text": "D. Narmada River (नर्मदा नदी)", "isCorrect": false }
        ],
        "explanationEng": "The Godavari is India's second longest river and is called Dakshin Ganga due to its large size and span.",
        "explanationHin": "गोदावरी भारत की दूसरी सबसे लंबी नदी है और अपने विशाल आकार तथा विस्तार के कारण इसे दक्षिण गंगा कहा जाता है।"
      },
      {
        "englishQ": "The historic Battle of Haldighati was fought in which year?",
        "hindiQ": "ऐतिहासिक हल्दीघाटी का युद्ध किस वर्ष लड़ा गया था?",
        "options": [
          { "key": "A", "text": "A. 1526 AD (1526 ई.)", "isCorrect": false },
          { "key": "B", "text": "B. 1556 AD (1556 ई.)", "isCorrect": false },
          { "key": "C", "text": "C. 1576 AD (1576 ई.)", "isCorrect": true },
          { "key": "D", "text": "D. 1761 AD (1761 ई.)", "isCorrect": false }
        ],
        "explanationEng": "The Battle of Haldighati was fought on 18 June 1576 between Maharana Pratap of Mewar and the Mughal forces led by Man Singh I of Amber.",
        "explanationHin": "हल्दीघाटी का युद्ध 18 जून 1576 को मेवाड़ के राजा महाराणा प्रताप और आमेर के मान सिंह प्रथम के नेतृत्व वाली मुगल सेना के बीच लड़ा गया था।"
      },
      {
        "englishQ": "Deficiency of Vitamin C causes which of the following diseases?",
        "hindiQ": "विटामिन C की कमी से निम्नलिखित में से कौन सा रोग होता है?",
        "options": [
          { "key": "A", "text": "A. Rickets (रिकेट्स)", "isCorrect": false },
          { "key": "B", "text": "B. Beriberi (बेरीबेरी)", "isCorrect": false },
          { "key": "C", "text": "C. Scurvy (स्कर्वी)", "isCorrect": true },
          { "key": "D", "text": "D. Night Blindness (रतौंधी)", "isCorrect": false }
        ],
        "explanationEng": "Scurvy is a disease resulting from a lack of vitamin C, leading to weakness, gum disease, and skin hemorrhages.",
        "explanationHin": "स्कर्वी विभाग विटामिन C की कमी से होने वाला रोग है, जिससे कमजोरी, मसूड़ों की बीमारी और त्वचा से खून बहने जैसी समस्याएं होती हैं।"
      }
    ];

    // Pick 5 completely random questions from the pool of 10
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledPool.slice(0, 5);
    
    res.json({ questions: selectedQuestions });
  }
});

// API: Latest Notifications Sidebar Alerts (Dynamic Real-Time Govt/Armed Forces Job alerts)
let cachedNotifications: any[] | null = null;
let lastNotificationsFetch = 0;

app.get("/api/latest-notifications", async (req: express.Request, res: express.Response) => {
  const forceBypassCache = req.query.force === "true";
  const now = Date.now();

  if (cachedNotifications && (now - lastNotificationsFetch < 30 * 60 * 1000) && !forceBypassCache) {
    console.log("Serving latest-notifications from memory cache...");
    return res.json({ notifications: cachedNotifications });
  }

  try {
    if (ai) {
      console.log("Fetching live notification updates via Gemini Search Grounding...");
      const promptString = `Research actual, live ongoing or upcoming Indian Armed Forces (Army, Navy, Air Force) Agniveer, SSC GD, CAPF, UPSC NDA/CDS, State Police (e.g. UP Police, Bihar Police) and major central/state government job alerts and exam notifications published or active in June/July 2026.
Generate a comprehensive list of exactly 5-6 highly authentic alerts.

Return raw JSON strictly matching the structure below. Do NOT use markdown code blocks (\`\`\`json on the outer wrapper):
[
  {
    "id": 1,
    "text": "Detailed recruitment update or exam notice text in English (e.g. 'Indian Air Force Agniveervayu 01/2026 Batch Online Registration has opened. Eligible unmarried Indian candidates can apply before July 15, 2026.')",
    "hindiText": "हिन्दी में विस्तृत भर्ती या परीक्षा की जानकारी (जैसे 'भारतीय वायु सेना अग्निवीरवायु 01/2026 बैच के लिए ऑनलाइन पंजीकरण शुरू हो गया है। योग्य अविवाहित उम्मीदवार 15 जुलाई 2026 से पहले आवेदन कर सकते हैं।')",
    "type": "urgent",
    "link": "Official government website link (e.g. 'https://agnipathvayu.cdac.in' or 'https://joinindianarmy.nic.in')",
    "date": "Sourced date (e.g. 'June 2026')"
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptString,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.8,
          responseMimeType: "application/json"
        }
      });

      let jsonText = response.text || "";
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
      }
      jsonText = jsonText.trim();

      const list = JSON.parse(jsonText);
      if (Array.isArray(list) && list.length > 0) {
        cachedNotifications = list;
        lastNotificationsFetch = now;
        return res.json({ notifications: list });
      }
    }
  } catch (err: any) {
    const errMessage = err?.message || String(err);
    if (errMessage.includes("429") || errMessage.includes("quota") || errMessage.includes("RESOURCE_EXHAUSTED")) {
      console.log("[INFO] Gemini API rate limit/quota reached (429/RESOURCE_EXHAUSTED) for latest-notifications. Fallback to premium offline job alerts database.");
    } else {
      console.log("[INFO] Live job notifications fetch fallback (using offline database):", errMessage);
    }
  }

  // Fallback to high-quality localized 2026 database
  const fallback = [
    {
      "id": 101,
      "text": "Indian Air Force (IAF) Agniveervayu intake 02/2026 registration dates scheduled. Registrations open from July 8, 2026 on the CDAC portal.",
      "hindiText": "भारतीय वायु सेना (IAF) अग्निवीरवायु 02/2026 बैच के लिए पंजीकरण की तिथियां जारी। आवेदन CDAC पोर्टल पर 8 जुलाई 2026 से उपलब्ध।",
      "type": "urgent",
      "link": "https://agnipathvayu.cdac.in",
      "date": "June 19, 2026"
    },
    {
      "id": 102,
      "text": "UPSC CDS-II & NDA-II examination notice out. Written test Scheduled on August 30, 2026 nationwide. Keep tracking upsc.gov.in for hall tickets.",
      "hindiText": "UPSC CDS-II और NDA-II परीक्षा सूचना जारी। लिखित परीक्षा 30 अगस्त 2026 को देश भर में होगी। एडमिट कार्ड के लिए upsc.gov.in देखें।",
      "type": "new",
      "link": "https://upsc.gov.in",
      "date": "June 18, 2026"
    },
    {
      "id": 103,
      "text": "Agniveer Army Rally West Zone Merit List published for General Duty & Tradesmen units. Candidates can download PDFs on official Indian Army web portal.",
      "hindiText": "अग्निवीर आर्मी रैली वेस्ट जोन मेरिट सूची (GD और ट्रेड्समैन) जारी। उम्मीदवार भारतीय सेना के आधिकारिक वेब पोर्टल पर जाकर PDF डाउनलोड कर सकते हैं।",
      "type": "result",
      "link": "https://joinindianarmy.nic.in",
      "date": "June 17, 2026"
    },
    {
      "id": 104,
      "text": "SSC Constable GD physical standard test (PST/PET) admit card links populated for Bihar and Uttar Pradesh qualified list. Download your center details.",
      "hindiText": "SSC कांस्टेबल GD शारीरिक परीक्षा (PST/PET) एडमिट कार्ड लिंक जारी। योग्य उम्मीदवार अपने परीक्षा केंद्र और तारीख देखने के लिए लॉगिन करें।",
      "type": "urgent",
      "link": "https://ssc.gov.in",
      "date": "June 16, 2026"
    },
    {
      "id": 105,
      "text": "CISF Constable Fireman written test schedules and revised syllabus announced. Offline exam in multiple sessions to begin mid July.",
      "hindiText": "CISF कांस्टेबल फायरमैन लिखित परीक्षा कार्यक्रम और संशोधित पाठ्यक्रम की घोषणा। बहु-चरणीय परीक्षा जुलाई के मध्य से शुरू होगी।",
      "type": "general",
      "link": "https://cisfrectt.cisf.gov.in",
      "date": "June 15, 2026"
    },
    {
      "id": 106,
      "text": "Weekly National General Knowledge mock test commences this Sunday at 10:00 AM on AgniPariksha. Track rankings for physical academy badge credits.",
      "hindiText": "सातिरिक्त राष्ट्रीय सामान्य ज्ञान मॉक टेस्ट इस रविवार सुबह 10:00 बजे अग्निपरीक्षा पर शुरू होगा। फिजिकल अकादमी बैज क्रेडिट के लिए रैंकिंग ट्रैक करें।",
      "type": "new",
      "link": "https://upsc.gov.in",
      "date": "June 15, 2026"
    }
  ];

  return res.json({ notifications: fallback });
});

// API: Latest Sarkari Result Jobs (Dynamic Real-Time Govt Vacancies with scraping and feed fallback)
let cachedSarkariJobs: any[] | null = null;
let lastSarkariJobsFetch = 0;

app.get("/api/sarkari-jobs", async (req: express.Request, res: express.Response) => {
  const forceBypassCache = req.query.force === "true";
  const now = Date.now();

  if (cachedSarkariJobs && (now - lastSarkariJobsFetch < 30 * 60 * 1000) && !forceBypassCache) {
    console.log("Serving sarkari-jobs from memory cache...");
    return res.json({ jobs: cachedSarkariJobs });
  }

  let rawXml = "";
  let feedUsed = false;

  try {
    console.log("Attempting direct sync from Sarkari Result official feed (https://www.sarkariresult.com/feed/)...");
    const controller = new AbortController();
    const abortTimeout = setTimeout(() => controller.abort(), 8000);

    const feedRes = await fetch("https://www.sarkariresult.com/feed/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/xml, text/xml, */*"
      },
      signal: controller.signal
    });

    clearTimeout(abortTimeout);

    if (feedRes.ok) {
      rawXml = await feedRes.text();
      if (rawXml && rawXml.includes("<item>")) {
        feedUsed = true;
        console.log("Sarkari Result XML RSS Feed successfully acquired. Length:", rawXml.length);
      }
    } else {
      console.log(`Feed fetch failed with response status: ${feedRes.status}`);
    }
  } catch (feedErr: any) {
    console.log("Network direct RSS feed fetch timed out or failed. Falling back to Search Grounding.", feedErr?.message || feedErr);
  }

  try {
    if (ai) {
      let promptString = "";
      if (feedUsed) {
        console.log("Synthesizing Sarkari RSS Feed Items through Gemini 3.5 Flash Model parser...");
        promptString = `You are an expert system parser for Indian State and Central Government Job updates.
Below is the live retrieved XML RSS Feed data from https://www.sarkariresult.com/feed/:
---
${rawXml.slice(0, 30000)}
---
Tasks:
1. Examine the <item> containers in the XML document. Retrieve the 6-8 most recent recruitment listings.
2. From their specific text blocks, extract or enrich high-quality structured items for our portal.
3. Every card must have full informational fields:
   - "id": A unique string, e.g., "sarkari-feed-1", "sarkari-feed-2"
   - "title": Clean full job name (e.g., 'SSC Multi Tasking Staff MTS Exam 2026' or 'Army Agniveer Scheme 02/2026')
   - "category": Match EXACTLY with one: 'Army', 'Navy', 'Air Force', 'Agniveer', 'SSC', 'UPSC', 'Railway', 'Police', 'Banking', 'State Gov'
   - "eligibility": Guidelines or physical standards (e.g., 'Indian male and female nationals meeting physical fitness.')
   - "ageLimit": Extrapolated age limits (e.g., '18 - 25 Years')
   - "qualification": Minimum educational standard (e.g., '10th class pass / Matriculation or equivalent')
   - "salary": Realistic approximate scale (e.g., '₹21,700 - ₹69,100')
   - "selectionProcess": Selection stages (e.g., 'Computer Based Test (CBE), Physical Standard Test (PST) and Medical Board evaluation.')
   - "importantDates": Object with registration start/end dates in YYYY-MM-DD format and exam timeline
   - "applyLink": Valid target website URL (e.g. ssc.gov.in, Join Indian Army Portal, or sarkariresult.com direct registration link)

Return raw JSON arrays resembling the schema structure. Do NOT wrap output inside \`\`\`json markdown blocks:
[
  {
    "id": "string",
    "title": "string",
    "category": "string",
    "eligibility": "string",
    "ageLimit": "string",
    "qualification": "string",
    "salary": "string",
    "selectionProcess": "string",
    "importantDates": { "start": "YYYY-MM-DD", "end": "YYYY-MM-DD", "exam": "string" },
    "applyLink": "string"
  }
]`;
      } else {
        console.log("Fetching live Sarkari Result notifications via Gemini Search Grounding fallback...");
        promptString = `Research actual, live ongoing or upcoming Indian government and armed forces job vacancies published or active on sarkariresult.com (or official boards like UPSC, SSC, Railway Recruitment Board RRB, State Police Boards, Agnipath/Agniveer CDAC) in 2026.
Generate a comprehensive list of exactly 6-8 highly authentic vacancies with full details.

Return raw JSON strictly matching the structure below. Do NOT use markdown code blocks on the outer wrapper:
[
  {
    "id": "sarkari-job-1",
    "title": "Full job title (e.g. 'UP Police Constable Recruitment 2026' or 'SSC CGL Tier-1 Online Form 2026')",
    "category": "One of: Army, Navy, Air Force, Agniveer, SSC, UPSC, Railway, Police, Banking, State Gov",
    "eligibility": "Detail of eligibility guidelines or physical standards (e.g. 'All Indian male/female nationals within age limit.')",
    "ageLimit": "Age bracket (e.g. '18 - 25 Years as of July 1, 2026.')",
    "qualification": "Educational requirements (e.g. 'Passed 10+2 Intermediate Exam from recognized board.')",
    "salary": "Pay scale or stipend (e.g. '₹21,700 - ₹69,100 (Pay Level 3)')",
    "selectionProcess": "Full details of phases of vetting (written entrance, physical benchmarks, medical examination and merit check.)",
    "importantDates": {
      "start": "Registration commencement (e.g. '2026-06-18')",
      "end": "Closing date (e.g. '2026-07-18')",
      "exam": "Tentative schedule or notification status (e.g. 'August 2026')"
    },
    "applyLink": "Genuine direct apply URL or respective official portal URL (e.g. 'https://ssc.gov.in' or 'https://sarkariresult.com' or 'https://joinindianarmy.nic.in')"
  }
]`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptString,
        config: {
          tools: feedUsed ? [] : [{ googleSearch: {} }],
          temperature: 0.7,
          responseMimeType: "application/json"
        }
      });

      let jsonText = response.text || "";
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
      }
      jsonText = jsonText.trim();

      const list = JSON.parse(jsonText);
      if (Array.isArray(list) && list.length > 0) {
        cachedSarkariJobs = list;
        lastSarkariJobsFetch = now;
        return res.json({ jobs: list });
      }
    }
  } catch (err: any) {
    const errMessage = err?.message || String(err);
    console.log("[INFO] Live xml parsing or search grounding failed, fallback to local high-yield database: ", errMessage);
  }

  // Generate real dynamic dates matching current system month and year in 2026
  const formatOffsetDate = (offsetDays: number): string => {
    const d = new Date(now + offsetDays * 24 * 60 * 60 * 1000);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${dy}`;
  };

  // Fallback to high-quality localized 2026 database with dynamic relative dates
  const fallback = [
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
        start: formatOffsetDate(-10),
        end: formatOffsetDate(20),
        exam: formatOffsetDate(45)
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
        start: formatOffsetDate(-18),
        end: formatOffsetDate(12),
        exam: formatOffsetDate(35)
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
        start: formatOffsetDate(-5),
        end: formatOffsetDate(25),
        exam: formatOffsetDate(60)
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
        start: formatOffsetDate(-25),
        end: formatOffsetDate(10),
        exam: formatOffsetDate(40)
      },
      applyLink: "https://indianrailways.gov.in"
    },
    {
      id: "job-up-const-1",
      title: "UP Police Constable Vacancy Online Form 2026",
      category: "Police",
      eligibility: "Resident of India with specific physical standards (Male: 168 cm, Female: 152 cm height).",
      ageLimit: "18 to 25 Years",
      qualification: "Passed 10+2 Intermediate Exam from any recognized board in India.",
      salary: "₹21,700 - ₹69,100 (Grade Pay 2000)",
      selectionProcess: "Written OMR Board Test, Document Verification (DV), Physical Standard Test (PST) and Physical Efficiency Test (PET) running check.",
      importantDates: {
        start: formatOffsetDate(-8),
        end: formatOffsetDate(22),
        exam: formatOffsetDate(55)
      },
      applyLink: "https://uppbpb.gov.in"
    },
    {
      id: "job-sbi-po-1",
      title: "SBI Probationary Officers (PO) Junior Management Scale 2026",
      category: "Banking",
      eligibility: "Indian citizens with graduate degree or final year candidates.",
      ageLimit: "21 to 30 Years",
      qualification: "Graduation in any discipline from a recognized University or any equivalent qualification recognized by the Central Government.",
      salary: "₹41,960 - ₹63,840 (with 4 advanced increments)",
      selectionProcess: "Phase I: Preliminary Objective Test, Phase II: Main Examination (Objective + Descriptive), Phase III: Psychometric Test & Interview.",
      importantDates: {
        start: formatOffsetDate(-15),
        end: formatOffsetDate(15),
        exam: formatOffsetDate(50)
      },
      applyLink: "https://sbi.co.in/careers"
    }
  ];

  cachedSarkariJobs = fallback;
  lastSarkariJobsFetch = now;

  return res.json({ jobs: fallback });
});

// API: Daily Automated Current Affairs Date-wise from DrishtiIAS Feed
let cachedCurrentAffairs: any[] | null = null;
let lastCurrentAffairsFetch = 0;

app.get("/api/current-affairs", async (req: express.Request, res: express.Response) => {
  const forceBypassCache = req.query.force === "true";
  const now = Date.now();

  if (cachedCurrentAffairs && (now - lastCurrentAffairsFetch < 30 * 60 * 1000) && !forceBypassCache) {
    console.log("Serving cached current affairs from memory...");
    return res.json({ affairs: cachedCurrentAffairs });
  }

  let feedPayload = "";
  let feedSuccess = false;

  try {
    console.log("Fetching live RSS feed / payload from Drishti IAS Current Affairs Quiz Set...");
    const url = "https://www.drishtiias.com/hindi/quiz/quizlist/current-affairs-quiz-set";
    const controller = new AbortController();
    const abortTimeout = setTimeout(() => controller.abort(), 8000);

    const dRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
      },
      signal: controller.signal
    });

    clearTimeout(abortTimeout);

    if (dRes.ok) {
      feedPayload = await dRes.text();
      if (feedPayload && feedPayload.length > 500) {
        feedSuccess = true;
        console.log("Successfully fetched DrishtiIAS payload, size:", feedPayload.length);
      }
    } else {
      console.log("DrishtiIAS fetch returned status:", dRes.status);
    }
  } catch (err: any) {
    console.log("Direct DrishtiIAS fetch failed/timeout. Relying on Gemini search grounding instead.", err?.message || err);
  }

  try {
    if (ai) {
      console.log("Analyzing Drishti IAS payload using Gemini...");
      let queryPrompt = "";

      if (feedSuccess) {
        queryPrompt = `The following block is extracted HTML/text content from Drishti IAS Hindi Current Affairs list:
---
${feedPayload.slice(0, 30000)}
---
Please parse, match, and transform active current affairs topics into 5-6 date-wise historical affairs objects.
For each item, generate high-quality entries that contain:
- "id": A unique string, e.g. "ca-drishti-1", "ca-drishti-2"
- "date": Date of publication (e.g. "June 20, 2026" or matching the source list item date)
- "titleEng": Translated highly descriptive headline of the affair in English (clean, professional phrasing)
- "titleHin": Authentic Title of the affair in Hindi as presented in the article topic or feed list
- "source": "Drishti IAS daily current affairs"
- "summaryEng": Summary of the topic (at least 2-3 sentences) in English
- "summaryHin": Summary of the topic (at least 2-3 sentences) in Hindi
- "quizQuestion": {
    "text": "A challenging quiz question matching the news affair, with both English and Hindi text combined (e.g., 'What is the target year? / लक्ष्य वर्ष क्या है?')",
    "options": ["Option A (Eng / Hindi)", "Option B (Eng / Hindi)", "Option C (Eng / Hindi)", "Option D (Eng / Hindi)"],
    "correctAnswer": 0,
    "explanation": "Detailed professional explanation of correct answer in both English & Hindi side-by-side"
}

Return raw JSON strictly matching the specified format. Do NOT wrap output layout in markdown code blocks:
[
  {
    "id": "string",
    "date": "string",
    "titleEng": "string",
    "titleHin": "string",
    "source": "string",
    "summaryEng": "string",
    "summaryHin": "string",
    "quizQuestion": {
      "text": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": 0,
      "explanation": "string"
    }
  }
]`;
      } else {
        queryPrompt = `Research live date-wise Indian Current Affairs and general knowledge questions published on Drishti IAS 'hindi/quiz/quizlist/current-affairs-quiz-set' in 2026.
Formulate 5-6 highly authentic daily bulletin blocks with corresponding revision check questions.
For each block, yield:
- "id": A unique string, e.g. "ca-sys-1", "ca-sys-2"
- "date": Accurate date (e.g., "June 20, 2026")
- "titleEng": Clear news title in English
- "titleHin": Clear news title in Hindi
- "source": "Drishti IAS Current Affairs Quiz"
- "summaryEng": Detailed recap in English
- "summaryHin": Detailed recap in Hindi
- "quizQuestion": {
    "text": "A challenging quiz question matching the news affair, with both English and Hindi text combined (e.g. 'What is the goal? / लक्ष्य क्या है?')",
    "options": ["Option A (Eng / Hindi)", "Option B (Eng / Hindi)", "Option C (Eng / Hindi)", "Option D (Eng / Hindi)"],
    "correctAnswer": 0,
    "explanation": "Detailed professional explanation of correct answer in both languages side-by-side"
}

Return raw, valid JSON. Do not wrap output inside \`\`\`json blocks:
[
  {
    "id": "string",
    "date": "string",
    "titleEng": "string",
    "titleHin": "string",
    "source": "string",
    "summaryEng": "string",
    "summaryHin": "string",
    "quizQuestion": {
      "text": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": 0,
      "explanation": "string"
    }
  }
]`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: queryPrompt,
        config: {
          tools: feedSuccess ? [] : [{ googleSearch: {} }],
          temperature: 0.7,
          responseMimeType: "application/json"
        }
      });

      let jsonText = response.text || "";
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
      }
      jsonText = jsonText.trim();

      const decoded = JSON.parse(jsonText);
      if (Array.isArray(decoded) && decoded.length > 0) {
        cachedCurrentAffairs = decoded;
        lastCurrentAffairsFetch = now;
        return res.json({ affairs: decoded });
      }
    }
  } catch (err: any) {
    console.log("[INFO] Automated Current Affairs parsing failed. Reverting to robust localized fallback databank:", err?.message || err);
  }

  // Generate real dynamic date strings like "June 20, 2026"
  const formatAffairsDate = (offsetDays: number): string => {
    const d = new Date(now + offsetDays * 24 * 60 * 60 * 1000);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  // Fallback to localized date-wise high-quality current affairs items using current relative dates
  const fallbackAffairs = [
    {
      id: "fallback-ca-1",
      date: formatAffairsDate(0),
      titleEng: "India's Digital Rupee Offline Capability Extends Nationally",
      titleHin: "ई-रुपया (e-Rupee) की ऑफलाइन लेन-देन क्षमता का देशव्यापी विस्तार",
      source: "Drishti IAS Current Affairs Quiz",
      summaryEng: "The RBI successfully deployed offline transaction capabilities for the Central Bank Digital Currency (CBDC-R), enabling rural transactions without active internet grids.",
      summaryHin: "भारतीय रिजर्व बैंक ने सेंट्रल बैंक डिजिटल करेंसी (CBDC-R) के लिए ऑफलाइन लेनदेन क्षमताओं का सफल विस्तार किया है, जिससे इंटरनेट ग्रिड के बिना ग्रामीण क्षेत्रों में सुरक्षित लेनदेन संभव हो सकेगा।",
      quizQuestion: {
        text: "Which currency initiative of the Reserve Bank of India is designated as CBDC-R for retail users? / खुदरा उपयोगकर्ताओं के लिए किस आरबीआई मुद्रा पहल को CBDC-R नामित किया गया है?",
        options: [
          "Digital Rupee / डिजिटल रुपया (e-Rupee)",
          "Unified Payments Interface / एकीकृत भुगतान इंटरफ़ेस (UPI)",
          "Bharat Bill Pay / भारत बिल पे",
          "RuPay Debit Card / रुपे डेबिट कार्ड"
        ],
        correctAnswer: 0,
        explanation: "The Digital Rupee is the CBDC-R retail variant introduced for paperless fiat transactions. / डिजिटल रुपया (e-Rupee) आरबीआई द्वारा कागज़ रहित फिएट लेनदेन हेतु शुरू किया गया खुदरा CBDC-R संस्करण है।"
      }
    },
    {
      id: "fallback-ca-2",
      date: formatAffairsDate(-1),
      titleEng: "Global Biodiversity Framework targets monitored at High Summit",
      titleHin: "वैश्विक जैव विविधता फ्रेमवर्क लक्ष्यों की उच्च कमान शिखर सम्मेलन में निगरानी",
      source: "Drishti IAS Current Affairs Quiz",
      summaryEng: "Environmental summits validated target indicators concerning pesticide usage reduction and the protection of 30% of global marine and terrestrial zones by 2030.",
      summaryHin: "पर्यावरण शिखर सम्मेलनों में वर्ष 2030 तक कीटनाशकों के उपयोग को कम करने और वैश्विक समुद्री तथा स्थलीय क्षेत्रों के 30% हिस्से को संरक्षित करने से संबंधित संकेतकों का सत्यापन किया गया।",
      quizQuestion: {
        text: "What percentage of marine and terrestrial systems must be conserved by 2030 as per the Kunming-Montreal Global Biodiversity Framework? / कुनमिंग-मॉन्तरियल वैश्विक जैव विविधता फ्रेमवर्क के अनुसार 2030 तक कितने प्रतिशत समुद्री और स्थलीय प्रणालियों का संरक्षण आवश्यक है?",
        options: [
          "20% / 20 प्रतिशत",
          "30% / 30 प्रतिशत",
          "40% / 40 प्रतिशत",
          "50% / 50 प्रतिशत"
        ],
        correctAnswer: 1,
        explanation: "The cornerstone target is the protection of at least 30% of global land and oceans by 2030. / मुख्य आधार लक्ष्य 2030 तक कम से कम 30% वैश्विक भूमि और महासागरों का संरक्षण करना है।"
      }
    },
    {
      id: "fallback-ca-3",
      date: formatAffairsDate(-2),
      titleEng: "PM-Pranam Fertilizers Optimization Initiative achieving major milestone",
      titleHin: "पीएम-प्रणाम (PM-PRANAM) वैकल्पिक उर्वरक संवर्धन योजना ने नया मील का पत्थर हासिल किया",
      source: "Drishti IAS Current Affairs Quiz",
      summaryEng: "States adopting organic alternative fertilization saw a marked reduction in chemical subsidy burdens, advancing agricultural sustainability objectives.",
      summaryHin: "प्रकृति-अनुकूल उर्वरकों को अपनाने वाले राज्यों ने रासायनिक उर्वरक सब्सिडी लागत में उल्लेखनीय गिरावट दर्ज की, जिससे कृषि स्थिरता उद्देश्यों को गति मिली।",
      quizQuestion: {
        text: "PM-PRANAM scheme is primarily dedicated to which agricultural sector? / पीम-प्रणाम (PM-PRANAM) योजना मुख्य रूप से किस कृषि क्षेत्र को समर्पित है?",
        options: [
          "Alternative Fertilizer Promotion / वैकल्पिक उर्वरक संवर्धन",
          "Micro-Irrigation Installation / सूक्ष्म सिंचाई स्थापना",
          "Cold Storage Subsidies / कोल्ड स्टोरेज सब्सिडी",
          "Pesticides Free Organic Certification / कीटनाशक मुक्त जैविक प्रमाणन"
        ],
        correctAnswer: 0,
        explanation: "PM-PRANAM aims to incentivize states to promote alternative organic fertilizers and reduce chemical urea dependency. / पीएम-प्रणाम का उद्देश्य राज्यों को वैकल्पिक जैविक उर्वरकों को बढ़ावा देने और रासायनिक यूरिया पर निर्भरता कम करने के लिए प्रोत्साहित करना है।"
      }
    }
  ];

  cachedCurrentAffairs = fallbackAffairs;
  lastCurrentAffairsFetch = now;

  return res.json({ affairs: fallbackAffairs });
});

// API: Get Automated Daily Researched Exam Notes & Blogs (Checks 12h gap)
app.get("/api/get-automated-content", async (req: express.Request, res: express.Response) => {
  try {
    const force = req.query.force === "true";
    await checkAndGenerateAutomatedContent(force);
    
    if (fs.existsSync(STORAGE_PATH)) {
      const data = JSON.parse(fs.readFileSync(STORAGE_PATH, "utf-8"));
      res.json(data);
    } else {
      res.json({ lastGenerated: 0, blogs: [], studyNotes: [] });
    }
  } catch (err: any) {
    console.error("Failed to serve automated content API:", err);
    res.status(500).json({ error: "Failed to load automated content", details: err.message });
  }
});

app.post("/api/get-automated-content", async (req: express.Request, res: express.Response) => {
  try {
    // Force immediate web research check
    await checkAndGenerateAutomatedContent(true);
    
    if (fs.existsSync(STORAGE_PATH)) {
      const data = JSON.parse(fs.readFileSync(STORAGE_PATH, "utf-8"));
      res.json(data);
    } else {
      res.json({ lastGenerated: 0, blogs: [], studyNotes: [] });
    }
  } catch (err: any) {
    console.error("Error manual trigger dynamic publisher:", err);
    res.status(500).json({ error: "Failed to trigger generator", details: err.message });
  }
});

// API: Robust Mock Test Questions (Dynamic generation via Gemini with high-quality localized 10-question fallback)
let cachedMockTest: any[] | null = null;
let lastMockTestFetch = 0;

app.get("/api/gk-mock-test", async (req: express.Request, res: express.Response) => {
  const forceBypassCache = req.query.force === "true";
  const now = Date.now();

  // Fresh for 10 minutes cache
  if (cachedMockTest && (now - lastMockTestFetch < 10 * 60 * 1000) && !forceBypassCache) {
    console.log("Serving gk-mock-test from memory cache...");
    return res.json({ questions: cachedMockTest });
  }

  try {
    if (ai) {
      console.log("Generating fresh GK Mock Test questions via Gemini...");
      const promptString = `Generate a set of exactly 10 high-quality, professional, bilingual (English and Hindi) multiple-choice General Knowledge, Defence forces, general science, and history questions for a competitive exam mock series.
Each question must be challenging, authentic, and styled like real Agniveer Navy, Army, SSC GD, Railway, and State civil service papers.

Return raw JSON strictly matching the structure below. Do NOT use markdown code blocks (\`\`\`json on the outer wrapper):
[
  {
    "id": "dynamic-mock-1",
    "text": "English question text here (e.g. 'Which is the oldest paramilitary force in India?')",
    "hindiText": "हिन्दी में प्रश्न (जैसे 'भारत का सबसे पुराना अर्धसैनिक बल कौन सा है?')",
    "options": [
      "Assam Rifles / असम राइफल्स",
      "Border Security Force / सीमा सुरक्षा बल",
      "Central Reserve Police Force / केन्द्रीय रिजर्व पुलिस बल",
      "Indo-Tibetan Border Police / भारत-तिब्बत सीमा पुलिस"
    ],
    "correctAnswer": 0,
    "explanation": "Assam Rifles was established in 1835 and is the oldest paramilitary force. / असम राइफल्स की स्थापना 1835 में हुई थी और यह भारत का सबसे पुराना अर्धसैनिक बल है।"
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptString,
        config: {
          temperature: 0.85,
          responseMimeType: "application/json"
        }
      });

      let jsonText = response.text || "[]";
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
      }
      jsonText = jsonText.trim();

      const questions = JSON.parse(jsonText);
      if (Array.isArray(questions) && questions.length > 0) {
        cachedMockTest = questions;
        lastMockTestFetch = now;
        return res.json({ questions });
      }
    }
  } catch (err: any) {
    const errMessage = err?.message || String(err);
    if (errMessage.includes("429") || errMessage.includes("quota") || errMessage.includes("RESOURCE_EXHAUSTED")) {
      console.log("[INFO] Gemini API limit reached for gk-mock-test. Serving offline high-yield 10-question mockup pool.");
    } else {
      console.warn("GK mock test generation encountered error, serving robust local fallback:", errMessage);
    }
  }

  // Curated premium backup pool of 10 real bilingual questions
  const backupPool = [
    {
      "id": "backup-mock-1",
      "text": "What is the highest peacetime gallantry award in India?",
      "hindiText": "भारत में शांति काल का सर्वोच्च वीरता पुरस्कार कौन सा है?",
      "options": [
        "Param Vir Chakra / परमवीर चक्र",
        "Ashoka Chakra / अशोक चक्र",
        "Kirti Chakra / कीर्ति चक्र",
        "Vir Chakra / वीर चक्र"
      ],
      "correctAnswer": 1,
      "explanation": "The Ashoka Chakra is India's highest peacetime military decoration awarded for valor, courageous action or self-sacrifice away from the battlefield. / अशोक चक्र शौर्य, साहसी कार्रवाई या युद्ध के मैदान से दूर आत्म-बलिदान के लिए दिया जाने वाला भारत का शांति काल का सर्वोच्च सैन्य सम्मान है।"
    },
    {
      "id": "backup-mock-2",
      "text": "Which Article of the Indian Constitution outlines the process for constitutional amendments?",
      "hindiText": "भारतीय संविधान का कौन सा अनुच्छेद संवैधानिक संशोधन की प्रक्रिया को रेखांकित करता है?",
      "options": [
        "Article 356 / अनुच्छेद 356",
        "Article 360 / अनुच्छेद 360",
        "Article 368 / अनुच्छेद 368",
        "Article 370 / अनुच्छेद 370"
      ],
      "correctAnswer": 2,
      "explanation": "Article 368 of the Constitution of India grants Parliament the power to amend the constitution in accordance with specified procedures. / भारतीय संविधान का अनुच्छेद 368 संसद को निर्दिष्ट प्रक्रियाओं के अनुसार संविधान में संशोधन करने की शक्ति प्रदान करता है।"
    },
    {
      "id": "backup-mock-3",
      "text": "Which is the highest mountain peak located entirely within India's borders?",
      "hindiText": "पूरी तरह से भारतीय सीमाओं के भीतर स्थित सबसे ऊंची पर्वत चोटी कौन सी है?",
      "options": [
        "Mount Everest / माउंट एवरेस्ट",
        "K2 (Godwin-Austen) / के2",
        "Kangchenjunga / कंचनजंगा",
        "Nanda Devi / नंदा देवी"
      ],
      "correctAnswer": 2,
      "explanation": "Kangchenjunga is the third highest mountain in the world and the highest located in India (Sikkim). Mount Everest is in Nepal, and K2 lies in Pok/Karakoram. / कंचनजंगा दुनिया का तीसरा सबसे ऊंचा और भारत (सिक्किम) में स्थित सबसे ऊंचा पर्वत है। एवरेस्ट नेपाल में है और के2 पीओके में स्थित है।"
    },
    {
      "id": "backup-mock-4",
      "text": "Which of the following is the oldest paramilitary force in India?",
      "hindiText": "निम्नलिखित में से भारत का सबसे पुराना अर्धसैनिक बल कौन सा है?",
      "options": [
        "Border Security Force (BSF) / सीमा सुरक्षा बल",
        "Central Reserve Police Force (CRPF) / केन्द्रीय रिजर्व पुलिस बल",
        "Assam Rifles / असम राइफल्स",
        "Central Industrial Security Force (CISF) / केन्द्रीय औद्योगिक सुरक्षा बल"
      ],
      "correctAnswer": 2,
      "explanation": "Assam Rifles is the oldest paramilitary force in India, established in 1835 under the name 'Cachar Levy'. / असम राइफल्स भारत का सबसे पुराना अर्धसैनिक बल है, जिसकी स्थापना 1835 में 'कछार लेवी' के नाम से की गई थी।"
    },
    {
      "id": "backup-mock-5",
      "text": "Which part of the computer acts as its primary logic and control center, or 'brain'?",
      "hindiText": "कंप्यूटर का कौन सा हिस्सा इसके प्राथमिक तर्क और नियंत्रण केंद्र अर्थात 'मस्तिष्क' के रूप में कार्य करता है?",
      "options": [
        "Random Access Memory (RAM) / रैम",
        "Hard Disk Drive (HDD) / हार्ड डिस्क",
        "Central Processing Unit (CPU) / सीपीयू",
        "Graphics Processing Unit (GPU) / जीपीयू"
      ],
      "correctAnswer": 2,
      "explanation": "The CPU (Central Processing Unit) performs all basic arithmetic, logical, and control operations, making it the computer's brain. / सीपीयू (सेंट्रल प्रोसेसिंग यूनिट) सभी बुनियादी अंकगणितीय, तार्किक और नियंत्रण कार्यों को निष्पादित करता है, जो इसे कंप्यूटर का मस्तिष्क बनाता है।"
    },
    {
      "id": "backup-mock-6",
      "text": "The First Battle of Panipat was fought in 1526 between Babur and whom?",
      "hindiText": "पानीपत की पहली लड़ाई 1526 में बाबर और किसके बीच लड़ी गई थी?",
      "options": [
        "Ibrahim Lodi / इब्राहिम लोदी",
        "Sher Shah Suri / शेर शाह सूरी",
        "Hem Chandra Vikramaditya / हेमू",
        "Rana Sanga / राणा सांगा"
      ],
      "correctAnswer": 0,
      "explanation": "The First Battle of Panipat (21 April 1526) was fought between Babur's invading Mughal forces and the Lodi Empire, marking the foundation of the Mughal era. / पानीपत की पहली लड़ाई (21 अप्रैल 1526) बाबर की हमलावर मुगल सेना और लोदी साम्राज्य के बीच लड़ी गई थी, जो मुगल काल की नींव थी।"
    },
    {
      "id": "backup-mock-7",
      "text": "Who governs and regulates the supply of paper currency coins and reserves in India?",
      "hindiText": "भारत में कागजी मुद्रा, सिक्कों और भंडार की आपूर्ति का संचालन और नियमन कौन करता है?",
      "options": [
        "State Bank of India (SBI) / भारतीय स्टेट बैंक",
        "Reserve Bank of India (RBI) / भारतीय रिजर्व बैंक",
        "Securities and Exchange Board of India (SEBI) / सेबी",
        "Ministry of Commerce /  वाणिज्य मंत्रालय"
      ],
      "correctAnswer": 1,
      "explanation": "The Reserve Bank of India (RBI) is India's central bank and regulatory authority for monetary policies and currency management. / भारतीय रिजर्व बैंक (RBI) भारत का केंद्रीय बैंक है जो मौद्रिक नीतियों और मुद्रा प्रबंधन के लिए प्रमुख नियामक प्राधिकरण है।"
    },
    {
      "id": "backup-mock-8",
      "text": "Which is the deepest oceanic trench on Earth?",
      "hindiText": "पृथ्वी पर सबसे गहरी महासागरीय गर्त कौन सी है?",
      "options": [
        "Puerto Rico Trench / प्यूर्टो रिको गर्त",
        "Mariana Trench / मारियाना गर्त",
        "Sundas Trench / सुंडा गर्त",
        "Java Trench / जावा गर्त"
      ],
      "correctAnswer": 1,
      "explanation": "The Challenger Deep inside the Mariana Trench in the western Pacific Ocean is the deepest point in the world's oceans. / पश्चिमी प्रशांत महासागर में मारियाना गर्त के भीतर स्थित चैलेंजर डीप दुनिया के महासागरों का सबसे गहरा स्थान है।"
    },
    {
      "id": "backup-mock-9",
      "text": "In which medium does sound travel with the highest speed at a given temperature?",
      "hindiText": "दिए गए तापमान पर ध्वनि किस माध्यम में सबसे अधिक गति से यात्रा करती है?",
      "options": [
        "Vacuum / निर्वात",
        "Air (Gas) / वायु (गैस)",
        "Water (Liquid) / पानी (द्रव)",
        "Steel (Solid) / स्टील (ठोस)"
      ],
      "correctAnswer": 3,
      "explanation": "Sound is a mechanical wave and travels fastest in solids (like steel) due to the dense arrangement and high elasticity of particles. / ध्वनि एक यांत्रिक तरंग है जो कणों की सघन संरचना और उच्च लोच के कारण ठोस (जैसे स्टील) में सबसे तेज गति करती है।"
    },
    {
      "id": "backup-mock-10",
      "text": "Which two air polluting gases are primarily responsible for the formation of acid rain?",
      "hindiText": "अम्लीय वर्षा के निर्माण के लिए मुख्य रूप से कौन सी दो वायु प्रदूषक गैसें जिम्मेदार हैं?",
      "options": [
        "Carbon Monoxide & Hydrogen / कार्बन मोनोऑक्साइड और हाइड्रोजन",
        "Oxygen & Carbon Dioxide / ऑक्सीजन और कार्बन डाइऑक्साइड",
        "Sulfur Dioxide & Nitrogen Oxides / सल्फर डाइऑक्साइड और नाइट्रोजन ऑक्साइड",
        "Methane & Helium / मीथेन और हीलियम"
      ],
      "correctAnswer": 2,
      "explanation": "Sulfur dioxide (SO2) and Nitrogen oxides (NOx) react with water vapor, oxygen, and other chemicals in the atmosphere to form sulfuric and nitric acids. / सल्फर डाइऑक्साइड (SO2) and नाइट्रोजन ऑक्साइड (NOx) वायुमंडल में जल वाष्प, ऑक्सीजन और अन्य रसायनों के साथ प्रतिक्रिया करके सल्फ्यूरिक और नाइट्रिक अम्ल बनाते हैं।"
    }
  ];

  return res.json({ questions: backupPool });
});

// API: Live Grounded AI Mentor/Tutor Chat
app.post("/api/chat", async (req: express.Request, res: express.Response) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "No message parameter provided" });
    }

    if (ai) {
      console.log(`[INFO] Chat Query received to Agni AI: "${message.substring(0, 50)}..."`);
      
      const chatHistory = (history || []).map((h: any) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      }));

      const chatSession = ai.chats.create({
        model: "gemini-2.5-flash",
        history: chatHistory,
        config: {
          systemInstruction: `You are Agni AI, a professional and highly authoritative study mentor and General Knowledge tutor for Indian Armed Forces exams (Agniveer, Navy, Air Force, NDA, CDS) and standard Civil Service exams (such as SSC GD, State Police, Railway recruitment exams).
All chats must follow this criteria:
- Give highly precise, encouraging, accurate, and educational guidance.
- Speak primarily in professional Hindi or English, and freely mix both like a real tutor (Hinglish/Bilingual mode).
- Keep formatting clean using bold markdown structures. Avoid extremely long paragraphs. Use clear bullet points for syllabus topics or steps.
- Celebrate service, courage, patriot values and selection.
- If asked about live notifications or latest exams, refer them to check the "Latest Vacancies" section or use Google Search grounded capability if you can.`,
          tools: [{ googleSearch: {} }]
        }
      });

      const response = await chatSession.sendMessage({ message });
      const reply = response.text || "Jai Hind! I processed your query, but could not produce text. Let's try again!";
      return res.json({ reply });
    }
  } catch (err: any) {
    console.error("Agni AI Chat Client processing error:", err);
  }

  // Fallback / Simulated mode if offline or rate-limited
  const textLower = (req.body.message || "").toLowerCase();
  let defaultReply = `Jai Hind! I am operating in low-overhead offline mode right now due to server traffic. 

Here are some core directions for your study right now:
- **Navy/Agniveer**: Focus on Indian naval history (Maratha admiral Shivaji Maharaj - Father of the Indian Navy).
- **SSC GD / Police Forces**: Read current affairs summaries and practice our bilingual GK mock exams often!
- **NDA / CDS**: Pay special attention to the Indian Constitution Parts III (Articles 12-35) and Parts IV-A (Article 51A).

*To unlock unlimited active high-fidelity conversational mentoring, please connect your live GEMINI_API_KEY under the Settings tab.*`;

  if (textLower.includes("navy") || textLower.includes("shivaji") || textLower.includes("father")) {
    defaultReply = `**Father of the Indian Navy**: Chhatrapati Shivaji Maharaj is widely recognized as the Father of the Indian Navy. 
    
**Key facts**:
- He realized the strategic importance of a strong naval presence and developed a superior navy to protect the Konkan coastline from Janjira Siddis, Portuguese, and British forces.
- He built several coastal and sea forts like Sindhudurg, Padmadurg, and Vijaydurg.
- Modern Indian Navy pay homage to this by utilizing his octagonal royal seal design in the new naval crest/ensign (introduced in 2022).`;
  } else if (textLower.includes("duty") || textLower.includes("51a") || textLower.includes("fundamental")) {
    defaultReply = `**Fundamental Duties (अनुच्छेद 51A - Part IV-A)**:
They were added to the Indian Constitution by the **42nd Amendment Act of 1976** based on the recommendations of the **Swaran Singh Committee**.

**Key aspects**:
- Originally there were 10 duties; the 11th duty was added in 2002 by the **86th Amendment Act** (duty of parents/guardians to provide education opportunities to children aged 6-14).
- They are non-justiciable in nature (cannot be enforced directly by a court).
- They apply strictly to Indian citizens. Examples include respecting the National Flag, promoting harmony, safeguarding public property, and defending the nation.`;
  } else if (textLower.includes("step") || textLower.includes("agniveer") || textLower.includes("selection")) {
    defaultReply = `**Agniveer Selection Procedure**:
1. **Phase I**: Indian Army/Navy/Air Force Common Entrance Exam (CEE) Online base computer exam.
2. **Phase II**: Physical Fitness Test (PFT):
   - 1.6 KM run under 5 mins 30 secs for Group I.
   - Pull-ups / beam hangs.
   - 9-feet ditch jump and zig-zag balance check.
3. **Phase III**: Physical Measurement Test (PMT) checking height, chest expansion weight standards.
4. **Phase IV**: Comprehensive Medical Examination and Merit List final announcement.`;
  } else if (textLower.includes("hierarchy") || textLower.includes("rank") || textLower.includes("commission")) {
    defaultReply = `**Equivalence of Indian Commissioned Officers Ranks** (Army vs Navy vs Air Force):

1. **Top Ranks**:
   - Army: **General**
   - Navy: **Admiral**
   - Air Force: **Air Chief Marshal**
2. **Brigadier equivalent**:
   - Army: **Brigadier**
   - Navy: **Commodore**
   - Air Force: **Air Commodore**
3. **Lieutenant level**:
   - Army: **Lieutenant** (Starting rank)
   - Navy: **Sub-Lieutenant**
   - Air Force: **Flying Officer**`;
  }

  return res.json({ reply: defaultReply });
});

// Dynamic SEO friendly XML Sitemap route
app.get("/sitemap.xml", (req, res) => {
  res.setHeader("Content-Type", "application/xml");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://agnipariksha.com/</loc><priority>1.00</priority><changefreq>daily</changefreq></url>
  <url><loc>https://agnipariksha.com/quiz-categories</loc><priority>0.80</priority><changefreq>weekly</changefreq></url>
  <url><loc>https://agnipariksha.com/latest-jobs</loc><priority>0.90</priority><changefreq>daily</changefreq></url>
  <url><loc>https://agnipariksha.com/study-material</loc><priority>0.85</priority><changefreq>weekly</changefreq></url>
  <url><loc>https://agnipariksha.com/pdf-library</loc><priority>0.85</priority><changefreq>weekly</changefreq></url>
  <url><loc>https://agnipariksha.com/current-affairs</loc><priority>0.90</priority><changefreq>daily</changefreq></url>
  <url><loc>https://agnipariksha.com/leaderboard</loc><priority>0.70</priority><changefreq>weekly</changefreq></url>
</urlset>`;
  res.send(sitemap);
});

// Robots.txt route for SEO crawler approval
app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Sitemap: https://agnipariksha.com/sitemap.xml`);
});

// Vite middleware for full-stack build/dev environments
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
});
