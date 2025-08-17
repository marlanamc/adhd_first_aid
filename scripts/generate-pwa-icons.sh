#!/bin/bash

# Generate PWA icons from logo.png using macOS sips
# Usage: ./scripts/generate-pwa-icons.sh

SOURCE_IMAGE="public/ios_icon.png"
OUTPUT_DIR="public"

# Check if source image exists
if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "Error: Source image $SOURCE_IMAGE not found!"
    exit 1
fi

echo "Generating PWA icons from $SOURCE_IMAGE..."

# Icon sizes for PWA
SIZES=(72 96 128 144 152 192 384 512)

for SIZE in "${SIZES[@]}"; do
    OUTPUT_FILE="$OUTPUT_DIR/icon-${SIZE}x${SIZE}.png"
    echo "Creating $OUTPUT_FILE..."
    
    # Create a copy and resize it
    cp "$SOURCE_IMAGE" "$OUTPUT_FILE"
    sips -z $SIZE $SIZE "$OUTPUT_FILE" --out "$OUTPUT_FILE" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✓ Created ${SIZE}x${SIZE} icon"
    else
        echo "✗ Failed to create ${SIZE}x${SIZE} icon"
    fi
done

# Create Apple Touch Icon (180x180)
echo "Creating Apple Touch Icon..."
cp "$SOURCE_IMAGE" "$OUTPUT_DIR/apple-touch-icon.png"
sips -z 180 180 "$OUTPUT_DIR/apple-touch-icon.png" --out "$OUTPUT_DIR/apple-touch-icon.png" > /dev/null 2>&1

# Create favicon.ico (multi-resolution)
echo "Creating favicon..."
cp "$SOURCE_IMAGE" "$OUTPUT_DIR/favicon.png"
sips -z 32 32 "$OUTPUT_DIR/favicon.png" --out "$OUTPUT_DIR/favicon.png" > /dev/null 2>&1

echo ""
echo "✅ Icon generation complete!"
echo "Generated icons in $OUTPUT_DIR:"
ls -la $OUTPUT_DIR/icon-*.png 2>/dev/null | awk '{print "  - " $NF}'
echo "  - $OUTPUT_DIR/apple-touch-icon.png"
echo "  - $OUTPUT_DIR/favicon.png"