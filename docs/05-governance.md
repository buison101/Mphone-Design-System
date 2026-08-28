# Governance

## Contribution gate

A new component must be useful in more than one context, unique within the system, tested in a real flow, accessible, documented, and owned.

## Versioning

- Patch: visual or behavioral fix without consumer migration.
- Minor: additive token, component, variant, or pattern.
- Major: renamed/removed token, component API break, or required migration.

## Definition of done

- Uses semantic tokens and existing components.
- Covers loading, empty, error, permission, and long-content states as applicable.
- Keyboard and focus behavior verified on web.
- TalkBack semantics and 48dp targets verified on Android.
- Vietnamese and English content updated together.
- Light and dark schemes checked.
- Code, documentation, tests, and release notes agree.

## AI design context

Before designing a new screen, provide the product role, user task, data fields, permissions, risky actions, selected template, required patterns, and relevant golden screens. AI output is reviewed against this definition of done before adoption.

