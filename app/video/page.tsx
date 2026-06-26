"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type TranslationKey = 
  | "backLink"
  | "title"
  | "subtitle"
  | "badge"
  | "videoTitle"
  | "tabCeremony"
  | "tabReels"
  | "videoCaption"
  | "reelsCaption"
  | "sliderTitle"
  | "sliderTab1"
  | "sliderTab2"
  | "sliderBefore"
  | "sliderAfter"
  | "sliderDesc"
  | "audioTitle"
  | "audioDesc"
  | "audioPlay"
  | "audioPause"
  | "audioModeStandard"
  | "audioModeCinematic"
  | "audioStatusMusicOnly"
  | "audioStatusVoiceDrowned"
  | "audioStatusVoiceClear"
  // Pricing keys
  | "pricingTitle"
  | "pricingSub"
  | "pkg1Title"
  | "pkg1Price"
  | "pkg1Feat1"
  | "pkg1Feat2"
  | "pkg1Feat3"
  | "pkg1Feat4"
  | "pkg2Title"
  | "pkg2Price"
  | "pkg2Popular"
  | "pkg2Feat1"
  | "pkg2Feat2"
  | "pkg2Feat3"
  | "pkg2Feat4"
  | "pkg2Feat5"
  | "pkg2Feat6"
  // Compact deliverables badges
  | "trustBadge1Title"
  | "trustBadge1Desc"
  | "trustBadge2Title"
  | "trustBadge2Desc"
  | "trustBadge3Title"
  | "trustBadge3Desc"
  | "trustBadge4Title"
  | "trustBadge4Desc"
  // Privacy keys
  | "privacyTitle"
  | "privacySub"
  | "privacy1Title"
  | "privacy1Desc"
  | "privacy2Title"
  | "privacy2Desc"
  | "privacy3Title"
  | "privacy3Desc"
  | "privacy4Title"
  | "privacy4Desc"
  | "privacyConsentTitle"
  | "privacyConsentDesc"
  // Testimonial keys
  | "testimonialTitle"
  | "testimonialQuote"
  | "testimonialAuthor"
  // FAQ keys
  | "faqTitle"
  | "faqQ1"
  | "faqA1"
  | "faqQ2"
  | "faqA2"
  | "faqQ3"
  | "faqA3"
  // Inquiry form keys
  | "formTitle"
  | "formSub"
  | "formSchool"
  | "formDate"
  | "formEstimate"
  | "formPkg"
  | "formLength"
  | "formEmail"
  | "formPhone"
  | "formNotes"
  | "formSubmit"
  | "formSuccess"
  | "contactTitle"
  | "contactSub"
  | "contactDesc"
  | "contactEmail"
  | "contactPhone"
  | "footerText";

const translations: Record<"he" | "en", Record<TranslationKey, string>> = {
  he: {
    backLink: "← לאתר הראשי",
    title: "סרט סיום שחוגג את הרגעים היפים שלהם ביחד",
    subtitle: "אנחנו הופכים מאות תמונות וסרטונים מפוזרים מההורים, מהטיולים ומקבוצות הווטסאפ ליצירה קולנועית מרגשת שמחברת את כולם — בלי כאב הראש של המיון, התיאומים והעריכה.",
    badge: "עריכה קולנועית וליווי הפקתי אישי · קיץ 2026",
    videoTitle: "הדגמות וידאו קהילתיות",
    tabCeremony: "סרטון טקס קלאסי (16:9)",
    tabReels: "קליפ שטח קצבי (9:16)",
    videoCaption: "סרטון הדגמה (22 שניות) המציג עריכה קולנועית, תנועה אומנותית עדינה וכתוביות בגובה העיניים התואמות את הרגעים בתמונה.",
    reelsCaption: "קליפ שטח אנכי (12 שניות) המציג מעברים קצביים, מוזיקה סוחפת וכתוביות בסגנון Reels.",
    sliderTitle: "איך אנחנו משדרגים את חומרי הגלם?",
    sliderTab1: "טשטוש רקע (תמונות לגובה)",
    sliderTab2: "תיקון צבעים ותאורה (צילום סלולר)",
    sliderBefore: "לפני (תמונה גולמית מההורים)",
    sliderAfter: "אחרי (העיבוד הקולנועי שלנו)",
    sliderDesc: "בכל מסיבת סיום, רוב החומרים שמגיעים מהשטח צולמו בנייד. תמונות לאורך יוצרות שוליים שחורים ריקים על המקרן באולם, ותמונות כיתה רבות צולמו בתאורה חלשה או צהובה. אנו מטפלים בכל פריים בנפרד: מטשטשים רקע לתמונות אנכיות ברכות על בסיס צבעי המקור, ומבצעים תיקון צבעים ואיזון תאורה (Color Grading) כדי להעניק לתמונות הפשוטות חמימות קולנועית עשירה.",
    audioTitle: "סימולציה: הדמיית עריכת סאונד קולנועית",
    audioDesc: "בסרטון ללא עריכה מקצועית, מוזיקת הרקע נשארת בעוצמה גבוהה ומקשה לשמוע את קולות הילדים המברכים. בעיצוב הפסקול שלנו, אנו מבצעים הנמכה דינמית עדינה (Audio Ducking) של המוזיקה בכל פעם שמישהו מדבר, ומחזירים אותה לעוצמה מלאה ברגעי המעבר. הפעילו את הסימולציה והשוו:",
    audioPlay: "הפעל סימולציה",
    audioPause: "השהה סימולציה",
    audioModeStandard: "סאונד גולמי (ללא הנמכת מוזיקה)",
    audioModeCinematic: "סאונד קולנועי (הנמכה דינמית)",
    audioStatusMusicOnly: "רק מוזיקה מתנגנת בעוצמה מלאה...",
    audioStatusVoiceDrowned: "הילד מדבר – אך קולו נבלע בגלל מוזיקה רועשת!",
    audioStatusVoiceClear: "הילד מדבר – המוזיקה נחלשת אוטומטית והדיבור נשמע צלול לחלוטין.",
    pricingTitle: "חבילות ומחירי עריכה",
    pricingSub: "תמחור שקוף וברור שמתאים לתקציבי מוסדות וקהילות",
    pkg1Title: "חבילת טקס קלאסית",
    pkg1Price: "₪4,500",
    pkg1Feat1: "סרטון סיום באורך 15-20 דקות",
    pkg1Feat2: "מיון וסינון של עד 500 תמונות וסרטונים",
    pkg1Feat3: "טשטוש אומנותי ועיבוד לתמונות לאורך",
    pkg1Feat4: "2 סבבי תיקונים כלולים במחיר",
    pkg2Title: "חבילת פרימיום קולנועית",
    pkg2Price: "₪7,000",
    pkg2Popular: "הבחירה הנפוצה של רכזות שכבה",
    pkg2Feat1: "סרטון סיום מלא באורך 20-30 דקות",
    pkg2Feat2: "בונוס: קליפ שטח קצר (9:16) מותאם לרשתות",
    pkg2Feat3: "מיון מלא של עד 1,500 קבצים (כולל תיאום ווטסאפ)",
    pkg2Feat4: "תיקון צבעים, תאורה וגריידינג לכל פריים",
    pkg2Feat5: "פסקול דינמי ומאוזן עם הנמכת מוזיקה (Ducking)",
    pkg2Feat6: "3 סבבי תיקונים ושירות איסוף חומרים מנוהל",
    trustBadge1Title: "מוכן להקרנה",
    trustBadge1Desc: "יצוא Full HD MP4 מותאם למקרנים גדולים",
    trustBadge2Title: "רישיון מוזיקה",
    trustBadge2Desc: "פסקולים מורשים מסחרית ליוטיוב ללא חסימות",
    trustBadge3Title: "עריכה שיתופית",
    trustBadge3Desc: "סימון תיקונים קל אונליין על גבי הסרטון",
    trustBadge4Title: "פרטיות קפדנית",
    trustBadge4Desc: "מחיקת חומרים תוך 30 יום + טפסי אישור הורים",
    privacyTitle: "אבטחת מידע ופרטיות של קטינים",
    privacySub: "בסרטוני ילדים ונוער, הבטיחות והסודיות שלכם נמצאת בראש סדר העדיפויות שלנו",
    privacy1Title: "מחיקה אוטומטית של חומרים",
    privacy1Desc: "כל קבצי המקור של התמונות והסרטונים של התלמידים נמחקים לצמיתות משרתינו כ-30 יום לאחר מסירת הסרט המוגמר.",
    privacy2Title: "סודיות ואי-פרסום",
    privacy2Desc: "אנו מתחייבים שלא לשתף, לפרסם או להשתמש בחומרי הגלם או בסרטון המוגמר שלכם לצורכי שיווק ללא אישור בכתב ומראש.",
    privacy3Title: "שרת העלאה מאובטח",
    privacy3Desc: "איסוף הקבצים מתבצע באמצעות שרת העלאה פרטי ומאובטח המוגן בגישה מוצפנת, ללא צורך בשיתוף פומבי.",
    privacy4Title: "גישה בלעדית מבוקרת",
    privacy4Desc: "רק אחיה בוטמן, עורך הוידאו הראשי, נחשף לקבצים שלכם. אנו לא מעבירים חומרים לעורכי קבלן חיצוניים או לפרילנסרים מחוץ לישראל.",
    privacyConsentTitle: "טפסי הסכמה מוסדרים",
    privacyConsentDesc: "אנו מספקים לכם טופס אישור הורים מוכן להפצה המנוסח בהתאם להנחיות הגנת הפרטיות, להחתמה קלה של ההורים לפני תחילת העבודה.",
    testimonialTitle: "מה אומרות רכזות שכבה שעבדו איתנו?",
    testimonialQuote: "«ההורים שיגעו אותי עם מאות קבצי תמונות וסרטונים מפוזרים בווטסאפ, והייתי בטוחה שזה ייגמר באסון. אחיה לקח את הכל, עשה סדר בבלגן והפיק סרטון מדהים. בטקס הסיום הכל עבד חלק, כולם בכו מהתרגשות והסאונד היה פשוט מושלם. שקט נפשי ששווה כל שקל.»",
    testimonialAuthor: "— רונית ש., רכזת שכבת י\"ב בתיכון קהילתי",
    faqTitle: "שאלות נפוצות",
    faqQ1: "מתי עלינו לשלוח את החומרים אליכם?",
    faqA1: "כדי להבטיח את איכות העריכה הגבוהה ביותר, מומלץ להעביר את תיקיית החומרים כ-14 ימים לפני מועד הטקס. פרויקטים דחופים (פחות מ-7 ימים) יתקבלו על בסיס פניות ובתוספת תשלום.",
    faqQ2: "איך מתמודדים עם זכויות יוצרים על מוזיקת הרקע?",
    faqA2: "אנו משתמשים בפסקולים איכותיים מתוך מאגרים בעלי רישיון מסחרי מלא הכלול במחיר החבילה. הסרט שלכם מוגן לחלוטין ולא ייחסם ביוטיוב, פייסבוק או במערכות ההקרנה באולם.",
    faqQ3: "מה קורה אם נרצה לבצע שינויים ברגע האחרון?",
    faqA3: "החבילה הקלאסית כוללת 2 סבבי תיקונים שלמים וחבילת הפרימיום כוללת 3 סבבים. סבבי התיקונים מבוצעים תוך 48 שעות. תיקונים מעבר לכך יבוצעו בעלות סמלית לפי היקף העבודה.",
    formTitle: "שילחו פנייה לקבלת הצעת מחיר",
    formSub: "מלאו את הפרטים ונחזור אליכם תוך 24 שעות עם תוכנית עריכה אישית",
    formSchool: "שם בית הספר / הארגון:",
    formDate: "תאריך מועד הטקס / אירוע:",
    formEstimate: "מספר קבצים מוערך (תמונות וסרטונים):",
    formPkg: "החבילה המבוקשת:",
    formLength: "אורך סרט רצוי:",
    formEmail: "כתובת דוא\"ל ליצירת קשר:",
    formPhone: "מספר טלפון לבירורים:",
    formNotes: "בקשות מיוחדות או הערות:",
    formSubmit: "שלח פנייה לאחיה",
    formSuccess: "תודה! פנייתך התקבלה בהצלחה. נחזור אליך בהקדם עם הצעה מסודרת.",
    contactTitle: "בואו ניצור את רגע השיא של האירוע שלכם",
    contactSub: "רוצים להגיע לערב הסיום בראש שקט ובידיעה שהאולם יהיה מרותק?",
    contactDesc: "הפקת סרט סיום מצריכה שבועות של עבודה מתישה. אנחנו מורידים את כל העול הזה מכם. נלווה אתכם בבחירת המוזיקה, נבנה נרטיב מרגש, ונעניק לכם מוצר מושלם שיגרום להורים, למורים ולתלמידים להרגיש גאווה אמיתית. צרו קשר עכשיו כדי לשריין תאריך לעריכה לקראת אירועי הקיץ.",
    contactEmail: "כתבו לנו:",
    contactPhone: "דברו איתנו:",
    footerText: "אחיה בוטמן · עריכה וליווי אומנותי לאירועי קהילה"
  },
  en: {
    backLink: "← Back to home",
    title: "A Graduation Film That Celebrates Their Beautiful Moments Together",
    subtitle: "We turn hundreds of scattered photos and videos from parents, trips, and WhatsApp groups into a moving cinematic masterpiece that connects everyone—without the headache of sorting, coordination, and editing.",
    badge: "Cinematic Editing & Personal Production Support · Summer 2026",
    videoTitle: "Community Video Demonstrations",
    tabCeremony: "Classic Ceremony Film (16:9)",
    tabReels: "Dynamic Reels Clip (9:16)",
    videoCaption: "A 22-second demonstration showcasing cinematic editing, natural camera motions, and clean subtitles that match the moments in the photos.",
    reelsCaption: "A 12-second vertical reels clip showcasing dynamic cuts, upbeat climax, and centered caption styling.",
    sliderTitle: "How We Upgrade Raw Media?",
    sliderTab1: "Widescreen Blur (Vertical Photos)",
    sliderTab2: "Color Grading & Lighting (Mobile Photos)",
    sliderBefore: "Before (Raw photo from parents)",
    sliderAfter: "After (Our cinematic editing)",
    sliderDesc: "At any ceremony, most media is shot on mobile phones. Vertical photos create empty black sidebars on the projector, and classroom photos are often low-light or yellow-tinted. We process each frame individually: dynamically blurring backgrounds for vertical photos using the image's original palette, and applying color grading to inject warmth and a cinematic texture.",
    audioTitle: "Simulation: Cinematic Sound Design",
    audioDesc: "In an unedited video, background music plays at full volume, making it hard to hear students speak. In our sound design, we dynamically duck the music whenever a voice begins, and restore it to full volume during transitions. Start the simulation and compare:",
    audioPlay: "Start Simulation",
    audioPause: "Pause",
    audioModeStandard: "Raw Audio (No Ducking)",
    audioModeCinematic: "Cinematic Audio (Dynamic Ducking)",
    audioStatusMusicOnly: "Background music playing at full volume...",
    audioStatusVoiceDrowned: "Student speaking – but drowned out by loud music!",
    audioStatusVoiceClear: "Student speaking – music ducks automatically, speech is crystal clear.",
    pricingTitle: "Pricing & Packages",
    pricingSub: "Transparent and clear pricing matching school and community budgets",
    pkg1Title: "Classic Ceremony Package",
    pkg1Price: "₪4,500",
    pkg1Feat1: "15-20 min final ceremony film",
    pkg1Feat2: "Sorting & filtering up to 500 photos/videos",
    pkg1Feat3: "Artistic blur styling for vertical photos",
    pkg1Feat4: "2 revision rounds included",
    pkg2Title: "Premium Cinematic Package",
    pkg2Price: "₪7,000",
    pkg2Popular: "Most popular choice for grade coordinators",
    pkg2Feat1: "20-30 min complete ceremony film",
    pkg2Feat2: "Bonus: Short reels/social clip (9:16)",
    pkg2Feat3: "Complete sorting up to 1,500 files (incl. WhatsApp)",
    pkg2Feat4: "Frame-by-frame color correction & lighting adjustment",
    pkg2Feat5: "Cinematic soundtrack ducking & audio balancing",
    pkg2Feat6: "3 revision rounds & fully managed media gathering",
    trustBadge1Title: "Projection Ready",
    trustBadge1Desc: "Full HD MP4 optimized for big event screens",
    trustBadge2Title: "Licensed Tracks",
    trustBadge2Desc: "Commercially licensed music, YouTube safe",
    trustBadge3Title: "Online Revisions",
    trustBadge3Desc: "Easy timestamped feedback on the timeline",
    trustBadge4Title: "Strict Privacy",
    trustBadge4Desc: "30-day secure wipe + parent consent forms",
    privacyTitle: "Privacy & Minor Data Protection",
    privacySub: "In videos featuring children and minors, confidentiality and safety are our top priorities",
    privacy1Title: "Automatic Data Purge",
    privacy1Desc: "All original raw images and videos of the students are permanently deleted from our servers 30 days after project delivery.",
    privacy2Title: "Absolute Confidentiality",
    privacy2Desc: "We guarantee not to share, publish, or use your raw media or finished film for marketing purposes without written consent.",
    privacy3Title: "Secure Upload Infrastructure",
    privacy3Desc: "Media collection is hosted on a secure, private upload portal protected by encryption, keeping files out of public view.",

    // Testimonials
    testimonialTitle: "What Do Coordinators Who Worked With Us Say?",
    testimonialQuote: "«Parents were overloading me with hundreds of photo and video files scattered across WhatsApp. I was sure it would end in disaster. Ahiya took everything, brought order to the chaos, and produced an incredible film. At the graduation, everything worked smoothly, everyone cried with emotion, and the sound was perfect. Peace of mind worth every shekel.»",
    testimonialAuthor: "— Ronit S., 12th Grade Coordinator, Community High School",

    // FAQ
    faqTitle: "Frequently Asked Questions",
    faqQ1: "When do we need to submit the media to you?",
    faqA1: "To ensure the highest creative quality, we recommend sending your media folder 14 days prior to your graduation event. Urgent projects (less than 7 days) are accepted on availability with an extra rush fee.",
    faqQ2: "How do you handle background music copyright?",
    faqA2: "We license all music tracks commercially. Your final film is fully cleared and safe to upload to YouTube or Facebook without the risk of muted audio or copyright strikes.",
    faqQ3: "What if we want to make last-minute changes?",
    faqA3: "Classic package includes 2 full revision rounds and Premium includes 3 rounds, delivered within 48 hours. Any further revisions will be handled for a small, transparent fee depending on the scope.",

    // Inquiry Form
    formTitle: "Submit a Creative Inquiry",
    formSub: "Fill in the details and we will get back to you within 24 hours with a personalized production plan",
    formSchool: "School / Organization Name:",
    formDate: "Event / Graduation Date:",
    formEstimate: "Estimated Number of Files:",
    formPkg: "Desired Package:",
    formEmail: "Contact Email:",
    formPhone: "Contact Phone:",
    formNotes: "Special requests or comments:",
    formSubmit: "Send Inquiry to Ahiya",
    formSuccess: "Thank you! Your inquiry was sent successfully. We will get back to you with a structured proposal within 24 hours.",

    contactTitle: "Let's Design the Climax of Your Event",
    contactSub: "Want to arrive at the graduation evening with peace of mind, knowing the room will be captivated?",
    contactDesc: "Creating a graduation video takes weeks of exhausting work. We take that entire burden off your shoulders. We will guide you in choosing music, build an emotional narrative, and deliver a polished film that instills pride in parents, teachers, and students alike. Reach out today to secure your editing slot for the summer.",
    contactEmail: "Write to us:",
    contactPhone: "Call us:",
    footerText: "Ahiya Butman · Editing & Artistic Support for Community Events",

    // Privacy addition
    privacy4Title: "Exclusive Controlled Access",
    privacy4Desc: "Only Ahiya Butman, the lead editor, reviews and edits your media. No files are outsourced to external freelancers or off-shore editors.",
    privacyConsentTitle: "Organized Consent Template",
    privacyConsentDesc: "We provide a pre-drafted parental consent letter aligned with standard privacy guidelines, allowing you to secure parental approval quickly.",

    // Inquiry form addition
    formLength: "Desired Video Length:",

  }
};

export default function VideoPortfolio() {
  const [lang, setLang] = useState<"he" | "en">("he");
  const [sliderPos, setSliderPos] = useState(50);
  const [sliderFeature, setSliderFeature] = useState<"blur" | "color">("blur");
  const [activeDemo, setActiveDemo] = useState<"ceremony" | "reels">("ceremony");

  // Audio simulation state
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioDucking, setAudioDucking] = useState(true);
  const [audioTime, setAudioTime] = useState(0);

  // Form submission state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formState, setFormState] = useState({
    school: "",
    date: "",
    files: "",
    pkg: "premium",
    length: "15-25",
    email: "",
    phone: "",
    notes: ""
  });

  const t = translations[lang];
  const isHebrew = lang === "he";

  // Simulate audio playback timeline (0s to 6s loop)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (audioPlaying) {
      interval = setInterval(() => {
        setAudioTime((prevTime) => (prevTime >= 5.9 ? 0 : Number((prevTime + 0.1).toFixed(1))));
      }, 100);
    } else {
      setAudioTime(0);
    }
    return () => clearInterval(interval);
  }, [audioPlaying]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Send email via mailto fallback
    const bodyText = `
School Name: ${formState.school}
Event Date: ${formState.date}
Est Files: ${formState.files}
Desired Length: ${formState.length} mins
Package: ${formState.pkg}
Phone: ${formState.phone}
Notes: ${formState.notes}
    `;
    window.open(`mailto:ahiya.butman@gmail.com?subject=Video Production Inquiry - ${encodeURIComponent(formState.school)}&body=${encodeURIComponent(bodyText)}`);
  };

  // Determine current audio phase
  const isVoiceSpeaking = audioTime >= 1.8 && audioTime <= 4.2;

  // Waveform heights calculation
  const getMusicBarHeight = (baseIndex: number) => {
    if (!audioPlaying) return "12px";
    const timeFactor = Math.sin(audioTime * 4 + baseIndex) * 15 + 30;
    if (isVoiceSpeaking) {
      if (audioDucking) {
        return `${Math.max(4, Math.sin(audioTime * 10 + baseIndex) * 3 + 8)}px`;
      } else {
        return `${timeFactor}px`;
      }
    }
    return `${timeFactor}px`;
  };

  const getVoiceBarHeight = (baseIndex: number) => {
    if (!audioPlaying || !isVoiceSpeaking) return "3px";
    return `${Math.sin(audioTime * 12 + baseIndex) * 20 + 35}px`;
  };

  const getAudioStatusText = () => {
    if (!audioPlaying) return "";
    if (!isVoiceSpeaking) return t.audioStatusMusicOnly;
    return audioDucking ? t.audioStatusVoiceClear : t.audioStatusVoiceDrowned;
  };

  return (
    <main 
      className="mx-auto max-w-2xl px-6 py-20 sm:py-28" 
      dir={isHebrew ? "rtl" : "ltr"}
      style={{ fontFamily: isHebrew ? "var(--font-hebrew), var(--font-sans), sans-serif" : "var(--font-sans), sans-serif" }}
    >
      {/* Navigation / Language Toggle */}
      <div className="lift lift-1 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
        <Link 
          href="/" 
          className="hover:text-[var(--color-sky-deep)] transition-colors duration-300"
        >
          {t.backLink}
        </Link>
        <button 
          onClick={() => setLang(lang === "he" ? "en" : "he")}
          className="hover:text-[var(--color-sky-deep)] transition-colors duration-300 px-3 py-1 border border-[var(--color-rule)] rounded hover:bg-[var(--color-paper-soft)] cursor-pointer"
        >
          {lang === "he" ? "English" : "עברית"}
        </button>
      </div>

      {/* Header */}
      <section className="mt-10">
        <h1 className="lift lift-2 font-display text-4xl sm:text-5xl font-normal leading-[1.1] tracking-tight text-[var(--color-ink)]">
          {t.title}
        </h1>
        <p className="lift lift-3 mt-6 font-display text-[20px] sm:text-[22px] font-light italic leading-[1.45] text-[var(--color-ink-soft)]">
          {t.subtitle}
        </p>
        <p className="lift lift-4 mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {t.badge}
        </p>
      </section>

      <div className="horizon my-12" />

      {/* Showcase Video Player */}
      <section className="lift lift-5">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] mb-4">
          {t.videoTitle}
        </h2>
        
        {/* Interactive Video Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[var(--color-rule)] pb-px font-mono text-xs tracking-wider select-none">
          <button
            onClick={() => setActiveDemo("ceremony")}
            className={`pb-2 px-1 cursor-pointer transition-all duration-300 border-b-2 -mb-px ${
              activeDemo === "ceremony" 
                ? "border-[var(--color-sky-deep)] text-[var(--color-ink)] font-medium" 
                : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {t.tabCeremony}
          </button>
          <button
            onClick={() => setActiveDemo("reels")}
            className={`pb-2 px-1 cursor-pointer transition-all duration-300 border-b-2 -mb-px ${
              activeDemo === "reels" 
                ? "border-[var(--color-sky-deep)] text-[var(--color-ink)] font-medium" 
                : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {t.tabReels}
          </button>
        </div>

        {/* Video Frame */}
        <div className="transition-all duration-500 ease-in-out">
          <div className={`relative overflow-hidden rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-soft)] shadow-sm transition-all duration-500 ease-in-out ${
            activeDemo === "ceremony" 
              ? "w-full aspect-video" 
              : "w-full max-w-[290px] aspect-[9/16] mx-auto"
          }`}>
            <video
              key={activeDemo}
              src={activeDemo === "ceremony" ? "/showcase_ceremony.mp4" : "/showcase_reels.mp4"}
              controls
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-center text-[var(--color-muted)]">
          {activeDemo === "ceremony" ? t.videoCaption : t.reelsCaption}
        </p>
      </section>

      <div className="horizon my-16" />

      {/* Interactive Before & After Slider */}
      <section className="lift lift-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] mb-4">
          {t.sliderTitle}
        </h2>

        {/* Feature Tabs for Slider */}
        <div className="flex gap-2 mb-6 border-b border-[var(--color-rule)] pb-px font-mono text-[11px] tracking-wider select-none">
          <button
            onClick={() => setSliderFeature("blur")}
            className={`pb-2 px-1 cursor-pointer transition-all duration-300 border-b-2 -mb-px ${
              sliderFeature === "blur" 
                ? "border-[var(--color-sky-deep)] text-[var(--color-ink)] font-medium" 
                : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {t.sliderTab1}
          </button>
          <button
            onClick={() => setSliderFeature("color")}
            className={`pb-2 px-1 cursor-pointer transition-all duration-300 border-b-2 -mb-px ${
              sliderFeature === "color" 
                ? "border-[var(--color-sky-deep)] text-[var(--color-ink)] font-medium" 
                : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {t.sliderTab2}
          </button>
        </div>
        
        <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-[var(--color-rule)] select-none">
          {/* FEATURE 1: BLUR PREVIEW */}
          {sliderFeature === "blur" && (
            <>
              {/* BEFORE: Raw vertical photo on black */}
              <div className="absolute inset-0 bg-[#0d0c0a] flex items-center justify-center">
                <img 
                  src="/showcase_p7.jpg" 
                  alt="Raw vertical photo" 
                  className="h-[90%] w-auto object-contain"
                />
                <div className={`absolute top-4 ${isHebrew ? "right-4" : "left-4"} bg-black/70 text-white font-mono text-[9px] tracking-[0.1em] px-2 py-0.5 rounded`}>
                  {t.sliderBefore}
                </div>
              </div>
              
              {/* AFTER: Processed widescreen with blurred background (clipped) */}
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110 opacity-75"
                  style={{ backgroundImage: "url('/showcase_p7.jpg')" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="/showcase_p7.jpg" 
                    alt="Widescreen layout" 
                    className="h-[90%] w-auto object-contain border-4 border-white shadow-xl"
                  />
                </div>
                <div className={`absolute top-4 ${isHebrew ? "left-4" : "right-4"} bg-[var(--color-sky-deep)] text-white font-mono text-[9px] tracking-[0.1em] px-2 py-0.5 rounded`}>
                  {t.sliderAfter}
                </div>
              </div>
            </>
          )}

          {/* FEATURE 2: COLOR GRADING PREVIEW */}
          {sliderFeature === "color" && (
            <>
              <div className="absolute inset-0 flex items-center justify-center bg-[#0d0c0a]">
                <img 
                  src="/showcase_p2.jpg" 
                  alt="Raw photo" 
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.62) contrast(0.85) sepia(0.3) saturate(0.65) hue-rotate(15deg)" }}
                />
                <div className={`absolute top-4 ${isHebrew ? "right-4" : "left-4"} bg-black/70 text-white font-mono text-[9px] tracking-[0.1em] px-2 py-0.5 rounded`}>
                  {t.sliderBefore}
                </div>
              </div>
              
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
              >
                <img 
                  src="/showcase_p2.jpg" 
                  alt="Color graded photo" 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-4 ${isHebrew ? "left-4" : "right-4"} bg-[var(--color-sky-deep)] text-white font-mono text-[9px] tracking-[0.1em] px-2 py-0.5 rounded`}>
                  {t.sliderAfter}
                </div>
              </div>
            </>
          )}
          
          {/* Drag slider handle */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[var(--color-paper)] border border-[var(--color-rule)] rounded-full flex items-center justify-center shadow-md">
              <span className="text-[10px] text-[var(--color-ink)] font-mono">↔</span>
            </div>
          </div>
          
          {/* Invisible Range Input Slider */}
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderPos}
            onChange={handleSliderChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
          />
        </div>
        
        <p className="mt-4 text-[14.5px] leading-[1.65] text-[var(--color-ink-soft)] font-sans">
          {t.sliderDesc}
        </p>
      </section>

      <div className="horizon my-16" />

      {/* Interactive Audio Curation Demo */}
      <section className="lift lift-6 bg-[var(--color-paper-soft)] p-6 rounded-lg border border-[var(--color-rule)]">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] mb-3">
          {t.audioTitle}
        </h2>
        <p className="text-[14.5px] leading-[1.65] text-[var(--color-ink-soft)] font-sans mb-6">
          {t.audioDesc}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-center">
          {/* Left: Controls */}
          <div className="flex flex-col gap-4 w-full sm:w-auto min-w-[200px]">
            <button
              onClick={() => setAudioPlaying(!audioPlaying)}
              className={`w-full py-3 px-6 rounded font-mono text-xs uppercase tracking-wider cursor-pointer text-center transition-all duration-300 ${
                audioPlaying 
                  ? "bg-[var(--color-muted)] text-[var(--color-paper)]" 
                  : "bg-[var(--color-sky-deep)] text-white hover:bg-[var(--color-sky)] shadow-sm"
              }`}
            >
              {audioPlaying ? t.audioPause : t.audioPlay}
            </button>

            {/* Simulated Audio Mode Selector */}
            <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="audioMode"
                  checked={!audioDucking}
                  onChange={() => setAudioDucking(false)}
                  className="accent-[var(--color-sky-deep)]"
                />
                <span>{t.audioModeStandard}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="audioMode"
                  checked={audioDucking}
                  onChange={() => setAudioDucking(true)}
                  className="accent-[var(--color-sky-deep)]"
                />
                <span>{t.audioModeCinematic}</span>
              </label>
            </div>
          </div>

          {/* Right: Audio Waveform Visualizations */}
          <div className="flex-1 w-full bg-[var(--color-paper)] p-4 rounded border border-[var(--color-rule)] flex flex-col justify-center min-h-[140px]">
            <div className="flex flex-col gap-4">
              
              {/* Music Channel Waveform */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-[var(--color-muted)] w-12 uppercase tracking-wider">Music</span>
                <div className="flex items-center gap-0.5 h-16 flex-1 justify-center bg-[var(--color-paper-soft)]/40 rounded px-2">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-[var(--color-muted)] rounded-full transition-all duration-150"
                      style={{ height: getMusicBarHeight(i) }}
                    />
                  ))}
                </div>
              </div>

              {/* Voice Channel Waveform */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-[var(--color-muted)] w-12 uppercase tracking-wider">Voice</span>
                <div className="flex items-center gap-0.5 h-16 flex-1 justify-center bg-[var(--color-paper-soft)]/40 rounded px-2">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-[var(--color-sky-deep)] rounded-full transition-all duration-150"
                      style={{ height: getVoiceBarHeight(i) }}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Audio State Text Update */}
            <div className="mt-4 font-mono text-[10px] uppercase tracking-wider text-center text-[var(--color-sky-deep)] h-4">
              {getAudioStatusText()}
            </div>
          </div>
        </div>
      </section>

      <div className="horizon my-16" />

      {/* Pricing & Packages */}
      <section className="spine pr-6 pl-6 rtl:pr-6 rtl:pl-0 ltr:pl-6 ltr:pr-0">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {t.pricingTitle}
        </h2>
        <p className="mt-2 text-[14px] text-[var(--color-muted)] font-mono uppercase tracking-wider">
          {t.pricingSub}
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
          {/* Package 1 */}
          <div className="p-6 rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-soft)]/40 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-xl font-medium text-[var(--color-ink)]">
                {t.pkg1Title}
              </h3>
              <div className="mt-4 text-3xl font-light text-[var(--color-sky-deep)] font-mono">
                {t.pkg1Price}
              </div>
              <ul className="mt-6 space-y-3 text-[14px] text-[var(--color-ink-soft)] list-disc list-inside">
                <li>{t.pkg1Feat1}</li>
                <li>{t.pkg1Feat2}</li>
                <li>{t.pkg1Feat3}</li>
                <li>{t.pkg1Feat4}</li>
              </ul>
            </div>
          </div>

          {/* Package 2 */}
          <div className="p-6 rounded-lg border-2 border-[var(--color-sky-deep)] bg-[var(--color-paper)] flex flex-col justify-between relative shadow-sm">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-sky-deep)] text-white font-mono text-[9px] tracking-widest px-3 py-1 rounded-full uppercase">
              {t.pkg2Popular}
            </div>
            <div className="mt-2">
              <h3 className="font-display text-xl font-medium text-[var(--color-ink)]">
                {t.pkg2Title}
              </h3>
              <div className="mt-4 text-3xl font-light text-[var(--color-sky-deep)] font-mono">
                {t.pkg2Price}
              </div>
              <ul className="mt-6 space-y-3 text-[14px] text-[var(--color-ink-soft)] list-disc list-inside">
                <li className="font-semibold text-[var(--color-ink)]">{t.pkg2Feat1}</li>
                <li className="text-[var(--color-sky-deep)] font-semibold">{t.pkg2Feat2}</li>
                <li>{t.pkg2Feat3}</li>
                <li>{t.pkg2Feat4}</li>
                <li>{t.pkg2Feat5}</li>
                <li>{t.pkg2Feat6}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="horizon my-12" />

      {/* Trust Deliverables Badges Grid */}
      <section className="grid grid-cols-2 gap-4 font-sans text-center">
        <div className="p-4 rounded border border-[var(--color-rule)] bg-[var(--color-paper-soft)]/20">
          <div className="text-xl mb-1">📺</div>
          <h4 className="font-display font-medium text-[14px] text-[var(--color-ink)]">{t.trustBadge1Title}</h4>
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-ink-soft)]">{t.trustBadge1Desc}</p>
        </div>
        <div className="p-4 rounded border border-[var(--color-rule)] bg-[var(--color-paper-soft)]/20">
          <div className="text-xl mb-1">🎵</div>
          <h4 className="font-display font-medium text-[14px] text-[var(--color-ink)]">{t.trustBadge2Title}</h4>
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-ink-soft)]">{t.trustBadge2Desc}</p>
        </div>
        <div className="p-4 rounded border border-[var(--color-rule)] bg-[var(--color-paper-soft)]/20">
          <div className="text-xl mb-1">💬</div>
          <h4 className="font-display font-medium text-[14px] text-[var(--color-ink)]">{t.trustBadge3Title}</h4>
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-ink-soft)]">{t.trustBadge3Desc}</p>
        </div>
        <div className="p-4 rounded border border-[var(--color-rule)] bg-[var(--color-paper-soft)]/20">
          <div className="text-xl mb-1">🛡️</div>
          <h4 className="font-display font-medium text-[14px] text-[var(--color-ink)]">{t.trustBadge4Title}</h4>
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-ink-soft)]">{t.trustBadge4Desc}</p>
        </div>
      </section>

      <div className="horizon my-12" />

      {/* Testimonials */}
      <section className="bg-[var(--color-paper-soft)]/30 border border-[var(--color-rule)] rounded-lg p-6 font-sans">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] mb-4">
          {t.testimonialTitle}
        </h2>
        <blockquote className="text-[15.5px] leading-[1.6] italic text-[var(--color-ink)]">
          {t.testimonialQuote}
        </blockquote>
        <cite className="block mt-4 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)] not-italic">
          {t.testimonialAuthor}
        </cite>
      </section>

      <div className="horizon my-12" />

      {/* FAQ Accordion Section */}
      <section className="spine pr-6 pl-6 rtl:pr-6 rtl:pl-0 ltr:pl-6 ltr:pr-0">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {t.faqTitle}
        </h2>

        <div className="mt-6 space-y-3 font-sans text-[14px]">
          {[
            { q: t.faqQ1, a: t.faqA1 },
            { q: t.faqQ2, a: t.faqA2 },
            { q: t.faqQ3, a: t.faqA3 },
            { 
              q: `${t.privacyTitle} (GDPR / משרד החינוך)`, 
              a: `• ${t.privacy1Title}: ${t.privacy1Desc}\n\n• ${t.privacy2Title}: ${t.privacy2Desc}\n\n• ${t.privacy3Title}: ${t.privacy3Desc}\n\n• ${t.privacy4Title}: ${t.privacy4Desc}\n\n• ${t.privacyConsentTitle}: ${t.privacyConsentDesc}`
            }
          ].map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="border-b border-[var(--color-rule)] pb-3">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex justify-between items-center text-right font-display font-medium text-[15px] text-[var(--color-ink)] cursor-pointer py-2 focus:outline-none hover:text-[var(--color-sky-deep)] transition-colors duration-200"
                >
                  <span>{item.q}</span>
                  <span className="font-mono text-[14px] text-[var(--color-muted)]">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)] whitespace-pre-line animate-hit-fade">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="horizon my-12" />

      {/* Inquiry Form */}
      <section className="bg-[var(--color-paper-soft)] border border-[var(--color-rule)] rounded-lg p-6 font-sans">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {t.formTitle}
        </h2>
        <p className="mt-2 text-[13px] text-[var(--color-ink-soft)] mb-6">
          {t.formSub}
        </p>

        {formSubmitted ? (
          <div className="p-4 bg-[var(--color-sky-deep)]/10 text-[var(--color-sky-deep)] border border-[var(--color-sky-deep)]/30 rounded text-center text-[14px] font-semibold transition-all duration-300">
            {t.formSuccess}
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4 text-[13.5px] text-[var(--color-ink-soft)]">
            <div className="flex flex-col gap-1">
              <label htmlFor="school" className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">{t.formSchool}</label>
              <input
                type="text"
                id="school"
                name="school"
                required
                value={formState.school}
                onChange={handleFormChange}
                className="p-2 border border-[var(--color-rule)] rounded bg-[var(--color-paper)] focus:outline-none focus:border-[var(--color-sky-deep)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="date" className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">{t.formDate}</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formState.date}
                  onChange={handleFormChange}
                  className="p-2 border border-[var(--color-rule)] rounded bg-[var(--color-paper)] focus:outline-none focus:border-[var(--color-sky-deep)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="files" className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">{t.formEstimate}</label>
                <input
                  type="text"
                  id="files"
                  name="files"
                  placeholder="e.g. 500"
                  required
                  value={formState.files}
                  onChange={handleFormChange}
                  className="p-2 border border-[var(--color-rule)] rounded bg-[var(--color-paper)] focus:outline-none focus:border-[var(--color-sky-deep)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">{t.formEmail}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formState.email}
                  onChange={handleFormChange}
                  className="p-2 border border-[var(--color-rule)] rounded bg-[var(--color-paper)] focus:outline-none focus:border-[var(--color-sky-deep)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="phone" className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">{t.formPhone}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formState.phone}
                  onChange={handleFormChange}
                  className="p-2 border border-[var(--color-rule)] rounded bg-[var(--color-paper)] focus:outline-none focus:border-[var(--color-sky-deep)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="length" className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">{t.formLength}</label>
                <select
                  id="length"
                  name="length"
                  value={formState.length}
                  onChange={handleFormChange}
                  className="p-2 border border-[var(--color-rule)] rounded bg-[var(--color-paper)] focus:outline-none focus:border-[var(--color-sky-deep)]"
                >
                  <option value="10-15">{isHebrew ? "סרטון קצר (10-15 דקות)" : "Short Film (10-15 min)"}</option>
                  <option value="15-25">{isHebrew ? "סרטון מלא (15-25 דקות)" : "Full Film (15-25 min)"}</option>
                  <option value="25-40">{isHebrew ? "סרטון מורחב (25-40 דקות)" : "Extended Film (25-40 min)"}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="pkg" className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">{t.formPkg}</label>
                <select
                  id="pkg"
                  name="pkg"
                  value={formState.pkg}
                  onChange={handleFormChange}
                  className="p-2 border border-[var(--color-rule)] rounded bg-[var(--color-paper)] focus:outline-none focus:border-[var(--color-sky-deep)]"
                >
                  <option value="classic">{isHebrew ? "חבילה קלאסית (₪4,500)" : "Classic Package (₪4,500)"}</option>
                  <option value="premium">{isHebrew ? "חבילת פרימיום (₪7,000)" : "Premium Package (₪7,000)"}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="notes" className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">{t.formNotes}</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formState.notes}
                onChange={handleFormChange}
                className="p-2 border border-[var(--color-rule)] rounded bg-[var(--color-paper)] focus:outline-none focus:border-[var(--color-sky-deep)] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-[var(--color-sky-deep)] hover:bg-[var(--color-sky)] text-white font-mono text-xs uppercase tracking-wider rounded cursor-pointer transition-all duration-300 shadow-sm"
            >
              {t.formSubmit}
            </button>
          </form>
        )}
      </section>

      <div className="horizon my-12" />

      {/* Contact info (Fallback option) */}
      <section>
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {t.contactTitle}
        </h2>
        <p className="mt-6 font-display text-[17px] sm:text-[19px] italic leading-[1.4] text-[var(--color-ink)]">
          {t.contactSub}
        </p>
        <p className="mt-3 text-[14px] leading-[1.6] text-[var(--color-ink-soft)] font-sans">
          {t.contactDesc}
        </p>
        <ul className="mt-6 space-y-2 text-[14px] text-[var(--color-ink-soft)] font-mono">
          <li>
            <span>{t.contactEmail} </span>
            <a className="link font-sans text-base" href="mailto:ahiya.butman@gmail.com">ahiya.butman@gmail.com</a>
          </li>
          <li>
            <span>{t.contactPhone} </span>
            <a className="link font-sans text-base" href="tel:+972587789019">058-778-9019</a>
          </li>
        </ul>
      </section>

      <footer className="mt-20 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {t.footerText}
      </footer>
    </main>
  );
}
