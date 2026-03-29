/**
 * generate_icons.js
 * Run with: node generate_icons.js
 * Generates icons/icon16.png, icon48.png, icon128.png
 * Requires: npm install canvas
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const SIZES = [16, 48, 128];

function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    const r = size * 0.12; // corner radius

    /* ── Background rounded rect ── */
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#7c6af5');
    grad.addColorStop(1, '#4f3fd4');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();

    /* ── Inner glow ── */
    const glow = ctx.createRadialGradient(size * 0.35, size * 0.3, 0, size * 0.5, size * 0.5, size * 0.65);
    glow.addColorStop(0, 'rgba(255,255,255,0.22)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();

    /* ── Lightning bolt ⚡ ── */
    ctx.save();
    const pad   = size * 0.18;
    const boltW = size - pad * 2;
    const boltH = size - pad * 2;
    const cx    = size / 2;
    const cy    = size / 2;

    /* Draw bolt as a filled polygon */
    const topX    = cx + boltW * 0.10;
    const topY    = pad;
    const midRX   = cx + boltW * 0.18;
    const midRY   = cy - boltH * 0.04;
    const rightX  = cx + boltW * 0.38;
    const rightY  = cy - boltH * 0.04;
    const botX    = cx - boltW * 0.10;
    const botY    = size - pad;
    const midLX   = cx - boltW * 0.18;
    const midLY   = cy + boltH * 0.04;
    const leftX   = cx - boltW * 0.38;
    const leftY   = cy + boltH * 0.04;

    ctx.beginPath();
    ctx.moveTo(topX,   topY);
    ctx.lineTo(midRX,  midRY);
    ctx.lineTo(rightX, rightY);
    ctx.lineTo(botX,   botY);
    ctx.lineTo(midLX,  midLY);
    ctx.lineTo(leftX,  leftY);
    ctx.closePath();

    /* Bolt fill — white with yellow shimmer */
    const boltGrad = ctx.createLinearGradient(leftX, topY, rightX, botY);
    boltGrad.addColorStop(0, '#ffffff');
    boltGrad.addColorStop(0.5, '#fde68a');
    boltGrad.addColorStop(1, '#fbbf24');
    ctx.fillStyle = boltGrad;
    ctx.fill();

    /* Bolt glow / shadow */
    ctx.shadowColor  = 'rgba(251,191,36,0.8)';
    ctx.shadowBlur   = size * 0.15;
    ctx.fillStyle    = 'rgba(251,191,36,0.35)';
    ctx.fill();

    ctx.restore();

    /* ── Border ── */
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth   = Math.max(1, size * 0.025);
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.stroke();

    return canvas;
}

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

SIZES.forEach(size => {
    const canvas = drawIcon(size);
    const buffer = canvas.toBuffer('image/png');
    const outPath = path.join(iconsDir, `icon${size}.png`);
    fs.writeFileSync(outPath, buffer);
    console.log(`✓ icons/icon${size}.png  (${buffer.length} bytes)`);
});

console.log('\nDone! Icons written to extension/icons/');
