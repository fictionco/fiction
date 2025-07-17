# Project Context - Fiction.com

## What We're Building
Fiction.com is a premium platform for creators, operators, and dealmakers who need to build authority without self-promotion. We're selling a $79/month system that builds bios, sites, newsletters, and authority in 3 minutes.

## Target Users
- **Advisors, operators, and dealmakers** who don't self-promote
- **Time-poor, status-conscious** professionals
- **ROI-driven users** who need results, not tools
- People who've "rewritten their About Me 12 times" and none felt right

## Value Proposition
- **From ignored to undeniable** — in one click
- **Get more replies, referrals, and investor intros** — without lifting a finger
- **Stop hoping someone Googles you. Start showing up on your terms.**

## Brand Positioning
- **Premium positioning** — we're not begging for customers
- **Contrarian against bloated tools** — "Not another personal site. A system that earns you recognition."
- **Exclusivity signal** — "$79/month. Because your reputation is worth more than free tools."

## Key Architecture Patterns
- Extend `FictionObject` for modular, testable stateful modules
- Dependency injection for all config/context
- Engine arrays for type-based logic
- Single-column layouts for conversion
- Minimal, clarity-first UI design

## Success Metrics
- **Clarity** — would a smart non-designer immediately know what this is?
- **Conversion** — does each element build momentum toward action?
- **Premium feel** — does it communicate restraint, competence, and precision?
- **Speed** — can users get value in 3 minutes?

## Common Failure Patterns to Avoid
- Designing for other designers instead of users
- Adding features that aren't today's problem
- Using vague terms like "platform" or "solution"
- Creating visual noise that competes with the message
- Building for edge cases instead of core use cases

## Technical Constraints
- Keep files under one screen height for clarity
- Avoid mocking in tests — use `testUtils`
- No auto-imports or global side effects
- Explicit over magical in all implementations
- YAGNI compliance — don't add until needed

*This context informs all design, copy, and code decisions.*
