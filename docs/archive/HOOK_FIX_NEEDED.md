# Fix Needed: React Hook Rules Violation

## Problem

The `useEffect` hook is being called after a conditional `return` statement in both:

- `src/components/admin/send-quote-button.tsx`
- `src/components/admin/convert-quote-button.tsx`

This violates React's Rules of Hooks which require hooks to be called in the same order on every render.

## Current Code Pattern (WRONG):

```tsx
if (!canSend) {
  return null  // Early return
}

useEffect(() => {  // Hook called AFTER conditional return
  ...
}, [])
```

## Solution:

Remove early return and use conditional rendering instead:

```tsx
useEffect(() => {
  if (open && !quoteDetails && canSend) {
    // Add condition here
    loadQuoteDetails()
  }
}, [open, quoteDetails, canSend])

if (!canSend) {
  return null
}
```

OR wrap with useCallback and move before early return.

## Action Required:

The ESLint pre-commit hook is correctly blocking the commit. These files need to be fixed before committing.
