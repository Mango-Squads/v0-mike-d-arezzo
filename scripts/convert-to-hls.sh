#!/bin/bash

# Video to HLS Conversion Script
# Usage: ./scripts/convert-to-hls.sh input.mp4 [output_directory]

set -e

if [ $# -lt 1 ]; then
    echo "Usage: $0 input.mp4 [output_directory]"
    exit 1
fi

INPUT="$1"
OUTPUT_DIR="${2:-hls_output}"

if [ ! -f "$INPUT" ]; then
    echo "Error: Input file '$INPUT' not found"
    exit 1
fi

echo "Converting $INPUT to HLS format..."
echo "Output directory: $OUTPUT_DIR"

mkdir -p "$OUTPUT_DIR"

# 1080p variant
echo "Creating 1080p variant..."
ffmpeg -i "$INPUT" \
  -vf scale=1920:1080 -c:v libx264 -b:v 5000k -maxrate 5350k -bufsize 7500k \
  -c:a aac -b:a 192k \
  -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "$OUTPUT_DIR/1080p_%03d.ts" \
  "$OUTPUT_DIR/1080p.m3u8"

# 720p variant
echo "Creating 720p variant..."
ffmpeg -i "$INPUT" \
  -vf scale=1280:720 -c:v libx264 -b:v 2800k -maxrate 2996k -bufsize 4200k \
  -c:a aac -b:a 128k \
  -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "$OUTPUT_DIR/720p_%03d.ts" \
  "$OUTPUT_DIR/720p.m3u8"

# 480p variant
echo "Creating 480p variant..."
ffmpeg -i "$INPUT" \
  -vf scale=854:480 -c:v libx264 -b:v 1400k -maxrate 1498k -bufsize 2100k \
  -c:a aac -b:a 96k \
  -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "$OUTPUT_DIR/480p_%03d.ts" \
  "$OUTPUT_DIR/480p.m3u8"

# 360p variant
echo "Creating 360p variant..."
ffmpeg -i "$INPUT" \
  -vf scale=640:360 -c:v libx264 -b:v 800k -maxrate 856k -bufsize 1200k \
  -c:a aac -b:a 64k \
  -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "$OUTPUT_DIR/360p_%03d.ts" \
  "$OUTPUT_DIR/360p.m3u8"

# Create master playlist
echo "Creating master playlist..."
cat > "$OUTPUT_DIR/master.m3u8" << EOF
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

# Generate poster image
echo "Generating poster image..."
ffmpeg -i "$INPUT" -ss 00:00:01 -vframes 1 -vf scale=1280:720 "$OUTPUT_DIR/poster.jpg"

echo ""
echo "✅ Conversion complete!"
echo "📁 Output directory: $OUTPUT_DIR"
echo "🎬 Master playlist: $OUTPUT_DIR/master.m3u8"
echo "🖼️  Poster image: $OUTPUT_DIR/poster.jpg"
echo ""
echo "Next steps:"
echo "1. Upload files to your CDN: vercel blob upload $OUTPUT_DIR/* --token YOUR_TOKEN"
echo "2. Update video URLs in your app to use the master.m3u8 file"
echo "3. Use the HLSVideoPlayer component for playback"
