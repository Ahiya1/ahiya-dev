"use client";

import { useState } from "react";
import Link from "next/link";

export default function VideoPortfolio() {
  const [sliderPos, setSliderPos] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
      {/* Back to main page */}
      <div className="lift lift-1">
        <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] hover:text-[var(--color-sky-deep)] transition-colors duration-300">
          ← ahiya.dev
        </Link>
      </div>

      {/* Header */}
      <section className="mt-8">
        <h1 className="lift lift-2 font-display text-4xl sm:text-5xl font-normal leading-[1.05] tracking-tight text-[var(--color-ink)]">
          Programmatic Video Production
        </h1>
        <p className="lift lift-3 mt-6 font-display text-[20px] font-light italic leading-[1.4] text-[var(--color-ink-soft)]">
          Transforming mixed community media—vertical phone photos, raw audio, and outdoor clips—into cohesive, cinematic widescreen narratives.
        </p>
        <p className="lift lift-4 mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Case Study · Automated Video Engine
        </p>
      </section>

      <div className="horizon my-12" />

      {/* Showcase Video Player */}
      <section className="lift lift-5">
        <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-soft)] shadow-sm">
          <video
            src="/showcase_ceremony.mp4"
            controls
            poster="https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=1200"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-center text-[var(--color-muted)]">
          Demonstration Video (Acoustic Guitar & Piano track by Kevin MacLeod)
        </p>
      </section>

      <div className="horizon my-16" />

      {/* Interactive Before & After Slider */}
      <section className="lift lift-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] mb-6">
          Interactive: Widescreen Adaptation
        </h2>
        
        <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-[var(--color-rule)] select-none">
          {/* BEFORE: Raw vertical photo on black */}
          <div className="absolute inset-0 bg-[#0d0c0a] flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800" 
              alt="Raw vertical photo" 
              className="h-[90%] w-auto object-contain"
            />
            <div className="absolute top-4 left-4 bg-black/60 text-white font-mono text-[9px] tracking-[0.1em] px-2 py-0.5 rounded">
              BEFORE (RAW VERTICAL)
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
            <div className="absolute top-4 right-4 bg-[var(--color-sky-deep)] text-white font-mono text-[9px] tracking-[0.1em] px-2 py-0.5 rounded">
              AFTER (BLUR OVERLAY)
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
        
        <p className="mt-4 text-[14px] leading-[1.6] text-[var(--color-ink-soft)]">
          Community participants primarily shoot vertical media on mobile phones. To avoid empty black sidebars on widescreen ceremony projectors, our pipeline automatically isolates the foreground, applies an active Gaussian blur to the scaled background, and drops the focused original on top with a clean white margin.
        </p>
      </section>

      <div className="horizon my-16" />

      {/* Production Capabilities */}
      <section className="spine pl-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Capabilities & Pipeline
        </h2>
        
        <div className="mt-8 space-y-8 text-[15px] leading-[1.7] text-[var(--color-ink-soft)]">
          <div>
            <h3 className="font-display text-lg font-medium text-[var(--color-ink)]">
              1. Cinematic Photo Motion (Ken Burns Effect)
            </h3>
            <p className="mt-1">
              Static slides are automatically animated with smooth, slow camera movements (zoom in, zoom out, left/right panning). These motions are randomized per photo to mimic professional documentary footage.
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium text-[var(--color-ink)]">
              2. Intelligent Audio Ducking
            </h3>
            <p className="mt-1">
              Speech should never compete with music. The mixing engine dynamically monitors speech timestamps and automatically decreases the background music volume to 15% when someone is speaking, fading it back to 100% during photo transitions.
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium text-[var(--color-ink)]">
              3. Chronological Metadata Ordering
            </h3>
            <p className="mt-1">
              Videos are compiled using EXIF metadata and timestamp patterns. The pipeline naturally sorts the media files from day one of the cohort to the graduation ceremony, building a cohesive narrative arc.
            </p>
          </div>
        </div>
      </section>

      <div className="horizon my-16" />

      {/* Inquiries / Contact */}
      <section>
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Inquiries
        </h2>
        <p className="mt-6 font-display text-[18px] italic leading-[1.4] text-[var(--color-ink)]">
          Looking for automated widescreen editing or custom ceremony video compilation?
        </p>
        <p className="mt-3 text-[14.5px] leading-[1.6] text-[var(--color-ink-soft)]">
          This rendering engine can be customized with your branding, specific color schemes, music selection, and speech files. Secure your date for upcoming events in late summer.
        </p>
        <ul className="mt-6 space-y-2 text-[14.5px] text-[var(--color-ink-soft)]">
          <li>
            Email: <a className="link" href="mailto:ahiya.butman@gmail.com">ahiya.butman@gmail.com</a>
          </li>
          <li>
            Phone: <a className="link" href="tel:+972587789019">058-778-9019</a>
          </li>
        </ul>
      </section>

      <footer className="mt-20 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
        ahiya.dev · video case study
      </footer>
    </main>
  );
}
