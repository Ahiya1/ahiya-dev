"use client";

import { useState } from "react";
import Link from "next/link";

type TranslationKey = 
  | "backLink"
  | "title"
  | "subtitle"
  | "badge"
  | "personalNoteTitle"
  | "personalNoteBody"
  | "videoTitle"
  | "tabCeremony"
  | "tabReels"
  | "videoCaption"
  | "reelsCaption"
  | "privacyNotice"
  | "musicCredit"
  | "sliderTitle"
  | "sliderBefore"
  | "sliderAfter"
  | "sliderDesc"
  | "soundTitle"
  | "soundDesc"
  // Pricing keys
  | "pricingTitle"
  | "pricingSub"
  | "pkg1Title"
  | "pkg1Price"
  | "pkg1Desc"
  | "pkg2Title"
  | "pkg2Price"
  | "pkg2Desc"
  | "pkgSubtext"
  // Deliverables Badges
  | "badge1Title"
  | "badge1Desc"
  | "badge2Title"
  | "badge2Desc"
  | "badge3Title"
  | "badge3Desc"
  | "badge4Title"
  | "badge4Desc"
  // FAQ keys
  | "faqTitle"
  | "faqQ1"
  | "faqA1"
  | "faqQ2"
  | "faqA2"
  | "faqQ3"
  | "faqA3"
  | "faqQ4"
  | "faqA4"
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
    title: "סרטי סיום ודוקומנטרי קהילתי",
    subtitle: "להפוך את הבלאגן של מאות סרטוני הווטסאפ ותמונות הנייד ליצירה קולנועית שמספרת את הסיפור האמיתי של השנה שלהם — בלי כאבי הראש של המיון והעריכה.",
    badge: "עריכה אומנותית וליווי אישי · אחיה בוטמן",
    
    personalNoteTitle: "למה אני עושה את זה?",
    personalNoteBody: "אני מאמין שסרט סיום הוא לא סתם רצף של תמונות מתחלפות עם מוזיקה קצבית. הוא מסמך קהילתי. הוא מנציח את הטיולים בגשם, את הצחוקים של המסדרונות, ואת הקשרים שנבנו לאורך שנים. כשאתם מוסרים לי את חומרי הגלם, אני לא סתם זורק אותם על ציר הזמן — אני מקשיב לסיפורים, מסנן את הכפילויות, מתקן את התאורה של צילומי הסלולר, ומאזן את הסאונד כדי שכל מילה של הילדים תישמע בבירור באולם ההקרנה.",
    
    videoTitle: "הצצה לתוצרים",
    tabCeremony: "סרט הנרטיב המלא (16:9)",
    tabReels: "קליפ השטח והתנועה (9:16)",
    videoCaption: "סרט תיעודי קצר (כדקה וחצי) שנערך מחומרים אמיתיים של מחזור שלם: צילומי סלולר, תמונות אורך ורגעים מהשטח, שהפכו לסיפור קולנועי אחד עם כתוביות התואמות את הרגעים.",
    reelsCaption: "קליפ שטח אנכי (12 שניות) המציג מעברים קצביים, מוזיקה סוחפת וכתוביות בסגנון Reels.",
    privacyNotice: "הערה: סרט ההדגמה הופק מחומרים אמיתיים של תוכנית נוער (דרך פרט) ומוצג כאן באישור מלא של מובילי התוכנית. ככלל, פרויקטים של לקוחות נשמרים בסודיות ואינם מפורסמים ברשת ללא רשות מפורשת.",
    musicCredit: "מוזיקה: \"Affirmations\" מאת Scott Buckley (רישיון CC BY 4.0)",
    
    sliderTitle: "פתרון לתמונות אנכיות (סלולר)",
    sliderBefore: "לפני (תמונה גולמית לאורך)",
    sliderAfter: "אחרי (התאמה למקרן רחב)",
    sliderDesc: "בכל מסיבת סיום, רוב החומרים שמגיעים מהשטח צולמו בנייד. תמונות לאורך יוצרות שוליים שחורים ריקים על המקרן באולם, מה שקוטע את הרצף הויזואלי. אנו מטפלים בכל פריים בנפרד: מייצרים רקע רך ומטושטש המבוסס על צבעי המקור, ומעמידים את התמונה במרכז עם מסגרת עדינה, כדי להבטיח זרימה חלקה ומקצועית על המקרן.",
    
    soundTitle: "סאונד נקי ודיאלוגים ברורים",
    soundDesc: "בסרטי סיום רבים, הדיבור של התלמידים נבלע מתחת למוזיקה רועשת. אנחנו מעצבים את הפסקול ידנית: המוזיקה נחלשת בעדינות (Audio Ducking) בכל פעם שמישהו מדבר, ומתגברת במעברים. אנחנו מנקים רעשי רוח מהשטח ומאזנים את העוצמות כדי שלא תצטרכו לרוץ למקסר של האולם במהלך ההקרנה.",
    
    pricingTitle: "ערוצי עבודה משותפים",
    pricingSub: "איך אנחנו יכולים לבנות את הסרט שלכם?",
    pkg1Title: "קליפ השטח הקצבי",
    pkg1Price: "₪4,500",
    pkg1Desc: "קליפ אנרגטי וסוחף של 3-5 דקות, המתמקד ברגעי שטח, טיולים, ומחנות. מתאים לפתיחת הטקס או לשיתוף מהיר בווטסאפ של ההורים. כולל מיון של מאות קבצים ועריכת סאונד קצבית.",
    pkg2Title: "הסרט התיעודי המלא",
    pkg2Price: "₪7,000",
    pkg2Desc: "הסרט המרכזי של מסיבת הסיום. 20-30 דקות של סיפור כרונולוגי של השנה או המחזור. כולל מיון של אלפי קבצים, שילוב ברכות מורים ותלמידים, טיפול בכל התמונות האנכיות, תיקוני צבע וסאונד קפדניים, ובונוס: קליפ רשתות מהיר מותאם לנייד.",
    pkgSubtext: "אנחנו לא עובדים עם מונה-זמן או סופרים תיקונים. אנחנו עובדים יחד איתכם עד שהסרט מדוייק ומרגש.",
    
    badge1Title: "מוכן להקרנה באולם",
    badge1Desc: "יצוא Full HD MP4 מותאם ומנוקה למקרני ענק (4K זמין בתיאום)",
    badge2Title: "רישיון מוזיקה מלא",
    badge2Desc: "פסקולים מורשים מסחרית ליוטיוב ללא חסימות או השתקות",
    badge3Title: "עריכה שיתופית ופשוטה",
    badge3Desc: "סימון הערות ותיקונים ישירות על גבי הסרטון אונליין",
    badge4Title: "פרטיות קפדנית לקטינים",
    badge4Desc: "שרת העלאה מוצפן ומחיקת כל חומרי הגלם תוך 30 יום",
    
    faqTitle: "שאלות נפוצות",
    faqQ1: "איך שומרים על פרטיות הילדים והאם אפשר לראות דוגמאות מלאות?",
    faqA1: "כל החומרים נשמרים בשרת מאובטח ופרטי. רק אני נחשף אליהם והם נמחקים לצמיתות תוך 30 יום מהאירוע. בשל כך, איננו מפרסמים סרטי לקוחות ברשת.\n\nעם זאת, נשמח לקיים שיחת וידאו קצרה (או פגישה) שבה נציג לכם דוגמאות מלאות ומאובטחות (בטשטוש פנים חלקי או באופן אנונימי), או להפנות אתכם ישירות לרכזים קודמים שעבדו איתנו ויכולים להעיד על התהליך.",
    faqQ2: "איך נראה תהליך העבודה, העלאת החומרים והלו\"ז?",
    faqA2: "1. **העלאה:** אתם מעלים את מאות התמונות והסרטונים מההורים והמורים לתיקייה מאובטחת שאני פותח עבורכם.\n2. **טיוטה ראשונה:** תוך 5-7 ימי עבודה תקבלו קישור פרטי לצפייה בטיוטה הראשונה (First Cut).\n3. **סבב תיקונים:** באמצעות מערכת הערות דיגיטלית פשוטה, אתם מסמנים תיקונים והערות ישירות על גבי הוידאו בכל שנייה רלוונטית.\n4. **מסירה:** לאחר אישורכם, אנו מפיקים קובץ הקרנה סופי יחד עם אישורי רישוי המוזיקה.",
    faqQ3: "מה קורה אם הטיוטה הראשונה לא קולעת לטון שרצינו?",
    faqA3: "לפני תחילת העבודה אנו מקיימים שיחת תיאום ציפיות להבנת אופי השכבה והכיוון הרצוי (קצבי, מרגש, מצחיק או שקט). אם הטיוטה הראשונה דורשת התאמה מחדש, אנו עושים זאת בשיתוף פעולה מלא – אין הגבלת סבבים נוקשה, ועובדים יחד עד שהסרט מדוייק ומרגש.",
    faqQ4: "האם רישיונות המוזיקה ניתנים בכתב ומהם תנאי התשלום?",
    faqA4: "כן. עם מסירת הסרט הסופי, אתם מקבלים קובץ רישיונות דיגיטלי מסודר בכתב (PDF) המכסה הקרנה ציבורית והעלאה ליוטיוב/רשתות חברתיות ללא הגבלה.\n\n**תנאי התשלום:** 50% מקדמה עם תחילת העבודה (שלב מיון החומרים), ו-50% הנותרים רק לאחר אישור הגרסה הסופית ולפני מסירת קובץ ההקרנה הסופי.",
    
    formTitle: "בואו נחשוב יחד על הסרט שלכם",
    formSub: "ספרו לי קצת על האירוע שלכם ונחזור אליכם תוך 24 שעות עם כיוון אומנותי ראשוני והצעת עבודה מסודרת",
    formSchool: "שם הארגון / בית הספר / תנועה:",
    formDate: "תאריך האירוע המשוער:",
    formEstimate: "מספר קבצים מוערך (תמונות וסרטונים):",
    formPkg: "כיוון העבודה המבוקש:",
    formLength: "אורך סרט רצוי:",
    formEmail: "כתובת דוא\"ל ליצירת קשר:",
    formPhone: "מספר טלפון לבירורים:",
    formNotes: "ספרו קצת על אופי השכבה, המסע שהם עברו או בקשות מיוחדות:",
    formSubmit: "בואו נתחיל לעבוד",
    formSuccess: "תודה! הפרטים התקבלו בהצלחה. אחזור אליך בהקדם עם רעיונות ראשוניים לעריכה.",
    
    contactTitle: "ליצור את רגע השיא של האירוע שלכם",
    contactSub: "להגיע לערב הסיום בראש שקט ובידיעה שהקהל יהיה מרותק",
    contactDesc: "הפקת סרט סיום מצריכה שבועות של עבודה מתישה ומורטת עצבים. אנחנו לוקחים את כל העול הזה מכם. נלווה אתכם בבחירת המוזיקה, נבנה נרטיב מרגש, ונעניק לכם מוצר מושלם שיגרום להורים, למורים ולחניכים להרגיש גאווה אמיתית.",
    contactEmail: "כתבו לי:",
    contactPhone: "דברו איתי:",
    footerText: "אחיה בוטמן · עריכה וליווי אומנותי לאירועי נוער וקהילה"
  },
  en: {
    backLink: "← Back to main site",
    title: "Graduation & Community Documentary Films",
    subtitle: "Turn the chaos of hundreds of WhatsApp videos and phone photos into a moving cinematic documentary that captures the real story of their year—without the headache of sorting and editing.",
    badge: "Artistic Editing & Personal Support · Ahiya Butman",
    
    personalNoteTitle: "Why I Do This?",
    personalNoteBody: "I believe a graduation film is more than just a sequence of slides with upbeat music. It is a community document. It commemorates hikes in the rain, quiet corridor laughter, and friendships built over years. When you hand over your media to me, I don't just dump it on a timeline—I listen to the stories, filter duplicates, correct mobile exposure, and hand-craft the audio to ensure every word is heard clearly on projection night.",
    
    videoTitle: "A Glimpse of the Deliverables",
    tabCeremony: "Full Narrative Film (16:9)",
    tabReels: "Field & Motion Clip (9:16)",
    videoCaption: "A short documentary film (about ninety seconds) edited from real material of a full cohort: phone clips, vertical photos, and field moments, woven into one cinematic story with captions matched to each moment.",
    reelsCaption: "A 12-second vertical reels clip showcasing dynamic cuts, upbeat climax, and centered caption styling.",
    privacyNotice: "Note: This demo film was produced from real material of a youth program (Derech Prat) and is shown here with the full permission of the program's leaders. As a rule, client projects are kept private and are never published online without explicit consent.",
    musicCredit: "Music: \"Affirmations\" by Scott Buckley (licensed under CC BY 4.0)",
    
    sliderTitle: "Widescreen Fit for Vertical Photos",
    sliderBefore: "Before (Raw vertical image)",
    sliderAfter: "After (Widescreen blurred background)",
    sliderDesc: "At any ceremony, most media is shot on mobile phones. Vertical photos create empty black sidebars on the projector, breaking the visual flow. We process each frame individually: generating a soft, matching blurred background based on the image's original palette, and placing the photo in the center with a clean border to ensure a professional widescreen presentation.",
    
    soundTitle: "Clean Sound & Clear Dialogues",
    soundDesc: "In many graduation videos, student voices are drowned out by loud music. We design the soundtrack manually: ducking the music gently whenever someone speaks and swelling it during transitions. We clean wind noise and balance volume so you won't need to run to the hall mixer during the screening.",
    
    pricingTitle: "Creative Formats",
    pricingSub: "How can we build your film?",
    pkg1Title: "The Field Clip",
    pkg1Price: "₪4,500",
    pkg1Desc: "An energetic, engaging 3-5 minute clip focusing on outdoor journeys, trips, and camps. Perfect for opening the ceremony or sharing on parents' WhatsApp groups. Includes sorting hundreds of files and rhythm-based sound editing.",
    pkg2Title: "The Full Documentary Film",
    pkg2Price: "₪7,000",
    pkg2Desc: "The core film of the graduation night. A 20-30 minute chronological narrative of the year or cohort. Includes sorting thousands of files, incorporating teacher/student blessings, background blur styling, detailed color/sound correction, and a mobile-friendly bonus reels clip.",
    pkgSubtext: "We do not work with a stopwatch or count revision rounds. We work together with you until the film is exact and moving.",
    
    badge1Title: "Projection Ready",
    badge1Desc: "Full HD MP4 optimized and cleaned for massive event screens (4K available on request)",
    badge2Title: "Licensed Music",
    badge2Desc: "Commercially licensed soundtracks, safe from YouTube blocks",
    badge3Title: "Simple Collaboration",
    badge3Desc: "Leave feedback and timestamped edits directly on the video online",
    badge4Title: "Strict Privacy for Minors",
    badge4Desc: "Secure upload portal and absolute erasure of all raw files in 30 days",
    
    faqTitle: "Frequently Asked Questions",
    faqQ1: "How do you protect student privacy, and can we see full examples?",
    faqA1: "All assets are stored on a private, secure server. Only I handle the files (no external freelancers), and everything is permanently erased 30 days after the event. Because of this, we do not publish client films publicly online.\n\nHowever, we are happy to schedule a short video call (or meeting) to show you full, secure examples (anonymized or partially blurred), or put you in touch with previous coordinators who can share their experience.",
    faqQ2: "What does the process, uploading, and timeline look like?",
    faqA2: "1. **Upload:** You upload the photos and videos from parents and teachers to a secure folder I set up for you.\n2. **First Draft:** Within 5-7 business days, you receive a private link to view the first cut (First Cut).\n3. **Feedback:** Using a simple digital commenting system, you leave notes and timestamps directly on the video.\n4. **Delivery:** Once approved, we export the final widescreen file along with the music license certificates.",
    faqQ3: "What happens if the first draft misses the tone we wanted?",
    faqA3: "Before starting, we hold a coordination call to align on the cohort's vibe (energetic, emotional, humorous, or quiet). If the first draft requires adjustments, we collaborate closely to realign it—we do not enforce rigid revision limits, and we work until the film is perfect.",
    faqQ4: "Are music licenses in writing, and what are the payment terms?",
    faqA4: "Yes, every film is accompanied by a written digital license certificate (PDF) covering public screening and YouTube uploads without restriction.\n\n**Payment terms:** 50% deposit at the start of work (sorting stage), and the remaining 50% only after you approve the final cut, prior to delivery of the screening file.",
    
    formTitle: "Let's Brainstorm Your Film",
    formSub: "Tell me a bit about your event and we will get back to you within 24 hours with an initial artistic direction and a structured proposal",
    formSchool: "School / Organization Name:",
    formDate: "Event / Graduation Date:",
    formEstimate: "Estimated Number of Files:",
    formPkg: "Desired Creative Format:",
    formLength: "Desired Video Length:",
    formEmail: "Contact Email:",
    formPhone: "Contact Phone:",
    formNotes: "Special requests or comments:",
    formSubmit: "Send Inquiry to Ahiya",
    formSuccess: "Thank you! Your inquiry was sent successfully. We will get back to you with a structured proposal within 24 hours.",
    
    contactTitle: "Creating the Climax of Your Event",
    contactSub: "Arrive at the graduation night with peace of mind, knowing the room will be captivated",
    contactDesc: "Producing a graduation film takes weeks of exhausting and nerve-wracking work. We take that entire burden off your shoulders. We will guide you in choosing music, build a moving narrative, and deliver a polished film that instills pride in parents, teachers, and students alike.",
    contactEmail: "Write to me:",
    contactPhone: "Call me:",
    footerText: "Ahiya Butman · Editing & Artistic Support for Youth and Community Events"
  }
};

export default function VideoPortfolio() {
  const [lang, setLang] = useState<"he" | "en">("he");
  const [sliderPos, setSliderPos] = useState(50);
  const [activeDemo, setActiveDemo] = useState<"ceremony" | "reels">("ceremony");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form submission state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    school: "",
    date: "",
    files: "",
    pkg: "premium",
    email: "",
    phone: "",
    notes: ""
  });

  const t = translations[lang];
  const isHebrew = lang === "he";

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    const bodyText = `
School/Organization Name: ${formState.school}
Event Date: ${formState.date}
Est Files: ${formState.files}
Format Channel: ${formState.pkg}
Contact Email: ${formState.email}
Phone: ${formState.phone}
Notes: ${formState.notes}
    `;
    window.open(`mailto:ahiya.butman@gmail.com?subject=Video Production Inquiry - ${encodeURIComponent(formState.school)}&body=${encodeURIComponent(bodyText)}`);
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

      {/* Personal Statement Card (Adds massive human credibility) */}
      <section className="lift lift-4 bg-[var(--color-paper-soft)]/20 p-6 rounded border border-[var(--color-rule)] font-sans">
        <h3 className="font-display font-medium text-[17px] text-[var(--color-ink)] mb-3">
          {t.personalNoteTitle}
        </h3>
        <p className="text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
          {t.personalNoteBody}
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

        {/* Privacy Note directly below demos */}
        <p className="mt-6 text-[12.5px] leading-relaxed text-[var(--color-ink-soft)] border-t border-[var(--color-rule)] pt-4 italic font-sans">
          🛡️ {t.privacyNotice}
        </p>
        <p className="mt-3 font-mono text-[10px] tracking-[0.1em] text-[var(--color-muted)]">
          {t.musicCredit}
        </p>
      </section>

      <div className="horizon my-12" />

      {/* Interactive Before & After Slider (Only vertical background blur) */}
      <section className="lift lift-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] mb-4">
          {t.sliderTitle}
        </h2>
        
        <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-[var(--color-rule)] select-none">
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

      <div className="horizon my-12" />

      {/* Sound Design narrative block (Clean, no tech widget) */}
      <section className="bg-[var(--color-paper-soft)]/40 p-6 rounded-lg border border-[var(--color-rule)] font-sans">
        <h3 className="font-display font-medium text-[17px] text-[var(--color-ink)] mb-3">
          {t.soundTitle}
        </h3>
        <p className="text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
          {t.soundDesc}
        </p>
      </section>

      <div className="horizon my-12" />

      {/* Pricing & Formats */}
      <section className="spine pr-6 pl-6 rtl:pr-6 rtl:pl-0 ltr:pl-6 ltr:pr-0">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {t.pricingTitle}
        </h2>
        <p className="mt-2 text-[14px] text-[var(--color-muted)] font-mono uppercase tracking-wider">
          {t.pricingSub}
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
          {/* Channel 1 */}
          <div className="p-6 rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-soft)]/20 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-xl font-medium text-[var(--color-ink)]">
                {t.pkg1Title}
              </h3>
              <div className="mt-3 text-3xl font-light text-[var(--color-sky-deep)] font-mono">
                {t.pkg1Price}
              </div>
              <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">
                {t.pkg1Desc}
              </p>
            </div>
          </div>

          {/* Channel 2 */}
          <div className="p-6 rounded-lg border-2 border-[var(--color-sky-deep)] bg-[var(--color-paper)] flex flex-col justify-between relative shadow-sm">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-sky-deep)] text-white font-mono text-[9px] tracking-widest px-3 py-1 rounded-full uppercase">
              מומלץ לטקס מרכזי
            </div>
            <div className="mt-2">
              <h3 className="font-display text-xl font-medium text-[var(--color-ink)]">
                {t.pkg2Title}
              </h3>
              <div className="mt-3 text-3xl font-light text-[var(--color-sky-deep)] font-mono">
                {t.pkg2Price}
              </div>
              <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">
                {t.pkg2Desc}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[10.5px] text-[var(--color-muted)] uppercase tracking-wide">
          {t.pkgSubtext}
        </p>
      </section>

      <div className="horizon my-12" />

      {/* Trust Deliverables Badges Grid */}
      <section className="grid grid-cols-2 gap-4 font-sans text-center">
        <div className="p-4 rounded border border-[var(--color-rule)] bg-[var(--color-paper-soft)]/20">
          <div className="text-xl mb-1">📺</div>
          <h4 className="font-display font-medium text-[14px] text-[var(--color-ink)]">{t.badge1Title}</h4>
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-ink-soft)]">{t.badge1Desc}</p>
        </div>
        <div className="p-4 rounded border border-[var(--color-rule)] bg-[var(--color-paper-soft)]/20">
          <div className="text-xl mb-1">🎵</div>
          <h4 className="font-display font-medium text-[14px] text-[var(--color-ink)]">{t.badge2Title}</h4>
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-ink-soft)]">{t.badge2Desc}</p>
        </div>
        <div className="p-4 rounded border border-[var(--color-rule)] bg-[var(--color-paper-soft)]/20">
          <div className="text-xl mb-1">💬</div>
          <h4 className="font-display font-medium text-[14px] text-[var(--color-ink)]">{t.badge3Title}</h4>
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-ink-soft)]">{t.badge3Desc}</p>
        </div>
        <div className="p-4 rounded border border-[var(--color-rule)] bg-[var(--color-paper-soft)]/20">
          <div className="text-xl mb-1">🛡️</div>
          <h4 className="font-display font-medium text-[14px] text-[var(--color-ink)]">{t.badge4Title}</h4>
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-ink-soft)]">{t.badge4Desc}</p>
        </div>
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
            { q: t.faqQ4, a: t.faqA4 }
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
                    {item.a.split("**").map((seg, i) =>
                      i % 2 === 1
                        ? <strong key={i} className="font-medium text-[var(--color-ink)]">{seg}</strong>
                        : seg
                    )}
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
                className="p-2 border border-[var(--color-rule)] rounded bg-transparent focus:outline-none focus:border-[var(--color-sky-deep)]"
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

            <div className="flex flex-col gap-1">
              <label htmlFor="pkg" className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">{t.formPkg}</label>
              <select
                id="pkg"
                name="pkg"
                value={formState.pkg}
                onChange={handleFormChange}
                className="p-2 border border-[var(--color-rule)] rounded bg-[var(--color-paper)] focus:outline-none focus:border-[var(--color-sky-deep)]"
              >
                <option value="classic">{isHebrew ? "קליפ שטח קצבי (3-5 דקות · ₪4,500)" : "Field Clip (3-5 min · ₪4,500)"}</option>
                <option value="premium">{isHebrew ? "סרט תיעודי מלא (20-30 דקות · ₪7,000)" : "Full Documentary (20-30 min · ₪7,000)"}</option>
              </select>
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

      {/* Contact info */}
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
