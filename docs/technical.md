# OasisBio Technical Documentation

## Project Overview

OasisBio is a cross-era identity system that allows users to create and manage multiple identity versions across different time periods and fictional worlds. It provides a comprehensive platform for building, storing, and displaying digital identities with rich features including ability pools, repositories, 3D model support, and worldbuilding capabilities.

## Technology Stack

### Frontend
- **Framework**: Next.js 14.1.4 with App Router
- **Language**: TypeScript 5.4.3
- **Styling**: Tailwind CSS 3.4.3
- **Authentication**: NextAuth.js 4.24.13 with email/password and OAuth (Google, GitHub)
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
- visibility: String (default: "private")
- createdAt: DateTime
- updatedAt: DateTime
- abilities: Array of Ability
- dcosFiles: Array of DcosFile
- references: Array of ReferenceItem
- worlds: Array of WorldItem
- models: Array of ModelItem
- eras: Array of EraIdentity

### EraIdentity
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- name: String
- eraType: String
- startDate: DateTime (optional)
- endDate: DateTime (optional)
- description: String (optional)

### Ability
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- name: String
- category: String
- type: String (default: "custom")
- level: Int (default: 1)
- description: String (optional)
- relatedWorldId: String (optional)
- relatedEraId: String (optional)

### DcosFile
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- title: String
- content: String
- folder: String
- createdAt: DateTime
- updatedAt: DateTime

### ReferenceItem
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- url: String
- title: String
- type: String
- description: String (optional)
- tags: String

### WorldItem
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- name: String
- summary: String
- timeline: String (optional)
- rules: String (optional)
- factions: String (optional)

### ModelItem
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- name: String
- objUrl: String
- mtlUrl: String (optional)
- previewImage: String (optional)
- relatedWorldId: String (optional)
- relatedEraId: String (optional)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication endpoints

### OasisBio Management
- `GET /api/oasisbios` - Get user's OasisBios
- `POST /api/oasisbios` - Create new OasisBio
- `GET /api/oasisbios/[id]` - Get specific OasisBio
- `PUT /api/oasisbios/[id]` - Update OasisBio
- `DELETE /api/oasisbios/[id]` - Delete OasisBio

### Ability Management
- `GET /api/oasisbios/[id]/abilities` - Get abilities for OasisBio
- `POST /api/oasisbios/[id]/abilities` - Add ability to OasisBio
- `PUT /api/abilities/[id]` - Update ability
- `DELETE /api/abilities/[id]` - Delete ability

### Repository Management
- **DCOS**: `GET|POST|PUT|DELETE /api/oasisbios/[id]/dcos`
- **References**: `GET|POST|PUT|DELETE /api/oasisbios/[id]/references`
- **Worlds**: `GET|POST|PUT|DELETE /api/oasisbios/[id]/worlds`

### Model Management
- `GET /api/oasisbios/[id]/models` - Get models for OasisBio
- `POST /api/oasisbios/[id]/models` - Upload model to OasisBio
- `DELETE /api/models/[id]` - Delete model

## Deployment

### Supabase Setup
1. Create a Supabase project
2. Configure the database with the provided schema
3. Set up environment variables with Supabase credentials

### Cloudflare Pages Deployment
1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next/static`
3. Add environment variables
4. Deploy the project

### Environment Variables
```
# Supabase Database URL
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.dhkgfdllgtmbkwcbubqt.supabase.co:5432/postgres"

# NextAuth.js Secret
NEXTAUTH_SECRET="[YOUR-NEXTAUTH-SECRET]"

# Supabase API Keys
NEXT_PUBLIC_SUPABASE_URL="https://dhkgfdllgtmbkwcbubqt.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"

# Google OAuth
GOOGLE_CLIENT_ID="[YOUR-GOOGLE-CLIENT-ID]"
GOOGLE_CLIENT_SECRET="[YOUR-GOOGLE-CLIENT-SECRET]"

# GitHub OAuth
GITHUB_CLIENT_ID="[YOUR-GITHUB-CLIENT-ID]"
GITHUB_CLIENT_SECRET="[YOUR-GITHUB-CLIENT-SECRET]"
```

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Run database migrations: `npx prisma migrate dev`
5. Start development server: `npm run dev`

### Testing
- Run build: `npm run build`
- Run lint: `npm run lint`

## Security Considerations
- Passwords are hashed using bcryptjs
- Authentication is handled through NextAuth.js
- Protected routes require valid session
- Environment variables are kept secure
- Input validation is implemented for all user inputs

## Performance Optimization
- Next.js App Router for efficient routing
- Server-side rendering for improved SEO
- Static generation for public pages
- Tailwind CSS for optimized styling
- Prisma ORM for efficient database queries

## Future Enhancements
- AI-assisted content generation
- Template marketplace
- Character collaboration features
- Shared worlds
- Advanced 3D model editing
- Mobile app development
