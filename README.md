# Julio Andrés Rozo - Green Proofing Interview Site

A high-performance Next.js application showcasing ecological restoration work in Colombia's Kaketa region.

## Features

- **Optimized Video Performance**: Lazy-loaded iframes with IntersectionObserver
- **Adaptive Streaming Ready**: HLS support with automatic quality switching
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance**: Lighthouse score > 90 with optimized Core Web Vitals

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- FFmpeg (for video conversion)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Video Optimization

### Converting Videos to HLS

```bash
# Convert a video to HLS format with multiple bitrates
npm run convert-video input.mp4 output_directory

# This creates:
# - 1080p, 720p, 480p, 360p variants
# - Master playlist (master.m3u8)
# - Poster image (poster.jpg)
```

### Using the HLS Player

```tsx
import { HLSVideoPlayer } from "@/components/hls-video-player"

<HLSVideoPlayer
  src="https://your-cdn.com/master.m3u8"
  poster="/images/poster.jpg"
  className="w-full aspect-video"
/>
```

### Lazy Loading Videos

```tsx
import { LazyVideoIframe } from "@/components/lazy-video-iframe"

<LazyVideoIframe
  src="https://drive.google.com/file/d/VIDEO_ID/preview"
  title="Video Title"
  poster="/images/thumbnail.jpg"
  className="w-full aspect-video"
/>
```

## Performance Monitoring

### Run Lighthouse Audits

```bash
# Desktop audit
npm run lighthouse

# Mobile audit
npm run lighthouse:mobile
```

### Performance Targets

- **LCP**: < 2.5 seconds
- **FID**: < 100 milliseconds  
- **CLS**: < 0.1
- **Lighthouse Score**: > 90

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main page with video content
│   └── globals.css         # Global styles and design tokens
├── components/
│   ├── lazy-video-iframe.tsx   # Lazy-loaded iframe component
│   ├── hls-video-player.tsx    # HLS video player
│   └── ui/                     # shadcn/ui components
├── docs/
│   ├── VIDEO_OPTIMIZATION_GUIDE.md  # Complete video optimization guide
│   └── PERFORMANCE_CHECKLIST.md     # Pre-deployment checklist
├── scripts/
│   └── convert-to-hls.sh       # Video conversion script
└── public/
    └── images/                 # Static images and assets
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Video**: hls.js for adaptive streaming
- **Fonts**: Montserrat (Google Fonts)
- **Icons**: Lucide React

## Documentation

- [Video Optimization Guide](./docs/VIDEO_OPTIMIZATION_GUIDE.md) - Complete guide for video performance
- [Performance Checklist](./docs/PERFORMANCE_CHECKLIST.md) - Pre-deployment checklist

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

No environment variables required for basic deployment.

## Contributing

1. Follow the performance checklist before submitting changes
2. Run Lighthouse audits to verify performance
3. Test on multiple browsers and devices
4. Ensure accessibility standards are met

## License

© 2025 Regen Network Development

---

**Made with 💚 by REGEN**
