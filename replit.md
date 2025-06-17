# TalentTap - Applicant Tracking System

## Overview

TalentTap is a modern web-based Applicant Tracking System (ATS) built to streamline the hiring process for organizations. The application provides a comprehensive platform for managing job postings, candidates, applications, interviews, and hiring workflows through an intuitive dashboard interface.

## System Architecture

The application follows a full-stack architecture with clear separation between frontend and backend components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with Material Design-inspired color system
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **Validation**: Zod schemas shared between frontend and backend

## Key Components

### Database Schema
The application uses PostgreSQL with the following core entities:
- **Users**: Authentication and user profile management (required for Replit Auth)
- **Jobs**: Job posting management with status tracking
- **Candidates**: Candidate profiles and contact information
- **Applications**: Links candidates to jobs with application status
- **Interviews**: Interview scheduling and management
- **Notes**: Activity tracking and notes system
- **Sessions**: Session storage (required for Replit Auth)

### Authentication System
- Integrated with Replit's OpenID Connect authentication
- Role-based access control (recruiter, hiring_manager, admin)
- Secure session management with PostgreSQL storage
- Mandatory user and session tables for Replit compatibility

### API Design
RESTful API structure with the following endpoints:
- `/api/auth/*` - Authentication and user management
- `/api/dashboard/*` - Dashboard metrics and analytics
- `/api/jobs/*` - Job posting CRUD operations
- `/api/candidates/*` - Candidate management with search
- `/api/applications/*` - Application tracking and status updates
- `/api/interviews/*` - Interview scheduling and management

### User Interface
- Material Design-inspired interface with consistent theming
- Responsive design for desktop and mobile devices
- Dashboard with key metrics and recent activity
- Kanban-style pipeline view for application tracking
- Form-based interfaces for data entry with validation

## Data Flow

1. **Authentication Flow**: Users authenticate through Replit Auth, creating sessions stored in PostgreSQL
2. **Dashboard Data**: Aggregated metrics pulled from multiple database tables
3. **CRUD Operations**: Standard create/read/update/delete flows for all entities
4. **Real-time Updates**: Client-side state management with optimistic updates
5. **Search Functionality**: Server-side search implementation for candidates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing library
- **zod**: Runtime type validation and schema definition

### UI Dependencies
- **@radix-ui/***: Unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **react-hook-form**: Performant form library

### Authentication Dependencies
- **openid-client**: OpenID Connect client implementation
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- Replit-optimized development setup with hot module replacement
- PostgreSQL module integration for local development
- Environment variable configuration for database connectivity

### Production Deployment
- **Build Process**: Vite builds the frontend, esbuild bundles the backend
- **Deployment Target**: Replit's autoscale infrastructure
- **Database**: External PostgreSQL instance (configurable via DATABASE_URL)
- **Static Assets**: Served from Express with Vite-built frontend

### Configuration
- Environment variables for database connection and session secrets
- Modular configuration supporting both development and production modes
- Database migrations managed through Drizzle Kit

## Changelog

Changelog:
- June 17, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.