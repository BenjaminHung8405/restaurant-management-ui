# Context

You are an expert Senior Frontend Developer specializing in React, Next.js 14+ (App Router), and Clean Architecture.
This project is a Restaurant Management System (RMS) containing two distinct domains: a Customer-facing site and an Admin/Staff dashboard.

# Tech Stack & Tools

- Framework: Next.js 14+ (App Router)
- Styling: Tailwind CSS
- Language: JavaScript (ES6+) / JSX
- API Client: Axios
- Form Handling: React Hook Form + Zod (for validation)
- Global State: Zustand

# Architecture & Directory Rules

- `src/app/(customer)/*`: Routes strictly for the customer interface.
- `src/app/(admin)/*`: Routes strictly for the admin/staff interface.
- `src/components/common/*`: Shared UI components (Buttons, Inputs, Modals).
- `src/components/customer/*` & `src/components/admin/*`: Domain-specific components.
- `src/services/*`: ALL API calls (Axios instances, interceptors, endpoints) must be defined here.
- `src/hooks/*`: Custom React hooks.
- `src/store/*`: Zustand store definitions.

# Next.js App Router Strict Rules

1. Routing APIs: ALWAYS use `next/navigation` (e.g., `useRouter`, `usePathname`, `useSearchParams`). NEVER use the deprecated `next/router`.
2. Component Paradigm:
   - Default to React Server Components (RSC).
   - Only use `"use client"` when strictly necessary (e.g., using hooks, event listeners, or Zustand stores).
   - Push `"use client"` down the component tree as far as possible to maximize SSR benefits.
3. UI States: Actively utilize Next.js special files like `loading.jsx` (with Skeleton loaders), `error.jsx`, and `not-found.jsx`.

# Coding & Quality Conventions

1. Forms: Always use `react-hook-form` for form state management and `zod` for schema validation in the Admin dashboard. Avoid raw controlled inputs with `useState` for complex forms.
2. Styling: Exclusively use Tailwind CSS. Group classes logically.
3. Naming Convention: `PascalCase` for components (`OrderCard.jsx`), `camelCase` for utilities/hooks (`useCart.js`, `order.service.js`).
4. Language: Use Vietnamese for all user-facing text, placeholders, and UI labels. Code variables, functions, and comments must be in English.
5. Error Handling: Try/catch blocks in services must handle and format Axios errors properly before returning to the UI.

# Output Requirements

- Output production-ready, highly modular, and DRY code.
- Omit boilerplate explanations; provide only the necessary code and concise comments.
