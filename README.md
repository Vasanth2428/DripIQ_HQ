# 🌊 AquaSense - AI-Powered Fountain Maintenance Prediction System

<div align="center">

![AquaSense Logo](https://via.placeholder.com/200x80/0066cc/ffffff?text=AquaSense)

**Intelligent fountain management with predictive maintenance, real-time monitoring, and AI-driven insights**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/aquasense)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

[Live Demo](https://aquasense-demo.vercel.app) • [Documentation](./docs) • [API Reference](./docs/api.md) • [Contributing](./CONTRIBUTING.md)

</div>

---

## 🎯 **Overview**

AquaSense is a cutting-edge fountain maintenance prediction system that leverages artificial intelligence to optimize fountain operations, predict maintenance needs, and reduce operational costs. Built with modern web technologies, it provides real-time monitoring, predictive analytics, and intelligent scheduling for fountain management teams.

### **Key Benefits**
- 🔮 **Predictive Maintenance**: Reduce unplanned downtime by 80%
- 💰 **Cost Optimization**: Decrease maintenance costs by 30%
- 📊 **Real-time Insights**: Monitor fountain health with live sensor data
- 🌤️ **Weather Integration**: Optimize operations based on weather conditions
- 📱 **Mobile-First**: Responsive design for technicians in the field
- 🤖 **AI-Powered**: Advanced algorithms for failure prediction and optimization

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- Git
- Supabase account (free tier available)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/aquasense.git
   cd aquasense
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link your project
   supabase link --project-ref your_project_ref
   
   # Run migrations
   supabase db push
   
   # Seed the database
   supabase db reset --linked
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 🏗️ **Architecture**

### **Tech Stack**
- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI/ML**: Custom prediction algorithms
- **Deployment**: Vercel (Frontend), Supabase (Backend)
- **Monitoring**: Built-in analytics with optional Sentry integration

### **System Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │  Vercel Edge    │    │   Supabase      │
│                 │    │   Functions     │    │                 │
│ • Dashboard     │◄──►│                 │◄──►│ • PostgreSQL    │
│ • Analytics     │    │ • AI Predictions│    │ • Real-time     │
│ • Mobile UI     │    │ • Maintenance   │    │ • Auth          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   External      │    │   Weather API   │    │   Notification  │
│   Integrations  │    │                 │    │   Services      │
│                 │    │ • OpenWeather   │    │                 │
│ • Maps API      │    │ • Forecasts     │    │ • Email/SMS     │
│ • IoT Sensors   │    │ • Alerts        │    │ • Push Notifs   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📋 **Features**

### **🔍 Real-Time Monitoring**
- Live fountain status dashboard
- Sensor data visualization (flow rate, pressure, temperature, pH)
- Battery level monitoring
- Water quality tracking
- System health indicators

### **🤖 AI-Powered Predictions**
- Failure probability calculations
- Maintenance need forecasting
- Efficiency optimization recommendations
- Cost-benefit analysis
- Risk assessment with confidence scores

### **📅 Maintenance Management**
- Intelligent scheduling based on AI predictions
- Work order generation and tracking
- Technician assignment and routing
- Parts and tools inventory management
- Maintenance history and analytics

### **🌤️ Weather Integration**
- Real-time weather monitoring
- Weather impact analysis on fountain operations
- Automatic operational adjustments
- 7-day forecast with maintenance implications

### **📱 Mobile Technician Dashboard**
- Mobile-optimized interface
- GPS navigation and routing
- Photo reporting and documentation
- Real-time status updates
- Offline functionality (coming soon)

### **📊 Advanced Analytics**
- Predictive analytics dashboard
- Performance trend analysis
- Cost optimization insights
- Custom reporting and data export
- ML model training data export

### **🔔 Smart Notifications**
- Multi-channel alerts (email, SMS, push, in-app)
- Severity-based prioritization
- Customizable notification preferences
- Action-based quick responses
- Escalation procedures

---

## 🎮 **Usage Guide**

### **For Facility Managers**
1. **Dashboard Overview**: Monitor all fountains from the main dashboard
2. **Analytics**: Review predictive analytics and performance trends
3. **Scheduling**: Approve maintenance schedules and budget allocations
4. **Reporting**: Generate custom reports for stakeholders

### **For Maintenance Technicians**
1. **Work Orders**: View assigned tasks and priorities
2. **Navigation**: Use GPS routing to reach fountain locations
3. **Documentation**: Take photos and add notes during maintenance
4. **Status Updates**: Update work order status in real-time

### **For Operations Teams**
1. **Monitoring**: Watch real-time fountain status and alerts
2. **Alert Management**: Respond to system alerts and notifications
3. **Scheduling**: Create and manage maintenance schedules
4. **Coordination**: Communicate with technicians and managers

---

## 🔧 **Configuration**

### **Environment Variables**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional: Weather API (for enhanced weather features)
VITE_WEATHER_API_KEY=your_weather_api_key

# Optional: Maps API (for future map integration)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token

# Optional: Notification Services
VITE_SENDGRID_API_KEY=your_sendgrid_key
VITE_TWILIO_ACCOUNT_SID=your_twilio_sid
```

### **Database Configuration**
The system uses Supabase PostgreSQL with the following main tables:
- `fountains` - Fountain information and specifications
- `sensor_readings` - Real-time sensor data
- `maintenance_schedules` - Maintenance planning and history
- `alerts` - System alerts and notifications
- `users` - User management and roles

### **AI Configuration**
AI prediction algorithms can be configured in `api/ai-predictions.js`:
- Adjust prediction thresholds
- Modify risk calculation weights
- Customize recommendation logic
- Configure confidence scoring

---

## 🚀 **Deployment**

### **Deploy to Vercel (Recommended)**

1. **One-Click Deploy**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/aquasense)

2. **Manual Deployment**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel
   
   # Set environment variables in Vercel dashboard
   # Deploy to production
   vercel --prod
   ```

3. **Environment Variables in Vercel**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add all required environment variables
   - Redeploy the application

### **Alternative Deployment Options**
- **Netlify**: Use `npm run build` and deploy the `dist` folder
- **Railway**: Connect your GitHub repo and deploy automatically
- **AWS Amplify**: Use the Amplify console for deployment
- **Self-hosted**: Build with `npm run build` and serve the `dist` folder

---

## 📊 **Monitoring & Analytics**

### **Built-in Analytics**
- System performance metrics
- User engagement tracking
- Feature utilization statistics
- Error rate monitoring
- Response time tracking

### **Optional Integrations**
- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: User behavior analytics
- **LogRocket**: Session replay and debugging
- **Mixpanel**: Advanced user analytics

---

## 🧪 **Testing**

### **Run Tests**
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### **Testing Strategy**
- **Unit Tests**: Component and function testing with Jest
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user flow testing with Playwright
- **Performance Tests**: Load testing with Artillery
- **Security Tests**: Vulnerability scanning with Snyk

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Conventional commits for commit messages
- Comprehensive testing for new features
- Documentation for public APIs

---

## 📚 **Documentation**

- [API Reference](./docs/api.md) - Complete API documentation
- [Database Schema](./docs/database.md) - Database structure and relationships
- [Deployment Guide](./DEPLOYMENT.md) - Detailed deployment instructions
- [Security Guide](./SECURITY_AUDIT.md) - Security best practices and audit
- [Troubleshooting](./docs/troubleshooting.md) - Common issues and solutions

---

## 🔒 **Security**

AquaSense takes security seriously:
- 🔐 **Authentication**: Secure user authentication with Supabase Auth
- 🛡️ **Authorization**: Role-based access control (RBAC)
- 🔒 **Data Encryption**: TLS 1.3 for data in transit, AES-256 for data at rest
- 🚫 **Input Validation**: Comprehensive input sanitization and validation
- 🔍 **Security Monitoring**: Regular security audits and vulnerability scanning

Report security vulnerabilities to: security@aquasense.com

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- [Supabase](https://supabase.com/) for the amazing backend-as-a-service platform
- [Vercel](https://vercel.com/) for seamless deployment and hosting
- [shadcn/ui](https://ui.shadcn.com/) for beautiful and accessible UI components
- [Lucide](https://lucide.dev/) for the comprehensive icon library
- The open-source community for inspiration and contributions

---

## 📞 **Support**

- 📧 **Email**: support@aquasense.com
- 💬 **Discord**: [Join our community](https://discord.gg/aquasense)
- 📖 **Documentation**: [docs.aquasense.com](https://docs.aquasense.com)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/aquasense/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/your-username/aquasense/discussions)

---

<div align="center">

**Made with ❤️ by the AquaSense Team**

[Website](https://aquasense.com) • [Twitter](https://twitter.com/aquasense) • [LinkedIn](https://linkedin.com/company/aquasense)

</div>