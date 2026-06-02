# ADR 0004: React Hook Form with Zod

## Status

Accepted

## Context

The profile-fe application contains complex forms with nested repeatable fields (achievements, projects, social links, timeline), conditional validation, and real-time user feedback. We needed a form solution that balanced performance, developer experience, and type safety.

## Decision

We chose **React Hook Form** with **Zod** schema validation (via `@hookform/resolvers/zod`).

## Options Considered

### Formik
- Popular and well-documented
- Re-renders entire form on every keystroke — problematic for large forms
- Manual validation logic or third-party schema integration

### React Hook Form
- Uncontrolled inputs minimise re-renders for better performance
- Built-in support for field arrays, dirty detection, and error tracking
- Seamless integration with Zod via `@hookform/resolvers`
- First-class TypeScript support

### Custom form logic
- Full control but high maintenance burden
- No built-in field arrays, dirty tracking, or validation patterns

## Rationale

1. **Performance**: React Hook Form's uncontrolled approach means inputs don't trigger re-renders of the entire form tree. This is critical for the profile page which has 50+ fields with drag-and-drop reordering.

2. **Zod integration**: The same Zod schemas used for API validation on the backend (`profileSchema`) are reused on the frontend, ensuring client and server validation stay in sync.

3. **Field arrays**: `useFieldArray` provides clean APIs for adding, removing, reordering, and updating dynamic field groups (achievements, projects, timeline entries).

4. **Dirty detection**: Built-in `isDirty` and per-field dirty flags enable the "No changes" / "Update Data" UI state without manual comparison logic.

## Consequences

- Developers must understand React Hook Form's `Controller` wrapper for custom components (e.g. `DebouncedSelect`)
- Validation errors surface via Zod error objects and must be mapped to form fields
- The `profileSchema` serves as the single source of truth for both frontend validation and API payload validation
