# Artist Portfolio Client — Project Guide

## Stack
React 19, TypeScript, Vite, TanStack Router, TanStack Query, Zustand, Tailwind CSS v4, shadcn/ui, React Hook Form + Zod, Sonner

## File naming
- `entity-name.component.tsx` — components
- `entity-name.page.tsx` — pages
- `entity-name.queries.ts` — TanStack Query hooks
- `entity-name.api.ts` — fetch wrappers
- `entity-name.store.ts` — Zustand stores
- `entity-name.utils.ts` — Zod schemas and shared utils
- `entity-name.types.ts` — TypeScript interfaces
- `entity-name.enums.ts` — enums

## Components

**Named exports** for components, **default exports** for pages.

**Create + edit in one component** — optional entity prop, two forms, two handlers:
```ts
interface XxxFormProps {
  entity?: EntityResponse
  onClose: () => void  // always onClose, never onCancel
}
const isEditing = !!entity
```

**Page overlay state** — discriminated union:
```ts
type OverlayState = { type: 'none' } | { type: 'create' } | { type: 'edit'; entity: T }
```

**Delete dialogs** — keep only mutation logic, delegate UI to `<DeleteDialog>`

**Event handlers** — always prefixed with `handle`: `handleSubmit`, `handleLogout`

**No meaningless comments** — never `{/* Email */}` above an email input. Only comment non-obvious logic.

## Design system

**Button** — always use variants, never inline brand colors in className:
- `variant="brand"` — primary CTA
- `variant="brand-outline"` — secondary action
- `variant="ghost-brand"` — edit icon button
- `variant="ghost-destructive"` — delete icon button
- `variant="destructive"` — confirm delete

**Shared UI components** — use instead of inline styles:
- `<EyebrowLabel>` — small uppercase label above headings
- `<Textarea hasError={!!errors.field} />` — styled textarea
- `<DeleteDialog>` — generic delete confirmation

**Colors** — only design tokens defined in `index.css` (`@theme inline`), never raw Tailwind utility colors (`bg-yellow-100`, `text-gray-500` etc.).

**`cn()`** from `@/lib/utils` for all conditional className merging.

## State management

**TanStack Query = server data. Zustand = UI/client state only.** Never store API responses in Zustand.

**Query keys** — singular form, factory functions:
```ts
const entityKeys = {
  all: () => ['entities'] as const,
  detail: (id: string) => ['entities', id] as const,
  byUser: (userId: string) => ['entities', 'user', userId] as const,
}
```

**`queryFn`** — pure fetch only, no side effects, no Zustand calls inside.

**`invalidateQueries`** — always prefix with `void`, never manually sync Zustand after mutation:
```ts
onSuccess: () => { void queryClient.invalidateQueries({ queryKey: entityKeys.all() }) }
```

**Detail queries** — always guard with `enabled: !!id` to prevent fetching with empty id.

**Mutation `onError`** — use `instanceof ApiError` to handle known errors:
```ts
onError: error => {
  if (error instanceof ApiError) toast.error('Failed to ...')
}
```

**Zustand stores** — must not import other stores. On logout: `queryClient.clear()` resets all server state.

## Auth store
- Call `setToken(token, isArtist)` after login — never `localStorage.setItem` directly
- `setToken` syncs both Zustand state and localStorage simultaneously

## API client

Always use `apiRequest<T>()` from `@/api/client.ts`. Never raw `fetch()` in api files — it bypasses `ApiError`.

- Auth header attached automatically: `Authorization: Bearer <token>`
- Errors thrown as `ApiError` with `.status` and `.data` — use `instanceof ApiError` in `onError`

## Forms

**Error messages** — always below the input:
```tsx
{errors.field && <p className='text-xs text-destructive'>{errors.field.message}</p>}
```

**Pending state** — button text changes during submission:
```tsx
{isPending ? 'Saving...' : 'Save changes'}
```

**Number inputs** — register with `valueAsNumber`:
```tsx
{...register('price', { valueAsNumber: true })}
```

## Validation (Zod)

- Schema = only fields the user edits. No display-only or server-read-only fields in schema.
- Always derive types: `type FormData = z.input<typeof schema>`
- Cross-field rules (min/max) — `.refine()` on the object level with `path: ['field']`
- Date minimum — `.refine()` + `min={getMinDate()}` on the input
- Number minimum — `min(0)` in schema + `min={0}` on input

## Loading state

Every page that fetches data renders this before main content:
```tsx
if (isLoading) {
  return (
    <div className='flex min-h-[calc(100vh-57px)] items-center justify-center'>
      <p className='text-sm text-muted-foreground'>Loading...</p>
    </div>
  )
}
```

## TypeScript

- Request types: `LoginRequest`. Response types: `LoginResponse`, `UserResponse`
- Use `import type { ... }` for type-only imports
- Use `enum` for named string sets, not `type` unions

## Routing

- File-based in `src/routes/`, auto-generates `routeTree.gen.ts` — never edit it manually
- `__root.tsx` handles global layout and auth guards

## Import paths

Always use `@/` alias:
```ts
import { Button } from '@/components/ui/button'
import type { UserResponse } from '@/types/user.types'
import { cn } from '@/lib/utils'
```

## Floating promises
Always prefix with `void`:
```ts
void navigate({ to: '/' })
void queryClient.invalidateQueries(...)
// Form submit:
onSubmit={e => void handleSubmit(handleFormSubmit)(e)}
```

## Commits
`feat:` / `fix:` / `refactor:` / `docs:` / `chore:`

## Do NOT
- Use raw Tailwind colors — only design tokens
- Store server data in Zustand
- Call `localStorage.setItem` for auth — use `setToken()`
- Use `onCancel` — always `onClose`
- Edit `routeTree.gen.ts`
- Use raw `fetch()` in api files — use `apiRequest()`
- Add comments that restate what the code does
- Use `type` unions where `enum` fits
- Import one Zustand store inside another
