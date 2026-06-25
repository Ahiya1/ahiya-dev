"use client";

import { useState } from "react";
import Link from "next/link";

type TranslationKey = 
  | "backLink"
  | "title"
  | "subtitle"
  | "badge"
  | "videoTitle"
  | "videoCaption"
  | "sliderTitle"
  | "sliderBefore"
  | "sliderAfter"
  | "sliderDesc"
  | "capabilitiesTitle"
  | "cap1Title"
  | "cap1Desc"
  | "cap2Title"
  | "cap2Desc"
  | "cap3Title"
  | "cap3Desc"
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
    videoTitle: "הצצה ליצירה: הרגעים שהופכים למשפחה",
    videoCaption: "סרטון הדגמה (22 שניות) המציג עריכה קולנועית, תנועה אומנותית עדינה וכתוביות נקיות בגובה העיניים.",
    sliderTitle: "איך אנחנו מעניקים לכל תמונה כבוד של קולנוע?",
    sliderBefore: "לפני (תמונת סלולר אנכית שקוטעת את הרצף)",
    sliderAfter: "אחרי (חוויה רחבה ומלאה שמכניסה לאווירה)",
    sliderDesc: "בכל מסיבת סיום, רוב החומרים שמגיעים מההורים ומהשטח צולמו בנייד לאורך. כשהם מוקרנים באולם, השוליים השחורים הריקים פוגעים בחגיגיות ומכווצים את המסך. העורכים שלנו מעבדים כל תמונה אנכית בנפרד, מטשטשים את הרקע ברכות על בסיס צבעי המקור, וממסגרים את התמונה החדה במרכז. על המסך הגדול זה מרגיש כמו סרט קולנוע עשיר שממלא את העין.",
    capabilitiesTitle: "למה בתי ספר ורכזים בוחרים לעבוד איתנו?",
    cap1Title: "1. אתם רק שולחים את החומרים, אנחנו עושים את כל השאר",
    cap1Desc: "איסוף ומיון של מאות תמונות מ-300 הורים ומורים זה סיוט. אנחנו מנהלים עבורכם את התהליך: שולחים קישור פשוט להעלאה, ממיינים, מסננים כפילויות, ומסדרים הכל כרונולוגית כדי לבנות את סיפור השנה בקלות ובשקט נפשי.",
    cap2Title: "2. החייאה אומנותית של רגעי סטילס",
    cap2Desc: "תמונות הסטילס לא סתם 'קופצות' על המסך. אנו מעניקים להן תנועת מצלמה עדינה, זום עדין ושינויי זווית הדרגתיים שיוצרים תחושה של סרט דוקומנטרי מקצועי ומאפשרים לקהל להישאב לתוך הרגע.",
    cap3Title: "3. עיצוב פסקול קולנועי שנוגע בלב",
    cap3Desc: "הסאונד הוא חצי מהחוויה. אנו מעצבים את פסקול הסרט עם מעברים מוזיקליים מדויקים שמלווים את הרגשות באולם, ומאזנים את העוצמות באופן דינמי כך שמוזיקת הרקע נחלשת בעדינות כשמישהו מדבר, ומתגברת ברגעי המעבר.",
    contactTitle: "בואו ניצור את רגע השיא של האירוע שלכם",
    contactSub: "רוצים להגיע לערב הסיום בראש שקט ובידיעה שהאולם יהיה מרותק?",
    contactDesc: "הפקת סרט סיום מצריכה שבועות של עבודה מתישה. אנחנו מורידים את כל העול הזה מכם. נלווה אתכם בבחירת המוזיקה, נבנה נרטיב מרגש, ונעניק לכם מוצר מושלם שיגרום להורים, למורים ולתלמידים להרגיש גאווה אמיתית. צרו קשר עכשיו כדי לשריין תאריך לעריכה לקראת אירועי הקיץ.",
    contactEmail: "כתבו לנו:",
    contactPhone: "דברו איתנו:",
    footerText: "אהיה בוטמן · עריכה וליווי אומנותי לאירועי קהילה"
  },
  en: {
    backLink: "← Back to home",
    title: "A Graduation Film That Celebrates Their Beautiful Moments Together",
    subtitle: "We turn hundreds of scattered photos and videos from parents, trips, and WhatsApp groups into a moving cinematic masterpiece that connects everyone—without the headache of sorting, coordination, and editing.",
    badge: "Cinematic Editing & Personal Production Support · Summer 2026",
    videoTitle: "Case Study Showcase: The Moments That Make a Family",
    videoCaption: "A 22-second demonstration showcasing cinematic editing, natural camera motions, and clean subtitles that blend cleanly into the frame.",
    sliderTitle: "How We Give Every Photo the Dignity of Cinema",
    sliderBefore: "Before (Vertical phone photo breaking the flow)",
    sliderAfter: "After (Rich widescreen projection experience)",
    sliderDesc: "At any graduation ceremony, most media contributed by parents and counselors is shot vertically on mobile phones. When projected on a wide screen, these photos are usually boxed in by ugly black sidebars, shrinking the screen. Our editors process each vertical photo individually, blurring the background softly based on the original image's palette, and framing the sharp photo in the center. On the big screen, it feels like a rich, unified film experience.",
    capabilitiesTitle: "Why Schools and Coordinators Choose Us",
    cap1Title: "1. You Just Send the Files, We Do Everything Else",
    cap1Desc: "Gathering and sorting hundreds of photos from 300 parents and teachers is a nightmare. We manage the process for you: sending a simple upload link, sorting, filtering duplicates, and organizing everything chronologically to build the year's story with ease and peace of mind.",
    cap2Title: "2. Reviving Static Still Photos with Delicate Motion",
    cap2Desc: "Still photos don't just 'pop' onto the screen. We give them subtle camera movement—soft zooms and gradual angle changes—creating a professional documentary feel that draws the audience into the moment.",
    cap3Title: "3. Cinematic Sound Design That Touches the Heart",
    cap3Desc: "Sound is half the experience. We design the film soundtrack with precise musical transitions that match the room's emotions, and balance volumes dynamically so background music ducks when someone speaks and swells during transitions.",
    contactTitle: "Let's Design the Climax of Your Event",
    contactSub: "Want to arrive at the graduation evening with peace of mind, knowing the room will be captivated?",
    contactDesc: "Creating a graduation video takes weeks of exhausting work. We take that entire burden off your shoulders. We will guide you in choosing music, build an emotional narrative, and deliver a polished film that instills pride in parents, teachers, and students alike. Reach out today to secure your editing slot for the summer.",
    contactEmail: "Write to us:",
    contactPhone: "Call us:",
    footerText: "Ahiya Butman · Editing & Artistic Support for Community Events"
  }
};

export default function VideoPortfolio() {
  const [lang, setLang] = useState<"he" | "en">("he");
  const [sliderPos, setSliderPos] = useState(50);

  const t = translations[lang];
  const isHebrew = lang === "he";

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
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
        <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-soft)] shadow-sm">
          <video
            src="/showcase_ceremony.mp4"
            controls
            className="w-full h-full object-cover"
          />
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-center text-[var(--color-muted)]">
          {t.videoCaption}
        </p>
      </section>

      <div className="horizon my-16" />

      {/* Interactive Before & After Slider */}
      <section className="lift lift-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] mb-6">
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
            {/* Blurred scaled background */}
            <div 
              className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110 opacity-75"
              style={{ backgroundImage: "url('/showcase_p7.jpg')" }}
            />
            {/* Clean foreground photo with border */}
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
        
        <p className="mt-4 text-[14.5px] leading-[1.65] text-[var(--color-ink-soft)]">
          {t.sliderDesc}
        </p>
      </section>

      <div className="horizon my-16" />

      {/* Production Capabilities */}
      <section className="spine pr-6 pl-6 rtl:pr-6 rtl:pl-0 ltr:pl-6 ltr:pr-0">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {t.capabilitiesTitle}
        </h2>
        
        <div className="mt-8 space-y-8 text-[15px] leading-[1.7] text-[var(--color-ink-soft)] font-sans">
          <div>
            <h3 className="font-display text-lg font-medium text-[var(--color-ink)]">
              {t.cap1Title}
            </h3>
            <p className="mt-2 text-[14.5px]">
              {t.cap1Desc}
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium text-[var(--color-ink)]">
              {t.cap2Title}
            </h3>
            <p className="mt-2 text-[14.5px]">
              {t.cap2Desc}
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium text-[var(--color-ink)]">
              {t.cap3Title}
            </h3>
            <p className="mt-2 text-[14.5px]">
              {t.cap3Desc}
            </p>
          </div>
        </div>
      </section>

      <div className="horizon my-16" />

      {/* Contact */}
      <section>
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {t.contactTitle}
        </h2>
        <p className="mt-6 font-display text-[18px] sm:text-[20px] italic leading-[1.4] text-[var(--color-ink)]">
          {t.contactSub}
        </p>
        <p className="mt-3 text-[14.5px] leading-[1.65] text-[var(--color-ink-soft)]">
          {t.contactDesc}
        </p>
        <ul className="mt-6 space-y-2 text-[14.5px] text-[var(--color-ink-soft)] font-mono">
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
