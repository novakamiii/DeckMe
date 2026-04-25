# PROJECT KNOWLEDGE BASE

**Project:** DeckMe! - Cross-platform study application with markdown integration
**Stack:** React 18 + Vite + TypeScript + Tailwind CSS v4 + Tauri (Rust) + Capacitor (Android)

## OVERVIEW

Flashcard/note-taking app with pomodoro timer. Supports desktop (Tauri) and Android (Capacitor). Uses localStorage for persistence, no external state library.

## STRUCTURE

```
DeckMe/
├── src/                          # React frontend
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/               # 40+ Radix UI primitives
│   │   │   ├── notes/            # Note type components
│   │   │   └── [feature comps]   # AppSidebar, PomodoroTimer, etc.
│   │   ├── pages/                # Route pages
│   │   ├── lib/                  # mockData.ts, subjectStorage.ts
│   │   └── routes.tsx            # React Router v7
│   └── styles/                   # Tailwind + theme CSS
├── src-tauri/                    # Desktop app (Rust)
│   └── src/main.rs               # Entry point
└── android/                      # Capacitor Android wrapper
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add UI component | `src/app/components/ui/` |
| Add note type | `src/app/components/notes/` |
| Add page | `src/app/pages/` |
| Routing | `src/app/routes.tsx` |
| Data/storage | `src/app/lib/mockData.ts`, `subjectStorage.ts` |
| Styling | `src/styles/` (Tailwind v4) |
| Build config | `vite.config.ts`, `src-tauri/tauri.conf.json` |

## CONVENTIONS

- **Components:** PascalCase files, default exports
- **UI components:** Use `cn()` from `utils.ts` for class merging
- **Variants:** Use `class-variance-authority` (cva) for component variants
- **Icons:** Lucide React
- **Styling:** Tailwind v4 with `@import` syntax (not `@tailwind`)
- **State:** localStorage only, no Redux/Zustand

## ANTI-PATTERNS

- **NEVER** add `.css`, `.tsx`, `.ts` to `assetsInclude` in vite.config.ts
- **NEVER** remove React/Tailwind plugins from Vite config (required for Make)
- **DO NOT REMOVE** `#![cfg_attr(...)]` line in `src-tauri/src/main.rs` (prevents Windows console)
- Avoid `@ts-ignore` or `@ts-expect-error` in source files

## UNIQUE STYLES

- Custom `figma:` protocol resolver in Vite for asset imports
- `@` alias maps to `./src` directory
- Radix UI primitives wrapped with Tailwind classes
- Tailwind v4 uses `@import './tailwind.css'` not directives

## COMMANDS

```bash
# Development
npm run dev              # Vite dev server
npm run tauri            # Tauri dev mode
cd android && ./gradlew  # Android build

# Production
npm run build            # Vite production build
cd src-tauri && cargo tauri build  # Desktop build
```

## NOTES

- Uses `peerDependencies` for React (optional in pnpm overrides)
- Mobile build: `capacitor.config.json` in android/app/src/main/assets/
- No test framework configured
