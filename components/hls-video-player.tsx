"use client"

import { useEffect, useRef, useState } from "react"
import Hls from "hls.js"

interface HLSVideoPlayerProps {
  src: string
  poster?: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  controls?: boolean
}

/**
 * HLSVideoPlayer - Adaptive bitrate video player with HLS support
 *
 * Features:
 * - Automatic quality switching based on bandwidth
 * - Native HLS support for Safari
 * - hls.js fallback for other browsers
 * - Error recovery and reconnection logic
 * - Preload="none" for optimal performance
 */
export function HLSVideoPlayer({
  src,
  poster,
  className = "",
  autoPlay = false,
  muted = false,
  controls = true,
}: HLSVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Check if browser supports HLS natively (Safari, iOS)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src
      console.log("[v0] Using native HLS support")
    }
    // Use hls.js for other browsers (Chrome, Firefox, Edge)
    else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000, // 60 MB
        maxBufferHole: 0.5,
      })

      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log("[v0] HLS manifest loaded, " + data.levels.length + " quality levels available")
      })

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = hls.levels[data.level]
        console.log("[v0] Quality switched to:", level.height + "p")
      })

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("[v0] HLS error:", data)

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("[v0] Network error, attempting to recover...")
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("[v0] Media error, attempting to recover...")
              hls.recoverMediaError()
              break
            default:
              console.error("[v0] Fatal error, destroying HLS instance")
              setError("Unable to load video. Please try again later.")
              hls.destroy()
              break
          }
        }
      })

      hlsRef.current = hls
      console.log("[v0] Using hls.js for video playback")
    } else {
      setError("HLS is not supported in this browser")
      console.error("[v0] HLS not supported")
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        console.log("[v0] HLS instance destroyed")
      }
    }
  }, [src])

  if (error) {
    return (
      <div className={`${className} bg-gray-900 flex items-center justify-center`}>
        <div className="text-white text-center p-4">
          <p className="text-lg font-semibold mb-2">Video Error</p>
          <p className="text-sm text-gray-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      controls={controls}
      poster={poster}
      preload="none"
      autoPlay={autoPlay}
      muted={muted}
      className={className}
      playsInline
    />
  )
}
