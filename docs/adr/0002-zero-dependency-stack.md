# Zero-Dependency Static Stack

The site is built with plain HTML, CSS, and JavaScript — no build tools, no frameworks, no package manager. Every file is directly editable and servable as-is. This keeps the portfolio loadable in under 100ms on any connection and maintainable without toolchain knowledge.

Alternatives considered: React/Next.js (build complexity, overkill for a single page), Astro (good SSG but adds a build step), Hugo (templating overhead). A portfolio site doesn't benefit from a framework's runtime capabilities.
