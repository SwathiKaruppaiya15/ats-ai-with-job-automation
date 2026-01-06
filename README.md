# ATS AI - Job Automation Platform

A modern, production-ready React application for Applicant Tracking System (ATS) with AI-powered job-resume matching capabilities.

## Features

- 🔐 **Authentication**: Login and registration with protected routes
- 📊 **Dashboard**: Overview with key metrics and recent activity
- 📄 **Resume Upload**: Drag-and-drop file upload with validation
- 💼 **Job Upload**: Create job postings with skills and requirements
- 🎯 **Matching Results**: View candidate-resume matches with color-coded scores
- 👥 **Admin Dashboard**: Platform management and analytics
- 🎨 **Modern UI**: Glassmorphism design with smooth animations
- 📱 **Responsive**: Works seamlessly on all devices

## Tech Stack

- **React 19** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Vite** - Build tool

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Sidebar.jsx
│   └── Navbar.jsx
├── layouts/          # Layout components
│   └── DashboardLayout.jsx
├── pages/            # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── ResumeUpload.jsx
│   ├── JobUpload.jsx
│   ├── Matches.jsx
│   └── Admin.jsx
├── services/         # API service layer
│   └── api.js
└── utils/            # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## API Integration

The application includes placeholder API functions in `src/services/api.js`. To connect to a backend:

1. Update `VITE_API_BASE_URL` in your `.env` file
2. The API service includes:
   - Authentication endpoints (login, register, logout)
   - Resume management endpoints
   - Job management endpoints
   - Matching endpoints
   - Admin endpoints

All API calls use axios with interceptors for:
- Automatic token injection
- Error handling
- Unauthorized redirects

## Features in Detail

### Authentication
- Protected routes that require authentication
- Automatic redirect to login for unauthenticated users
- Token-based authentication with localStorage

### Dashboard
- Real-time metrics cards
- Recent activity feed
- Smooth animations and hover effects

### Resume Upload
- Drag-and-drop interface
- File type validation (PDF, DOCX)
- File size validation (max 10MB)
- Upload progress indicator
- Success/error states

### Job Upload
- Multi-field form with validation
- Dynamic skills input (press Enter to add)
- Experience level selection
- Rich text description

### Matching Results
- Sortable table with match scores
- Color-coded match percentages:
  - Green: 85%+
  - Yellow: 70-84%
  - Red: <70%
- Detailed match view modal
- Candidate information display

### Admin Dashboard
- Platform-wide statistics
- Recent activity timeline
- User management interface

## Customization

### Styling
The app uses Tailwind CSS with custom utilities. Modify `tailwind.config.js` to customize:
- Colors
- Spacing
- Typography
- Animations

### API Configuration
All API endpoints are centralized in `src/services/api.js`. Modify this file to:
- Add new endpoints
- Change request/response handling
- Add custom interceptors

## Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## License

MIT
