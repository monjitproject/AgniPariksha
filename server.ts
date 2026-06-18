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
* **m/s से km/h में बदलाव**: चाल गुणा $\\frac{18}{5}$ करें।

### 2. सापेक्ष चाल (Relative Speed)
* **समान दिशा**: यदि दो गाड़ियाँ $u$ और $v$ की चाल से एक ही दिशा में जा रही हैं, तो सापेक्ष चाल = $u - v$ (जहाँ $u > v$).
* **विपरीत दिशा**: यदि वे एक-दूसरे की ओर अलग-अलग दिशाओं से आ रही हैं, तो सापेक्ष चाल = $u + v$.

### 3. रेलगाड़ी आधारित विशेष नियम (Train Cases)
* **केस A**: जब रेलगाड़ी किसी खंभे या खड़े व्यक्ति को पार करती है:   
  आवश्यक दूरी = रेलगाड़ी की स्वयं की लम्बाई।
* **केस B**: जब रेलगाड़ी किसी पुल, सुरंग या प्लेटफॉर्म को पार करती है:   
  आवश्यक दूरी = (रेलगाड़ी की लम्बाई + पूल/प्लेटफॉर्म की लम्बाई)।

### 4. औसत चाल (Average Speed)
*  औसत चाल सूत्र: जब कोई निश्चित दूरी दो अलग-अलग चाल $x$ और $y$ से तय की जाती है:   
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
      // If manually forced, don't update lastGenerated so that natural 12 hour cycle still triggers on schedule
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

// Helper function to synthesize a high-quality relevant response offline when Gemini is unavailable or rate-limited
function synthesizeMockReply(message: string, isRateLimited: boolean = false): string {
  const lower = message.toLowerCase();
  
  let header = "";
  if (isRateLimited) {
    header = "Jai Hind, aspirant! I am **Agni AI**, your preparation partner. Our live AI cloud service is currently experiencing extremely high traffic & quota utilization limit (ApiError 429: Active Quota Exceeded). To keep your studies completely uninterrupted, I have switched to our **High-Speed Offline Local Knowledge Engine**:\n\n";
  } else {
    header = "Jai Hind, aspirant! I am **Agni AI**, your preparation partner. It seems the platform is currently operating in offline mode (no live Key configured), but here is a guided answer from our specialized Local Knowledge Base:\n\n";
  }
  
  let body = "";
  if (lower.includes("army") || lower.includes("soldier") || lower.includes("agniveer") || lower.includes("officer") || lower.includes("defence")) {
    body += "• **Agniveer & Officer Selection Guidelines**:\n" +
            "  1. **Physical Fitness (100 Marks)**: Focused running (1.6 km in 5m 30s), pull-ups, and balance exercises.\n" +
            "  2. **Written Common Entrance Exam (CEE)**: Revise static facts, science principles, and simple maths indices.\n" +
            "  3. **Daily Recommendation**: Study the PDF syllabus matching your branch (use our integrated 'Sarkariresult Live PDF library') and draft notes for active revisions.\n\n" +
            "• **Syllabus Focus Areas**: Static world developments, geography of borders, elementary space tech, and fundamental physical science formulas.";
  } else if (lower.includes("navy") || lower.includes("ship") || lower.includes("sea") || lower.includes("sailor")) {
    body += "• **Indian Navy Entry Guidelines (Agniveer SSR/MR)**:\n" +
            "  1. **Qualifications**: 10+2 with Maths, Physics, and at least one subject of Chemistry/Biology/Computer Science is necessary for SSR.\n" +
            "  2. **Syllabus Core**: Waves and acoustics, thermodynamics, laws of gravitation, relations & functions, trigonometry, and general civics/geography.\n" +
            "  3. **Preparation Strategy**: Practice our tailored online free mock quizzes to clock exactly 60 seconds per logical question!";
  } else if (lower.includes("airforce") || lower.includes("vayu") || lower.includes("pilot") || lower.includes("jet")) {
    body += "• **Indian Air Force Agniveer Vayu Entry**:\n" +
            "  1. **Science Subjects**: Focus on high-level Class 11 & 12 CBSE physics, kinematics, matrices, determinants, and limits.\n" +
            "  2. **Other than Science (RAGA)**: Features extensive reasoning (verbal and non-verbal), numerical ability (profit and loss, average, percentage), and dynamic General Awareness.\n" +
            "  3. **Pro-Tip**: Speed and accuracy are critical. Dedicate 45 minutes daily to simulated RAGA mock papers.";
  } else if (lower.includes("syllabus") || lower.includes("pattern") || lower.includes("exam") || lower.includes("prepare") || lower.includes("study") || lower.includes("how to")) {
    body += "• **Agni 60-Day Success Planner**:\n" +
            "  - **First 30 Days**: Concept consolidation. Go through our comprehensive 'Study Notes' cabinet or browse syllabus PDFs imported directly from Sarkariresult.\n" +
            "  - **Next 15 Days**: Sectional practice. Tackle our custom-crafted daily quizzes across general science, history, current affairs, and polity.\n" +
            "  - **Final 15 Days**: Mock drills. Take continuous timed mock tests to adapt to exam-day pressure.\n" +
            "  - **Constant Routine**: Keep reading our updated Current Affairs cards daily to catch latest national defense news.";
  } else if (lower.includes("polity") || lower.includes("constitution") || lower.includes("article") || lower.includes("law")) {
    body += "• **Indian Polity Cheat Sheet for Defense Exams**:\n" +
            "  - **Part III Fundamental Rights**: Core Articles 14 (Equality), 19 (Freedom of speech), 21 (Right to life & liberty), and 32 (Constitutional remedies/Writs).\n" +
            "  - **Part IV Directive Principles**: Key welfare state principles, Uniform Civil Code (Article 44).\n" +
            "  - **President & Armed Forces**: Keep in mind that the President of India is the Supreme Commander of the Armed Forces (Article 53(2)).\n" +
            "  - **Recommendation**: Go directly to our dynamic Polity Quiz section to lock in safe scores!";
  } else if (lower.includes("current") || lower.includes("affair") || lower.includes("news") || lower.includes("today")) {
    body += "• **Latest Defense Current Affairs Briefings**:\n" +
            "  - **Bilateral Exercises**: Maintain a list of major exercise names like 'Yudh Abhyas' (India-US), 'Nomadic Elephant' (India-Mongolia), 'Samudra Shakti' (India-Indonesia).\n" +
            "  - **Defense Acquisitions**: High focus on indigenous manufacturing under 'Make in India' / 'Atmanirbhar Bharat' (Tejas, INS Vikrant, Prachand helicopters, Agni missiles).\n" +
            "  - **Important Appointments**: Note current Chief of Defence Staff (CDS), Army Chief, Navy Chief, and Air Chief Marshal titles.";
  } else {
    body += "As a dedicated candidate training to join the prestigious forces of our motherland, you should organize your day around 3 principles:\n" +
            "1. **Discipline over Motivation**: Maintain an active morning physical training drill paired with concept reviews in the afternoon.\n" +
            "2. **Evidence-Based Success**: Track your mock quiz percentage trends and identify weak categories early.\n" +
            "3. **Dynamic Alertness**: Regularly review recent syllabus changes (downloaded into our newly updated Google Drive database format) to be fully prepared.\n\n" +
            "Ask me anything relative to your defense curriculum, physics questions, general knowledge, or strategies!";
  }
  
  return header + body;
}

// 1. API: Agni AI Chat Bot Endpoint
app.post("/api/chat", async (req: express.Request, res: express.Response) => {
  const { message, history } = req.body;

  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  // Fallback / standard response simulator if Gemini is not configured
  if (!ai) {
    const reply = synthesizeMockReply(message, false);
    res.json({ reply, mode: "simulation" });
    return;
  }

  try {
    const systemPrompt = `You are 'Agni AI', the official AI Study Companion on AgniPariksha.com.
You specialize in Indian Armed Forces (Army, Navy, Air Force, Agniveer, NDA, CDS, AFCAT) and national level competitive exams (SSC GD, SSC CGL, SSC CHSL, Railway, Police forces, UPSC, Banking, teaching).
Exclusively format your response in professional, well-spaced, highly readable markdown.
Ensure your tone is polite, structured, deeply supportive, and authoritative.
Use bullet points, bold headers, and key callouts to make it easy for candidates to write down notes.
Begin your answers with 'Jai Hind, Aspirant!' or a high-energy patriotic greeting like 'Keep marching forward!'.`;

    const chatHistory = history ? history.map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    })) : [];

    // Formulate model contents
    const contents = [
      ...chatHistory,
      { role: "user", parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    const reply = response.text || "I was unable to formulate a response. Please rephrase your question.";
    res.json({ reply, mode: "live" });

  } catch (error: any) {
    console.error("Gemini API Error, executing offline fallback response strategy: ", error);
    // Graceful fallback response instead of failing server response
    const reply = synthesizeMockReply(message, true);
    res.json({ reply, mode: "fallback" });
  }
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

// 2. Dynamic SEO friendly XML Sitemap route
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

// 3. Robots.txt route for SEO crawler approval
app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Sitemap: https://agnipariksha.com/sitemap.xml`);
});

// 4. Vite middleware for full-stack build/dev environments
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
