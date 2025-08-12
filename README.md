# Flux Lens - Professional Log Monitoring System

A clean, professional log ingestion and querying system.

## Project Setup & Usage

### 1. Prerequisites
- Node.js 18+
- npm 9+
- Docker (optional, for containerized deployment)

### 2. Install Dependencies
```bash
npm install
npm install tailwindcss
cd backend && npm install
```

### 3. Run Locally
- Start the backend:
  ```bash
  cd backend
  npm run dev
  ```
- Start the frontend:
  ```bash
  cd ..
  npm run dev
  ```
- Frontend: http://localhost:8080
- Backend API: http://localhost:4000

### 4. Docker (Full Stack)
Build and run both frontend and backend with Docker Compose:
```bash
docker-compose up --build
```

## 🐳 Docker Setup

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Development with Docker

1. **Start the application**
   ```bash
   # From the project root directory
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:4000

### Production Build

1. **Build the production images**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f
   ```

3. **Stop the application**
   ```bash
   docker-compose down
   ```

### Volumes
- Logs are persisted in `backend/logs.json`
- The backend container automatically restarts if it crashes
- The frontend is served through Nginx for better performance

## 🚀 Features

### Core Functionality
- **Professional Monitoring Dashboard** with dark theme
- **Real-time Log Filtering** with debounced search (300ms)
- **Advanced Multi-Filter Search** (level, message, resourceId, timestamp range, traceId, spanId, commit)
- **Log Ingestion Interface** simulating backend API endpoints
- **Visual Analytics Dashboard** with charts and metrics
- **Color-coded Log Levels** with visual indicators
- **Responsive Design** optimized for desktop monitoring workflows

### Technical Features
- **TypeScript** with comprehensive type definitions
- **Backend API**: Node.js/Express, logs stored in a JSON file (logs.json)
- **Professional Design System** with semantic tokens
- **Component Architecture** with clean separation of concerns
- **Debounced Search** for smooth performance
- **Date/Time Range Filtering** with calendar pickers

## 🛠 Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express, Joi (schema validation), JSON file storage
- **UI Framework**: Tailwind CSS with custom design system
- **Components**: Radix UI primitives (shadcn/ui)
- **Charts**: Recharts for analytics visualization
- **Docker**: Production-ready containerization with multi-stage builds
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Form Handling**: React Hook Form with Zod validation

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── LogDashboard.tsx # Main dashboard orchestrator
│   ├── LogFiltersPanel.tsx # Advanced filtering sidebar
│   ├── LogTable.tsx     # Professional log display
│   ├── LogAnalytics.tsx # Visual analytics dashboard
│   ├── LogIngestionForm.tsx # Log ingestion interface
│   └── LogMetricsCards.tsx # Real-time metrics display
├── services/            # API services
│   └── logApi.ts       # Backend API service connecting to Node.js/Express backend
├── types/              # TypeScript type definitions
│   └── log.ts          # Log-related types
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── pages/              # Page components
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flux-lens
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production
```bash
npm run build
npm run preview  # Preview production build
```

## 📊 Log Schema

The system uses the following log entry structure:

```typescript
interface LogEntry {
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  resourceId: string;
  timestamp: string; // ISO 8601 format
  traceId: string;
  spanId: string;
  commit: string;
  metadata: {
    parentResourceId: string;
  };
}
```

## 🎯 API Simulation

### Simulated Endpoints

**POST /logs** (Log Ingestion)
- Validates log entry format
- Stores in localStorage
- Returns success/error response

**GET /logs** (Query with Filters)
- Supports combinable filters:
  - `level`: Array of log levels
  - `message`: Full-text search (case-insensitive)
  - `resourceId`: Resource identifier filter
  - `timestamp_start/timestamp_end`: Date range filtering
  - `traceId`: Trace identifier filter
  - `spanId`: Span identifier filter
  - `commit`: Commit hash filter
- Returns filtered results in reverse chronological order

## 🎨 Design System

### Color Scheme
- **Primary**: Blue gradient theme
- **Log Levels**:
  - Error: Red (`--log-error`)
  - Warning: Yellow (`--log-warn`)
  - Info: Blue (`--log-info`)
  - Debug: Purple (`--log-debug`)

### Key Design Principles
- **Professional monitoring aesthetic** inspired by Grafana/Datadog
- **Dark theme optimized** for extended monitoring sessions
- **Semantic color tokens** for consistent theming
- **Smooth animations** and transitions
- **Typography hierarchy** for information clarity

## 🔧 Configuration

### Design System Customization
Edit `src/index.css` and `tailwind.config.ts` to customize:
- Color palette and gradients
- Typography scales
- Spacing and shadows
- Animation timings

### Mock Data
The system includes realistic mock log data for demonstration. Data persists in localStorage between sessions.

## 🚀 Deployment

This project can be deployed on any static hosting platform:

- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag & drop the `dist` folder after build
- **AWS S3 + CloudFront**: Upload build files to S3 bucket
- **GitHub Pages**: Use GitHub Actions for automated deployment

## 🧩 Key Components

### LogDashboard
Main orchestrator component managing state and routing between different views (Monitor, Analytics, Ingestion).

### LogFiltersPanel
Advanced filtering sidebar with:
- Debounced text search
- Multi-select log level checkboxes
- Date range pickers
- Real-time filter application

### LogTable
Professional log display with:
- Color-coded log levels
- Responsive design
- Metadata display
- Loading states

### LogAnalytics
Visual analytics dashboard featuring:
- Log level distribution pie chart
- 24-hour activity timeline
- Stacked bar charts for trends
- Top resources by log count

## 🎯 Design Decisions & Trade-offs

### Frontend-Only Architecture
**Decision**: Implement mock API simulation instead of real backend
**Rationale**: Demonstrates full-stack concepts while maintaining simplicity for demo purposes
**Trade-off**: localStorage limitations vs. database persistence

### Component Architecture
**Decision**: Modular component design with clear separation of concerns
**Rationale**: Maintainable, testable, and reusable code structure
**Benefit**: Easy to extend and modify individual features

### Design System Approach
**Decision**: Semantic tokens and custom CSS properties
**Rationale**: Consistent theming and easy customization
**Benefit**: Professional appearance with brand flexibility

### Real-time Filtering
**Decision**: Debounced search with 300ms delay
**Rationale**: Balance between responsiveness and performance
**Benefit**: Smooth user experience without excessive API calls

## 🔮 Future Enhancements

### Backend Implementation
- Node.js + Express API server
- JSON file persistence
- Real HTTP endpoints
- Input validation and error handling

### Advanced Features
- WebSocket real-time updates
- Export functionality (CSV, JSON)
- Log aggregation and grouping
- Advanced query language
- Alerting and notifications

### DevOps & Testing
- Docker containerization
- Unit and integration tests
- CI/CD pipeline
- Performance monitoring
- End-to-end testing

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ for professional log monitoring workflows**