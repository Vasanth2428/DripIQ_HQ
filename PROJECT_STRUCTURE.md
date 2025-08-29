# 📁 AquaSense Project Structure

## 🏗️ **Overview**

This document provides a comprehensive overview of the AquaSense project structure, explaining the purpose and organization of each directory and file.

```
aquasense/
├── 📁 api/                          # Serverless API functions
│   ├── ai-predictions.js            # AI prediction algorithms
│   └── maintenance-ai.js            # Maintenance analysis AI
├── 📁 public/                       # Static assets
│   └── favicon.ico                  # Application favicon
├── 📁 scripts/                      # Automation scripts
│   ├── setup.sh                     # Unix/Linux setup script
│   └── deploy.ps1                   # Windows deployment script
├── 📁 src/                          # Source code
│   ├── 📁 assets/                   # Static assets (images, etc.)
│   │   ├── hero-dashboard.jpg       # Dashboard hero image
│   │   ├── chart-flow.jpg          # Flow chart placeholder
│   │   └── chart-pressure.jpg      # Pressure chart placeholder
│   ├── 📁 components/               # React components
│   │   ├── 📁 ui/                   # Base UI components (shadcn/ui)
│   │   │   ├── button.tsx           # Button component
│   │   │   ├── card.tsx             # Card component
│   │   │   ├── input.tsx            # Input component
│   │   │   ├── select.tsx           # Select component
│   │   │   ├── badge.tsx            # Badge component
│   │   │   ├── progress.tsx         # Progress bar component
│   │   │   ├── tabs.tsx             # Tabs component
│   │   │   ├── switch.tsx           # Switch component
│   │   │   ├── checkbox.tsx         # Checkbox component
│   │   │   ├── calendar.tsx         # Calendar component
│   │   │   ├── date-picker.tsx      # Date picker component
│   │   │   └── ...                  # Other UI components
│   │   ├── 📁 views/                # Page-level components
│   │   │   ├── OverviewHub.tsx      # Main dashboard view
│   │   │   ├── PredictiveAnalytics.tsx # AI analytics dashboard
│   │   │   ├── ScheduleView.tsx     # Maintenance scheduling
│   │   │   ├── ReportsView.tsx      # Reports and analytics
│   │   │   ├── FountainDetail.tsx   # Individual fountain details
│   │   │   └── TechnicianDashboard.tsx # Mobile technician interface
│   │   ├── AIInsights.tsx           # AI insights component
│   │   ├── WeatherIntegration.tsx   # Weather data integration
│   │   ├── NotificationCenter.tsx   # Notification system
│   │   ├── MLDataExport.tsx         # ML data export functionality
│   │   ├── InteractiveMap.tsx       # Map component (existing)
│   │   ├── KPICard.tsx             # KPI display cards
│   │   └── Sidebar.tsx             # Navigation sidebar
│   ├── 📁 hooks/                    # Custom React hooks
│   │   ├── useSupabase.ts          # Supabase data hooks
│   │   ├── useAI.ts                # AI prediction hooks
│   │   ├── use-mobile.tsx          # Mobile detection hook
│   │   └── use-toast.ts            # Toast notification hook
│   ├── 📁 integrations/            # External service integrations
│   │   └── 📁 supabase/            # Supabase configuration
│   │       ├── client.ts           # Supabase client setup
│   │       └── types.ts            # Generated TypeScript types
│   ├── 📁 lib/                     # Utility libraries
│   │   └── utils.ts                # Common utility functions
│   ├── 📁 pages/                   # Page components
│   │   ├── Index.tsx               # Main application page
│   │   └── NotFound.tsx            # 404 error page
│   ├── App.tsx                     # Root application component
│   ├── main.tsx                    # Application entry point
│   └── index.css                   # Global styles
├── 📁 supabase/                    # Supabase configuration
│   ├── 📁 migrations/              # Database migrations
│   │   └── 001_initial_schema.sql  # Initial database schema
│   ├── seed.sql                    # Sample data for development
│   └── config.toml                 # Supabase configuration
├── 📄 .env.example                 # Environment variables template
├── 📄 .gitignore                   # Git ignore rules
├── 📄 DEPLOYMENT.md                # Deployment instructions
├── 📄 MAP_INTEGRATION.md           # Map integration plan
├── 📄 PROJECT_STRUCTURE.md         # This file
├── 📄 README.md                    # Project documentation
├── 📄 REQUIREMENTS.md              # Detailed requirements
├── 📄 SECURITY_AUDIT.md            # Security audit report
├── 📄 TASKS.md                     # Task management and roadmap
├── 📄 eslint.config.js             # ESLint configuration
├── 📄 index.html                   # HTML template
├── 📄 package.json                 # Node.js dependencies and scripts
├── 📄 postcss.config.js            # PostCSS configuration
├── 📄 tailwind.config.ts           # Tailwind CSS configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 tsconfig.node.json           # TypeScript config for Node.js
├── 📄 vercel.json                  # Vercel deployment configuration
└── 📄 vite.config.ts               # Vite build configuration
```

---

## 📂 **Directory Breakdown**

### **`/api` - Serverless Functions**
Contains Vercel serverless functions for AI processing and backend logic.

- **`ai-predictions.js`**: Advanced AI algorithms for predicting maintenance needs
- **`maintenance-ai.js`**: Maintenance analysis and optimization algorithms

### **`/src/components` - React Components**

#### **`/ui` - Base UI Components**
Reusable UI components built with shadcn/ui and Tailwind CSS.
- Follows atomic design principles
- Fully accessible (WCAG 2.1 AA compliant)
- Consistent design system

#### **`/views` - Page Components**
High-level page components that compose multiple UI components.
- **`OverviewHub.tsx`**: Main dashboard with KPIs and real-time data
- **`PredictiveAnalytics.tsx`**: AI-powered analytics and predictions
- **`ScheduleView.tsx`**: Maintenance scheduling and work orders
- **`FountainDetail.tsx`**: Detailed view of individual fountains
- **`TechnicianDashboard.tsx`**: Mobile-optimized technician interface

#### **Feature Components**
- **`AIInsights.tsx`**: AI prediction and analysis display
- **`WeatherIntegration.tsx`**: Weather data and impact analysis
- **`NotificationCenter.tsx`**: Real-time notification system
- **`MLDataExport.tsx`**: Machine learning data export functionality

### **`/src/hooks` - Custom Hooks**
Reusable React hooks for data fetching and state management.

- **`useSupabase.ts`**: Database operations and real-time subscriptions
- **`useAI.ts`**: AI prediction and analysis hooks
- **`use-mobile.tsx`**: Mobile device detection
- **`use-toast.ts`**: Toast notification management

### **`/src/integrations` - External Services**
Configuration and utilities for external service integrations.

- **`/supabase`**: Supabase client configuration and TypeScript types

### **`/supabase` - Database Configuration**
Database schema, migrations, and configuration files.

- **`/migrations`**: SQL migration files for database schema changes
- **`seed.sql`**: Sample data for development and testing
- **`config.toml`**: Supabase project configuration

---

## 🔧 **Configuration Files**

### **Build & Development**
- **`vite.config.ts`**: Vite build tool configuration
- **`tsconfig.json`**: TypeScript compiler configuration
- **`tailwind.config.ts`**: Tailwind CSS customization
- **`postcss.config.js`**: PostCSS processing configuration

### **Code Quality**
- **`eslint.config.js`**: ESLint linting rules
- **`.gitignore`**: Git version control ignore rules

### **Deployment**
- **`vercel.json`**: Vercel deployment and routing configuration
- **`package.json`**: Node.js dependencies and npm scripts

---

## 📋 **File Naming Conventions**

### **Components**
- **PascalCase** for component files: `FountainDetail.tsx`
- **camelCase** for hooks: `useSupabase.ts`
- **kebab-case** for UI components: `date-picker.tsx`

### **Directories**
- **lowercase** for utility directories: `lib/`, `hooks/`
- **PascalCase** for component directories when needed

### **Constants & Types**
- **UPPER_SNAKE_CASE** for constants: `API_ENDPOINTS`
- **PascalCase** for TypeScript interfaces: `FountainData`

---

## 🎯 **Architecture Patterns**

### **Component Architecture**
```
Page Component (OverviewHub)
├── Feature Components (AIInsights, WeatherIntegration)
├── UI Components (Card, Button, Badge)
└── Hooks (useSupabase, useAI)
```

### **Data Flow**
```
Supabase Database
├── Real-time Subscriptions → React Components
├── API Calls → Custom Hooks → Components
└── AI Functions → Predictions → UI Updates
```

### **State Management**
- **React Query**: Server state and caching
- **React Context**: Global application state
- **Local State**: Component-specific state with useState/useReducer

---

## 🔄 **Development Workflow**

### **Adding New Features**
1. Create feature branch: `git checkout -b feature/new-feature`
2. Add components in appropriate directories
3. Create or update hooks for data management
4. Add tests for new functionality
5. Update documentation
6. Submit pull request

### **Component Development**
1. Start with UI component in `/ui` if needed
2. Create feature component in `/components`
3. Add to page component in `/views`
4. Create custom hooks for data logic
5. Add TypeScript types and interfaces

### **Database Changes**
1. Create migration file in `/supabase/migrations`
2. Update TypeScript types: `npm run supabase:types`
3. Update seed data if needed
4. Test migration locally: `npm run supabase:reset`

---

## 📊 **Code Organization Principles**

### **Separation of Concerns**
- **Components**: UI rendering and user interaction
- **Hooks**: Data fetching and business logic
- **Utils**: Pure functions and utilities
- **Types**: TypeScript interfaces and type definitions

### **Reusability**
- **UI Components**: Highly reusable, prop-driven
- **Feature Components**: Moderately reusable, context-aware
- **Page Components**: Specific to routes, compose other components

### **Maintainability**
- **Clear naming**: Self-documenting code
- **Small functions**: Single responsibility principle
- **Type safety**: Comprehensive TypeScript usage
- **Documentation**: Inline comments and README files

---

## 🧪 **Testing Structure**

### **Test Organization**
```
src/
├── components/
│   ├── Component.tsx
│   └── __tests__/
│       ├── Component.test.tsx
│       └── Component.integration.test.tsx
├── hooks/
│   ├── useHook.ts
│   └── __tests__/
│       └── useHook.test.ts
└── utils/
    ├── utility.ts
    └── __tests__/
        └── utility.test.ts
```

### **Test Types**
- **Unit Tests**: Individual components and functions
- **Integration Tests**: Component interactions and data flow
- **E2E Tests**: Full user workflows and scenarios

---

## 📈 **Performance Considerations**

### **Code Splitting**
- **Route-based**: Lazy load page components
- **Feature-based**: Dynamic imports for large features
- **Vendor splitting**: Separate chunks for third-party libraries

### **Bundle Optimization**
- **Tree shaking**: Remove unused code
- **Minification**: Compress production builds
- **Asset optimization**: Optimize images and fonts

### **Runtime Performance**
- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Optimize expensive calculations
- **Virtual scrolling**: Handle large data sets efficiently

---

This structure provides a solid foundation for the AquaSense application, ensuring maintainability, scalability, and developer productivity.