---
name: portfolio-conventions
description: Use when adding, editing, or scaffolding a page, section, or component in this Next.js portfolio (dmai-portfolio) — covers the CSS-variable theme system, component shape, Framer Motion timing, and the data-array content pattern actually used in this codebase. Trigger on requests like "add a section", "add a page", "new component", "add a project/experience entry".
---

# Portfolio conventions

This project's full coding-standards reference lives in `CLAUDE.md` at the repo root — read it first if it's not already in context. This skill is the actionable checklist for the two things people get wrong most: colors and component shape.

## Before writing any component

1. **Never hardcode a color and never invent a Tailwind color class.** Use the existing CSS variables via inline `style`:

   `--bg-color` `--text-color` `--primary-color` `--secondary-color` `--accent-color` `--card-bg` `--border-color` `--input-bg` `--input-border` `--hover-bg` `--muted-text`

   These are defined once in `src/app/globals.css` for both `:root` (light) and `:root[data-theme="dark"]` — using the variable name gets dark mode for free. Tailwind classes are only for layout/spacing/sizing/type-scale (`flex`, `gap-4`, `text-sm`, `rounded-full`, `py-16`).

   Exception: files under `src/components/ui/` (shadcn primitives) may use Tailwind color utilities (`bg-accent`, `text-primary`) — that's the one place the indirection through `tailwind.config.ts` is intended.

2. **Decide if it needs `"use client"`.** Only add it if the component uses state, effects, event handlers, or Framer Motion `whileInView`/gesture props. Plain content components stay server components.

## Scaffold for a new page section

```tsx
"use client"; // omit if the section has no interactivity/animation-on-scroll

import { motion } from "framer-motion";

const items = [
  // typed data objects here — add new content by extending this array
] as const;

const SectionName = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-8"
        >
          <h2
            className="text-2xl font-medium"
            style={{ color: "var(--primary-color)", letterSpacing: "-0.02em" }}
          >
            Title
          </h2>
          <div
            className="flex-1 h-px opacity-60"
            style={{ backgroundColor: "var(--border-color)" }}
          />
        </motion.div>

        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08, ease: "easeOut" }}
          >
            {/* item content, colors via style={{ color: "var(--text-color)" }} etc. */}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SectionName;
```

For content that reveals on scroll (long pages like `experience/page.tsx`) swap `animate` for `whileInView` and add `viewport={{ once: true, margin: "-60px" }}`.

## Adding a project/experience entry

Don't hand-write new markup — add an object to the existing typed array (`projects` in `src/app/projects/page.tsx`, `experiences` in `src/app/experience/page.tsx`) and the `.map()` renders it. Match the existing object shape exactly (field names, tech array, etc.).

## Internal vs external links

When a component renders `href`-driven nav/links, follow the existing pattern instead of always using `next/link`:

```tsx
const isExternal = href.startsWith("http");
const LinkComponent = isExternal ? "a" : Link;
const linkProps = isExternal
  ? { href, target: "_blank", rel: "noopener noreferrer" }
  : { href };
```

## Icons

Use `react-icons` (`Fi*`, `Fa*`, `Ci*`, `Si*` are already imported elsewhere in the project) rather than `lucide-react` in page-level components — `lucide-react` is only pulled in for shadcn's internals.

## After writing

Run `npx tsc --noEmit` and `npm run lint` — both must stay clean.
