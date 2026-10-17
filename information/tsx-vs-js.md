# Why .tsx and not .js?

## File Extensions Used in BrewBox

| Extension | Used For |
|---|---|
| `.tsx` | React components (files with JSX like `<View>`, `<Text>`) |
| `.ts` | Pure logic, types, utilities (no JSX) |
| `.js` | Only `index.js` — React Native's entry point (kept by convention) |

---

## What is TypeScript (.tsx)?

- `.js` = plain JavaScript → no type checking
- `.tsx` = TypeScript + JSX → type checking + React components

`.tsx` is just `.js` with superpowers. All valid JS is valid TS.

---

## Why TypeScript over plain JavaScript?

### 1. Catches bugs before running the app
```tsx
const price: number = "free"; // ❌ Error shown immediately in editor
const price: number = 99;     // ✅ Correct
```

### 2. Autocomplete & better editor support
- Your editor knows what properties exist on an object
- No more guessing prop names or function arguments

### 3. Define the shape of your data
```tsx
interface Product {
  id: string;
  name: string;
  price: number;
  category: 'coffee' | 'tea' | 'accessories';
}
```
Now if you accidentally pass wrong data, TypeScript will warn you instantly.

### 4. Safer with Supabase & Zustand
- Type your database responses → no surprise `undefined` crashes
- Type your store slices → know exactly what state looks like

---

## Simple Rule to Remember

> Use `.tsx` when the file has JSX (angle brackets like `<Component />`).
> Use `.ts` for everything else (pure functions, types, API calls).

---

## Example from BrewBox

```
App.tsx          → has <NavigationContainer> JSX → .tsx ✅
index.js         → just registers the app → .js (convention) ✅
src/types/       → only interfaces, no JSX → .ts ✅
src/screens/     → all have JSX → .tsx ✅
src/services/    → Supabase API calls, no JSX → .ts ✅
```
