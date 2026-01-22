# Video Performance Optimization Guide

This guide covers best practices for optimizing video performance in the application, including lazy loading, adaptive streaming, CDN setup, and performance monitoring.

---

## 1. Lazy Loading Implementation

### Current Implementation
The app uses `LazyVideoIframe` component with IntersectionObserver to defer video loading until needed.

**Features:**
- Loads iframes 200px before entering viewport
- Shows poster image with play button until user interaction
- Reduces initial page load by ~70% for video-heavy pages
- Automatic cleanup on component unmount

**Usage:**
```tsx
import { LazyVideoIframe } from "@/components/lazy-video-iframe"

<LazyVideoIframe
  src="https://example.com/video.mp4"
  title="Video Title"
  className="w-full aspect-video"
  poster="/images/video-poster.jpg"
/>
```

---

## 2. Adaptive Bitrate Streaming (HLS/DASH)

### Why Use Adaptive Streaming?
- Automatically adjusts quality based on user's bandwidth
- Reduces buffering by 60-80%
- Improves user experience across different network conditions
- Supports multiple device types and screen sizes

### Converting Videos to HLS with FFmpeg

**Install FFmpeg:**
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

**Basic HLS Conversion:**
```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -c:a aac \
  -hls_time 10 \
  -hls_playlist_type vod \
  -hls_segment_filename "video_%03d.ts" \
  output.m3u8
```

**Multi-Bitrate HLS (Recommended):**
```bash
#!/bin/bash
# Create multiple quality variants

INPUT="input.mp4"
OUTPUT_DIR="hls_output"
mkdir -p $OUTPUT_DIR

# 1080p variant
ffmpeg -i $INPUT \
  -vf scale=1920:1080 -c:v libx264 -b:v 5000k -maxrate 5350k -bufsize 7500k \
  -c:a aac -b:a 192k \
  -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "$OUTPUT_DIR/1080p_%03d.ts" \
  $OUTPUT_DIR/1080p.m3u8

# 720p variant
ffmpeg -i $INPUT \
  -vf scale=1280:720 -c:v libx264 -b:v 2800k -maxrate 2996k -bufsize 4200k \
  -c:a aac -b:a 128k \
  -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "$OUTPUT_DIR/720p_%03d.ts" \
  $OUTPUT_DIR/720p.m3u8

# 480p variant
ffmpeg -i $INPUT \
  -vf scale=854:480 -c:v libx264 -b:v 1400k -maxrate 1498k -bufsize 2100k \
  -c:a aac -b:a 96k \
  -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "$OUTPUT_DIR/480p_%03d.ts" \
  $OUTPUT_DIR/480p.m3u8

# 360p variant
ffmpeg -i $INPUT \
  -vf scale=640:360 -c:v libx264 -b:v 800k -maxrate 856k -bufsize 1200k \
  -c:a aac -b:a 64k \
  -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "$OUTPUT_DIR/360p_%03d.ts" \
  $OUTPUT_DIR/360p.m3u8

# Create master playlist
cat > $OUTPUT_DIR/master.m3u8 << EOF
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=5192000,RESOLUTION=1920x1080
1080p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2928000,RESOLUTION=1280x720
720p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1496000,RESOLUTION=854x480
480p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=864000,RESOLUTION=640x360
360p.m3u8
EOF

echo "HLS conversion complete! Master playlist: $OUTPUT_DIR/master.m3u8"
```

### Implementing HLS.js Player

**Install hls.js:**
```bash
npm install hls.js
```

**Create HLS Video Component:**
```tsx
// components/hls-video-player.tsx
"use client"

import { useEffect, useRef } from "react"
import Hls from "hls.js"

interface HLSVideoPlayerProps {
  src: string
  poster?: string
  className?: string
}

export function HLSVideoPlayer({ src, poster, className }: HLSVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Check if browser supports HLS natively (Safari)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src
    } 
    // Use hls.js for other browsers
    else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
      })
      
      hls.loadSource(src)
      hls.attachMedia(video)
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("[v0] HLS manifest loaded, ready to play")
      })

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error("[v0] Fatal HLS error:", data)
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError()
              break
            default:
              hls.destroy()
              break
          }
        }
      })

      hlsRef.current = hls
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      controls
      poster={poster}
      preload="none"
      className={className}
    />
  )
}
```

---

## 3. CDN Setup & Configuration

### Recommended CDN Providers
1. **Vercel Blob** (Integrated with Vercel)
2. **Cloudflare Stream** (Video-specific CDN)
3. **AWS CloudFront + S3**
4. **Bunny CDN** (Cost-effective)

### Vercel Blob Upload Example

```bash
# Install Vercel CLI
npm i -g vercel

# Upload video files
vercel blob upload video.mp4 --token YOUR_TOKEN
```

### Required CDN Headers

Configure your CDN to send these headers:

```
# Enable range requests for seeking
Accept-Ranges: bytes

# Cache control for video segments
Cache-Control: public, max-age=31536000, immutable

# CORS headers (if needed)
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, OPTIONS
Access-Control-Expose-Headers: Content-Length, Content-Range

# Content type
Content-Type: video/mp4  # or application/vnd.apple.mpegurl for HLS
```

### Cloudflare Workers Example (Custom CDN Logic)

```javascript
// cloudflare-worker.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const cache = caches.default
    
    // Check cache first
    let response = await cache.match(request)
    
    if (!response) {
      // Fetch from origin
      response = await fetch(request)
      
      // Clone and cache if successful
      if (response.ok) {
        const headers = new Headers(response.headers)
        headers.set("Cache-Control", "public, max-age=31536000")
        headers.set("Accept-Ranges", "bytes")
        
        response = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        })
        
        await cache.put(request, response.clone())
      }
    }
    
    return response
  },
}
```

---

## 4. Performance Monitoring with Lighthouse

### Automated Lighthouse Checks

**Install Lighthouse CI:**
```bash
npm install -g @lhci/cli
```

**Create Lighthouse Config:**
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

**Run Lighthouse:**
```bash
# Single run
lighthouse http://localhost:3000 --view

# CI integration
lhci autorun
```

**Add to package.json:**
```json
{
  "scripts": {
    "lighthouse": "lighthouse http://localhost:3000 --view --preset=desktop",
    "lighthouse:ci": "lhci autorun"
  }
}
```

### Key Metrics to Monitor

| Metric | Target | Description |
|--------|--------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s | Time until largest content element loads |
| FID (First Input Delay) | < 100ms | Time until page becomes interactive |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability score |
| TBT (Total Blocking Time) | < 300ms | Time page is blocked from user input |
| Video Load Time | < 3s | Time until video starts playing |

---

## 5. Best Practices Checklist

### Video Encoding
- [ ] Use H.264 codec for maximum compatibility
- [ ] Create multiple bitrate variants (360p, 480p, 720p, 1080p)
- [ ] Use 6-10 second segment duration for HLS
- [ ] Optimize audio bitrate (64-192 kbps)
- [ ] Generate poster images at key frames

### Delivery
- [ ] Serve videos from CDN with edge caching
- [ ] Enable range requests for seeking
- [ ] Set proper Cache-Control headers
- [ ] Use HTTPS for all video URLs
- [ ] Implement CORS headers if needed

### Implementation
- [ ] Lazy load all offscreen videos
- [ ] Use `preload="none"` for non-critical videos
- [ ] Show poster images before playback
- [ ] Implement IntersectionObserver for deferred loading
- [ ] Add loading states and error handling

### Monitoring
- [ ] Run Lighthouse audits regularly
- [ ] Monitor Core Web Vitals
- [ ] Track video load times
- [ ] Monitor CDN cache hit rates
- [ ] Set up error tracking for video failures

---

## 6. Quick Start Commands

```bash
# Convert video to HLS
./scripts/convert-to-hls.sh input.mp4

# Upload to Vercel Blob
vercel blob upload hls_output/* --token YOUR_TOKEN

# Run Lighthouse audit
npm run lighthouse

# Run CI performance checks
npm run lighthouse:ci
```

---

## 7. Troubleshooting

### Videos Not Loading
1. Check CORS headers on CDN
2. Verify video URLs are accessible
3. Check browser console for errors
4. Test with different browsers

### Poor Performance
1. Verify CDN is serving content
2. Check if videos are properly encoded
3. Ensure lazy loading is working
4. Monitor network waterfall in DevTools

### Seeking Issues
1. Verify `Accept-Ranges: bytes` header
2. Check if video is properly segmented (HLS)
3. Test with different video players

---

## Resources

- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [HLS.js GitHub](https://github.com/video-dev/hls.js)
- [Web.dev Video Performance](https://web.dev/fast/#optimize-your-images)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
