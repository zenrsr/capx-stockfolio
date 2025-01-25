# **Capx Simple Portfolio Tracker**

## 📈 **Project Overview**

Capx Simple Portfolio Tracker is a modern, feature-rich web application designed to help users track and manage their stock investments with ease and precision. Built using cutting-edge web technologies, this application provides real-time stock data, historical performance tracking, and intuitive portfolio management.

---

## 🚀 **Features**

- **Stock Portfolio Management**
  - Add, edit, and remove stocks from your portfolio.
  - Track current holdings and investment performance.
  - Real-time stock price updates.
  - Historical price and performance data visualization.

- **User-Friendly Interface**
  - Responsive design using Tailwind CSS.
  - Dark and light mode support.
  - Intuitive modal-based interactions.
  - Smooth animations with Framer Motion.

- **Data Visualization**
  - Interactive stock charts.
  - Performance metrics and insights.
  - Comprehensive stock information display.

---

## 🛠 **Tech Stack**

- **Frontend**
  - Next.js 15
  - React
  - TypeScript
  - Tailwind CSS
  - Radix UI Components
  - Framer Motion
  - Shadcn/ui

- **Backend**
  - Next.js API Routes
  - Axios for API interactions
  - Date-fns for date manipulation

- **State Management**
  - React Hooks
  - Custom hooks for data fetching and management

---

## 📦 **Prerequisites**

- Node.js (v18 or later)
- npm, yarn, pnpm, or bun

---

## 🔧 **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/zenrsr/capx-stockfolio.git
   ```

2. Navigate to the project directory:
   ```bash
   cd capx-simple-portfolio-tracker
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`.
   - Fill in the required API keys and configuration.

---

## 🚀 **Running the Application**

### **Development Mode**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### **Production Build**
```bash
npm run build
npm start
# or equivalent with yarn/pnpm/bun
```

---

## 📂 **Project Structure**

```
capx-simple-portfolio-tracker/
├── src/
│   ├── app/             # Next.js app router
│   ├── components/      # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── styles/          # Global styles
├── public/              # Static assets
├── next.config.ts       # Next.js configuration
└── tailwind.config.ts   # Tailwind CSS configuration
```

---

## 🔍 **Key Components**

- **`useHistoricalData`**: Custom hook for fetching and managing stock historical data.
- **`add-edit-stock-modal.tsx`**: Modal for adding and editing stock entries.
- **API Routes**: Backend endpoints for stock data management.

---

## 🤝 **Contributing**

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request.

---

## 📄 **License**

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 🎉 **Acknowledgments**

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Shadcn/ui](https://ui.shadcn.com/)

---

**Happy Portfolio Tracking! 📊**

---

Feel free to customize this README further to match your project’s specifics. Let me know if you need any additional help! 🚀
