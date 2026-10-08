export type Language = "en" | "hi" | "mr";

export interface Translations {
  appName: string;
  tagline: string;
  screeningNotice: string;
  disclaimer: string;
  nav: {
    home: string;
    screening: string;
    dashboard: string;
    milestones: string;
    specialists: string;
    clinician: string;
    admin: string;
    login: string;
    signup: string;
    logout: string;
  };
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    startCta: string;
    learnMore: string;
    howItWorksTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    trustTitle: string;
    trustDesc: string;
  };
  screening: {
    questionLabel: string;
    exampleLabel: string;
    yes: string;
    no: string;
    next: string;
    previous: string;
    submit: string;
    saving: string;
    saved: string;
    videoGuide: string;
  };
  results: {
    title: string;
    riskDisclaimer: string;
    whatNext: string;
    downloadPdf: string;
    findSpecialist: string;
    rescreenNotice: string;
  };
  dpdp: {
    title: string;
    notice: string;
    consentBox: string;
    deleteData: string;
    exportData: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "EarlySteps",
    tagline: "Gentle, Science-Backed Early Autism Screening for Ages 12-48 Months",
    screeningNotice:
      "Important Notice: EarlySteps is a developmental screening tool, NOT a diagnostic evaluation. Results indicate whether a child may benefit from further professional assessment by a qualified pediatrician or developmental specialist.",
    disclaimer:
      "This tool is designed to support, not replace, clinical judgment. Never hesitate to discuss your observations with your child's pediatrician.",
    nav: {
      home: "Home",
      screening: "Screening",
      dashboard: "Parent Dashboard",
      milestones: "Milestones",
      specialists: "Find Specialists",
      clinician: "Clinician View",
      admin: "Admin",
      login: "Sign In",
      signup: "Get Started",
      logout: "Sign Out",
    },
    landing: {
      heroTitle: "Understand Your Child's Unique Developmental Journey",
      heroSubtitle:
        "Standardized, pediatrician-aligned developmental screening designed specifically for parents of children aged 12 to 48 months. Confidential, compassionate, and DPDP-compliant.",
      startCta: "Start Free Screening",
      learnMore: "How It Works",
      howItWorksTitle: "How EarlySteps Works in 3 Gentle Steps",
      step1Title: "1. Tell Us About Your Child",
      step1Desc:
        "Enter your child's age or birthdate to match the exact standardized developmental age band.",
      step2Title: "2. Answer Guided Questions",
      step2Desc:
        "Respond to clear everyday observations with real-life examples and sensory-friendly guidance.",
      step3Title: "3. Receive Actionable Insights",
      step3Desc:
        "Download a structured pediatric summary report ready to share with your developmental specialist.",
      trustTitle: "Built on Trust & Child Health Data Privacy",
      trustDesc:
        "Compliant with India's DPDP Act 2023. You have complete control: verifiable consent, zero tracking, and one-click data deletion.",
    },
    screening: {
      questionLabel: "Question",
      exampleLabel: "Everyday Example",
      yes: "Yes",
      no: "No",
      next: "Next Question",
      previous: "Previous",
      submit: "Complete Screening",
      saving: "Saving progress...",
      saved: "Saved",
      videoGuide: "View Video Example",
    },
    results: {
      title: "Screening Evaluation Summary",
      riskDisclaimer:
        "This is an early developmental screening instrument, NOT a medical diagnosis. A doctor or clinical psychologist must conduct an in-person assessment.",
      whatNext: "Recommended Next Steps",
      downloadPdf: "Download PDF Report for Doctor",
      findSpecialist: "Find Nearby Developmental Pediatricians",
      rescreenNotice: "Development unfolds rapidly. Periodic re-screening is recommended every 3 to 6 months.",
    },
    dpdp: {
      title: "Data Privacy & Parental Consent (DPDP Act 2023)",
      notice:
        "EarlySteps values your family's privacy. We collect minimal developmental observations solely for generating your child's screening report.",
      consentBox:
        "I verify that I am the legal parent or guardian. I consent to confidential processing of this developmental screening under India's Digital Personal Data Protection Act 2023.",
      deleteData: "Delete My Data Permanently",
      exportData: "Export My Family's Data",
    },
  },
  hi: {
    appName: "EarlySteps",
    tagline: "12-48 महीने के बच्चों के लिए कोमल, वैज्ञानिक ऑटिज्म स्क्रीनिंग टूल",
    screeningNotice:
      "महत्वपूर्ण सूचना: EarlySteps एक विकासात्मक स्क्रीनिंग टूल है, न कि कोई चिकित्सीय निदान (Diagnosis)। परिणाम केवल यह दर्शाते हैं कि क्या आपके बच्चे को बाल रोग विशेषज्ञ द्वारा आगे के मूल्यांकन की आवश्यकता है।",
    disclaimer:
      "यह साधन डॉक्टर की सलाह का विकल्प नहीं है। किसी भी शंका के लिए तुरंत अपने बाल रोग विशेषज्ञ से मिलें।",
    nav: {
      home: "मुख्य पृष्ठ",
      screening: "स्क्रीनिंग",
      dashboard: "अभिभावक डैशबोर्ड",
      milestones: "विकासात्मक पड़ाव",
      specialists: "विशेषज्ञ खोजें",
      clinician: "चिकित्सक पोर्टल",
      admin: "व्यवस्थापक",
      login: "लॉग इन",
      signup: "शुरू करें",
      logout: "लॉग आउट",
    },
    landing: {
      heroTitle: "अपने बच्चे के अनोखे विकास को समझें",
      heroSubtitle:
        "12 से 48 महीने के बच्चों के लिए बाल रोग विशेषज्ञों द्वारा अनुमोदित सुरक्षित और गोपनीय स्क्रीनिंग।",
      startCta: "निःशुल्क स्क्रीनिंग शुरू करें",
      learnMore: "यह कैसे काम करता है",
      howItWorksTitle: "EarlySteps कैसे काम करता है (3 आसान चरण)",
      step1Title: "1. बच्चे की जानकारी",
      step1Desc: "बच्चे की उम्र या जन्मतिथि दर्ज करें ताकि सही आयु-वर्ग की प्रश्नावली लोड हो।",
      step2Title: "2. आसान प्रश्नों के उत्तर",
      step2Desc: "दैनिक जीवन के व्यावहारिक उदाहरणों के साथ सरल हाँ/ना उत्तर दें।",
      step3Title: "3. डॉक्टर के लिए रिपोर्ट प्राप्त करें",
      step3Desc: "अपने बाल रोग विशेषज्ञ को दिखाने के लिए तुरंत PDF सारांश रिपोर्ट डाउनलोड करें।",
      trustTitle: "गोपनीयता और विश्वास पर आधारित",
      trustDesc: "भारत के DPDP अधिनियम 2023 के अनुरूप। आपकी अनुमति और डेटा नियंत्रण हमेशा आपके हाथ में है।",
    },
    screening: {
      questionLabel: "प्रश्न",
      exampleLabel: "दैनिक उदाहरण",
      yes: "हाँ",
      no: "नहीं",
      next: "अगला प्रश्न",
      previous: "पिछला",
      submit: "स्क्रीनिंग पूरी करें",
      saving: "सहेजा जा रहा है...",
      saved: "सहेजा गया",
      videoGuide: "वीडियो उदाहरण देखें",
    },
    results: {
      title: "स्क्रीनिंग मूल्यांकन सारांश",
      riskDisclaimer:
        "यह एक प्रारंभिक विकासात्मक स्क्रीनिंग है, चिकित्सा निदान नहीं। केवल प्रमाणित बाल रोग विशेषज्ञ या मनोवैज्ञानिक ही औपचारिक निदान कर सकते हैं।",
      whatNext: "अनुशंसित अगले कदम",
      downloadPdf: "डॉक्टर के लिए PDF रिपोर्ट डाउनलोड करें",
      findSpecialist: "निकटतम बाल रोग विशेषज्ञ खोजें",
      rescreenNotice: "बच्चों का विकास तेजी से बदलता है। 3-6 महीने बाद पुन: स्क्रीनिंग की सलाह दी जाती है।",
    },
    dpdp: {
      title: "डेटा गोपनीयता और अभिभावक सहमति (DPDP Act 2023)",
      notice: "हम आपके डेटा की सुरक्षा का पूरा ध्यान रखते हैं। डेटा केवल स्क्रीनिंग रिपोर्ट बनाने हेतु प्रयुक्त होता है।",
      consentBox:
        "मैं पुष्टि करता/करती हूँ कि मैं कानूनी अभिभावक हूँ और DPDP अधिनियम 2023 के तहत इस स्क्रीनिंग के लिए अपनी सहमति देता/देती हूँ।",
      deleteData: "मेरा सारा डेटा स्थायी रूप से हटाएँ",
      exportData: "मेरा डेटा डाउनलोड करें",
    },
  },
  mr: {
    appName: "EarlySteps",
    tagline: "१२ ते ४८ महिने वयोगटातील मुलांसाठी प्राथमिक ऑटिझम स्क्रिनिंग",
    screeningNotice:
      "महत्त्वाची सूचना: EarlySteps हे एक विकासात्मक स्क्रिनिंग टूल आहे, वैद्यकीय निदान (Diagnosis) नाही. हे केवळ बालरोगतज्ज्ञांच्या पुढील मूल्यांकनाची गरज सुचवते.",
    disclaimer:
      "हे साधन डॉक्टरांच्या सल्ल्याची जागा घेऊ शकत नाही. आपल्या बालरोगतज्ज्ञांशी अवश्य चर्चा करा.",
    nav: {
      home: "मुखपृष्ठ",
      screening: "स्क्रिनिंग",
      dashboard: "पालक डॅशबोर्ड",
      milestones: "विकासाचे टप्पे",
      specialists: "तज्ज्ञ शोधा",
      clinician: "डॉक्टर पोर्टल",
      admin: "प्रशासक",
      login: "साइन इन",
      signup: "सुरुवात करा",
      logout: "साइन आउट",
    },
    landing: {
      heroTitle: "तुमच्या बाळाचा विकास समजून घ्या",
      heroSubtitle:
        "१२ ते ४८ महिन्यांच्या मुलांसाठी वैज्ञानिक आणि सुरक्षित विकासात्मक तपासणी.",
      startCta: "स्क्रिनिंग सुरू करा",
      learnMore: "कसे कार्य करते",
      howItWorksTitle: "EarlySteps कसे कार्य करते (३ सोप्या पायऱ्या)",
      step1Title: "१. मुलाची माहिती भरा",
      step1Desc: "मुलाचे वय किंवा जन्मतारीख नोंदवून योग्य प्रश्नावली मिळवा.",
      step2Title: "२. सोप्या प्रश्नांची उत्तरे द्या",
      step2Desc: "दैनंदिन संवादाच्या उदाहरणांसह होय/नाही उत्तरे नोंदवा.",
      step3Title: "३. डॉक्टरांसाठी रिपोर्ट मिळवा",
      step3Desc: "तज्ज्ञांना दाखवण्यासाठी सविस्तर PDF अहवाल डाउनलोड करा.",
      trustTitle: "सुरक्षितता आणि गोपनीयता",
      trustDesc: "भारताच्या DPDP कायदा २०२३ नुसार सुरक्षित. तुमचा डेटा तुमच्या नियंत्रणात आहे.",
    },
    screening: {
      questionLabel: "प्रश्न",
      exampleLabel: "दैनंदिन उदाहरण",
      yes: "होय",
      no: "नाही",
      next: "पुढील प्रश्न",
      previous: "मागे",
      submit: "स्क्रिनिंग पूर्ण करा",
      saving: "जतन करत आहे...",
      saved: "जतन केले",
      videoGuide: "व्हिडिओ उदाहरण पहा",
    },
    results: {
      title: "स्क्रिनिंग मूल्यमापन अहवाल",
      riskDisclaimer:
        "हे प्राथमिक स्क्रिनिंग साधन आहे, वैद्यकीय निदान नाही. प्रमाणित बालरोगतज्ज्ञांकडूनच तपासणी करून घ्यावी.",
      whatNext: "पुढील पावले",
      downloadPdf: "डॉक्टरांसाठी PDF रिपोर्ट डाउनलोड करा",
      findSpecialist: "जवळचे बालरोगतज्ज्ञ शोधा",
      rescreenNotice: "३ ते ६ महिन्यांनी पुन्हा स्क्रिनिंग करण्याचा सल्ला दिला जातो.",
    },
    dpdp: {
      title: "डेटा गोपनीयता आणि पालकांची संमती (DPDP कायदा २०२३)",
      notice: "आम्ही तुमच्या गोपनीयतेचा आदर करतो. डेटा केवळ अहवाल तयार करण्यासाठी वापरला जातो.",
      consentBox:
        "मी प्रमाणित करतो/करते की मी कायदेशीर पालक आहे आणि DPDP कायदा २०२३ अंतर्गत माझी संमती देतो/देते.",
      deleteData: "माझा सर्व डेटा कायमचा हटवा",
      exportData: "माझा डेटा डाउनलोड करा",
    },
  },
};
