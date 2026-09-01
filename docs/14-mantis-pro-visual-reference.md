# Mantis Pro visual reference

Mantis Pro is the primary external visual reference for Portal UI experiments:

- [Mantis Pro — Analytics](https://mantisdashboard.com/dashboard/analytics)
- Start from Analytics, then inspect the relevant destinations through the Mantis Pro sidebar.
- The vendored Mantis Free project is useful for implementation structure, but it is not a substitute for checking the current Pro composition and visual behavior.

This is a visual reference only. Do not copy proprietary source code, assets, illustrations, text, sample data, or product-specific content. Reconstruct the applicable hierarchy and behavior with Portal components, semantic tokens, Mphone branding, bilingual content, and honest local sample data.

## Required AI reference workflow

Before proposing or implementing a Portal page, an AI agent must:

1. Open the Analytics reference above and switch Mantis Pro to the same light or dark mode being evaluated in Portal.
2. Use the Mantis Pro sidebar to inspect the nearest relevant category instead of judging every page only from Analytics:
   - **Dashboard → Default / Analytics** for page shell, KPI cards, charts, activity feeds, and responsive dashboard composition.
   - **Widgets → Statistics / Data / Chart** for compact information objects and chart containers.
   - **Applications → Chat / Calendar / Kanban / Customer / Invoice / Profile / E-commerce** for application layouts, lists, details, split panes, and dense workflows.
   - **Forms & Tables → Forms Validation / Forms Wizard / React Table / MUI Table** for fields, validation, filters, tables, pagination, and multi-step flows.
   - **Charts & Map** for chart framing, legends, axes, tooltips, and visualization density.
   - **Pages → Authentication / Maintenance / Contact US / Pricing** for standalone page hierarchy and content states.
   - **Menu Levels / Sub Caption Levels / Disabled Menu / Oval Chip** for sidebar nesting, captions, disabled states, and badges.
3. Compare the reference with the actual Portal route at `http://localhost:4321/`, using the same viewport and theme.
4. Record what should be adopted, what must remain Mphone-specific, and any missing semantic token or shared component.
5. Implement from Portal primitives. Never import from, scrape, decompile, or reproduce Mantis Pro source or assets.

When the Pro demo requires authentication or is temporarily unavailable, record that limitation. Use captured observations and the vendored Mantis Free implementation only as fallback context; do not claim a current Pro comparison was completed.

## Dark-mode baseline observed on 2026-08-29

The Mantis Pro Analytics page was inspected with **Theme Customization → Theme Mode → Dark**, using the default layout and fluid width. The values below describe the rendered visual layers, not an authorization to copy Pro implementation code.

| Layer | Mantis Pro observed | Portal before alignment | Effect |
|---|---:|---:|---|
| Page canvas / body | `#121212` | `#1e1e1e` | Portal makes the empty page gutters lighter than the content objects. |
| Header | `#1e1e1e` | `#121212` | Pro lifts the header above the canvas; Portal recesses it. |
| Expanded sidebar | `#1e1e1e` | `#121212` | Pro treats navigation as a raised shell surface; Portal makes it the darkest region. |
| Standard card surface | approximately `#141414` to `#1e1e1e`, depending on object | `#121212` | Pro cards are equal to or lighter than the canvas; Portal cards are darker than the canvas. |
| Subtle border/divider | about `rgba(255,255,255,0.05)` | about `rgba(255,255,255,0.05)` / `#1e1e1e` card border | Border strength is similar, but Portal's inverted surfaces make some borders read as dark frames. |
| Primary text | `rgba(255,255,255,0.87)` | `rgba(255,255,255,0.87)` | Primary text treatment is already aligned. |

### Main dark-mode difference

Mantis Pro uses a conventional elevation sequence:

```text
darkest canvas (#121212)
  → raised navigation/header (#1e1e1e)
  → cards slightly above the canvas (#141414–#1e1e1e)
  → borders and dividers at low-opacity white
```

Portal currently reverses the first relationship:

```text
lighter canvas (#1e1e1e)
  → darker navigation/header/cards (#121212)
  → card border (#1e1e1e)
```

This reversal is the main reason the two dark themes feel substantially different even though typography, the blue family, divider opacity, drawer width, and much of the shell structure are related.

### Portal alignment implemented on 2026-08-29

Portal now follows the Pro surface direction for dark mode:

- page canvas: `#121212`;
- header, expanded sidebar and default content surface: `#1e1e1e`;
- subtle dark surface: `#141414`;
- raised surface: `#1f1f1f`;
- standard card borders: the shared low-opacity dark divider rather than a solid `#1e1e1e` frame;
- expanded dark drawer: one ambient elevation step above the canvas.
- compact KPI/stat cards: the `#141414` subtle surface, while larger data cards remain on the `#1e1e1e` default surface;
- selected and hovered expanded-sidebar rows: the neutral `#141414` surface with the existing blue semantic selection edge, instead of a large dark-blue wash.
- measured Mantis Pro Dark sidebar states use `#bfbfbf` for regular labels/icons; hover and active use `rgba(255,255,255,0.05)`, white primary labels and blue primary icons; active adds the 2px blue edge.
- the desktop header includes a route search and a persisted Fluid/Container width choice; Portal omits the simulated connection badge from the visual shell.

The earlier measurements remain in the table above as change evidence. Future AI comparisons must evaluate the current rendered Portal rather than treating the former reversed hierarchy as intentional behavior.

### Component-level observations

- **Sidebar:** Pro's expanded drawer reads as a continuous raised surface. Portal's drawer is the darkest large block and the selected row adds a dark-blue fill plus a bright blue edge, so navigation has stronger contrast than the Pro reference.
- **Header:** Pro places a lighter header over the darkest canvas and includes search plus a denser action cluster. Portal's darker, sparse header visually merges with the darkest cards instead of establishing a top shell layer.
- **Cards:** Pro alternates subtle dark surfaces and uses low-opacity borders/shadows. Portal applies the same `#121212` surface and `#1e1e1e` border to most cards, making the dashboard look like dark cut-outs in a lighter sheet.
- **Tables and list rows:** Both use restrained dividers, but Portal's darker container increases the contrast between the table and page while Pro keeps table/card elevation in the same upward surface sequence.
- **Charts:** Pro reduces saturation and brightness of filled chart areas in dark mode. Portal's blue, red, amber, cyan, and green marks are often more luminous against `#121212`; keep semantic meaning and accessibility, but compare intensity and fill opacity with the relevant Pro chart page.
- **Hero surfaces:** Both use a strong blue hero. Pro's gradient/image treatment is integrated with the dark canvas, while Portal's flat, bright hero dominates more because surrounding cards are uniformly near-black.

## Guidance for future changes

- Treat Pro as a compositional reference, not a requirement to make every Mphone screen identical.
- Match the reference theme before comparing; never compare Pro light mode with Portal dark mode.
- Prioritize surface hierarchy, spacing, density, and interaction states before matching decorative details.
- Preserve Mphone semantic status colors, validated chart separation, Vietnamese/English content, accessibility, and telecom-specific workflows.
- If Portal intentionally deviates, document the reason beside the token or component. Accessibility and product truth take precedence over visual similarity.
