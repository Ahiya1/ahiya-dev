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
    title: "סרטוני סיום מרגשים שחוגגים את הסיפור שלכם",
    subtitle: "סטודיו עריכה המשלב רגישות אומנותית וטכנולוגיה חכמה כדי להפוך מאות קבצים מפוזרים מההורים והשטח ליצירה קולנועית סוחפת — ללא טיפת מאמץ מצדכם.",
    badge: "ליווי אומנותי והפקה קהילתית · קיץ 2026",
    videoTitle: "סרטון לדוגמה: הרגעים שהופכים למשפחה",
    videoCaption: "סרטון הדגמה (22 שניות) המציג תנועה אומנותית, מעברים רכים וכתוביות קולנועיות המשתלבות ברקע ללא פגיעה בחוויית הצפייה.",
    sliderTitle: "איך אנחנו מעלים את החומרים שלכם לרמה של קולנוע?",
    sliderBefore: "לפני (תמונת סלולר אנכית ומסך שחור בצדדים)",
    sliderAfter: "אחרי (חוויית מקרן רחבה ועשירה במיוחד)",
    sliderDesc: "בכל אירוע קהילתי, רוב החומרים שמגיעים מההורים ומהשטח צולמו לאורך בטלפונים הניידים. כשהם מוקרנים על מסך רחב באולם, הם מוקפים בשוליים שחורים וריקים שפוגעים בחגיגיות. העורכים שלנו מעבדים כל תמונה אנכית בעזרת כלי טשטוש אומנותיים המבוססים על גווני המקור, ומניחים את התמונה החדה במרכז בתוך מסגרת נקייה. התוצאה: מראה קולנועי עשיר שממלא את המסך כולו באווירה אחידה ויוקרתית.",
    capabilitiesTitle: "הערך האומנותי וההפקתי שלנו",
    cap1Title: "1. החייאה אומנותית של כל תמונה",
    cap1Desc: "תמונות הסטילס הסטטיות שלכם לא סתם מופיעות על המסך. אנו מעניקים להן תנועת מצלמה עדינה, זום רך ושינויי זווית הדרגתיים שיוצרים זרימה של סרט תיעודי מקצועי ומאפשרים לקהל להתרכז בפנים המצולמות.",
    cap2Title: "2. עיצוב פסקול קולנועי ואיזון דיבור דינמי",
    cap2Desc: "סרט טוב נשען על סאונד מעולה. אנו מעצבים את פסקול הסרט כך שמוזיקת הרקע הולכת ונחלשת באופן טבעי בכל פעם שמישהו מדבר, מברך או צוחק, ומתחזקת בעוצמה מלאה ברגעי המעבר. הקהל לא יפסיד אף מילה או ברכה מרגשת.",
    cap3Title: "3. בניית נרטיב וסידור כרונולוגי של השנה",
    cap3Desc: "אתם שולחים לנו את תיקיות החומרים ללא סדר, ואנחנו דואגים לכל השאר. אנו מנתחים את זמני הצילום האמיתיים ומסדרים את התמונות והסרטונים באופן שיבנה סיפור מרתק — מההתחלה המהוססת של השנה, דרך החוויות המשותפות, ועד לרגע הפרידה המרגש.",
    contactTitle: "בואו נעצב את רגע השיא של האירוע שלכם",
    contactSub: "רוצים שקט נפשי ודמעות של התרגשות באולם?",
    contactDesc: "הפקת סרט סיום מצריכה שבועות של איסוף, מיון ועריכה מתישה. אנחנו לוקחים את כל האחריות הזו מכם. אנו מנהלים את איסוף המדיה, מייעצים לגבי התסריט והמוזיקה, ומעניקים לכם מוצר מוגמר ומושלם שיגרום להורים ולתלמידים להרגיש גאווה אמיתית. צרו קשר עכשיו כדי לשריין תאריך לעריכה לקראת אירועי סוף הקיץ.",
    contactEmail: "דוא\"ל:",
    contactPhone: "טלפון:",
    footerText: "אהיה בוטמן · הפקת וידאו קהילתית"
  },
  en: {
    backLink: "← Back to home",
    title: "Cinematic Graduation Videos That Celebrate Your Story",
    subtitle: "An editing studio combining artistic sensitivity and cutting-edge technology to turn hundreds of scattered files from parents and staff into a sweeping cinematic masterpiece—with zero effort from your team.",
    badge: "Artistic Direction & Community Production · Summer 2026",
    videoTitle: "Case Study Showcase: The Moments That Make a Family",
    videoCaption: "A 22-second demonstration showcasing natural camera motions, soft transitions, and cinematic subtitles that blend cleanly into the frame.",
    sliderTitle: "How We Elevate Your Raw Media to a Cinematic Level",
    sliderBefore: "Before (Vertical phone photo with black bars)",
    sliderAfter: "After (Rich widescreen projection experience)",
    sliderDesc: "At any community event, most media contributed by parents and counselors is shot vertically on mobile phones. When projected on a wide screen, these photos are usually boxed in by ugly black sidebars. Our studio processes each vertical photo using artistic background-blurring techniques tailored to the original image's palette, placing the sharp photo in the center with a crisp white border. The result is a unified, premium look that fills the entire screen.",
    capabilitiesTitle: "Our Production & Artistic Value",
    cap1Title: "1. Reviving Every Photo with Subtle Camera Motion",
    cap1Desc: "Static still photos don't just sit on the screen. We breathe life into them with delicate camera moves—soft zooms and gradual pans—mimicking professional documentary direction to draw the audience into each face.",
    cap2Title: "2. Cinematic Soundscapes & Intelligent Volume Balancing",
    cap2Desc: "A great film relies on excellent sound. We design the audio so the background music automatically ducks to a gentle level whenever a participant speaks or laughs, and fades back to full volume between greetings. Your audience won't miss a single word.",
    cap3Title: "3. Narrative Structuring & Chronological Timeline",
    cap3Desc: "Send us your messy media folders, and we take care of the rest. We analyze capture metadata to reconstruct the year's chronological timeline, building a meaningful story arc—from the quiet first day of the cohort to the emotional graduation ceremony.",
    contactTitle: "Let's Design the Climax of Your Event",
    contactSub: "Seeking peace of mind and tears of joy in the crowd?",
    contactDesc: "Creating a ceremony video takes weeks of chaotic gathering, sorting, and editing. We take that entire burden off your shoulders. We manage media collection, consult on story structure, and deliver a polished film that instills deep community pride. Reach out today to secure your production slot for late summer.",
    contactEmail: "Email:",
    contactPhone: "Phone:",
    footerText: "Ahiya Butman · Community Video Production"
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
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800" 
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
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800')` }}
            />
            {/* Clean foreground photo with border */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800" 
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
        
        <div className="mt-8 space-y-8 text-[15px] leading-[1.7] text-[var(--color-ink-soft)]">
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

