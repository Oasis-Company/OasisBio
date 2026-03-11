# OasisBio Documentation

Welcome to the OasisBio documentation repository. This documentation provides comprehensive information about the OasisBio project, including technical details, design guidelines, and implementation instructions.

## Table of Contents

- [Project Overview](#project-overview)
- [Documentation Structure](#documentation-structure)
- [Technical Documentation](#technical-documentation)
- [Design Documentation](#design-documentation)
- [Feature Documentation](#feature-documentation)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

OasisBio is a cross-era identity system that allows users to create and manage multiple identity versions across different time periods and fictional worlds. It provides a comprehensive platform for building, storing, and displaying digital identities with rich features including ability pools, repositories, 3D model support, and worldbuilding capabilities.

## Documentation Structure

```
docs/
├── README.md              # This document
├── technical.md           # Technical implementation details
├── design.md              # Design guidelines and principles
└── features/              # Feature-specific documentation
    ├── oasisbio.md        # OasisBio identity container
    ├── abilities.md       # Ability pool system
    ├── repositories.md    # Repository system (DCOS, References, Worlds)
    ├── models.md          # 3D character model system
    └── worlds.md          # Worldbuilding system
```

## Technical Documentation

The [technical documentation](technical.md) provides detailed information about the project's technical implementation, including:

- Technology stack
- Project structure
- Database models
- API endpoints
- Deployment instructions
- Security considerations
- Performance optimization

## Design Documentation

The [design documentation](design.md) outlines the project's design principles and guidelines, including:

- Design philosophy
- Color palette
- Typography
- Layout structure
- Component design
- Responsive design
- Animations
- Accessibility

## Feature Documentation

### OasisBio Identity Container

The [OasisBio identity container](features/oasisbio.md) documentation covers:

- Identity modes (real, fictional, hybrid, future, alternate)
- Basic profile information
- Identity management
- Era-specific identities

### Ability Pool System

The [ability pool system](features/abilities.md) documentation includes:

- Ability categories
- Custom vs official abilities
- Skill levels
- Era and world binding
- Ability management

### Repository System

The [repository system](features/repositories.md) documentation covers:

- DCOS (Dynamic Core Operating Script)
- References library
- Worldbuilding repository
- File structure and organization

### 3D Character Model

The [3D character model](features/models.md) documentation includes:

- OBJ file support
- Model preview
- Era-specific models
- World-bound visuals

### Worldbuilding System

The [worldbuilding system](features/worlds.md) documentation covers:

- World creation and management
- Timeline and rules
- Factions and geography
- Character-world binding

## Getting Started

To get started with OasisBio:

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Run database migrations: `npx prisma migrate dev`
5. Start development server: `npm run dev`

For more detailed instructions, refer to the [technical documentation](technical.md).

## Contributing

We welcome contributions to the OasisBio project. Please refer to the contributing guidelines for more information.

## License

OasisBio is licensed under the MIT License. See the [LICENSE](../LICENSE) file for more information.
