# Distillery Management Application

## Overview

This is a comprehensive distillery management application built with a modern full-stack architecture. The application provides tools for alcohol dilution calculations, OIML temperature corrections, distillation operation logging, tank management, and component mixing calculations. The interface is designed in Arabic (RTL layout) for a distillery operation environment.

## System Architecture

The application follows a **monorepo structure** with clear separation between client, server, and shared components:

- **Frontend**: React 18 with TypeScript using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Radix UI components with Tailwind CSS and shadcn/ui
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for frontend, esbuild for backend bundling

## Key Components

### Frontend Architecture
- **React Router**: wouter for lightweight client-side routing
- **UI Components**: Comprehensive shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React icon library
- **RTL Support**: Right-to-left layout for Arabic interface

### Backend Architecture
- **API Server**: RESTful Express.js server with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL (Neon serverless)
- **Data Storage**: Abstracted storage interface with database implementation
- **Development**: Hot reload with tsx and Vite middleware integration
- **Production**: Compiled with esbuild for optimal performance

### Database Schema
Two main entities managed through Drizzle ORM:
- **Distillation Operations**: Records of distillation processes with operator details, tower types, volumes, and alcohol content measurements
- **Mixing Calculations**: Saved calculations for component mixing with volumes and final alcohol content

## Data Flow

1. **Client Requests**: React components use TanStack Query for API calls
2. **API Layer**: Express routes handle validation using Zod schemas
3. **Storage Layer**: Abstracted storage interface allows for different implementations
4. **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
5. **Response**: JSON responses with proper error handling and logging

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection with WebSocket support
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration tools
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form & @hookform/resolvers**: Form handling with validation
- **zod**: Runtime type validation and schema definition

### UI Dependencies
- **@radix-ui/***: Comprehensive primitive component library
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Modern icon library
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional CSS class utilities

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Type safety across the entire application
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production builds

## Deployment Strategy

### Development Environment
- **Local Development**: Uses tsx with hot reload for backend and Vite dev server for frontend
- **Database**: Connects to remote PostgreSQL instance via DATABASE_URL
- **Port Configuration**: Backend runs on port 5000, with frontend proxy

### Production Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database Migrations**: Drizzle Kit handles schema migrations
4. **Deployment**: Configured for Replit autoscale deployment

### Environment Configuration
- **Development**: NODE_ENV=development with Vite middleware
- **Production**: NODE_ENV=production with static file serving
- **Database**: Requires DATABASE_URL environment variable
- **Replit Integration**: Special handling for Replit environment with cartographer plugin

## PWA Features

The application now includes full Progressive Web App (PWA) support:

### PWA Capabilities
- **Installable**: Users can install the app on their devices through browser prompts
- **Offline Functionality**: Service worker caches API responses and static assets for offline use
- **App-like Experience**: Standalone display mode with custom theme colors
- **Arabic RTL Support**: Manifest configured for right-to-left language support
- **Install Prompts**: Smart install prompts appear when installation is available
- **Offline Indicators**: Visual feedback for connection status

### PWA Components
- **Manifest**: `/public/manifest.json` with Arabic metadata and app configuration
- **Service Worker**: Advanced caching strategies for offline functionality
- **Install Prompt**: Interactive component for easy app installation
- **Offline Indicator**: Real-time connection status display
- **App Icons**: SVG-based scalable icons for various device sizes

### Caching Strategy
- **Cache-first**: Static assets served from cache when available
- **Network-first**: API requests attempt network then fallback to cache
- **Runtime caching**: Successful responses cached for offline access

## Changelog

```
Changelog:
- June 22, 2025. Initial setup with distillation management features
- June 22, 2025. Updated interface with EGYBEV branding and shift-based operations
- June 22, 2025. Added PWA support with offline functionality and install prompts
- June 24, 2025. Updated OIML calculations using official reference table for precise accuracy
- June 24, 2025. Added alcohol concentration calculator with tabbed interface
- June 24, 2025. Added comprehensive alcohol conversion cheat sheet with tooltips and reference tables
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```