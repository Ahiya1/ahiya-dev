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
  const [sliderFeature, setSliderFeature] = useState<"blur" | "color">("blur");
  const [activeDemo, setActiveDemo] = useState<"ceremony" | "reels">("ceremony");

  // Audio simulation state
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioDucking, setAudioDucking] = useState(true);
  const [audioTime, setAudioTime] = useState(0);

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

  // Determine current audio phase based on simulated time
  // 0s - 1.8s: Music Only
  // 1.8s - 4.2s: Voice Speaking
  // 4.2s - 6s: Music Only
  const isVoiceSpeaking = audioTime >= 1.8 && audioTime <= 4.2;

  // Waveform heights calculation (pure CSS animation drivers)
  const getMusicBarHeight = (baseIndex: number) => {
    if (!audioPlaying) return "12px";
    
    // Base wave motion
    const timeFactor = Math.sin(audioTime * 4 + baseIndex) * 15 + 30;
    
    if (isVoiceSpeaking) {
      if (audioDucking) {
        // Ducked state: small amplitude
        return `${Math.max(4, Math.sin(audioTime * 10 + baseIndex) * 3 + 8)}px`;
      } else {
        // Unducked state: music stays loud
        return `${timeFactor}px`;
      }
    }
    return `${timeFactor}px`;
  };

  const getVoiceBarHeight = (baseIndex: number) => {
    if (!audioPlaying || !isVoiceSpeaking) return "3px";
    // Animated active voice waveform
    return `${Math.sin(audioTime * 12 + baseIndex) * 20 + 35}px`;
  };

  // Get status message based on current audio simulation state
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
            </>
          )}

          {/* FEATURE 2: COLOR GRADING PREVIEW */}
          {sliderFeature === "color" && (
            <>
              {/* BEFORE: Low-quality green-yellow phone photo */}
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
              
              {/* AFTER: Beautiful cinematic color grading (clipped) */}
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
        <p className="mt-3 text-[14.5px] leading-[1.65] text-[var(--color-ink-soft)] font-sans">
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
