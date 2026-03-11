# OasisBio Technical Documentation

## Project Overview

OasisBio is a cross-era identity system that allows users to create and manage multiple identity versions across different time periods and fictional worlds. It provides a comprehensive platform for building, storing, and displaying digital identities with rich features including ability pools, repositories, 3D model support, and worldbuilding capabilities.

## Technology Stack

### Frontend
- **Framework**: Next.js 14.1.4 with App Router
- **Language**: TypeScript 5.4.3
- **Styling**: Tailwind CSS 3.4.3
- **Authentication**: NextAuth.js 4.24.13
- **Components**: Custom React components
- **State Management**: React useState and useEffect hooks

### Backend
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 6.19.1
- **Authentication**: NextAuth.js with Prisma Adapter
- **Password Hashing**: bcryptjs 3.0.3

### Deployment
- **Hosting**: Cloudflare Pages
- **Database**: Supabase
- **Environment Variables**: .env file configuration

## Project Structure

```
OasisBio/
├── prisma/                  # Database models and migrations
│   ├── schema.prisma        # Prisma schema definition
│   └── migrations/          # Database migration files
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/             # API endpoints
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # User dashboard
│   │   ├── bio/             # Public OasisBio pages
│   │   └── (other pages)    # Additional website pages
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utility functions
│   └── generated/           # Generated Prisma client
├── docs/                    # Project documentation
├── .env                     # Environment variables
├── package.json             # Project dependencies
└── tailwind.config.js       # Tailwind CSS configuration
```

## Core Features

### 1. Cross-Era Identity System
- Multiple identity versions (Past, Present, Future, Alternate, Fictional)
- Timeline-based identity management
- Era-specific attributes and abilities

### 2. Ability Pool System
- Custom and official ability categories
- Skill levels (1-5)
- Era and world binding
- Categorized skill system

### 3. Repositories
- **DCOS (Dynamic Core Operating Script)**: Core identity narrative files
- **References**: External links and resources
- **Worlds**: Fictional world creation and management

### 4. 3D Model Support
- OBJ file uploads
- 3D model preview
- Era-specific models
- World-bound visuals

### 5. User Authentication
- Secure registration and login
- Password hashing
- Session management
- Protected routes

## Database Models

### User
- id: String (primary key)
- name: String (optional)
- email: String (unique)
- emailVerified: DateTime (optional)
- image: String (optional)
- password: String
- createdAt: DateTime
- updatedAt: DateTime
- oasisBios: Array of OasisBio

### OasisBio
- id: String (primary key)
- userId: String (foreign key to User)
- title: String
- slug: String (unique)
- tagline: String (optional)
- identityMode: String (default: "real")
- birthDate: DateTime (optional)
- gender: String (optional)
- pronouns: String (optional)
- placeOfOrigin: String (optional)
- currentEra: String (optional)
- species: String (optional)
- status: String (optional)
- description: String (optional)
