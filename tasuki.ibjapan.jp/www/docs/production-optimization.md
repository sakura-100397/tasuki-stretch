# Production Optimization Guide

## Goals
- Preserve the "Quiet Future" mood while keeping page performance high.
- Maintain smooth animation on desktop and graceful fallback on low-power devices.

## 1. Asset Strategy
- Export hero and card images in AVIF first, WebP fallback.
- Target max size per visual:
  - Hero image: under 300 KB
  - Card image: under 120 KB each
- Serve responsive images with srcset and sizes.

## 2. CSS/JS Delivery
- Inline only critical CSS for above-the-fold structure.
- Defer non-critical stylesheet and all scripts.
- Keep total JS under 80 KB minified.
- Avoid external animation libraries unless strictly necessary.

## 3. Motion Fallback Policy
- If prefers-reduced-motion is true:
  - Disable canvas animation.
  - Disable reveal transitions.
  - Keep static gradient and typography only.
- If frame rate drops significantly:
  - Reduce particle count by 40%.
  - Skip particle link lines.

## 4. Accessibility Requirements
- Contrast ratio AA minimum for all text.
- Keep focus-visible styles on every actionable element.
- Do not encode key meaning only with color.
- Use semantic landmarks: header, main, section, footer.

## 5. QA Checklist
- Visual parity test on:
  - Desktop 1440x900
  - Tablet 834x1112
  - Mobile 390x844
- Browser matrix:
  - Chrome latest
  - Safari latest
  - Edge latest
- Verify no horizontal scroll at any breakpoint.
- Verify CTA remains visible and accessible in keyboard navigation.

## 6. Deployment Notes
- Enable gzip or brotli compression.
- Set cache-control headers for static assets (7-30 days).
- Use immutable hash naming on production assets.
- Track Core Web Vitals: LCP, CLS, INP.

## 7. Suggested Enhancements (Optional)
- Replace canvas background with lightweight WebGL shader when hardware support is stable.
- Add progressive enhancement for interactive cursor field only on pointer:fine devices.
- Attach analytics events to CTA interactions and section dwell time.