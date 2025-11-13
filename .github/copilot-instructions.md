# 24Toolkit AI Coding Conventions

This document provides AI-native instructions for contributing to the 24Toolkit codebase.

## Big Picture Architecture

24Toolkit is a web-based toolkit built with **React (Vite)** and **TypeScript**. It provides a collection of over 80+ free, fast, and AI-powered tools. The application is designed as a client-side single-page application (SPA), with serverless functions for AI-related features.   

- **Frontend**: The frontend is built with React and TypeScript, using Vite for fast development and builds. Components are styled with **Tailwind CSS** and **shadcn/ui**.
- **AI Features**: AI-powered tools leverage the **GitHub Models API** via serverless functions located in the `api/_spark/` directory. These functions are deployed on **Vercel**.
- **Client-Side Tools**: Most tools are implemented as client-side React components, ensuring user data privacy by processing data in the browser.

## Developer Workflow

### Setup and Development

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**: Create a `.env` file from `.env.example` and add your GitHub token for AI features.
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5000`.

### Building and Deployment

- **Build for Production**:
  ```bash
  npm run build
  ```
- **Deployment**: The project is deployed on **Vercel**. Configuration can be found in `vercel.json`.

## Project Conventions

### Directory Structure

- `src/pages/tools/`: Each tool is a separate React component in this directory. When adding a new tool, create a new file here (e.g., `NewTool.tsx`).
- `src/components/`: Shared React components. UI components are located in `src/components/ui/`.
- `api/_spark/`: Serverless functions for AI features.
- `public/`: Static assets like `sitemap.xml` and `robots.txt`.

### Adding a New Tool

1.  Create a new component in `src/pages/tools/`, for example, `MyNewTool.tsx`.
2.  The component should be a self-contained tool with its own UI and logic.
3.  Use shadcn/ui components from `src/components/ui/` for a consistent look and feel.
4.  Add the new tool to the `tools-data.ts` file in `src/lib/` to make it appear in the tool list.

### AI Integration

- AI-powered tools use the `useChat` hook from the `ai/react` library to interact with the backend.
- Serverless functions in `api/_spark/` handle requests to the GitHub Models API.
- When creating a new AI tool, follow the pattern in existing components like `AITranslator.tsx`.

## Key Files

- `vite.config.ts`: Vite configuration.
- `tailwind.config.js`: Tailwind CSS configuration.
- `src/lib/tools-data.ts`: The list of all tools available in the application.
- `src/App.tsx`: Main application component with routing.
- `vercel.json`: Vercel deployment configuration.
