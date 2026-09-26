# Alteesh Clinic

تطبيق عربي لإدارة عيادة أسنان يعمل أوفلاين بالكامل ويحفظ بيانات العيادة على الجهاز.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/alteesh-clinic run dev` — run the web app
- `pnpm --filter @workspace/alteesh-clinic run typecheck` — typecheck the clinic app
- `pnpm --filter @workspace/alteesh-clinic run android:sync` — build and sync Capacitor Android
- `pnpm --filter @workspace/alteesh-clinic run desktop:build` — build the Electron desktop package
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Clinic app: React + Vite + TypeScript + Wouter + Dexie + Capacitor + Electron

## Where things live

- `artifacts/alteesh-clinic/src/App.tsx` — routes, screens, local UI flows, and role presentation
- `artifacts/alteesh-clinic/src/lib/repository.ts` — Dexie schema, repositories, validation, seed data, and local persistence
- `artifacts/alteesh-clinic/src/index.css` — RTL visual system and responsive layout
- `artifacts/alteesh-clinic/capacitor.config.ts` — Android wrapper configuration
- `artifacts/alteesh-clinic/electron/main.ts` — Windows desktop wrapper

## Architecture decisions

- The clinic deliberately has no backend or login; IndexedDB is the source of truth so the same UI code can run in browser, Capacitor, and Electron.
- Role switching is a presentation and data-shaping boundary: doctor mode never receives patient names, doctor identities, money, inventory, or settings in its view.
- Appointment overlap validation lives in the repository and applies to one shared chair, regardless of which doctor is selected.
- Seed records are marked with `isSeed` so users can remove only starter data.

## Product

تشمل النسخة الحالية شاشة إعداد أولي، لوحة مدير، وضع طبيب معزول، المرضى وتفاصيلهم
وخريطة 32 سنًا، المواعيد والفواتير التلقائية، خطط العلاج، المخزون والحركات،
الإعدادات، PWA، وإعدادات Capacitor وElectron.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- تشغيل build يدويًا يحتاج `PORT` و`BASE_PATH`؛ استخدم workflow أو سكربتات التغليف الجاهزة.
- إخراج EXE النهائي يحتاج Windows أو Wine؛ إعداد Electron نفسه موجود ويُبنى حتى مرحلة التغليف المحلي.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
