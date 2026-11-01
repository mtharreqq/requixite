# Animation plans

Produced by the `improve-animations` skill (Emil Kowalski's motion bar) at commit `e1816d6`. Each plan is self-contained and can be executed by any agent. Run `improve-animations reconcile` after executing to refresh status and line numbers.

| # | Plan | Severity | Category | Status |
| --- | --- | --- | --- | --- |
| 001 | [Rail ticks: transform instead of width](001-rail-ticks-transform.md) | HIGH | Performance | DONE |
| 002 | [No reveal for sections visible at load](002-no-reveal-for-initially-visible-sections.md) | MEDIUM | Purpose & frequency | DONE |
| 003 | [Gentler reduced motion](003-gentler-reduced-motion.md) | MEDIUM | Accessibility | TODO |
| 004 | [Interruptible Proof card switch](004-proof-switch-interruptible.md) | MEDIUM | Interruptibility | TODO |
| 005 | [Grouped social tooltips](005-grouped-social-tooltips.md) | MEDIUM | Purpose & frequency | TODO |
| 006 | [Replace transition-all](006-replace-transition-all.md) | MEDIUM | Performance | TODO |
| 007 | [Easing tokens](007-easing-tokens.md) | LOW | Cohesion & tokens | TODO |
| 008 | [Transform strings for Magnetic/Polaroid](008-motion-transform-strings.md) | LOW | Performance | TODO |
| 009 | [Lighter section reveal](009-lighter-section-reveal.md) | LOW | Cohesion & tokens | TODO |
| 010 | [Micro-delight for 3 state changes](010-micro-delight-state-changes.md) | LOW | Missed opportunities | TODO |
| 011 | [Work card overflow](011-work-card-overflow.md) | HIGH | Break-ui | DONE |
| 012 | [Proof pin labels never clipped](012-proof-pin-labels.md) | HIGH | Break-ui | DONE |
| 013 | [Hide empty Work section](013-hide-empty-work.md) | MEDIUM | Break-ui | DONE |
| 014 | [TagPill color-mix](014-tag-pill-color-mix.md) | LOW | Break-ui | DONE |
| 015 | [Experience "@ Org" nowrap](015-experience-org-nowrap.md) | LOW | Break-ui | DONE |
| 016 | [Touch press feedback](016-touch-press-feedback.md) | MEDIUM | Mobile-native | TODO |
| 017 | [theme-color follows theme](017-theme-color.md) | LOW | Mobile-native | TODO |
| 018 | [Controls: no select, no tap delay](018-controls-select-and-touch-action.md) | LOW | Mobile-native | TODO |

Plans 011-018 come from `break-ui` (dev toggle at `/?data=worst|one|empty`) and `mobile-native` audits at commit `bdceefd`.

## Recommended execution order

0. **011-015** first (real layout bugs), then the animation plans below, then **016-018**. 012 must land before 010 (010 animates the new pin label placement).
1. **001**: biggest perf win, isolated to `rail-nav.tsx`.
2. **002**: one-line fix, removes the load flicker.
3. **007**: tokens first, because 009 references `var(--ease-out)`.
4. **003**: reduced-motion rewrite (after 007 so it sees final tokens).
5. **009**: depends on 007.
6. **006**: then **004** (both touch `proof-section.tsx`; 006 is tiny, do it first to avoid conflicts).
7. **005**: isolated to `connect-section.tsx`.
8. **008**: feel-sensitive, review on a real screen.
9. **010**: last; touches `connect-section.tsx`, `proof-section.tsx`, `rail-nav.tsx` after the others have landed.

## Dependencies

- 009 → needs 007 (`--ease-out` token).
- 004 and 010 both edit `proof-section.tsx`; 010 should reuse 004's `EASE_OUT`.
- 001, 003 and 010 all edit `rail-nav.tsx` in different places; apply in that order.
- 005 and 010 both edit `connect-section.tsx` in different places.

## Out of scope (for the dependency cleanup step)

- `gsap`, `components/text-type.tsx`, `components/rotating-text.tsx`, `components/squares.tsx` are unused.
- `framer-motion` and `motion` are both installed (same library). Consolidation is a separate task, not part of these plans.
