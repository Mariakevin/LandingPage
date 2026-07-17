# CSS Layers Architecture

We organize all CSS into explicit `@layer` groups — reset, base, tokens, components, utilities — so specificity is controlled by layer order rather than selector weight. This enables a token-driven theming system where dark mode overrides only semantic tokens (surface, text, border) without specificity wars.

Alternatives considered: BEM naming (no specificity control), Tailwind (build dependency), CSS Modules (build dependency), plain cascade (unpredictable). Layers give us predictable specificity with zero tooling.
