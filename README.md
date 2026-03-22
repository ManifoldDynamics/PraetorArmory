# Prætor Armory Intelligence Hub

A locally hosted, privacy-first management system for tracking firearms, NFA items, ammunition stock, and range excursions. 

## Overview
Built to replace brittle spreadsheets and web-scraping services, the Armory operates entirely on your local network. It utilizes an embedded SQLite database to ensure your inventory, round counts, and tax stamps remain 100% private and never touch the cloud.

### Core Modules
- **Asset Ledger**: Track firearms, optics, and suppressors.
- **Munitions Logistics**: Monitor specific calibers, grains, and stock quantities visually.
- **NFA Form Tracker**: Live "days pending" calculator for Form 1 and Form 4 tax stamps, bypassing the need for unreliable automated ATF portal scrapers.
- **Transactional Range Logs**: Record range trips to automatically log maintenance histories, instantly boost lifetime round counts on assigned assets, and accurately deduct expended ammunition from your stockpile simultaneously.

## Tech Stack
- **Framework:** Next.js 15 (React App Router)
- **Database:** Prisma ORM + local SQLite (`better-sqlite3`)
- **Iconography:** Lucide-React
- **Styling:** Custom CSS Base (Matte Obsidian)

## Quickstart

### 1. Requirements
Ensure you have Node.js installed on your system.

### 2. Setup
Clone the repository, then navigate to the project directory and install the necessary dependencies:

```bash
npm install
```

### 3. Database Initialization
Initialize your local SQLite ledger:

```bash
npx prisma db push
npx prisma generate
```
*(Note: Your database is stored locally in `dev.db`. This file is explicitly gitignored for your privacy.)*

### 4. Running the Intelligence Hub
Start the local development server:

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser. 
