# Requirements Document

## Introduction

完全重写 OasisBio 的世界观填写功能。现有实现是一个平铺的 12 字段表单，缺乏引导、结构感和创作氛围，导致用户不知道如何开始。新版本采用分步引导式创建流程，将世界观构建拆分为 6 个语义化模块，每步聚焦一个主题，配有示例和引导文字，并建立世界与角色的可视化关联，使世界观成为真正有差异化价值的核心功能。

## Glossary

- **World_Builder**: 世界观创建与编辑系统，包含分步向导和详情编辑器
- **World**: 一个完整的虚构世界设定，包含 6 个模块的内容
- **World_Module**: 世界观的一个主题模块（Core Identity / Time Structure / World Rules / Civilization / Environment / Narrative Context）
- **Step_Wizard**: 分步引导式创建流程，每步对应一个 World_Module
- **World_Card**: 世界列表中展示单个世界摘要信息的卡片组件
- **World_Detail**: 世界详情编辑器，展示并允许编辑所有 6 个模块
- **Completion_Score**: 基于已填写字段数量计算的世界完整度百分比
- **OasisBio**: 角色档案，世界观的归属父级实体

## Requirements

### Requirement 1: 分步引导式世界创建

**User Story:** As a creator, I want a guided step-by-step world creation flow, so that I can build a coherent fictional world without feeling overwhelmed by a blank form.

#### Acceptance Criteria

1. WHEN a user clicks "Create New World", THE World_Builder SHALL display a Step_Wizard with 6 sequential steps
2. THE Step_Wizard SHALL display the current step number, step title, and a progress indicator showing completion across all 6 steps
3. WHEN a user completes a step and clicks "Next", THE Step_Wizard SHALL advance to the next step and preserve all entered data
4. WHEN a user clicks "Back" on any step after the first, THE Step_Wizard SHALL return to the previous step with previously entered data intact
5. THE Step_Wizard SHALL allow users to skip optional steps by clicking "Skip for now"
6. WHEN a user reaches the final step and clicks "Create World", THE World_Builder SHALL save the world and navigate to the World_Detail view
7. THE Step_Wizard SHALL require only the world name and summary (Step 1) to proceed — all other steps are optional
8. WHEN a user abandons the wizard mid-way, THE World_Builder SHALL discard unsaved data and return to the world list

### Requirement 2: 6 模块语义化内容结构

**User Story:** As a creator, I want each world-building module to have clear, creative language and examples, so that I understand what to fill in and feel inspired to do so.

#### Acceptance Criteria

1. THE Step_Wizard SHALL present modules in this order: Core Identity → Time Structure → World Rules → Civilization → Environment → Narrative Context
2. EACH step SHALL display a module title, a one-sentence description of what the module covers, and at least 2 concrete example values for each field
3. THE Core_Identity step SHALL collect: world name, tagline, genre (select), tone (select), summary
4. THE Time_Structure step SHALL collect: era name, time period (select), timeline (key events), major events
5. THE World_Rules step SHALL collect: physics rules, technology level (select), power system, limitations
6. THE Civilization step SHALL collect: governance, economy, factions, social structure, culture
7. THE Environment step SHALL collect: geography, cities, landmarks, environmental features
8. THE Narrative_Context step SHALL collect: conflict, themes, story hooks, character roles
9. WHERE genre and tone fields are present, THE World_Builder SHALL provide predefined options as a select/tag input rather than free text

### Requirement 3: 世界列表与卡片视图

**User Story:** As a creator, I want to see all my worlds in a visually organized list, so that I can quickly find and navigate to any world.

#### Acceptance Criteria

1. THE World_Builder SHALL display all worlds belonging to the current OasisBio as World_Cards in a grid layout
2. EACH World_Card SHALL display: world name, genre tag, tone tag, summary excerpt (max 80 characters), Completion_Score, and last updated date
3. WHEN a user clicks a World_Card, THE World_Builder SHALL navigate to the World_Detail view for that world
4. THE World_Builder SHALL display a "Create New World" card as the first item in the grid when fewer than 10 worlds exist
5. WHEN no worlds exist, THE World_Builder SHALL display an empty state with an illustration and a prominent "Create Your First World" button
6. THE Completion_Score SHALL be calculated as: (number of non-empty fields / total fields) × 100, rounded to nearest integer

### Requirement 4: 世界详情编辑器

**User Story:** As a creator, I want to view and edit all world details in a structured layout after creation, so that I can refine my world over time.

#### Acceptance Criteria

1. THE World_Detail SHALL display all 6 modules as collapsible sections in a single-page layout
2. EACH module section SHALL show a completion indicator (e.g., "3/5 fields filled")
3. WHEN a user clicks "Edit" on a module section, THE World_Detail SHALL switch that section to inline edit mode
4. WHEN a user clicks "Save" after editing, THE World_Detail SHALL persist changes via API and show a success indicator
5. IF the API save fails, THEN THE World_Detail SHALL display an error message and preserve the unsaved changes in the form
6. THE World_Detail SHALL display a "Back to Worlds" navigation link
7. THE World_Detail SHALL show the world's Completion_Score prominently at the top

### Requirement 5: 世界与角色的关联展示

**User Story:** As a creator, I want to see which characters belong to a world, so that I understand the relationship between my worlds and characters.

#### Acceptance Criteria

1. THE World_Detail SHALL display a "Characters in this World" section showing all OasisBio characters linked to this world
2. EACH linked character SHALL be displayed with their name, cover image (if available), and a link to their profile
3. WHEN no characters are linked to the world, THE World_Detail SHALL display "No characters in this world yet" with a hint about how to link characters
4. THE World_Builder SHALL support linking a world to a character via the character's existing world selection field

### Requirement 6: 数据持久化与 API

**User Story:** As a system, I want world data to be reliably saved and retrieved, so that creators never lose their work.

#### Acceptance Criteria

1. WHEN a world is created via the Step_Wizard, THE World_Builder SHALL POST to `/api/oasisbios/[id]/worlds` with all collected module data
2. WHEN a world module is updated in World_Detail, THE World_Builder SHALL PUT to `/api/worlds/[id]` with only the changed fields
3. THE World_Builder SHALL display an auto-save indicator when changes are pending
4. WHEN a user deletes a world, THE World_Builder SHALL show a confirmation dialog before sending DELETE to `/api/worlds/[id]`
5. IF a network request fails, THEN THE World_Builder SHALL retry once automatically before showing an error to the user
6. THE API SHALL accept and store all 6 module fields as defined in the WorldItem Prisma model
