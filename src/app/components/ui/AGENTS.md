# UI COMPONENTS

40+ Radix UI primitive wrappers with Tailwind styling. All components follow the shadcn/ui pattern using `class-variance-authority` for variants.

## STRUCTURE

```
ui/
├── utils.ts              # cn() helper for class merging
├── button.tsx            # Primary CTA component
├── card.tsx              # Container with variants
├── dialog.tsx            # Modal overlay
├── input.tsx             # Form inputs
├── select.tsx            # Dropdown selection
├── sidebar.tsx           # Navigation sidebar
├── tooltip.tsx           # Hover tooltips
├── [40+ more...]         # All Radix primitives
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add new component | Create `.tsx` file here |
| Class merging | Import `cn` from `./utils` |
| Component variants | Use `cva()` from class-variance-authority |
| Slot composition | Use `@radix-ui/react-slot` |

## CONVENTIONS

- Use `cn()` from `./utils` for all class merging
- Define variants with `cva()` - include `defaultVariants`
- Support `asChild` prop via Radix Slot for composition
- Export both component and variant type (e.g., `buttonVariants`)
- Use `data-slot` attribute for styling hooks

## ANTI-PATTERNS

- **NEVER** import from `@radix-ui/react-*` directly in pages - use these wrappers
- Don't use inline styles - always Tailwind classes via `cn()`
- Avoid prop drilling for styling - use variant props instead

## EXAMPLE PATTERN

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const variants = cva("base-classes", {
  variants: { size: { sm: "...", lg: "..." } },
  defaultVariants: { size: "default" }
});

export function Component({ className, size, ...props }) {
  return <div className={cn(variants({ size, className }))} {...props} />;
}
```
