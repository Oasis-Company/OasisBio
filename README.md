# OasisBio

OasisBio is a comprehensive identity management system that allows users to create, manage, and showcase digital identities across multiple time periods and dimensions. It provides a rich set of features for character creation, ability management, worldbuilding, and 3D model integration.

## Features

### 1. Character Creation Flow
- **Six-step process**: Identity, Era, Abilities, Repositories, Model, Publish
- **Comprehensive form fields** for all character attributes
- **Real-time validation** and error handling

### 2. Character Public Page
- **Scroll-based design** with multiple sections
- **Hero section** with system tags
- **Identity Panel** with basic information
- **Ability Matrix** with categorized abilities
- **DCOS Archive** for character documents
- **World Gallery** for associated worlds
- **References Library** for external resources
- **3D Presence** with interactive 3D model viewer
- **Era Timeline** with visual time-based progression

### 3. Dashboard Management
- **Left navigation bar** with sections: Overview, Identity, Eras, Abilities, DCOS, References, Worlds, Models, Publish
- **Stats overview** with key metrics
- **OasisBios status** with drafts and published bios
- **Recent updates** activity feed
- **Quick actions** for common tasks
- **Account and system status** information

### 4. 3D Model Support
- **Interactive 3D viewer** using Three.js
- **Orbit controls** for rotating and zooming
- **Real-time rendering** with lighting effects
- **Placeholder models** for demonstration

### 5. Era System
- **Visual timeline** with interactive elements
- **Year-based organization** of character development
- **Ability progression** across different eras
- **Detailed era descriptions** and context

### 6. Ability Pool System
- **Categorized abilities** (Technology, Languages, Arts, Worldbuilding)
- **Level-based proficiency** (1-5)
- **Featured abilities** showcase
- **Custom ability creation**

### 7. Repository System
- **DCOS (Digital Character Operating System)** for character documents
- **References** for external resources
- **Worlds** for fictional settings
- **3D Models** for visual representation

## Technology Stack

- **Frontend**: Next.js 14.1.4, React 18, TypeScript 5.4.3, Tailwind CSS 3.4.3
- **Backend**: Node.js, Next.js API routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 6.19.1
- **3D Rendering**: Three.js
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites
- Node.js 18.0.0 or later
- npm 9.0.0 or later
- PostgreSQL database (Supabase recommended)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/oasisbio.git
cd oasisbio
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your database credentials and other settings
```

4. Initialize database
```bash
npx prisma db push
npx prisma generate
```

5. Start development server
```bash
npm run dev
```

### Deployment

1. Build for production
```bash
npm run build
```

2. Start production server
```bash
npm start
```

## Project Structure

```
oasisbio/
├── src/
│   ├── app/
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── oasisbios/       # Character management
│   │   │   ├── worlds/          # World management
│   │   │   ├── models/          # Model management
│   │   │   └── page.tsx         # Dashboard overview
│   │   ├── bio/                 # Public character pages
│   │   │   └── [slug]/          # Dynamic character pages
│   │   ├── auth/                # Authentication pages
│   │   └── api/                 # API routes
│   ├── components/              # Reusable components
│   │   ├── Button.tsx           # Button component
│   │   ├── Card.tsx             # Card component
│   │   └── ModelViewer.tsx      # 3D model viewer
│   ├── lib/                     # Utility functions
│   └── styles/                  # Global styles
├── prisma/                      # Database schema
│   └── schema.prisma            # Prisma schema definition
├── public/                      # Static assets
│   └── models/                  # 3D model files
├── .env.example                 # Environment variable example
├── next.config.js               # Next.js configuration
├── package.json                 # Package configuration
└── README.md                    # Project documentation
```

## Usage

### Creating a New Character
1. Navigate to the dashboard
2. Click "Create New OasisBio"
3. Follow the six-step process:
   - **Identity**: Enter basic character information
   - **Era**: Define time periods and context
   - **Abilities**: Add and categorize abilities
   - **Repositories**: Upload documents and references
   - **Model**: Upload or select 3D model
   - **Publish**: Review and publish

### Managing Existing Characters
1. Navigate to the dashboard
2. Click "Manage OasisBios"
3. Select a character to edit or view

### Viewing Public Character Pages
1. Navigate to `/bio/[slug]` where [slug] is the character's unique identifier
2. Explore the scroll-based interface
3. Interact with the 3D model viewer
4. Browse through the character's eras, abilities, and repositories

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact:
- Email: support@oasisbio.com
- GitHub: https://github.com/yourusername/oasisbio
