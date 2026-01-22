# Video Performance Checklist

Use this checklist to ensure optimal video performance across your application.

## Pre-Deployment Checklist

### Video Encoding ✓
- [ ] All videos encoded with H.264 codec
- [ ] Multiple bitrate variants created (360p, 480p, 720p, 1080p)
- [ ] HLS segments are 6-10 seconds each
- [ ] Audio bitrate optimized (64-192 kbps based on quality)
- [ ] Poster images generated for all videos
- [ ] Master playlist (master.m3u8) created for adaptive streaming

### CDN Configuration ✓
- [ ] Videos uploaded to CDN (Vercel Blob, Cloudflare, etc.)
- [ ] `Accept-Ranges: bytes` header enabled
- [ ] `Cache-Control: public, max-age=31536000` set
- [ ] CORS headers configured if cross-origin
- [ ] HTTPS enabled for all video URLs
- [ ] Edge caching enabled
- [ ] Compression enabled (gzip/brotli for playlists)

### Component Implementation ✓
- [ ] `LazyVideoIframe` used for all iframe embeds
- [ ] `HLSVideoPlayer` used for self-hosted videos
- [ ] `preload="none"` set on all video elements
- [ ] Poster images displayed before playback
- [ ] IntersectionObserver threshold set appropriately (200px)
- [ ] Loading states implemented
- [ ] Error handling added for failed loads

### Performance Optimization ✓
- [ ] Videos only load when near viewport
- [ ] Thumbnail images optimized (WebP format, < 50KB)
- [ ] No autoplay on mobile devices
- [ ] Video dimensions match container (no unnecessary scaling)
- [ ] Lazy loading working in modal/dialog components
- [ ] Multiple videos on page don't load simultaneously

## Testing Checklist

### Browser Testing ✓
- [ ] Chrome (HLS via hls.js)
- [ ] Firefox (HLS via hls.js)
- [ ] Safari (Native HLS)
- [ ] Edge (HLS via hls.js)
- [ ] Mobile Safari (Native HLS)
- [ ] Mobile Chrome (HLS via hls.js)

### Network Testing ✓
- [ ] Fast 3G (1.6 Mbps) - Should load 360p/480p
- [ ] 4G (4 Mbps) - Should load 720p
- [ ] WiFi (10+ Mbps) - Should load 1080p
- [ ] Test quality switching during playback
- [ ] Test seeking/scrubbing performance
- [ ] Test buffering behavior

### Performance Metrics ✓
- [ ] Lighthouse Performance Score > 90
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] TBT (Total Blocking Time) < 300ms
- [ ] Video starts playing within 3 seconds
- [ ] No layout shift when video loads

### Accessibility ✓
- [ ] All videos have descriptive titles
- [ ] Poster images have alt text
- [ ] Video controls are keyboard accessible
- [ ] Captions/subtitles available (if applicable)
- [ ] Focus indicators visible on controls

## Monitoring Checklist

### Analytics Setup ✓
- [ ] Video load time tracking
- [ ] Quality level distribution tracking
- [ ] Error rate monitoring
- [ ] CDN cache hit rate monitoring
- [ ] Bandwidth usage tracking

### Automated Checks ✓
- [ ] Lighthouse CI configured
- [ ] Performance budgets set
- [ ] Automated tests for video loading
- [ ] CDN health checks enabled
- [ ] Error alerting configured

## Quick Commands

```bash
# Convert video to HLS
npm run convert-video input.mp4 output_dir

# Run Lighthouse audit (desktop)
npm run lighthouse

# Run Lighthouse audit (mobile)
npm run lighthouse:mobile

# Upload to Vercel Blob
vercel blob upload video.mp4 --token YOUR_TOKEN

# Check video file size
ls -lh video.mp4

# Test HLS stream
curl -I https://your-cdn.com/master.m3u8
```

## Performance Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Page Load Time | < 3s | - | ⏳ |
| Video Load Time | < 3s | - | ⏳ |
| LCP | < 2.5s | - | ⏳ |
| CLS | < 0.1 | - | ⏳ |
| TBT | < 300ms | - | ⏳ |
| Lighthouse Score | > 90 | - | ⏳ |

## Common Issues & Solutions

### Issue: Videos not loading
**Solution:** Check CORS headers, verify CDN URLs, check browser console

### Issue: Poor quality on fast connection
**Solution:** Verify bitrate ladder, check HLS manifest, ensure CDN not throttling

### Issue: Buffering on slow connection
**Solution:** Add lower bitrate variants (240p), reduce segment size

### Issue: High initial load time
**Solution:** Ensure lazy loading enabled, check poster image size, verify preload="none"

### Issue: Layout shift when video loads
**Solution:** Set explicit width/height, use aspect-ratio CSS, reserve space

---

**Last Updated:** 2025-01-08
**Next Review:** After deployment
