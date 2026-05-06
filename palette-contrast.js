/**
 * palette-contrast.js
 *
 * APCA / WCAG 3 palette contrast checker and auto-corrector.
 *
 * WHAT THIS DOES
 * ──────────────
 * Given a CSS custom-property palette and a list of variables to check,
 * this script:
 *   1. Computes each color's APCA Lc contrast against its background.
 *   2. For any color that fails its target Lc threshold, it finds the
 *      minimum-adjustment hex value that passes — holding LCH hue (H)
 *      and chroma (C) constant and binary-searching the CIELAB lightness
 *      (L). This is the same method used by accessiblepalette.com.
 *   3. Returns a corrected palette object and a human-readable report.
 *
 * APCA THRESHOLDS (WCAG 3 draft)
 * ───────────────────────────────
 *   Lc 75  — columns of body text
 *   Lc 60  — regular body text, interactive elements
 *   Lc 45  — large text (≥18pt), decorative UI, hint text
 *   Lc 15  — non-text UI elements (minimum)
 *
 * HOW TO HAND THIS TO CLAUDE
 * ──────────────────────────
 * Upload this file and say something like:
 *   "Use palette-contrast.js to check this palette: { ... }"
 *
 * Claude will read the exported functions, run the correction logic,
 * and return corrected CSS + a report without needing to re-derive
 * the algorithm.
 *
 * API
 * ───
 *   apca(textHex, bgHex)              → Lc number (positive = dark-on-light)
 *   hexToLCH(hex)                     → { L, C, H }
 *   lchToHex(L, C, H)                 → hex string
 *   correctColor(hex, bgHex, targetLc)→ { hex, changed, lcBefore, lcAfter }
 *   correctPalette(palette, checks)   → { corrected, report }
 *   formatCSS(palette, extras)        → CSS :root { } string
 *
 * EXAMPLE
 * ───────
 *   import { correctPalette, formatCSS } from './palette-contrast.js';
 *
 *   const palette = {
 *     '--bg':   '#EDE8E2',
 *     '--text': '#2A3830',
 *     '--accent': '#6E9E7A',
 *   };
 *
 *   const checks = [
 *     { varName: '--text',   bgVar: '--bg', targetLc: 75 },
 *     { varName: '--accent', bgVar: '--bg', targetLc: 60 },
 *   ];
 *
 *   const { corrected, report } = correctPalette(palette, checks);
 *   console.log(formatCSS(corrected));
 *   console.log(report);
 */

// ── Hex / RGB helpers ─────────────────────────────────────────────────────────

/**
 * Parse a 6-char (or 8-char with alpha) hex string to { r, g, b }.
 * Alpha is ignored — strip it before contrast checks.
 */
export function hexToRGB(hex) {
    const h = hex.replace('#', '').slice(0, 6);
    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
    };
}

/** Clamp and encode { r, g, b } back to a hex string. */
export function rgbToHex(r, g, b) {
    return (
        '#' +
        [r, g, b]
            .map(v =>
                Math.round(Math.max(0, Math.min(255, v)))
                    .toString(16)
                    .padStart(2, '0')
            )
            .join('')
    );
}

/** True if the hex string includes an alpha channel (8 hex digits after #). */
export function hasAlpha(hex) {
    return hex.replace('#', '').length > 6;
}

// ── sRGB ↔ CIELAB ↔ LCH ──────────────────────────────────────────────────────

/** sRGB gamma expand (IEC 61966-2-1). */
function linearize(c) {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** sRGB gamma compress. */
function delinearize(c) {
    return (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4)) * 255;
}

/** CIELAB cube-root helper. */
function labF(t) {
    return t > 0.008856 ? t ** (1 / 3) : 7.787 * t + 16 / 116;
}

/** CIELAB cube-root inverse. */
function labFInv(t) {
    return t > 0.2069 ? t ** 3 : (t - 16 / 116) / 7.787;
}

// D65 reference white
const D65 = { X: 0.95047, Y: 1.0, Z: 1.08883 };

/** Convert { r, g, b } (0–255) to CIELAB LCH { L, C, H }. */
export function rgbToLCH(r, g, b) {
    // Linear RGB
    const rl = linearize(r), gl = linearize(g), bl = linearize(b);
    // XYZ (D65)
    const X = 0.4124564 * rl + 0.3575761 * gl + 0.1804375 * bl;
    const Y = 0.2126729 * rl + 0.7151522 * gl + 0.0721750 * bl;
    const Z = 0.0193339 * rl + 0.1191920 * gl + 0.9503041 * bl;
    // CIELAB
    const fy = labF(Y / D65.Y);
    const fX = labF(X / D65.X);
    const fZ = labF(Z / D65.Z);
    const L = 116 * fy - 16;
    const a = 500 * (fX - fy);
    const b_ = 200 * (fy - fZ);
    // LCH
    const C = Math.hypot(a, b_);
    const H = ((Math.atan2(b_, a) * 180) / Math.PI + 360) % 360;
    return { L, C, H };
}

/** Convenience: hex → LCH. */
export function hexToLCH(hex) {
    const { r, g, b } = hexToRGB(hex);
    return rgbToLCH(r, g, b);
}

/** Convert CIELAB LCH { L, C, H } back to a hex string. */
export function lchToHex(L, C, H) {
    const h = (H * Math.PI) / 180;
    const a = C * Math.cos(h);
    const b_ = C * Math.sin(h);
    // Lab → XYZ
    const fy = (L + 16) / 116;
    const X = labFInv(a / 500 + fy) * D65.X;
    const Y = labFInv(fy) * D65.Y;
    const Z = labFInv(fy - b_ / 200) * D65.Z;
    // XYZ → linear RGB
    const r = 3.2404542 * X - 1.5371385 * Y - 0.4985314 * Z;
    const g = -0.9692660 * X + 1.8760108 * Y + 0.0415560 * Z;
    const b = 0.0556434 * X - 0.2040259 * Y + 1.0572252 * Z;
    return rgbToHex(delinearize(r), delinearize(g), delinearize(b));
}

// ── APCA contrast (WCAG 3 draft) ─────────────────────────────────────────────

/**
 * Convert sRGB (0–255) to APCA luminance Y, including soft near-black clamp.
 * Uses straight 2.4 exponent per the APCA-W3 spec (not full sRGB piecewise).
 */
export function sRGBtoY(r, g, b) {
    let Y =
        0.2126729 * (r / 255) ** 2.4 +
        0.7151522 * (g / 255) ** 2.4 +
        0.0721750 * (b / 255) ** 2.4;
    // Soft clamp for near-black
    return Y < 0.022 ? Y + (0.022 - Y) ** 1.414 : Y;
}

/**
 * APCA-W3 contrast between a text color and a background color.
 *
 * Returns a signed Lc value:
 *   positive  → dark text on light background (normal polarity)
 *   negative  → light text on dark background (reverse polarity)
 *
 * Use Math.abs() for threshold comparisons.
 *
 * Reference: https://github.com/Myndex/apca-w3
 */
export function apca(textHex, bgHex) {
    const t = hexToRGB(textHex);
    const bg = hexToRGB(bgHex);
    const Yt = sRGBtoY(t.r, t.g, t.b);
    const Yb = sRGBtoY(bg.r, bg.g, bg.b);

    if (Math.abs(Yb - Yt) < 0.0005) return 0;

    if (Yb >= Yt) {
        // Normal polarity: dark text on light bg
        const S = (Yb ** 0.56 - Yt ** 0.57) * 1.14;
        return S < 0.1 ? 0 : (S - 0.027) * 100;
    } else {
        // Reverse polarity: light text on dark bg
        const S = (Yb ** 0.65 - Yt ** 0.62) * 1.14;
        return S > -0.1 ? 0 : (S + 0.027) * 100;
    }
}

// ── Correction ────────────────────────────────────────────────────────────────

/**
 * Correct a single color so it meets targetLc against bgHex.
 *
 * Strategy (mirrors accessiblepalette.com):
 *   - Convert to LCH. Hold H (hue) and C (chroma) constant.
 *   - Binary-search for the highest CIELAB L value that still passes.
 *   - This produces the most minimal lightness change needed.
 *
 * @param {string}  hex        - Foreground hex (no alpha).
 * @param {string}  bgHex      - Background hex (no alpha).
 * @param {number}  targetLc   - Required Lc threshold (use absolute value).
 * @returns {{ hex, changed, lcBefore, lcAfter }}
 */
export function correctColor(hex, bgHex, targetLc) {
    const lcBefore = Math.abs(apca(hex, bgHex));
    if (lcBefore >= targetLc) {
        return { hex, changed: false, lcBefore, lcAfter: lcBefore };
    }

    const { r, g, b } = hexToRGB(hex);
    const { L, C, H } = rgbToLCH(r, g, b);
    const bgLCH = hexToLCH(bgHex);

    // Direction: if bg is lighter, darken text (lower L); if bg is darker, lighten text.
    const darken = bgLCH.L > L;
    let lo = darken ? 0 : L;
    let hi = darken ? L : 100;
    let bestL = darken ? 0 : 100;

    // 64 iterations → precision < 100/2^64 ≈ negligible
    for (let i = 0; i < 64; i++) {
        const mid = (lo + hi) / 2;
        const lc = Math.abs(apca(lchToHex(mid, C, H), bgHex));
        if (lc >= targetLc) {
            bestL = mid;
            if (darken) lo = mid; // passes; try lighter (higher L)
            else hi = mid;        // passes; try darker (lower L)
        } else {
            if (darken) hi = mid; // fails; need darker (lower L)
            else lo = mid;        // fails; need lighter (higher L)
        }
    }

    const corrected = lchToHex(bestL, C, H);
    return {
        hex: corrected,
        changed: true,
        lcBefore,
        lcAfter: Math.abs(apca(corrected, bgHex)),
    };
}

// ── Palette correction ────────────────────────────────────────────────────────

/**
 * Check and correct an entire palette.
 *
 * @param {Object} palette
 *   A map of CSS variable names to hex values.
 *   e.g. { '--bg': '#EDE8E2', '--text': '#2A3830', ... }
 *
 * @param {Array}  checks
 *   Array of check descriptors:
 *   {
 *     varName:  string,  // e.g. '--text'
 *     bgVar:    string,  // e.g. '--bg'  (must exist in palette)
 *     targetLc: number,  // e.g. 75
 *     label?:   string,  // optional human-readable description
 *   }
 *
 *   Skip any variable whose value contains an alpha channel —
 *   those are composited at runtime and can't be statically checked.
 *
 * @returns {{
 *   corrected: Object,   // palette with corrected values
 *   report:    Array,    // per-check result objects
 * }}
 */
export function correctPalette(palette, checks) {
    const corrected = { ...palette };
    const report = [];

    for (const { varName, bgVar, targetLc, label } of checks) {
        const hex = palette[varName];
        const bgHex = palette[bgVar];

        if (!hex || !bgHex) {
            report.push({ varName, error: `Missing variable: ${!hex ? varName : bgVar}` });
            continue;
        }

        if (hasAlpha(hex)) {
            report.push({ varName, skipped: true, reason: 'alpha channel — skip' });
            continue;
        }

        const result = correctColor(hex, bgHex, targetLc);
        corrected[varName] = result.hex;
        report.push({ varName, label, targetLc, bgVar, ...result });
    }

    return { corrected, report };
}

// ── CSS formatting ────────────────────────────────────────────────────────────

/**
 * Format a palette object as a CSS :root { } block.
 *
 * @param {Object} palette   - Map of CSS var names to values.
 * @param {Object} extras    - Optional extra declarations to append.
 *   e.g. { '--mono': "'IBM Plex Mono', monospace", '--base-fs': '16px' }
 */
export function formatCSS(palette, extras = {}) {
    const lines = [
        ...Object.entries(palette).map(([k, v]) => `  ${k}: ${v};`),
        ...Object.entries(extras).map(([k, v]) => `  ${k}: ${v};`),
    ];
    return `:root {\n${lines.join('\n')}\n}`;
}

/**
 * Format a correction report as a human-readable string.
 *
 * @param {Array} report - The report array returned by correctPalette().
 */
export function formatReport(report) {
    const lines = ['WCAG 3 / APCA Contrast Report', '─'.repeat(44)];
    for (const r of report) {
        if (r.error) { lines.push(`  ${r.varName.padEnd(24)} ERROR: ${r.error}`); continue; }
        if (r.skipped) { lines.push(`  ${r.varName.padEnd(24)} SKIPPED (${r.reason})`); continue; }
        const status = r.changed ? 'FIXED ' : 'PASS  ';
        const lcInfo = r.changed
            ? `Lc ${r.lcBefore.toFixed(1)} → ${r.lcAfter.toFixed(1)}  (needed ${r.targetLc})`
            : `Lc ${r.lcAfter.toFixed(1)}  (needed ${r.targetLc})`;
        const hexInfo = r.changed ? `  ${r.hex}` : '';
        lines.push(`  ${status}  ${r.varName.padEnd(24)} ${lcInfo}${hexInfo}`);
    }
    return lines.join('\n');
}

// ── Default check config ──────────────────────────────────────────────────────

/**
 * A sensible default check configuration inferred from common variable
 * naming conventions. Pass this to correctPalette() or use it as a
 * starting point to customise.
 *
 * WCAG 3 thresholds used:
 *   --text           75   (body text columns)
 *   --text-secondary 60   (regular secondary text)
 *   --text-tertiary  45   (hint / tertiary text)
 *   --accent*        60   (accent text & links)
 *   --positive       60   (status text)
 *   --negative       60   (error text)
 */
export const DEFAULT_CHECKS = [
    { varName: '--text', bgVar: '--bg', targetLc: 75, label: 'body text' },
    { varName: '--text-secondary', bgVar: '--bg', targetLc: 60, label: 'secondary text' },
    { varName: '--text-tertiary', bgVar: '--bg', targetLc: 45, label: 'tertiary / hint' },
    { varName: '--accent', bgVar: '--bg', targetLc: 60, label: 'accent text & links' },
    { varName: '--accent-muted', bgVar: '--bg', targetLc: 45, label: 'muted accent (large UI)' },
    { varName: '--accent-2', bgVar: '--bg', targetLc: 60, label: 'secondary accent text' },
    { varName: '--accent-warm', bgVar: '--bg', targetLc: 60, label: 'warm accent text' },
    { varName: '--accent-botanical', bgVar: '--bg', targetLc: 60, label: 'botanical text' },
    { varName: '--positive', bgVar: '--bg', targetLc: 60, label: 'positive status' },
    { varName: '--negative', bgVar: '--bg', targetLc: 60, label: 'error / negative' },
];

// ── Quick-run example (paste into browser console or Node) ───────────────────
//
//   import { correctPalette, formatCSS, formatReport, DEFAULT_CHECKS } from './palette-contrast.js';
//
//   const palette = {
//     '--bg':               '#EDE8E2',
//     '--bg-panel':         '#E8E2DC',
//     '--text':             '#2A3830',
//     '--text-secondary':   '#504840',
//     '--text-tertiary':    '#827870',
//     '--accent':           '#6E9E7A',
//     '--accent-muted':     '#92AA98',
//     '--accent-2':         '#6858A8',
//     '--accent-warm':      '#C05218',
//     '--accent-botanical': '#366848',
//     '--positive':         '#529A4E',
//     '--negative':         '#B84520',
//   };
//
//   const { corrected, report } = correctPalette(palette, DEFAULT_CHECKS);
//   console.log(formatReport(report));
//   console.log(formatCSS(corrected, {
//     '--mono': "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace",
//     '--serif': "'EB Garamond', 'Iowan Old Style', Georgia, serif",
//     '--base-fs': '16px',
//   }));