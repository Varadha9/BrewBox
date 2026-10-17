# BrewBox — Specialty Coffee & Tea E-Commerce App

A clean, modern mobile e-commerce application built with **React Native** and **TypeScript**, focused on specialty coffee and tea shopping experience.

## Developer

- **Name:** Varad Vikas Mandhare
- **GitHub:** [github.com/Varadha9](https://github.com/Varadha9)

---

## App Screens

| Screen | Description |
|---|---|
| **Home** | Hero banner, featured products, top categories |
| **Categories** | Browse by Coffee, Tea, Accessories, Merchandise |
| **Product Listing** | Grid/list view of products per category |
| **Search & Filters** | Search by name, filter by price, roast, rating |
| **Product Details** | Images, description, size/variant selector, reviews |
| **Wishlist** | Saved favourite products |
| **Cart** | Add/remove items, quantity control, price summary |
| **Checkout** | Address, payment method, order confirmation |
| **Order History** | Past orders with status tracking |
| **Reviews & Ratings** | Submit and view product reviews |
| **User Profile** | Account info, saved addresses, preferences |

---

## Tech Stack

- **Framework:** React Native (CLI) + TypeScript
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **State Management:** Zustand
- **Backend / Auth / DB:** Supabase
- **Payments:** Razorpay
- **Styling:** StyleSheet (React Native)

---

## Project Structure

```
BrewBox/
├── src/
│   ├── components/     # Reusable artisanal UI components (RoastMeter, TasteProfileBar, GrindSelector, BespokeIcon)
│   ├── data/           # Specialty coffees, estate teas, brew guides, categories
│   ├── navigation/     # React Navigation (Stack + Bottom Tabs)
│   ├── screens/        # All app screens (Home, Explore, Details, Cart, Checkout, Wishlist, Orders, Profile)
│   ├── store/          # Zustand state slices (Cart, Wishlist, Filters, User & Orders)
│   ├── theme/          # Artisanal palette, typography, spacing, shadows
│   └── types/          # TypeScript interfaces (Product, Cart, Order, User, Navigation)
├── __tests__/          # Jest unit tests for cart, discount math & app rendering
├── android/
├── index.js
├── App.tsx
└── package.json
```

---

## Prerequisites

- Node.js `>= 22.11.0`
- Android SDK (API 34/35) & JDK 21

## Commands

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android

# TypeScript check
npx tsc --noEmit

# Run Jest tests
npm test

# Lint
npm run lint
```
