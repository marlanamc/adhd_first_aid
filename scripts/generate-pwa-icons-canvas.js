const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Icon sizes for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Design 5: Classic First Aid (clean and simple)
function drawIcon(ctx, size) {
    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    
    // Red cross
    ctx.fillStyle = '#ff4747';
    const crossWidth = size * 0.3;
    const crossHeight = size * 0.8;
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Add rounded corners
    const radius = size * 0.05;
    
    // Vertical bar with rounded corners
    ctx.beginPath();
    ctx.moveTo(centerX - crossWidth/2 + radius, centerY - crossHeight/2);
    ctx.lineTo(centerX + crossWidth/2 - radius, centerY - crossHeight/2);
    ctx.quadraticCurveTo(centerX + crossWidth/2, centerY - crossHeight/2, centerX + crossWidth/2, centerY - crossHeight/2 + radius);
    ctx.lineTo(centerX + crossWidth/2, centerY + crossHeight/2 - radius);
    ctx.quadraticCurveTo(centerX + crossWidth/2, centerY + crossHeight/2, centerX + crossWidth/2 - radius, centerY + crossHeight/2);
    ctx.lineTo(centerX - crossWidth/2 + radius, centerY + crossHeight/2);
    ctx.quadraticCurveTo(centerX - crossWidth/2, centerY + crossHeight/2, centerX - crossWidth/2, centerY + crossHeight/2 - radius);
    ctx.lineTo(centerX - crossWidth/2, centerY - crossHeight/2 + radius);
    ctx.quadraticCurveTo(centerX - crossWidth/2, centerY - crossHeight/2, centerX - crossWidth/2 + radius, centerY - crossHeight/2);
    ctx.closePath();
    ctx.fill();
    
    // Horizontal bar with rounded corners
    ctx.beginPath();
    ctx.moveTo(centerX - crossHeight/2 + radius, centerY - crossWidth/2);
    ctx.lineTo(centerX + crossHeight/2 - radius, centerY - crossWidth/2);
    ctx.quadraticCurveTo(centerX + crossHeight/2, centerY - crossWidth/2, centerX + crossHeight/2, centerY - crossWidth/2 + radius);
    ctx.lineTo(centerX + crossHeight/2, centerY + crossWidth/2 - radius);
    ctx.quadraticCurveTo(centerX + crossHeight/2, centerY + crossWidth/2, centerX + crossHeight/2 - radius, centerY + crossWidth/2);
    ctx.lineTo(centerX - crossHeight/2 + radius, centerY + crossWidth/2);
    ctx.quadraticCurveTo(centerX - crossHeight/2, centerY + crossWidth/2, centerX - crossHeight/2, centerY + crossWidth/2 - radius);
    ctx.lineTo(centerX - crossHeight/2, centerY - crossWidth/2 + radius);
    ctx.quadraticCurveTo(centerX - crossHeight/2, centerY - crossWidth/2, centerX - crossHeight/2 + radius, centerY - crossWidth/2);
    ctx.closePath();
    ctx.fill();
}

function generateIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Enable antialiasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    drawIcon(ctx, size);
    
    return canvas.toBuffer('image/png');
}

// Generate all icons
console.log('🎨 Generating PWA icons...\n');

sizes.forEach(size => {
    const buffer = generateIcon(size);
    const filename = path.join(__dirname, '..', 'public', `icon-${size}x${size}.png`);
    fs.writeFileSync(filename, buffer);
    console.log(`✅ Generated ${size}x${size} icon`);
});

// Generate Apple Touch Icon (180x180)
const appleBuffer = generateIcon(180);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'), appleBuffer);
console.log('✅ Generated Apple Touch Icon (180x180)');

// Generate favicon (32x32)
const faviconBuffer = generateIcon(32);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.png'), faviconBuffer);
console.log('✅ Generated Favicon (32x32)');

console.log('\n🎉 All icons generated successfully!');