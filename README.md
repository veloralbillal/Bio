# 🌟 Billal Hossen | Gravatar Digital Profile & Crypto Hub

![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.1-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![GitHub Pages Ready](https://img.shields.io/badge/GitHub_Pages-Compatible-22C55E?style=for-the-badge&logo=github&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)

> A high-performance, mobile-first Gravatar Digital Identity Card, Portfolio Showcase, Verified Social Network Hub, Crypto Payment Gateway (BTC, LTC, ETH, USDT, SOL), and Admin Analytics Control Panel built with React 19 and Tailwind CSS v4.

---

## 🔗 Live Preview & Demo

- **Live GitHub Pages URL**: `https://<your-username>.github.io/<repository-name>/`
- **Crypto Payment Portal**: `https://<your-username>.github.io/<repository-name>/#crypto-pay`
- **Admin Panel Access**: `https://<your-username>.github.io/<repository-name>/#admin`

---

## ✨ Key Features

- **🌐 Verified Gravatar Identity Card**: Seamless integration displaying Gravatar profile, location badges, job titles, bio, and custom avatar customization.
- **⚡ Crypto & Payment Portal (BTC, LTC, ETH, USDT, SOL)**: Non-custodial crypto wallet manager with instant copy address buttons and dynamic QR Code generation for 5+ networks.
- **📊 Realtime Analytics & Admin Control Engine**: Auto-polling live dashboard tracking visitor page views, device metrics, link clicks, and contact inbox messages.
- **📱 Mobile-First Responsive Design**: 100% fluid, responsive grid and flex layouts with touch-friendly controls, dark/light mode toggle, and zero horizontal scrolling bugs.
- **🛡️ Graceful API & Offline Fallbacks**: Built-in `localStorage` persistence and React `ErrorBoundary` ensuring 0% white-screen crashes on static hosting like GitHub Pages.
- **🚀 Ultra-Fast Vite & Tailwind CSS v4 Engine**: Blazing fast bundle size and smooth micro-animations powered by standard modern web primitives.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Lucide React Icons, Motion (Framer Motion)
- **Styling**: Tailwind CSS v4, PostCSS
- **Build Tool**: Vite 6 (Configured with relative `./` base path for GitHub Pages)
- **Backend Sync**: Express Node API (local dev/server) with automatic `localStorage` fallback for static sites
- **Deployment**: GitHub Pages / Cloud Run / Vercel

---

## 🚀 GitHub Pages Deployment Workflow

Deploying this app to **GitHub Pages** is straightforward! Follow these step-by-step commands:

### Method 1: Automated Deploy via `gh-pages` Package

1. **Install `gh-pages` helper package**:
   ```bash
   npm install gh-pages --save-dev
   ```

2. **Add Deployment Scripts to `package.json`**:
   Ensure your `package.json` contains:
   ```json
   "scripts": {
     "dev": "vite --port=3000 --host=0.0.0.0",
     "build": "vite build",
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Gravatar profile & crypto hub"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

4. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```
   > 💡 Your site will automatically build and publish to `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`!

---

### Method 2: Deploy via GitHub Actions Workflow

Create a file named `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Application
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 💻 Local Development Setup

To run the project locally on your machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Built with ❤️ by **Billal Hossen**.
