# CLAUDE.md

Guidance for working in this repo: Daniel Mai's personal portfolio site.

## Stack

- **Framework:** Next.js 14 (App Router, `src/` layout)
- **Language:** TypeScript, `strict: true`
- **Styling:** Tailwind CSS + CSS custom properties for theme colors
- **Animation:** Framer Motion
- **UI primitives:** shadcn/ui (Radix UI underneath) in `src/components/ui/`
- **Icons:** `react-icons` (used throughout); `lucide-react` is installed for shadcn internals only
- **Contact form:** EmailJS (`@emailjs/browser`)
- **Deployment:** Vercel, live at codewithdmai.com

## Commands

```bash
npm run dev     # start dev server
npm run build   # production build
npm run lint    # next lint (ESLint)
npx tsc --noEmit  # type-check
```

Env vars (see `.env.local`): `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`.

## Directory layout

```
src/app/            # routes (page.tsx per route), layout.tsx, globals.css
src/components/      # shared components (PascalCase, one per file)
src/components/ui/   # shadcn/ui primitives (button, input, select, sheet, tabs, ...)
src/lib/utils.ts     # cn() helper + pageLinks nav data
```

The `blog` nav link intentionally points to an external subdomain (`blog.codewithdmai.com`) — the blog is a separate deployment, not a route in this app. Don't try to "fix" it into an internal link.

## Path aliases

`@/*` → `src/*` (see `tsconfig.json` / `components.json`). Always import via `@/components/...`, `@/lib/utils`, `@/components/ui/...` — never deep relative paths (`../../..`).

## Theme system — read this before styling anything

Colors are **CSS custom properties**, not Tailwind color tokens. Defined in `src/app/globals.css`:

```css
:root {                          /* light (default) */
  --bg-color: #f2efe8;
  --text-color: #6d6355;
  --primary-color: #2c2926;      /* headings / emphasis */
  --secondary-color: #a69d93;
  --accent-color: #b08040;
  --card-bg: #faf8f5;
  --border-color: #ddd8cd;
  --input-bg: #edeae3;
  --input-border: #ddd8cd;
  --hover-bg: #e9e5db;
  --muted-text: #a69d93;
}
:root[data-theme="dark"] { /* same variable names, dark values */ }
```

Theme is toggled by setting `data-theme="dark"` on `<html>` (see `ThemeProvider.tsx`, `ThemeToggle.tsx`) and persisted to `localStorage`. `layout.tsx` inlines a small script to set it before hydration to avoid a flash.

**Rule:** in page/section components, apply color via inline `style={{ color: "var(--text-color)" }}` (or `backgroundColor`, `borderColor`). Never hardcode a hex value and never invent a new Tailwind color class for theme colors. Tailwind classes are for layout, spacing, sizing, and typography scale only (`flex`, `gap-4`, `text-sm`, `rounded-full`, `py-16`, responsive `xl:` prefixes).

**Exception:** `src/components/ui/*` (shadcn primitives) use Tailwind color utilities like `bg-accent` / `text-primary`, which resolve through `tailwind.config.ts`'s `theme.extend.colors` back to the same CSS variables. That indirection is only for the shared `ui/` primitives — don't use `bg-accent` etc. directly in page components; use the CSS var inline style instead.

## Component conventions

- One component per file, PascalCase filename matching the export: `const Name = () => {...}; export default Name;`
- Add `"use client"` only when the component actually needs hooks, browser APIs, or interactivity (state, `useEffect`, event handlers, framer-motion `whileInView`/gestures). Static content components stay server components — don't cargo-cult `"use client"` onto everything.
- Content-heavy pages (`experience/page.tsx`, `projects/page.tsx`) define a typed `const` data array (plain objects, sometimes with an `as const` union type) above the component, then `.map()` over it in JSX. Add new content by editing the array, not by hand-writing more markup.
- Internal vs. external links: check `href.startsWith("http")` and switch between `next/link`'s `Link` and a plain `a` with `target="_blank" rel="noopener noreferrer"` (see `Navigation.tsx`, `MobileNavigation.tsx`).
- Icons: use `react-icons` (`Fi`, `Fa`, `Ci`, `Si` prefixes are already in use) for consistency with existing components.

## Animation (Framer Motion)

Two recurring patterns — reuse these timings rather than inventing new ones:

- **Entrance on mount:** `initial={{ opacity: 0, y: 16-20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35-0.5, ease: "easeOut" }}`, often with a small `delay: i * 0.08` when animating a list.
- **Scroll-triggered:** use `whileInView` instead of `animate`, with `viewport={{ once: true, margin: "-60px" }}` (see the experience page timeline).

Page-to-page transitions (`StairTransition.tsx`, `PageTransition.tsx`, `Stairs.tsx`) are a fixed, shared mechanism wired up once in `LayoutShell.tsx` — don't duplicate transition logic in individual pages.

## Section layout pattern

Page sections consistently use:

```tsx
<section className="py-16">
  <div className="container mx-auto">
    <div className="flex items-center gap-4 mb-8">
      <h2 className="text-2xl font-medium" style={{ color: "var(--primary-color)" }}>
        Title
      </h2>
      <div className="flex-1 h-px opacity-60" style={{ backgroundColor: "var(--border-color)" }} />
    </div>
    {/* content */}
  </div>
</section>
```

## shadcn/ui primitives

New primitives in `src/components/ui/` should match the existing shape (see `button.tsx`): `React.forwardRef`, `displayName` set, variants via `class-variance-authority`, classes merged with `cn()` from `@/lib/utils`.

## Known follow-ups (not auto-fixed)

- `src/components/Stats.tsx` is not imported anywhere — dead code with placeholder stats ("100 Happy Clients"). Either wire it into the home page with real numbers or delete it.
- `public/assets/photo-3.png` is unreferenced (`Photo.tsx` only rotates `photo-1.png` and `photo.png`).
