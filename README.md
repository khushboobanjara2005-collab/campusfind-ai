# CampusFind AI 🧭
### Simple, Friendly Collegiate Lost & Found Platform

**CampusFind AI** is a clean, student-friendly web application designed for campus lost and found management. Built with a modern, light-themed university interface, it features a deterministic multi-vector matching engine that compares lost-item reports against found-item reports with zero external dependencies.

---

## 🎨 Design System & Palette

- **Main Background**: `#F8FAFC` (Soft Slate)
- **Cards & Surfaces**: `#FFFFFF` (Pure White with subtle `#E2E8F0` borders)
- **Primary Brand**: `#4169E1` (Royal Blue)
- **Soft Accent**: `#EAF1FF` (Light Blue)
- **Main Text**: `#1E293B` (Slate 800)
- **Secondary Text**: `#64748B` (Slate 500)
- **Success Green**: `#16A34A` (Green 600)
- **Card Shadows**: Soft, elegant elevation with subtle hover lift

---

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Create local configuration if it does not exist
if (!(Test-Path .env)) { Copy-Item .env.example .env }
# Edit .env and replace OPENROUTER_API_KEY with your own key

# 3. Run automated test suite
npm test

# 4. Start the API server in one terminal
npm run dev:api

# 5. Start the web app in a second terminal
npm run dev

# 6. Production build and server
npm run build
npm start
```

The report description is sent to OpenRouter after you pause typing for 1.2 seconds. The API key stays on the server and is never bundled into the browser app. Do not put private information in the description. The development server proxies `/api` requests to the local API server on port 3001; set `PORT` if that port is in use and update the Vite proxy accordingly.

Set `OPENROUTER_MODEL` in `.env` to select another model. The default is `openai/gpt-4o-mini`. Never commit `.env` or share your API key.

On Windows, keep the project path free of `&` (for example, use `D:\lost-found_AI\campusfind-main`). `npm` scripts can fail to find local tools when the working path contains an ampersand.

---

## 📱 Page Overview

### 1. Welcome Homepage (`HomeView.tsx`)
- **Welcoming Navigation**: CampusFind logo, Home, Browse Items, Smart Matches, How It Works, and Report Lost / Report Found action buttons.
- **Hero Section**:
  - Headline: *"Lost something on campus?"*
  - Subtitle: *"Let's help you find it."*
  - Supporting text: *"Search for your belongings or help someone recover an item you've found."*
  - Prominent search bar with instant directory query routing.
  - Clear dual actions: *"Find an Item"* and *"Report Lost"*.
- **Recently Found Items**: Clean cards showcasing recently turned-in campus items with category icon badges, building location, date, and quick actions.
- **How It Works**: 3-step simple visual walkthrough for students.

### 2. Item Directory (`DirectoryView.tsx`)
- Clean responsive card grid with soft borders and subtle hover lift.
- Single search input with clear button.
- Compact status pill filter: *All*, *Lost*, *Found*, *Recovered*.
- Expandable **Filters** drawer with Category, Campus Location, Colour, and Date Sort.

### 3. Smart Item Matcher (`MatchEngineView.tsx`)
- Bidirectional matching: compare any Lost item against Found items, or any Found item against Lost items.
- Animated circular score gauge with friendly match indicators:
  - **Strong match** ($\ge 75\%$)
  - **Possible match** ($\ge 50\%$)
  - **Moderate match** ($\ge 30\%$)
  - **Low match** ($< 30\%$)
- Expandable *"Why this matches"* section showing 5 component score bars and specific feature notes.

### 4. Report Submission Forms (`ReportFormModal.tsx`)
- **Required fields first**: Item Title, Category, Colour, Campus Location, Date, and Description.
- **Expandable Optional Details**: Brand/Model, Specific Room/Desk, Distinctive Stickers/Marks, Confidential Verification Challenge, and Contact Information.

### 5. Private Ownership Verification (`VerificationModal.tsx`)
- Confidential challenge-response check to confirm legal ownership before items are handed over.
- Private answers are never exposed in public directory listings.

---

## 🧪 Automated Tests

Run `npm test` to execute the automated Vitest suite:
```
 ✓ src/services/matcher.test.ts (9 tests) 49ms
   ✓ identifies strong matches with high similarity scores and high confidence
   ✓ penalizes incompatible categories drastically down to near zero or low score
   ✓ properly penalizes distinct colour and distant location contradictions
   ✓ handles missing fields without awarding full credit and displays appropriate warnings
   ✓ strictly excludes returned/resolved items from active candidate matching pool
   ✓ gracefully handles empty datasets without exceptions
   ✓ guarantees all component and final scores remain strictly between 0 and 100
   ✓ correctly ranks candidate matches in descending score order with deterministic tie-breaking
   ✓ safely evaluates invalid or unparseable dates without throwing errors
```

---

## 📦 Production Build

- **Status**: Production build verified clean (`tsc && vite build` completed with 0 errors).
- **Bundle**: Gzipped HTML (0.67 kB), CSS (6.45 kB), JS (109.08 kB).
