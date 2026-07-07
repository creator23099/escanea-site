"use client";

import { useEffect, useRef, useState } from "react";
import { DarkTag } from "@/components/primitives/DarkTag";
import styles from "./HomeActionVideo.module.css";

const VIDEO_SRC = "/videos/escanea-hero-compressed.mp4";
const POSTER_SRC = "/images/escanea-hero-poster.jpg";

function VolumeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M11 5L6 9H3v6h3l5 4V5z" strokeLinejoin="round" />
      <path d="M16 9l5 5M21 9l-5 5" strokeLinecap="round" />
    </svg>
  );
}

function VolumeOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M11 5L6 9H3v6h3l5 4V5z" strokeLinejoin="round" />
      <path d="M15.5 8.5a4.5 4.5 0 010 7M18 6a7.5 7.5 0 010 12" strokeLinecap="round" />
    </svg>
  );
}

export function HomeActionVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const activate = () => setMounted((prev) => prev || true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) activate();
      },
      { threshold: 0.05, rootMargin: "120px 0px" },
    );

    observer.observe(wrapper);

    const rect = wrapper.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      activate();
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    const syncPlayback = () => {
      video.muted = muted;
      if (video.paused) {
        void video.play().catch(() => {});
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          syncPlayback();
        } else {
          video.pause();
        }
      },
      { threshold: 0.1, rootMargin: "0px" },
    );

    observer.observe(wrapper);

    const onReady = () => syncPlayback();
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);

    syncPlayback();

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      observer.disconnect();
    };
  }, [mounted, muted]);

  const toggleMute = () => {
    if (!mounted) setMounted(true);

    const nextMuted = !muted;
    setMuted(nextMuted);

    const video = videoRef.current;
    if (video) {
      video.muted = nextMuted;
      if (video.paused) {
        void video.play().catch(() => {});
      }
    }
  };

  return (
    <section className={styles.section} aria-label="Escanea en acción">
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.eyebrow}>
            <DarkTag>Escanea en acción</DarkTag>
          </div>
          <h2 className={styles.title}>
            La ciudad,
            <br />
            <em>en movimiento.</em>
          </h2>
          <p className={styles.subline}>
            Mira nuestras campañas circulando en tiempo real.
          </p>
        </div>
      </div>
      <div ref={wrapperRef} className={styles.wrapper}>
        {mounted ? (
          <video
            ref={videoRef}
            className={styles.video}
            src={VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={POSTER_SRC}
            disablePictureInPicture
            disableRemotePlayback
            aria-label="Video de Escanea en acción"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={POSTER_SRC}
            alt=""
            className={styles.video}
            aria-hidden="true"
          />
        )}
        <button
          type="button"
          className={styles.muteToggle}
          onClick={toggleMute}
          aria-label={muted ? "Activar sonido" : "Silenciar"}
          aria-pressed={!muted}
        >
          {muted ? <VolumeOffIcon /> : <VolumeOnIcon />}
        </button>
      </div>
    </section>
  );
}
