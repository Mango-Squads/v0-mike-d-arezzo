"use client"

import { useEffect, useRef, useState } from "react"

interface LazyVideoIframeProps {
  src: string
  title: string
  className?: string
  poster?: string
}

export function LazyVideoIframe({ src, title, className = "", poster }: LazyVideoIframeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      {
        rootMargin: "200px",
        threshold: 0.01,
      },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-white ${className}`}>
      {/* Poster/Thumbnail state - before user clicks */}
      {!hasInteracted && poster && (
        <div className="absolute inset-0 cursor-pointer z-10" onClick={() => setHasInteracted(true)}>
          <img
            src={poster || "/placeholder.svg"}
            alt={title}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
          />

          <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors" />

          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-[#90027D] ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {isVisible && (hasInteracted || !poster) && (
        <iframe
          src={src}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={title}
          loading="lazy"
        />
      )}
    </div>
  )
}
