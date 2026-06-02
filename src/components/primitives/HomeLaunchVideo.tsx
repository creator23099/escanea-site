"use client";

import { useCallback, useEffect, useRef } from "react";
import { T } from "@/lib/tokens";
import styles from "./HomeLaunchVideo.module.css";

const VIDEO_SRC = "/videos/escanea-launch-hero-compressed.mp4";

function ensureAutoplayAttrs(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("muted", "");
  video.setAttribute("autoplay", "");
  video.setAttribute("loop", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
}

function tryPlay(video: HTMLVideoElement) {
  ensureAutoplayAttrs(video);
  const attempt = video.play();
  if (attempt === undefined) return;
  void attempt.catch(() => {
    requestAnimationFrame(() => {
      ensureAutoplayAttrs(video);
      void video.play().catch(() => {});
    });
  });
}

export function HomeLaunchVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const onVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (!node) return;
    ensureAutoplayAttrs(node);
    tryPlay(node);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video) return;

    tryPlay(video);

    const onReady = () => tryPlay(video);
    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("canplaythrough", onReady);

    const observer = wrapper
      ? new IntersectionObserver(
          ([entry]) => {
            if (!entry) return;
            if (entry.isIntersecting) {
              tryPlay(video);
            } else {
              video.pause();
            }
          },
          { threshold: 0.2, rootMargin: "0px 0px 10% 0px" }
        )
      : null;

    if (wrapper && observer) {
      observer.observe(wrapper);
    }

    return () => {
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("canplaythrough", onReady);
      observer?.disconnect();
    };
  }, []);

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
      <video
        ref={onVideoRef}
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
    </div>
  );
}
