# Changelog

## [0.9.1](https://github.com/mtharreqq/requixite/compare/requixite-v0.9.0...requixite-v0.9.1) (2026-11-10)


### Performance Improvements

* **case-study:** load the live demo on first interaction, not on load ([155ff37](https://github.com/mtharreqq/requixite/commit/155ff3797969ec7344eeb9eb57825d0c4a011022))
* lazy motion, drop tailwind-merge, defer lenis and case-study demo; perf budget 0.9 ([a8543a5](https://github.com/mtharreqq/requixite/commit/a8543a5372b0543527309e2361576515a2bb4e53))

## [0.9.0](https://github.com/mtharreqq/requixite/compare/requixite-v0.8.1...requixite-v0.9.0) (2026-11-09)


### Features

* case study pages, centred pins, sentence-by-sentence stack story ([2b21f33](https://github.com/mtharreqq/requixite/commit/2b21f333822eba8ab14db7c6c8552fcd45554e1a))

## [0.8.1](https://github.com/mtharreqq/requixite/compare/requixite-v0.8.0...requixite-v0.8.1) (2026-11-05)


### Performance Improvements

* stop the 1.1MB favicon from delaying mobile LCP ([5392c5d](https://github.com/mtharreqq/requixite/commit/5392c5de9f00ddc9c2882f1e4c25911fb8cba00e))

## [0.8.0](https://github.com/mtharreqq/requixite/compare/requixite-v0.7.0...requixite-v0.8.0) (2026-11-02)


### Features

* add tactile portfolio interactions and section reveals ([fba216c](https://github.com/mtharreqq/requixite/commit/fba216cba3fb9bd3b3c2e70ec1894dd27ee4d765))
* **contact:** group social tooltips so only the first one waits ([9d21e2d](https://github.com/mtharreqq/requixite/commit/9d21e2dded7607ed553217962e0061ad19d7580c))
* **mobile:** no text selection or tap delay on controls ([acfcbd5](https://github.com/mtharreqq/requixite/commit/acfcbd58634d5f0a6eeec10759c94f19815c57d9))
* **mobile:** press feedback on every control for touch ([79633d3](https://github.com/mtharreqq/requixite/commit/79633d37c764abb64973b32ef228be6d54c29259))
* **mobile:** theme-color that follows the active theme ([30f6d91](https://github.com/mtharreqq/requixite/commit/30f6d914abaf7645352e1df06afa791ae6fcc7e4))
* **motion:** animate copy-email, pin labels and theme icon swaps ([aa8a27c](https://github.com/mtharreqq/requixite/commit/aa8a27c7f72e5a8dbf88c67807877215b702785b))
* **motion:** lighter, shorter section reveal ([a46d149](https://github.com/mtharreqq/requixite/commit/a46d14999ab3527d85366c2aba5240a19a4e5575))
* **proof:** interruptible crossfade with animated height ([a6cb423](https://github.com/mtharreqq/requixite/commit/a6cb4237fd19c8f200c81abdee61e6a73c0e7194))
* **work:** hide work section and rail stop when nothing is published ([339f5ce](https://github.com/mtharreqq/requixite/commit/339f5ce50626ddf561327ad1e1a13582c49fe20a))


### Bug Fixes

* **a11y:** reduced motion keeps fades, drops movement ([be11d6d](https://github.com/mtharreqq/requixite/commit/be11d6d3e13efa29e153c3ca8b7a1218d59e7146))
* **experience:** keep @ org on one line ([466baa4](https://github.com/mtharreqq/requixite/commit/466baa442cbc19d6fdae5d3f4e97e15d8dc2dec4))
* **motion:** do not replay reveal on sections visible at load ([9588e25](https://github.com/mtharreqq/requixite/commit/9588e25ded9ecaffe107d4275b4c5faafab1f080))
* **proof:** open pin labels into the card so they are never clipped ([cf1c901](https://github.com/mtharreqq/requixite/commit/cf1c90152c2852d6a74557fe1d86e3701ecaf0c8))
* **tag-pill:** tint with color-mix so any css colour works ([3269d0a](https://github.com/mtharreqq/requixite/commit/3269d0ad6f9967eab3292fa3496591a059ebdfb8))
* **work:** keep long hosts and titles inside project cards ([844fdde](https://github.com/mtharreqq/requixite/commit/844fdde981bced3dc19d9340d138a031ab830b82))


### Performance Improvements

* **motion:** drive magnetic and polaroid with transform strings ([94e9cd6](https://github.com/mtharreqq/requixite/commit/94e9cd6476e692bd0a0c47a7a40fe7beaf4b6330))
* **motion:** replace transition-all with explicit properties ([82dec04](https://github.com/mtharreqq/requixite/commit/82dec0417ef475d9a2ce7318a90ac598289bef37))
* **rail:** scale ticks with transform instead of animating width ([928e360](https://github.com/mtharreqq/requixite/commit/928e36035333cef5596adb84098a25e12e88a3d4))

## [0.7.0](https://github.com/mtharreqq/requixite/compare/requixite-v0.6.1...requixite-v0.7.0) (2026-11-01)


### Features

* add personal avatar, favicons and social profile hover card ([ee071bf](https://github.com/mtharreqq/requixite/commit/ee071bf0648a3d1b44c543658f0682dc5749360e))
* refactor portfolio layout to salmoon intimate style ([7e2e7b6](https://github.com/mtharreqq/requixite/commit/7e2e7b643a19175f647ae2d7832b19eff0a9a4b2))
* showcase RantAI and add scroll rail navigation ([3a0f701](https://github.com/mtharreqq/requixite/commit/3a0f7019ffb411cdee5d499d804ff2a7bd8a7b0d))
* simplify portfolio to zero-database static landing page ([186c544](https://github.com/mtharreqq/requixite/commit/186c5442bf71267beaa1b7bfa1651fdc8da8974d))

## [0.6.1](https://github.com/mtharreqq/requixite/compare/requixite-v0.6.0...requixite-v0.6.1) (2026-05-14)


### Bug Fixes

* align todo types with drizzle and rename middleware to proxy ([de62cfd](https://github.com/mtharreqq/requixite/commit/de62cfd516790d0ce51aa287df3de154f89a78fb))

## [0.6.0](https://github.com/mtharreqq/requixite/compare/requixite-v0.5.1...requixite-v0.6.0) (2026-05-14)


### Features

* **0.3.0:** add favicon, dark-mode support, and others minor update ([928ef61](https://github.com/mtharreqq/requixite/commit/928ef6172ce516c8724a2a593c1333c4f65586f3))
* **0.4.0:** integrate Supabase for release data management and remove static JSON file ([e9fce61](https://github.com/mtharreqq/requixite/commit/e9fce61198739559738ed8a7d84db2768f436edb))
* **0.4.1:** add Vercel Speed Insights for performance monitoring ([b2e4053](https://github.com/mtharreqq/requixite/commit/b2e405323942160c4b20075da2ecf74b8a02b205))
* **0.4.2:** integrate Vercel Analytics for enhanced performance tracking ([0c44f45](https://github.com/mtharreqq/requixite/commit/0c44f451b384018631c3d347e5db957fd82e3bdc))
* **0.5.0:** implement animated theme toggler and popover component; update styles and remove mode toggle ([d68986c](https://github.com/mtharreqq/requixite/commit/d68986cc0e001f5be15e60293e44aa31c99c047d))
* add FadeContent component for fade-in effects on scroll ([928ef61](https://github.com/mtharreqq/requixite/commit/928ef6172ce516c8724a2a593c1333c4f65586f3))
* add new Radix UI components and Zod for improved form validation; update package dependencies ([4394409](https://github.com/mtharreqq/requixite/commit/4394409e34f585970e48297a041a79a6be8dd932))
* add TextType component for animated text typing effect ([928ef61](https://github.com/mtharreqq/requixite/commit/928ef6172ce516c8724a2a593c1333c4f65586f3))
* create ModeToggle component for theme switching ([928ef61](https://github.com/mtharreqq/requixite/commit/928ef6172ce516c8724a2a593c1333c4f65586f3))
* create ThemeProvider component for theme management ([928ef61](https://github.com/mtharreqq/requixite/commit/928ef6172ce516c8724a2a593c1333c4f65586f3))
* implement DropdownMenu component with various subcomponents ([928ef61](https://github.com/mtharreqq/requixite/commit/928ef6172ce516c8724a2a593c1333c4f65586f3))
* **v0.1.1:** add ScrollArea and Separator components with versioning support ([efef940](https://github.com/mtharreqq/requixite/commit/efef940be4381b3d9039c900a2063824ed169fa4))
* **v0.2.0:** implement API for fetching release versions and update UI to display them ([78c1491](https://github.com/mtharreqq/requixite/commit/78c1491bcfa5d5c80f128f17af0948ae342255a8))


### Bug Fixes

* **0.5.1:** optimize release loading by removing redundant sorting and ensuring order by release date; adjust padding and margin for HoverCardContent and ScrollArea components ([561364e](https://github.com/mtharreqq/requixite/commit/561364ea1f2fc69deb02cbabbc25b458ca708e58))
* enhance button styles for dark mode compatibility ([928ef61](https://github.com/mtharreqq/requixite/commit/928ef6172ce516c8724a2a593c1333c4f65586f3))
