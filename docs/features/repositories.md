# Repository System

## Overview

The Repository system is a core feature of OasisBio that allows users to store and organize content related to their identities. It consists of three interconnected repositories: DCOS (Dynamic Core Operating Script), References, and Worlds. These repositories provide a structured way to manage identity-related content and enhance the depth of each OasisBio.

## DCOS Repository

### Overview

**DCOS (Dynamic Core Operating Script)** is a narrative layer where users define their identity's core logic, principles, and internal scripts. It serves as the foundational narrative framework for the identity.

### Purpose

- Define the identity's core principles and values
- Establish the identity's voice and tone
- Create narrative fragments that shape the identity
- Set rules and guidelines for the identity's behavior
- Document the identity's evolution over time

### Content Types

#### Core Identity Definition
- **Purpose**: Define the fundamental nature of the identity
- **Examples**: Mission statements, core values, identity origins
- **File**: `core.md`

#### Voice and Tone Guidelines
- **Purpose**: Establish the identity's communication style
- **Examples**: Writing style, speech patterns, communication preferences
- **File**: `voice.md`

#### Principles and Beliefs
- **Purpose**: Document the identity's guiding principles
- **Examples**: Philosophical beliefs, moral code, decision-making framework
- **File**: `principles.md`

#### Manifesto
- **Purpose**: Create a declaration of the identity's purpose and goals
- **Examples**: Personal mission, vision for the future, core objectives
- **File**: `manifesto.md`

#### Memory Fragments
- **Purpose**: Store significant memories and experiences
- **Examples**: Key life events, formative experiences, important milestones
- **File**: `memories.md`

### File Structure

```
dcos/
├── core.md          # Core identity definition
├── voice.md         # Voice and tone guidelines
├── principles.md    # Guiding principles
├── manifesto.md     # Identity manifesto
└── memories.md      # Memory fragments
```

### Editor Features

- **Markdown Support**: Rich text formatting with Markdown
- **Version History**: Track changes over time
- **Draft/Published States**: Work on content before publishing
- **Pinned Lines**: Mark important sections for easy reference
- **Era Binding**: Link content to specific time periods

## References Repository

### Overview

The References repository is a structured collection of external sources that relate to the identity. It allows users to curate and organize links to articles, videos, music, images, and other resources that inform or inspire the identity.

### Purpose

- Curate resources that influence the identity
- Provide context for the identity's interests and influences
- Create a personal knowledge base for the identity
- Document external references that shape the identity

### Reference Types

#### Articles
- **Description**: Written content from websites, blogs, or publications
- **Examples**: News articles, blog posts, essays, academic papers

#### Videos
- **Description**: Video content from platforms like YouTube, Vimeo, etc.
- **Examples**: Documentaries, interviews, tutorials, music videos

#### Music
- **Description**: Audio content including songs, podcasts, and other audio
- **Examples**: Songs, albums, podcasts, audiobooks

#### Images
- **Description**: Visual content including photos, artwork, and graphics
- **Examples**: Photographs, illustrations, infographics, artwork

#### Research
- **Description**: Academic or research-based content
- **Examples**: Research papers, studies, white papers, case studies

#### Moodboard
- **Description**: Collections of visual references that inspire the identity
- **Examples**: Style guides, aesthetic references, design inspiration

#### Social Accounts
- **Description**: Links to social media profiles or online presence
- **Examples**: Twitter, Instagram, LinkedIn, personal websites

#### Archive Pages
- **Description**: Links to archived content or historical resources
- **Examples**: Wayback Machine links, historical documents, archived websites

### Reference Structure

Each reference includes the following attributes:

- **URL**: The web address of the reference
- **Title**: The title of the reference
- **Type**: The category of the reference (article, video, etc.)
- **Description**: A brief description of the reference
- **Tags**: Keywords to categorize the reference
- **Related World**: World the reference is associated with (optional)
- **Related Era**: Era the reference is associated with (optional)
- **Source Credibility**: Rating of the source's credibility (optional)
- **Snapshot Cover**: Visual preview of the reference (optional)

### File Structure

```
references/
└── (reference files organized by type or topic)
```

### Display Options

- **Card Grid**: Visual display of references as cards
- **List View**: Detailed list of references with descriptions
- **Filtered Views**: View references by type, world, or era
- **Search Functionality**: Search references by title, description, or tags

## Worlds Repository

### Overview

The Worlds repository allows users to create and manage fictional or conceptual worlds that their identities can inhabit. It provides a structured way to build detailed worlds with their own rules, histories, and characteristics.

### Purpose

- Create fictional settings for identities
- Establish consistent rules and lore for worlds
- Build immersive environments for fictional identities
- Document world-building details for reference

### World Components

#### World Overview
- **Description**: General information about the world
- **Content**: World name, summary, genre, tone, aesthetic
- **File**: `overview.md`

#### Timeline
- **Description**: Chronological events in the world's history
- **Content**: Key events, historical periods, important milestones
- **File**: `timeline.md`

#### Rules of Physics
- **Description**: The physical laws and rules that govern the world
- **Content**: Natural laws, magic systems, technology limitations
- **File**: `rules.md`

#### Geography
- **Description**: The physical geography of the world
- **Content**: Continents, regions, landmarks, climate
- **File**: `geography.md`

#### Social Structure
- **Description**: The social organization of the world
- **Content**: Social classes, cultural norms, customs, traditions
- **File**: `social.md`

#### Factions
- **Description**: Groups or organizations within the world
- **Content**: Faction names, goals, relationships, hierarchies
- **File**: `factions.md`

#### Language System
- **Description**: The languages spoken in the world
- **Content**: Language names, structures, writing systems
- **File**: `language.md`

#### Myth and Religion
- **Description**: Belief systems within the world
- **Content**: Myths, legends, religious practices, deities
- **File**: `mythology.md`

#### Conflict
- **Description**: Major conflicts within the world
- **Content**: Wars, disputes, tensions, resolutions
- **File**: `conflict.md`

### File Structure

```
worlds/
├── archive-city/
│   ├── overview.md    # World overview
│   ├── timeline.md    # World timeline
│   ├── rules.md       # Rules of physics
│   ├── geography.md   # World geography
│   ├── social.md      # Social structure
│   ├── factions.md    # Factions
│   ├── language.md    # Language system
│   ├── mythology.md   # Myth and religion
│   └── conflict.md    # Conflicts
└── neon-desert/
    ├── overview.md
    ├── timeline.md
    └── ...
```

### World Management

#### Creating a World
1. **Name Your World**: Choose a name for the world
2. **Define Basics**: Create an overview with genre and tone
3. **Build Structure**: Add timeline, rules, geography, etc.
4. **Populate Details**: Fill in specific information about the world
5. **Link Identities**: Associate identities with the world

#### Editing a World
- Update world details
- Modify timeline events
- Adjust rules and systems
- Add new components
- Link additional identities

#### Deleting a World
- Remove a world and all associated content
- Confirmation required before deletion

### World Visualization

- **World Map**: Visual representation of the world's geography
- **Timeline Visualization**: Interactive timeline of world events
- **Faction Relationships**: Visual representation of faction dynamics
- **Identity-World Connections**: Map of identities within the world

## Repository Integration

### Cross-Repository Links
- **DCOS to References**: Link specific DCOS content to relevant references
- **References to Worlds**: Associate references with specific worlds
- **Worlds to DCOS**: Link world lore to identity narratives

### Search and Discovery
- **Global Search**: Search across all repositories
- **Contextual Suggestions**: Get recommendations based on current content
- **Related Content**: Discover content related to the current item

## Best Practices

1. **Organization**: Use consistent file naming and folder structures
2. **Documentation**: Provide clear, detailed descriptions for all content
3. **Cross-Referencing**: Link related content across repositories
4. **Version Control**: Track changes to maintain a history of development
5. **Accessibility**: Ensure content is well-organized and easy to navigate

## Future Enhancements

- **Collaborative Editing**: Allow multiple users to edit repository content
- **AI-Assisted Content Generation**: Generate content suggestions based on existing material
- **Content Import/Export**: Import and export repository content between OasisBios
- **Interactive World Maps**: Create interactive maps for world visualization
- **Repository Templates**: Pre-built templates for common repository structures
