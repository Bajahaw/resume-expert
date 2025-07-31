# Resume Expert

An AI-powered resume analysis and cover letter generator built with React, TypeScript, and Tailwind CSS.

## Features

- **Resume Analysis**: Upload your resume and job description to get an AI-powered compatibility score
- **Keyword Recommendations**: Get specific keywords to include in your resume based on the job requirements
- **Enhancement Tips**: Receive actionable suggestions to improve your resume
- **Cover Letter Generation**: Create personalized cover letters tailored to specific job applications
- **PDF Export**: Download generated cover letters as PDF files
- **Dark/Light Theme**: Toggle between light and dark modes for better user experience

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **PDF Handling**: PDF.js
- **Backend API**: https://ai.radhi.tech

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resume-expert
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## Project Structure

```
src/
├── components/          # React components
│   ├── AnalysisSection.tsx
│   ├── CoverLetterSection.tsx
│   ├── JobDescriptionSection.tsx
│   ├── ResumeSection.tsx
│   └── ThemeToggle.tsx
├── config/             # Configuration files
│   └── api.ts          # API configuration
├── contexts/           # React contexts
│   └── ThemeContext.tsx
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

## API Configuration

The application is configured to use `https://ai.radhi.tech` as the backend API base URL. API endpoints include:

- `/api/analyze` - Resume analysis
- `/api/generate` - Cover letter generation
- `/api/pdf` - PDF generation

## Deployment

The project is configured for automatic deployment to GitHub Pages using GitHub Actions. The deployment workflow runs on pushes to the master branch.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.