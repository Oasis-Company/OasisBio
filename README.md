# OasisBio

**OasisBio** is a cross-era identity system that allows users to build expandable digital identities.

Instead of a single static profile, OasisBio enables users to construct identities across time, worlds, abilities, 
and archives. A user can create a structured identity container called an **OasisBio**, which includes personal 
data, ability systems, narrative scripts, references, worldbuilding archives, and 3D character models.

The project explores a new way of representing identity — not as a page, but as an evolving archive.

---

# Core Concept

Traditional profile systems describe who you are **now**.

OasisBio allows identities to exist across multiple layers:

- Past self
- Present self
- Future self
- Fictional self
- Parallel identities
- World-bound identities

An OasisBio becomes a **living identity archive** that can store narratives, abilities, knowledge sources, and 
fictional worlds.

---

# Key Features

## 1. OasisBio Identity Container

Each user can create multiple **OasisBio profiles**, which act as modular identity containers.

Each OasisBio includes:

- Name
- Basic personal information
- Ability Pool
- Archive repositories
- 3D character model
- Optional world associations

---

## 2. Basic Profile Information

Users define core identity attributes:

- Birth date
- Gender
- Description
- Identity mode (real / fictional / hybrid)

---

## 3. Ability Pool System

The **Ability Pool** allows users to define skills, traits, and abilities.

Abilities can be:

- custom abilities (user-defined)
- official preset abilities (provided by the platform)

Examples:

- Spanish
- Basketball
- Rap
- Frontend Development
- Storytelling
- Strategy
- Worldbuilding

Abilities may include:

- category
- level
- description
- world or era association

---

## 4. Repository System

Each OasisBio contains three core repositories.

### DCOS Repository

**DCOS (Dynamic Core Operating Script)**

A narrative layer where users define their identity logic, principles, and internal scripts.

Examples of DCOS content:

- identity definitions
- philosophical statements
- narrative fragments
- character rules
- voice and tone guidelines

All DCOS files are user-written.

Folder structure example:

/dcos
core.md
voice.md
manifesto.md

---

### References Repository

A structured collection of external sources provided by the user.

Supported items:

- articles
- videos
- music
- images
- research links
- archives

Each reference may include:

- URL
- title
- description
- tags

Folder structure:

/references

---

### World Repository

Users can create multiple fictional or conceptual **worlds**.

Each world may include:

- world summary
- timeline
- rules of physics
- factions
- geography
- narrative background

Example folder structure:

/worlds
archive-city
overview.md
timeline.md
factions.md
neon-desert
overview.md


These worlds can be linked to OasisBio identities.

---

## 5. 3D Character Model

Users can upload a 3D model representing their identity.

Supported format:

OBJ

nginx

The model can be previewed directly on the profile page.

Model files:

/models
identity.obj

Future versions may support interactive viewing using **Three.js / React Three Fiber**.

---

# Website Design

The OasisBio website follows a minimal editorial design inspired by:

- Swiss design system
- Awwwards-style interaction design

### Visual Characteristics

- black & white color palette
- strong grid layout
- large whitespace
- editorial typography
- minimal motion

---

# Tech Stack

Frontend:

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- React Three Fiber (3D preview)

Backend:

- Next.js API routes
- PostgreSQL
- Prisma ORM

Storage:

- S3 compatible object storage (for models and files)

---

# Project Structure

/app
/components
/lib
/prisma
/public

/features
oasisbio
abilities
repositories
worlds
models

perl


Repository storage example for each OasisBio:

oasisbio/

dcos/
core.md

references/

worlds/
archive-city/

models/
avatar.obj


---

# Example OasisBio Structure

OasisBio
├── Basic Info
├── Ability Pool
├── DCOS Repository
├── Reference Library
├── World Repository
└── 3D Model

---

# Future Development

Planned features include:

- Cross-era identity timeline
- Public OasisBio exploration page
- shared worldbuilding
- collaborative characters
- AI-assisted identity generation
- version history for identity scripts

---

# Philosophy

Identity is not static.

A biography captures only a moment.

OasisBio treats identity as a system that can grow, branch, and evolve across time and imagination.

---

# License

MIT License