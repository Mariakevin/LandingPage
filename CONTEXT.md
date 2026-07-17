# Portfolio — Personal Showcase Site

A single-page static portfolio for Arun Kumar, a full-stack developer in Chennai. Its job is to showcase skills, experience, and projects — not generate leads.

## Language

**Site**:
The portfolio itself. A static HTML/CSS/JS website with one 404 page. Not an "app", "project", or "page".
_Avoid_: app, application, project (when referring to the site itself)

**Section**:
A distinct scrollable area within the single page (Hero, Skills, About, Experience, Projects, Blog, Testimonials, CTA). Each has an anchor ID and a numbered badge.
_Avoid_: block, module, region

**Skill Card**:
A bento card in the Skills section grouping related technologies (Frontend, Backend, Design, DevOps) with proficiency bars. Previously called "service card" in CSS.
_Avoid_: service card, tech card

**Project Card**:
A work sample displayed in the Projects grid. A showcase item demonstrating capability. Previously called "work card" in CSS. Clicking reveals a live demo or source link.
_Avoid_: work card, case card

**Testimonial Card**:
A client quote displayed in the Testimonials section. Includes the person's name, role, company, and their quote. Previously called "insight card" in CSS.
_Aavoid_: insight card, review card

**Blog Card**:
A decorative card in the Blog section showing article metadata (date, category, read time). Not linked to real content — purely showcase to demonstrate writing ability. Does not represent actual articles.
_Avoid_: article, post, blog post (these imply real content)

**Consultation Dialog**:
A `<dialog>` element triggered by "Hire me" / "Start a project" / "Start a conversation" buttons. Contains a contact form (name, email, project type, message). The form validates client-side and either POSTs to an endpoint or simulates success.
_Avoid_: contact form, hire form, booking, modal

**Theme**:
The light/dark mode system. Uses `data-theme` attribute on `<html>`. Persisted to `localStorage`, respects `prefers-color-scheme`, controlled by a toggle button in the header.
_Avoid_: dark mode, color scheme, appearance (use "theme" consistently)

**Toast**:
A transient notification message that stacks at the bottom-right and auto-dismisses after 3 seconds. Used for form feedback, shortcuts help, and easter egg confirmation.
_Avoid_: notification, alert, snackbar

**Section Number**:
A numbered badge (01–06) at the top of each major section. Purely decorative, color-coded per section (accent, blue, pink).
_Aavoid_: section label, section indicator

**Skill Bar**:
A horizontal proficiency indicator within a skill card. Shows a technology name, a fill bar driven by `--pct` CSS variable, and a percentage label.
_Avoid_: progress bar, proficiency bar (use "skill bar")
