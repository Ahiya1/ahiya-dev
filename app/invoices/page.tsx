"use client";

import { useState } from "react";
import Link from "next/link";

type Lang = "he" | "en";

type TranslationKey =
  | "backLink"
  | "title"
  | "subtitle"
  | "badge"
  | "urgencyTitle"
  | "urgencyBody"
  | "demoTitle"
  | "demoSub"
  | "tabOk"
  | "tabMissing"
  | "runBtn"
  | "runningLabel"
  | "fVendor"
  | "fTaxId"
  | "fInvNo"
  | "fDate"
  | "fNet"
  | "fVat"
  | "fTotal"
  | "fAlloc"
  | "fStatus"
  | "statusOk"
  | "statusMissing"
  | "demoCaption"
  | "trustTitle"
  | "trustBody"
  | "trustPoint1"
  | "trustPoint2"
  | "trustPoint3"
  | "painTitle"
  | "painBody"
  | "ioTitle"
  | "ioInLabel"
  | "ioIn"
  | "ioOutLabel"
  | "ioOut"
  | "startTitle"
  | "startBody"
  | "startNote"
  | "faqTitle"
  | "faqQ1"
  | "faqA1"
  | "faqQ2"
  | "faqA2"
  | "faqQ3"
  | "faqA3"
  | "faqQ4"
  | "faqA4"
  | "formTitle"
  | "formSub"
  | "formName"
  | "formFirm"
  | "formVolume"
  | "formSystem"
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

const translations: Record<Lang, Record<TranslationKey, string>> = {
  he: {
    backLink: "← לאתר הראשי",
    title: "החשבוניות נכנסות למערכת לבד. כולל בדיקת מספר הקצאה.",
    subtitle:
      "כלי שמקבל חשבוניות ספק בעברית, גם צילום מהטלפון, ומחזיר שורה נקייה ומסודרת: ספק, ח.פ, סכומים ומע\"מ. ובעיקר, מסמן כל חשבונית שחסר בה מספר הקצאה תקין, לפני שהיא חוסמת ללקוח את ניכוי מס התשומות.",
    badge: "חילוץ חשבוניות לרואי חשבון ומנהלי חשבונות · אחיה בוטמן",

    urgencyTitle: "מ-1 ביוני 2026, זה כבר לא נישתי",
    urgencyBody:
      "הסף לחובת מספר הקצאה ירד ל-5,000 ש\"ח לפני מע\"מ. בפועל, כמעט כל חשבונית עסקית חייבת עכשיו במספר הקצאה. חשבונית בלי מספר תקין מעל הסף עלולה למנוע מהלקוח שלכם לנכות את מס התשומות. זה הופך כל חודש לבדיקה ידנית מתישה, או לכלי שעושה אותה בשבילכם.",

    demoTitle: "ראו את זה עובד",
    demoSub: "בחרו חשבונית והריצו חילוץ",
    tabOk: "חשבונית תקינה",
    tabMissing: "חשבונית עם בעיה",
    runBtn: "הרץ חילוץ",
    runningLabel: "קורא את המסמך...",
    fVendor: "ספק",
    fTaxId: "עוסק / ח.פ",
    fInvNo: "מספר חשבונית",
    fDate: "תאריך",
    fNet: "לפני מע\"מ",
    fVat: "מע\"מ",
    fTotal: "סה\"כ",
    fAlloc: "מספר הקצאה",
    fStatus: "סטטוס",
    statusOk: "תקין · מוכן לקיזוז",
    statusMissing: "חסר מספר הקצאה · מס תשומות ₪1,710 חסום לניכוי",
    demoCaption:
      "ההדגמה רצה על חשבוניות אמיתיות. אותם שדות מחולצים גם מצילום טלפון, ולא רק מ-PDF נקי.",

    trustTitle: "שני מודלים. לא אחד.",
    trustBody:
      "כל חשבונית נקראת בנפרד בידי שני מודלים. כשהם מסכימים, השורה עוברת אוטומטית. כשהם לא, היא מסומנת לבדיקה אנושית.",
    trustPoint1: "על מסמכים דיגיטליים רגילים כמעט לא נשארת עבודה ידנית.",
    trustPoint2: "כשהצילום גרוע, המערכת מעדיפה לשאול אתכם מאשר לנחש.",
    trustPoint3: "אף פעם לא נכנס מספר שגוי בביטחון. זו הנקודה הכי חשובה.",

    painTitle: "למי זה",
    painBody:
      "מנהלי חשבונות ורואי חשבון מבזבזים בין 40% ל-70% מהשעות על הקלדה ידנית של קבלות וחשבוניות. הכלי לא בא להחליף אתכם, אלא להוריד מכם בדיוק את החלק הזה, ולהשאיר לכם את העבודה שבאמת דורשת שיקול דעת.",

    ioTitle: "מה נכנס ומה יוצא",
    ioInLabel: "נכנס",
    ioIn: "חשבונית ספק בעברית · PDF, סריקה או צילום מהטלפון · בודד או אצווה",
    ioOutLabel: "יוצא",
    ioOut:
      "שורה מסודרת לכל חשבונית: ספק, ח.פ, מספר, תאריך, סכומים ומע\"מ · בדיקת מספר הקצאה · יצוא נקי למערכת שלכם",

    startTitle: "איך מתחילים",
    startBody:
      "פיילוט במחיר קבוע: שולחים חודש אחד של חשבוניות ספק, ומקבלים בחזרה קובץ מסודר עם כל השדות, סימון של כל מה שחסר בו מספר הקצאה, ויצוא לפורמט שהמערכת שלכם קולטת.",
    startNote: "אם זה חוסך זמן, ממשיכים לעבודה חודשית. בלי מונה-זמן, מחיר סגור מראש.",

    faqTitle: "שאלות נפוצות",
    faqQ1: "כמה זה מדויק?",
    faqA1:
      "על חשבוניות דיגיטליות רגילות, שני המודלים מגיעים כמעט תמיד לאותה תוצאה, והיא נכונה. כל אי-הסכמה ביניהם מסומנת לבדיקה, כך שאתם בודקים רק את המעט שבאמת צריך, ולא את הכל.",
    faqQ2: "זה עובד על צילום מהטלפון ועל עברית?",
    faqA2:
      "כן. נבדק על חשבוניות עברית אמיתיות וגם על צילומים שהושחתו בכוונה. צילום סביר מהטלפון מחולץ במלואו. כשהצילום באמת גרוע, השדות הלא-קריאים מסומנים לבדיקה במקום להנחש.",
    faqQ3: "לאן אפשר לייצא?",
    faqA3:
      "ליצוא מובנה (CSV / אקסל) ולפורמטים שמערכות הנהלת חשבונות בישראל קולטות. נתאים את היצוא למערכת שאתם עובדים איתה.",
    faqQ4: "מה עם המסמכים שלי?",
    faqA4:
      "המסמכים מעובדים לצורך החילוץ בלבד ואינם נשמרים אחרי המסירה. נסגור בכתב את תנאי השמירה והמחיקה לפני שמתחילים.",

    formTitle: "בואו נבדוק על החשבוניות שלכם",
    formSub:
      "ספרו לי על המשרד, ואחזור אליכם עם הצעה לפיילוט במחיר קבוע על חודש אמיתי של חשבוניות.",
    formName: "שם:",
    formFirm: "שם המשרד:",
    formVolume: "כמה חשבוניות ספק בחודש (בערך):",
    formSystem: "מערכת הנהלת חשבונות נוכחית:",
    formEmail: "דוא\"ל ליצירת קשר:",
    formPhone: "טלפון:",
    formNotes: "משהו שכדאי שאדע:",
    formSubmit: "שליחה",
    formSuccess: "תודה. קיבלתי את הפרטים ואחזור אליכם בהקדם עם הצעה לפיילוט.",

    contactTitle: "להוריד את ההקלדה מהשולחן",
    contactSub: "לסגור את החודש בלי לשבת לילה על הקלדת חשבוניות ובדיקת מספרי הקצאה",
    contactDesc:
      "אם מרבית הזמן שלכם הולך על הקלדה ובדיקה ידנית, שווה לבדוק את זה על חשבוניות אמיתיות שלכם. נתחיל קטן, על חודש אחד, ונראה כמה זמן זה מחזיר.",
    contactEmail: "כתבו לי:",
    contactPhone: "דברו איתי:",
    footerText:
      "אחיה בוטמן · חילוץ חשבוניות ובדיקת מספר הקצאה לרואי חשבון ומנהלי חשבונות",
  },
  en: {
    backLink: "← Back to main site",
    title: "Supplier invoices that file themselves. Allocation-number check included.",
    subtitle:
      "A tool that takes Hebrew supplier invoices, including phone photos, and returns one clean structured row: vendor, business ID, amounts and VAT. Above all, it flags every invoice missing a valid allocation number, before it blocks your client's input-VAT deduction.",
    badge: "Invoice intake for accountants & bookkeepers · Ahiya Butman",

    urgencyTitle: "As of June 1, 2026, this is no longer niche",
    urgencyBody:
      "The allocation-number threshold dropped to ₪5,000 before VAT. In practice, nearly every business invoice now requires an allocation number. An invoice without a valid number above the threshold can stop your client from deducting input VAT. That turns every month into exhausting manual checking, or into a tool that does it for you.",

    demoTitle: "See it work",
    demoSub: "Pick an invoice and run extraction",
    tabOk: "Valid invoice",
    tabMissing: "Problem invoice",
    runBtn: "Run extraction",
    runningLabel: "Reading the document...",
    fVendor: "Vendor",
    fTaxId: "Business ID",
    fInvNo: "Invoice #",
    fDate: "Date",
    fNet: "Subtotal",
    fVat: "VAT",
    fTotal: "Total",
    fAlloc: "Allocation #",
    fStatus: "Status",
    statusOk: "Valid · deductible",
    statusMissing: "No allocation number · ₪1,710 input VAT blocked",
    demoCaption:
      "The demo runs on real invoices. The same fields are extracted from a phone photo too, not only a clean PDF.",

    trustTitle: "Two models. Not one.",
    trustBody:
      "Every invoice is read independently by two models. When they agree, the row passes automatically. When they disagree, it is flagged for a human.",
    trustPoint1: "On standard digital documents, almost no manual work is left.",
    trustPoint2: "When a photo is bad, the system would rather ask you than guess.",
    trustPoint3: "A wrong number never enters confidently. That is the whole point.",

    painTitle: "Who it's for",
    painBody:
      "Bookkeepers and accountants spend 40% to 70% of their hours on manual entry of receipts and invoices. This tool isn't here to replace you. It takes exactly that part off your plate, and leaves you the work that actually needs judgment.",

    ioTitle: "What goes in, what comes out",
    ioInLabel: "In",
    ioIn: "A Hebrew supplier invoice · PDF, scan, or phone photo · single or batch",
    ioOutLabel: "Out",
    ioOut:
      "One clean row per invoice: vendor, ID, number, date, amounts and VAT · allocation-number check · clean export into your system",

    startTitle: "How we start",
    startBody:
      "A fixed-price pilot: you send one month of supplier invoices, and get back a clean file with every field, a flag on anything missing an allocation number, and an export in the format your system ingests.",
    startNote: "If it saves time, we move to a monthly engagement. No stopwatch, price agreed up front.",

    faqTitle: "Frequently asked",
    faqQ1: "How accurate is it?",
    faqA1:
      "On standard digital invoices, the two models almost always reach the same result, and it is correct. Any disagreement between them is flagged for review, so you check only the few that truly need it, not everything.",
    faqQ2: "Does it work on phone photos and on Hebrew?",
    faqA2:
      "Yes. Tested on real Hebrew invoices and on deliberately degraded photos. A reasonable phone photo is fully extracted. When a photo is genuinely bad, the unreadable fields are flagged for review instead of guessed.",
    faqQ3: "Where can it export to?",
    faqA3:
      "To structured export (CSV / Excel) and to formats Israeli bookkeeping systems ingest. We tailor the export to the system you actually use.",
    faqQ4: "What about my documents?",
    faqA4:
      "Documents are processed only for the extraction and are not retained after delivery. We agree the retention and deletion terms in writing before we start.",

    formTitle: "Let's test it on your invoices",
    formSub:
      "Tell me about the practice, and I'll come back with a fixed-price pilot on one real month of invoices.",
    formName: "Name:",
    formFirm: "Practice name:",
    formVolume: "Supplier invoices per month (approx.):",
    formSystem: "Current bookkeeping system:",
    formEmail: "Contact email:",
    formPhone: "Phone:",
    formNotes: "Anything I should know:",
    formSubmit: "Send",
    formSuccess: "Thank you. I've received your details and will get back to you shortly with a pilot proposal.",

    contactTitle: "Get manual entry off the desk",
    contactSub: "Close the month without a late night of keying invoices and checking allocation numbers",
    contactDesc:
      "If most of your time goes to manual entry and checking, it's worth testing on your own real invoices. We start small, on one month, and see how much time it returns.",
    contactEmail: "Write to me:",
    contactPhone: "Call me:",
    footerText:
      "Ahiya Butman · Invoice extraction & allocation-number checking for accountants and bookkeepers",
  },
};

type DemoField = { key: TranslationKey; value: string };

const demoData: Record<"ok" | "missing", { img: string; fields: DemoField[] }> = {
  ok: {
    img: "/demo_invoice_ok.png",
    fields: [
      { key: "fVendor", value: "אורן טכנולוגיות בע\"מ" },
      { key: "fTaxId", value: "515872364" },
      { key: "fInvNo", value: "2026-0442" },
      { key: "fDate", value: "15/06/2026" },
      { key: "fNet", value: "₪12,000.00" },
      { key: "fVat", value: "18% · ₪2,160.00" },
      { key: "fTotal", value: "₪14,160.00" },
      { key: "fAlloc", value: "487213905" },
    ],
  },
  missing: {
    img: "/demo_invoice_missing.png",
    fields: [
      { key: "fVendor", value: "ספארק שיווק דיגיטל בע\"מ" },
      { key: "fTaxId", value: "516104773" },
      { key: "fInvNo", value: "1180" },
      { key: "fDate", value: "21/06/2026" },
      { key: "fNet", value: "₪9,500.00" },
      { key: "fVat", value: "18% · ₪1,710.00" },
      { key: "fTotal", value: "₪11,210.00" },
      { key: "fAlloc", value: "—" },
    ],
  },
};

export default function InvoicesTool() {
  const [lang, setLang] = useState<Lang>("he");
  const [active, setActive] = useState<"ok" | "missing">("ok");
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    firm: "",
    volume: "",
    system: "",
    email: "",
    phone: "",
    notes: "",
  });

  const t = translations[lang];
  const isHebrew = lang === "he";

  const selectInvoice = (which: "ok" | "missing") => {
    setActive(which);
    setPhase("idle");
  };

  const runExtraction = () => {
    setPhase("running");
    setTimeout(() => setPhase("done"), 1300);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    const bodyText = `
Name: ${formState.name}
Practice: ${formState.firm}
Invoices/month: ${formState.volume}
Current system: ${formState.system}
Email: ${formState.email}
Phone: ${formState.phone}
Notes: ${formState.notes}
    `;
    window.open(
      `mailto:ahiya.butman@gmail.com?subject=Invoice Tool Inquiry - ${encodeURIComponent(
        formState.firm || formState.name
      )}&body=${encodeURIComponent(bodyText)}`
    );
  };

  const current = demoData[active];

  return (
    <main
      className="mx-auto max-w-2xl px-6 py-20 sm:py-28"
      dir={isHebrew ? "rtl" : "ltr"}
      style={{
        fontFamily: isHebrew
          ? "var(--font-hebrew), var(--font-sans), sans-serif"
          : "var(--font-sans), sans-serif",
      }}
    >
      {/* Nav / language toggle */}
      <div className="lift lift-1 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
        <Link
          href="/"
          className="hover:text-[var(--color-sky-deep)] transition-colors duration-300"
        >
          {t.backLink}
        </Link>
        <button
          onClick={() => setLang(isHebrew ? "en" : "he")}
          className="hover:text-[var(--color-sky-deep)] transition-colors duration-300 px-3 py-1 border border-[var(--color-rule)] rounded hover:bg-[var(--color-paper-soft)] cursor-pointer"
        >
          {isHebrew ? "English" : "עברית"}
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

      {/* Urgency / timing */}
      <section className="lift lift-4 bg-[var(--color-paper-soft)]/20 p-6 rounded border border-[var(--color-rule)] font-sans">
        <h3 className="font-display font-medium text-[17px] text-[var(--color-ink)] mb-3">
          {t.urgencyTitle}
        </h3>
        <p className="text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
          {t.urgencyBody}
        </p>
      </section>

      <div className="horizon my-12" />

      {/* Interactive extraction demo */}
      <section className="lift lift-5">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1">
          {t.demoTitle}
        </h2>
        <p className="text-[13px] text-[var(--color-muted)] font-mono uppercase tracking-wider mb-5">
          {t.demoSub}
        </p>

        {/* Invoice tabs */}
        <div className="flex gap-2 mb-6 border-b border-[var(--color-rule)] pb-px font-mono text-xs tracking-wider select-none">
          <button
            onClick={() => selectInvoice("ok")}
            className={`pb-2 px-1 cursor-pointer transition-all duration-300 border-b-2 -mb-px ${
              active === "ok"
                ? "border-[var(--color-sky-deep)] text-[var(--color-ink)] font-medium"
                : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {t.tabOk}
          </button>
          <button
            onClick={() => selectInvoice("missing")}
            className={`pb-2 px-1 cursor-pointer transition-all duration-300 border-b-2 -mb-px ${
              active === "missing"
                ? "border-[var(--color-sky-deep)] text-[var(--color-ink)] font-medium"
                : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {t.tabMissing}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
          {/* Invoice image */}
          <div className="relative rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-soft)] overflow-hidden">
            <img
              src={current.img}
              alt="Sample invoice"
              className="w-full h-auto object-contain"
            />
            {phase !== "done" && (
              <button
                onClick={runExtraction}
                disabled={phase === "running"}
                className="absolute inset-0 flex items-center justify-center bg-[var(--color-ink)]/45 backdrop-blur-[1px] cursor-pointer group"
              >
                <span className="px-5 py-2.5 bg-[var(--color-sky-deep)] group-hover:bg-[var(--color-sky)] text-white font-mono text-[11px] uppercase tracking-[0.18em] rounded shadow-sm transition-colors duration-300">
                  {phase === "running" ? t.runningLabel : t.runBtn}
                </span>
              </button>
            )}
          </div>

          {/* Extraction panel */}
          <div className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-soft)]/20 p-4 font-sans min-h-[260px]">
            {phase === "idle" && (
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-muted)] leading-relaxed">
                {isHebrew
                  ? "לחצו “הרץ חילוץ” על החשבונית"
                  : "Hit “Run extraction” on the invoice"}
              </p>
            )}

            {phase === "running" && (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <div className="h-2.5 w-16 rounded bg-[var(--color-rule)]" />
                    <div className="h-2.5 flex-1 rounded bg-[var(--color-rule)]/70" />
                  </div>
                ))}
              </div>
            )}

            {phase === "done" && (
              <div className="hit-fade">
                <dl className="space-y-2 text-[13px]">
                  {current.fields.map((f) => (
                    <div
                      key={f.key}
                      className="flex justify-between gap-4 border-b border-[var(--color-rule)]/60 pb-1.5"
                    >
                      <dt className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-[var(--color-muted)] pt-1 whitespace-nowrap">
                        {t[f.key]}
                      </dt>
                      <dd
                        className={`text-[var(--color-ink)] text-end ${
                          f.key === "fAlloc" && active === "missing"
                            ? "text-[#a23a2a] font-semibold"
                            : ""
                        }`}
                      >
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Status banner */}
                <div
                  className={`mt-4 flex items-start gap-2 rounded px-3 py-2.5 text-[12.5px] font-medium leading-snug ${
                    active === "ok"
                      ? "bg-[var(--color-sky-deep)]/10 text-[var(--color-sky-deep)] border border-[var(--color-sky-deep)]/30"
                      : "bg-[#a23a2a]/10 text-[#a23a2a] border border-[#a23a2a]/30"
                  }`}
                >
                  <span className="font-mono">{active === "ok" ? "✓" : "!"}</span>
                  <span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] block opacity-70">
                      {t.fStatus}
                    </span>
                    {active === "ok" ? t.statusOk : t.statusMissing}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-5 text-[12.5px] leading-relaxed text-[var(--color-ink-soft)] border-t border-[var(--color-rule)] pt-4 italic font-sans">
          {t.demoCaption}
        </p>
      </section>

      <div className="horizon my-12" />

      {/* Two models trust */}
      <section className="lift bg-[var(--color-paper-soft)]/40 p-6 rounded-lg border border-[var(--color-rule)] font-sans">
        <h3 className="font-display font-medium text-[17px] text-[var(--color-ink)] mb-3">
          {t.trustTitle}
        </h3>
        <p className="text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
          {t.trustBody}
        </p>
        <ul className="mt-4 space-y-2 text-[13.5px] text-[var(--color-ink-soft)]">
          {[t.trustPoint1, t.trustPoint2, t.trustPoint3].map((p, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="text-[var(--color-sky-deep)] font-mono mt-0.5">→</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="horizon my-12" />

      {/* In / Out */}
      <section className="spine pr-6 pl-6 rtl:pr-6 rtl:pl-0 ltr:pl-6 ltr:pr-0">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] mb-6">
          {t.ioTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-sans">
          <div className="p-5 rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-soft)]/20">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-muted)] mb-2">
              {t.ioInLabel}
            </div>
            <p className="text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
              {t.ioIn}
            </p>
          </div>
          <div className="p-5 rounded-lg border-2 border-[var(--color-sky-deep)] bg-[var(--color-paper)]">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-sky-deep)] mb-2">
              {t.ioOutLabel}
            </div>
            <p className="text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
              {t.ioOut}
            </p>
          </div>
        </div>
      </section>

      <div className="horizon my-12" />

      {/* Pain / who */}
      <section className="font-sans">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] mb-3">
          {t.painTitle}
        </h2>
        <p className="text-[15px] leading-[1.7] text-[var(--color-ink-soft)]">
          {t.painBody}
        </p>
      </section>

      <div className="horizon my-12" />

      {/* How we start */}
      <section className="spine pr-6 pl-6 rtl:pr-6 rtl:pl-0 ltr:pl-6 ltr:pr-0">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] mb-4">
          {t.startTitle}
        </h2>
        <div className="p-6 rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-soft)]/20 font-sans">
          <p className="text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
            {t.startBody}
          </p>
          <p className="mt-3 font-mono text-[10.5px] uppercase tracking-wide text-[var(--color-muted)]">
            {t.startNote}
          </p>
        </div>
      </section>

      <div className="horizon my-12" />

      {/* FAQ */}
      <section className="spine pr-6 pl-6 rtl:pr-6 rtl:pl-0 ltr:pl-6 ltr:pr-0">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {t.faqTitle}
        </h2>
        <div className="mt-6 space-y-3 font-sans text-[14px]">
          {[
            { q: t.faqQ1, a: t.faqA1 },
            { q: t.faqQ2, a: t.faqA2 },
            { q: t.faqQ3, a: t.faqA3 },
            { q: t.faqQ4, a: t.faqA4 },
          ].map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="border-b border-[var(--color-rule)] pb-3">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className={`w-full flex justify-between items-center ${
                    isHebrew ? "text-right" : "text-left"
                  } font-display font-medium text-[15px] text-[var(--color-ink)] cursor-pointer py-2 focus:outline-none hover:text-[var(--color-sky-deep)] transition-colors duration-200`}
                >
                  <span>{item.q}</span>
                  <span className="font-mono text-[14px] text-[var(--color-muted)]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)] whitespace-pre-line hit-fade">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="horizon my-12" />

      {/* Inquiry form */}
      <section className="bg-[var(--color-paper-soft)] border border-[var(--color-rule)] rounded-lg p-6 font-sans">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {t.formTitle}
        </h2>
        <p className="mt-2 text-[13px] text-[var(--color-ink-soft)] mb-6">{t.formSub}</p>

        {formSubmitted ? (
          <div className="p-4 bg-[var(--color-sky-deep)]/10 text-[var(--color-sky-deep)] border border-[var(--color-sky-deep)]/30 rounded text-center text-[14px] font-semibold transition-all duration-300">
            {t.formSuccess}
          </div>
        ) : (
          <form
            onSubmit={handleFormSubmit}
            className="space-y-4 text-[13.5px] text-[var(--color-ink-soft)]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
                >
                  {t.formName}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formState.name}
                  onChange={handleFormChange}
                  className="p-2 border border-[var(--color-rule)] rounded bg-[var(--color-paper)] focus:outline-none focus:border-[var(--color-sky-deep)]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="firm"
                  className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
                >
                  {t.formFirm}
                </label>
                <input
                  type="text"
                  id="firm"
                  name="firm"
                  value={formState.firm}
                  onChange={handleFormChange}
                  className="p-2 border border-[var(--color-rule)] rounded bg-[var(--color-paper)] focus:outline-none focus:border-[var(--color-sky-deep)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="volume"
                  className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
                >
                  {t.formVolume}
                </label>
                <input
                  type="text"
                  id="volume"
                  name="volume"
                  placeholder={isHebrew ? "לדוגמה: 300" : "e.g. 300"}
                  value={formState.volume}
                  onChange={handleFormChange}
                  className="p-2 border border-[var(--color-rule)] rounded bg-[var(--color-paper)] focus:outline-none focus:border-[var(--color-sky-deep)]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="system"
                  className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
                >
                  {t.formSystem}
                </label>
                <input
                  type="text"
                  id="system"
                  name="system"
                  placeholder={isHebrew ? "חשבשבת / ריווחית / אחר" : "Hashavshevet / Rivhit / other"}
                  value={formState.system}
                  onChange={handleFormChange}
                  className="p-2 border border-[var(--color-rule)] rounded bg-[var(--color-paper)] focus:outline-none focus:border-[var(--color-sky-deep)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
                >
                  {t.formEmail}
                </label>
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
                <label
                  htmlFor="phone"
                  className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
                >
                  {t.formPhone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formState.phone}
                  onChange={handleFormChange}
                  className="p-2 border border-[var(--color-rule)] rounded bg-[var(--color-paper)] focus:outline-none focus:border-[var(--color-sky-deep)]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="notes"
                className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
              >
                {t.formNotes}
              </label>
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

      {/* Contact */}
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
            <a className="link font-sans text-base" href="mailto:ahiya.butman@gmail.com">
              ahiya.butman@gmail.com
            </a>
          </li>
          <li>
            <span>{t.contactPhone} </span>
            <a className="link font-sans text-base" href="tel:+972587789019">
              058-778-9019
            </a>
          </li>
        </ul>
      </section>

      <footer className="mt-20 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {t.footerText}
      </footer>
    </main>
  );
}
