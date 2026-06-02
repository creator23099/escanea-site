"use client";

import { useEffect, useRef, useState } from "react";
import { T } from "@/lib/tokens";
import styles from "./HomeLaunchVideo.module.css";

const VIDEO_SRC = "/videos/escanea-launch-hero-compressed.mp4";

export function HomeLaunchVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);

  // Mount the <video> only once the block is near the viewport so Safari sees
  // autoplay+muted on an already-visible element (avoids off-screen autoplay failure).
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const activate = () => setMounted((prev) => prev || true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) activate();
      },
      { threshold: 0.05, rootMargin: "120px 0px" }
    );

    observer.observe(wrapper);

    const rect = wrapper.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      activate();
    }

    return () => observer.disconnect();
  }, []);

  // Keep playback in sync with visibility after the video element exists.
  useEffect(() => {
    if (!mounted) return;

    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    const syncPlayback = () => {
      video.muted = true;
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
      { threshold: 0.1, rootMargin: "0px" }
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
  }, [mounted]);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      style={{
        border: `1.5px solid ${T.stone}`,
        boxShadow: "0 4px 24px rgba(26, 45, 90, 0.08)",
        aspectRatio: "406 / 720",
      }}
    >
      {mounted ? (
        <video
          ref={videoRef}
          className={styles.video}
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-label="Instalación de publicidad en vehículo Escanea"
        />
      ) : null}
    </div>
  );
}
