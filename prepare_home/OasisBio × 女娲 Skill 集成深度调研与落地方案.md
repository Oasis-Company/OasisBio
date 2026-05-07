# OasisBio × 女娲 Skill 集成深度调研与落地方案

## 源码调研后的现状判断

我先给出最重要的判断：**OasisBio 当前已经具备“被 AI 深化”的内容骨架，但还没有“AI 建议层”与“可审阅的中间产物层”**。从已公开的技术文档、Prisma schema、前端页面与 API 路由来看，现有系统已经把身份内容拆成了 `OasisBio` 主体、`EraIdentity` 时间切片、`Ability` 能力池、`DcosFile` 叙事文档、`ReferenceItem` 参考资料、`WorldItem` 世界观与 `WorldDocument` 世界文档等多个结构化单元；但 schema 中并不存在任何用于 AI 任务编排、建议草案存储、证据溯源、人工采纳状态管理的模型。这意味着你们不需要重写内容中心，只需要在现有内容中心外面再加一层“Nuwa 建议工作台”。citeturn7view0turn20search1turn32view2

在运行时架构上，OasisBio 是一个部署在 Cloudflare Pages 上的 Next.js 16 全栈应用，服务端访问 Supabase PostgreSQL，使用 Prisma 作为 ORM，认证通过 Supabase OTP 与 cookie 会话完成。技术文档明确写到 API 路由跑在 Node runtime，数据库有 RLS，但 Prisma 运行时通过 pooler 连接；这意味着**AI 集成最现实的落点仍然是现有 Next.js API Route 或新增 Edge Function，而不是前端直连某个“女娲接口”**。citeturn7view0turn40view3

内容模型方面，最关键的几个表已经足够支撑 Nuwa 结果落地：`oasis_bios` 有 `title`、`tagline`、`summary`、`description`、`identityMode`、`visibility` 等主档字段；`era_identities` 有 `name`、`eraType`、`startYear`、`endYear`、`description`；`abilities` 有 `name`、`category`、`level`、`description`、`relatedWorldId`、`relatedEraId`；`reference_items` 有 `url`、`title`、`description`、`sourceType`、`provider`、`metadata`、`eraId`、`worldId`、`tags`；`world_items` 有 `summary`、`timeSetting`、`geography`、`physicsRules`、`socialStructure`、`majorConflict`、`timeline`、`rules`、`factions` 等字段。换言之，**女娲输出不需要凭空造新内容类型，几乎都能映射到现有表上**。citeturn20search1

前端交互也已经给了你们很强的集成锚点。角色详情页 `src/app/dashboard/oasisbios/[id]/page.tsx` 现在会拉取 `/api/oasisbios/${bioId}`，本地管理表单状态，并在顶部使用 `useToast()` 做保存/发布反馈；同一页面下方已经有 `Identity / Eras / Abilities / Worlds / DCOS / References` 的子导航。世界观模块则已经是一套完整的“卡片列表 + StepWizard + 详情页”结构，世界创建流程支持 `Back`、`Skip for now`、`Create World`，列表页有 `Create New World` 卡片，卡片还会根据 10 个字段计算 completion score。**这套现成的交互模式非常适合直接复用成“Nuwa 建议 → 审阅 → 采纳”的产品体验**。citeturn26view0turn26view2turn27view1turn29view0turn29view1turn30view0turn35view1

同时，我在源码里看到几处必须避坑的地方。第一，`/api/abilities/[id]` 的更新路由仍然接受 `isActive` 字段，但当前 `Ability` schema 并没有这个字段；第二，`/api/references/[id]` 的更新路由仍然按旧字段名 `type` 更新，而 schema 与创建路由使用的是 `sourceType`；第三，世界观里 `aestheticKeywords` 在现有实现中其实被 `serializeGenreTone()` 当成 `genre/tone` 的 JSON 序列化字段，而不是可随意塞内容的自由文本。这说明**Nuwa 集成不应直接绕用若干旧更新路由做批量落盘，而应新增一套干净、显式、可版本化的 AI 建议 API 与服务层**。citeturn33view5turn33view3turn32view6turn35view0turn32view8

最后，从产品语义上看，公开文档和 README 仍然把 OasisBio 描述为“digital identity builder / character creator platform”，强调 abilities、worldbuilding、DCOS、references、3D model、publish 等模块；而你们在本次需求中，把它重新定义为“跨代际身份协议系统”与“人类身份的数字容器”。这两者并不冲突，但说明当前代码库的“底层资源模型”仍偏内容管理而非认知建模。因此我建议集成策略采用**“不改核心 ontology，先叠加认知建议层”**：先让 Nuwa 产出结构化建议并映射到现有模块，等产品跑通后再考虑是否引入原生的 `mental_models / heuristics / expression_dna` 一类一等公民表。citeturn11search1turn15view0turn16view2

## 女娲方法论与对 OasisBio 的启示

女娲仓库本质上不是一个可直接 `npm install` 进 Next.js 线上请求链路的 SDK，而是一个 **Claude Code skill + 方法论仓库**。它的安装方式是 `npx skills add alchaincyf/nuwa-skill`；它的核心产物是写入 `.claude/skills/[person-name]-perspective/SKILL.md` 以及 `references/research/*.md` 这样的调研文件；它强调的不是“接口调用”，而是“深度调研 → 框架提炼 → 生成可运行 skill”。从工程角度讲，这意味着你们**不应该把 Nuwa 原样当成一个运行时依赖接入 OasisBio**，而应该把它视为一套方法模板、输出契约与审稿标准，然后在 OasisBio 里做一个 Nuwa-compatible 的服务实现。这个判断是基于仓库形态做出的工程推断。citeturn39search1turn36view3turn36view4

Nuwa 的方法论非常清晰，而且与你们的目标高度契合。README_EN 和 `SKILL.md` 都明确说明，它要提炼的不是“他说过什么”，而是“他如何思考”：包括心智模型、决策启发式、表达 DNA、反模式与诚实边界；执行上采用 6 路并行调研（著作、长对话、短表达、他者视角、决策记录、时间线），之后再做三重验证的心智模型提取，最终形成 3–7 个心智模型、5–10 条决策启发式、表达 DNA、价值观/反模式与 honest limits，并通过已知问题与边缘问题测试来验证质量。**这套产物形式，正好可以转写成 OasisBio 的 description / abilities / worlds / references / eras 建议集。**citeturn39search4turn38view0turn38view1turn38view2

更重要的是，女娲并不只适用于“蒸馏公众人物”。`SKILL.md` 明确区分了纯网络搜索、本地语料优先、纯本地语料三种模式；并特别写到：如果用户明确要求“只用我给的素材”或蒸馏非公众人物，就走纯本地语料模式，不做网络搜索。对于 OasisBio 而言，这一点极其关键，因为你们真正要做的是**帮助用户深化“自己的角色资料库”**，而不是分析一个陌生公众人物。也就是说，OasisBio 集成不但能复用 Nuwa，而且应该把 Nuwa 的**默认模式改成 local-first / private-first**。citeturn37view0

Nuwa 还要求每个研究流标注来源、可信度，并区分“他说过的”“别人说他的”“我推断的”；同时给出中文场景的信息源黑名单（知乎、微信公众号、百度百科）。这些规范对 OasisBio 同样有价值，因为你们的 AI 建议一旦要被用户信任，就不能只给结果，不给来路。我的建议是：**在 OasisBio 内部把 Nuwa 的“研究文件”改写为数据库里的 evidence JSON，而不是文件系统 md 文件**；同时保留来源类型、置信度与片段证据，作为每一条建议的右侧证据面板。citeturn38view0

因此，对 OasisBio 最合适的女娲接入方式不是“直接跑一个人物 perspective skill”，而是**抽取 Nuwa 的核心协议**：六路采集、三重验证、结构化提炼、人工确认、质量自检、证据可追溯。你们真正要交付给用户的，也不是一个“.claude/skills/xxx-perspective”目录，而是一组“可编辑、可采纳、可回滚、可追源”的身份深化建议。这个结论是对 Nuwa 仓库形态与 OasisBio 产品目标做出的工程级适配。citeturn39search1turn38view1turn37view2

## 推荐集成架构

### 总体思路

我建议把这次集成命名为 **Nuwa Suggestion Layer**，而不是 “Nuwa character distillation”。这层不直接改写用户数据，而是围绕一个独立的中间对象运行：`NuwaRun` 表示一次建议生成任务，`NuwaSuggestion` 表示一条可审阅建议。这样做有三个好处：一是符合 OasisBio 当前“内容资源已经结构化，但没有 AI 中间层”的现状；二是符合 Nuwa 在 Phase 2.5 里要求的“提炼确认检查点”；三是能把“生成”和“采纳”解耦，真正把控制权留给用户。OasisBio 当前 schema 没有 AI job/suggestion 表，而 Nuwa 方法又强调确认节点与证据保留，所以这是最稳的增量。citeturn20search1turn37view2

推荐的数据流如下：用户在角色页点击“Nuwa 深化”后，前端先让用户选择素材范围与目标范围；后端建立 `NuwaRun`，保存一次 source snapshot 的哈希和任务参数；异步 worker 读取该角色的 `OasisBio + abilities + eras + dcosFiles + references + worlds (+ world documents)`，构造成 Nuwa-compatible 的六路输入；随后完成提炼，得到统一的 Distilled Framework JSON；再把 JSON 映射成若干 `NuwaSuggestion` 行，按 `description / abilities / worlds / references / eras` 分组落库；前端轮询或订阅任务状态，展示建议；用户逐条或批量采纳后，再由 apply service 用事务把这些建议写回核心表。`GET /api/oasisbios/[id]` 现有就已经能一次返回主角色及多类关联数据，世界文档也有单独 API 和 schema，可作为快照拼接来源。citeturn32view2turn20search1turn35view5turn35view6

### 运行时建议

从当前基础设施看，**不要把完整蒸馏放在同步 HTTP 请求里**。原因不是“不能做”，而是“会很脆”：Nuwa 的典型链路包含多源输入、至少两阶段推理、证据收集与结构化输出；而 OasisBio 当前 API 主要是标准 CRUD。更现实的做法是：先在主站里提供创建任务与读状态的 API，再增加一个独立的 worker。这个 worker 最好做成新 Edge Function 或后台消费者，因为技术文档已经为 Edge Functions 预设了统一规则：每个请求有 `request_id`、所有输入经 Zod 校验、返回 `{ error: { code, message } }`、记录结构化日志；同时文档里已经规划过 `reference-enrich` 这类异步 enrich 型函数，说明产品架构本身接受“异步增强器”的模式。citeturn40view1turn7view0

如果你们短期不想引入新的运行环境，我建议 v1 采用 **数据库任务表 + 定时 worker** 的设计：Next.js 只负责 `create/list/get/apply`；真正的 `processQueuedRuns()` 由一个内部 cron 驱动服务调用。二期再把 worker 迁移到 Supabase Edge Functions 或 Cloudflare 队列。之所以这么定，是因为现在技术文档已经表明 `domain_events` 和 `audit_logs` 是 service-role 侧的基础设施，而不是直接暴露给前端的用户能力；把 Nuwa 任务也纳入这条后端链路，会让可观测性和审计一致很多。citeturn40view0turn40view2

### 建议新增的 Prisma 模型

下面这组 schema 足够支撑 MVP，而且不会破坏现有内容结构：

```prisma
model NuwaRun {
  id             String   @id @default(cuid())
  oasisBioId     String   @map("oasis_bio_id")
  userId         String   @map("user_id")
  status         String   @default("queued") // queued|processing|completed|failed|canceled
  mode           String   @default("quick")  // quick|deep
  sourcePolicy   String   @default("local_only") // local_only|local_plus_web
  scopes         String[]
  snapshotHash   String   @map("snapshot_hash")
  promptVersion  String   @map("prompt_version")
  provider       String?
  model          String?
  summary        Json?
  distilled      Json?
  error          Json?
  startedAt      DateTime? @map("started_at")
  completedAt    DateTime? @map("completed_at")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  oasisBio       OasisBio @relation(fields: [oasisBioId], references: [id], onDelete: Cascade)
  items          NuwaSuggestion[]

  @@index([oasisBioId, createdAt])
  @@index([userId, status])
  @@index([snapshotHash])
  @@map("nuwa_runs")
}

model NuwaSuggestion {
  id                String   @id @default(cuid())
  runId             String   @map("run_id")
  scope             String   // description|ability|world|reference|era|dcos
  operation         String   // append|create|update|replace
  targetId          String?  @map("target_id")
  title             String?
  payload           Json
  rationale         String?
  confidence        Float?
  evidence          Json?
  baseFingerprint   String?  @map("base_fingerprint")
  decision          String   @default("pending") // pending|accepted|rejected|applied
  createdEntityId   String?  @map("created_entity_id")
  appliedAt         DateTime? @map("applied_at")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  run               NuwaRun  @relation(fields: [runId], references: [id], onDelete: Cascade)

  @@index([runId, scope])
  @@index([decision])
  @@map("nuwa_suggestions")
}
```

如果你们想把“完整女娲报告”也归档进 OasisBio，而不只保存在 `NuwaRun.distilled` 里，我建议在任务完成后**额外生成一份 DCOS 文档**，例如 `folderPath = "/nuwa"`、`title = "Cognitive Framework Review"`。这与现有 DcosFile 的用途并不冲突，反而能把完整 reasoning artifact 归档进角色的长期记忆层。现有 Dcos 模型本来就适合保存富文本、版本化的叙事文档。citeturn17view3turn20search1

## API 与字段映射设计

### 统一中间产物

整个集成最重要的设计，不是某个端点，而是一个**统一的中间 JSON 契约**。我建议定义一个 `DistilledFramework`，先让所有 LLM 输出都收敛到这个结构，再由 mapper 把它拆成 OasisBio 的建议项。这样可以把“Nuwa 方法论”和“OasisBio 数据模型”解耦，后面无论你们换模型、换 prompt、还是把 true Nuwa worker 独立成服务，都不用改前端采纳逻辑。

```ts
type Evidence = {
  kind: 'bio' | 'era' | 'ability' | 'dcos' | 'reference' | 'world' | 'world_document' | 'web';
  sourceId?: string;
  label: string;
  snippet: string;
  confidence: 'high' | 'medium' | 'low';
  url?: string;
};

type MentalModel = {
  name: string;
  oneLiner: string;
  application: string;
  limitation: string;
  evidence: Evidence[];
};

type DecisionHeuristic = {
  name: string;
  rule: string;
  scenario: string;
  example: string;
  evidence: Evidence[];
};

type ExpressionDNA = {
  sentenceStyle: string;
  vocabulary: string[];
  rhythm: string;
  humor: string;
  certaintyStyle: string;
  citationHabit: string;
};

type AbilityDraft = {
  name: string;
  category: string;
  level: 1 | 2 | 3 | 4 | 5;
  description: string;
  relatedEraHint?: string;
  relatedWorldHint?: string;
  evidence: Evidence[];
};

type EraDraft = {
  name: string;
  eraType: 'past' | 'present' | 'future' | 'alternate' | 'worldbound';
  startYear?: number;
  endYear?: number;
  description: string;
  evidence: Evidence[];
};

type WorldDraft = {
  name: string;
  summary: string;
  timeSetting?: string;
  socialStructure?: string;
  rules?: string;
  timeline?: string;
  majorConflict?: string;
  genre?: string;
  tone?: string;
  evidence: Evidence[];
};

type ReferenceDraft = {
  url: string;
  title: string;
  description?: string;
  sourceType: string;
  provider?: string;
  tags: string;
  whyRelevant: string;
  evidence: Evidence[];
};

type DistilledFramework = {
  mentalModels: MentalModel[];
  decisionHeuristics: DecisionHeuristic[];
  expressionDNA: ExpressionDNA;
  antiPatterns: string[];
  tensions: { left: string; right: string; explanation: string; evidence: Evidence[] }[];
  honestLimits: string[];
  abilities: AbilityDraft[];
  eras: EraDraft[];
  worlds: WorldDraft[];
  references: ReferenceDraft[];
  descriptionPatch: {
    title: string;
    markdown: string;
    mode: 'append' | 'replace';
  };
};
```

这个契约之所以必要，是因为 Nuwa 原生产物面向 `.md` skill 文件，而 OasisBio 需要的是**可局部采纳的结构化建议**；两者之间必须有一个可测试的中间层。Nuwa 模板本身就把 SKILL 切成“心智模型、决策启发式、表达 DNA、时间线、价值观与反模式、诚实边界、调研来源”等 section，所以把它 JSON 化是天然顺手的。citeturn37view2turn39search0

### 端点设计

我建议遵循 OasisBio 当前“`/api/oasisbios/[id]/...` 建资源，`/api/<resource>/[id]` 改资源”的风格，但**Nuwa 不要散落到多个旧 CRUD 端点里**，而是拥有独立命名空间。

#### 创建任务

`POST /api/oasisbios/[id]/nuwa/runs`

```ts
const CreateNuwaRunSchema = z.object({
  mode: z.enum(['quick', 'deep']).default('quick'),
  sourcePolicy: z.enum(['local_only', 'local_plus_web']).default('local_only'),
  scopes: z.array(
    z.enum(['description', 'abilities', 'worlds', 'references', 'eras'])
  ).min(1),
  include: z.object({
    bioCore: z.boolean().default(true),
    eraIds: z.array(z.string()).default([]),
    abilityIds: z.array(z.string()).default([]),
    dcosIds: z.array(z.string()).default([]),
    referenceIds: z.array(z.string()).default([]),
    worldIds: z.array(z.string()).default([]),
    includeWorldDocuments: z.boolean().default(true),
  }),
  notes: z.string().max(2000).optional(),
  forceRefresh: z.boolean().default(false),
});
```

返回：

```json
{
  "runId": "nr_xxx",
  "status": "queued",
  "snapshotHash": "sha256:...",
  "cacheHit": false
}
```

这个端点要复用现有的 `requireAuth()` 与 `requireOasisBioOwnership()` 约束，因为当前所有核心 CRUD 都是这个模式。OasisBio 文档和源码已经明确：路由侧应拿到的是 `user.id`，不是旧 session wrapper；所有嵌套路由也都先做 ownership check 再写库。citeturn8view3turn22search2turn32view5turn32view7

#### 查询任务

`GET /api/oasisbios/[id]/nuwa/runs`
`GET /api/nuwa/runs/[runId]`

返回：

```json
{
  "runId": "nr_xxx",
  "status": "completed",
  "mode": "deep",
  "sourcePolicy": "local_only",
  "summary": {
    "mentalModels": 4,
    "decisionHeuristics": 7,
    "abilities": 5,
    "eras": 3,
    "worlds": 1,
    "references": 6
  },
  "items": [
    {
      "id": "ns_xxx",
      "scope": "ability",
      "operation": "create",
      "title": "长期叙事整合",
      "confidence": 0.84,
      "decision": "pending",
      "payload": { "...": "..." },
      "rationale": "从多个时代节点与叙事文档逆推出的稳定能力",
      "evidence": [ ... ]
    }
  ]
}
```

#### 采纳建议

`POST /api/nuwa/runs/[runId]/apply`

```ts
const ApplyNuwaSuggestionsSchema = z.object({
  itemIds: z.array(z.string()).min(1),
  descriptionMode: z.enum(['append', 'replace', 'manual_merge']).default('append'),
  worldTarget: z.union([
    z.object({ kind: z.literal('existing'), worldId: z.string() }),
    z.object({ kind: z.literal('new'), name: z.string().min(1) }),
  ]).optional(),
});
```

返回：

```json
{
  "runId": "nr_xxx",
  "applied": [
    { "itemId": "ns_1", "entityType": "ability", "entityId": "ab_123" },
    { "itemId": "ns_2", "entityType": "era", "entityId": "era_456" }
  ],
  "failed": []
}
```

#### 拒绝或归档建议

`POST /api/nuwa/runs/[runId]/reject`
`POST /api/nuwa/runs/[runId]/restore`

这两个端点只改 `NuwaSuggestion.decision`，不写核心表。

### OasisBio 字段映射

这里是最关键的字段映射逻辑。

`description` 方向最简单，也最值得先做。Nuwa 的 `mentalModels + decisionHeuristics + expressionDNA + antiPatterns + honestLimits` 可以先生成一段结构化 Markdown patch，用户审阅后以 `append` 或 `replace` 方式写回 `oasis_bios.description`。因为 `description` 本身就是主档中的长文本字段，且当前编辑页已经在本地 form state 中维护它，所以加一个 diff review 成本很低。citeturn20search1turn26view0

`abilities` 方向要遵守现有 schema。当前创建能力时必须至少有 `name` 和 `category`，可选 `level / description / relatedWorldId / relatedEraId`。因此 Nuwa 不能只给出抽象判断，比如“你很有系统思考能力”；必须被翻译成一个**可存表**的能力草案，例如 `name="系统化抽象"`, `category="technology" | "social-skills" | "worldbuilding-skills"`，`level=4`，并附上描述与证据。能力分类可以先映射到 OasisBio 现有能力分类文档里的行业桶位，再允许用户在 UI 中手改。citeturn32view5turn18view0

`worlds` 方向不能乱写。现有 `WorldItem` 有 `summary / timeSetting / geography / physicsRules / socialStructure / majorConflict / timeline / rules / factions` 等多个严肃字段，而 `aestheticKeywords` 在当前实现里又被拿来 JSON 序列化 `genre/tone`。所以对 Nuwa 而言，**“世界观深层矛盾”最合适的落点是 `majorConflict`，其次是 `rules / socialStructure / timeline`，而不是 `aestheticKeywords`**。如果用户已有世界，则把 Nuwa 结果做成一个 `update candidate`；如果没有世界，则建议新增一个“conceptual world”草案，例如 `Worldview of {bio.title}`。由于 OasisBio 文档本身把 worlds 定义为 fictional **or conceptual** worlds，这样做在语义上站得住。citeturn16view0turn17view3turn20search1turn35view0turn32view8

`references` 方向要注意当前数据约束。现有 `ReferenceItem` schema 要求 `url` 与 `title`，创建路由也明确校验这两项。这意味着 Nuwa 如果引用的是用户上传的本地 PDF、某段 DCOS 内容、或某个导入 transcript，就**不应该**强行写成 `reference_items` 行；这些更适合保留在 `NuwaSuggestion.evidence` 中。只有真正的外部链接型推荐素材，比如书、文章、访谈、视频，才应该生成 `ReferenceDraft` 并可一键写入现有 references 表。citeturn20search1turn32view6

`eras` 方向非常适合做 AI 建议。Nuwa 的时间线提炼与 OasisBio 的 `EraIdentity` 高度契合；现有 era 创建接口也会自动分配 `sortOrder`。因此只要把 Nuwa 抽取出的关键节点转成 `name / eraType / startYear / endYear / description` 即可落地。这里的原则是：**只生成“叙事上稳定且可命名”的阶段，不生成碎片事件**。Nuwa 的时间线 agent 本来就强调关键里程碑和最近动态，这一点与 OasisBio 的 era 结构相容。citeturn38view0turn32view7turn21view0

### 关键后端伪代码

下面这段伪代码基本可以让后端工程师直接开工。

```ts
// src/lib/nuwa/source-snapshot.ts
export async function buildNuwaSourceSnapshot(oasisBioId: string, include: IncludeOptions) {
  const bio = await prisma.oasisBio.findUnique({
    where: { id: oasisBioId },
    include: {
      abilities: true,
      eras: true,
      dcosFiles: true,
      references: true,
      worlds: {
        include: { documents: true },
      },
      models: false,
    },
  });

  if (!bio) throw new Error('OasisBio not found');

  return {
    bioCore: {
      id: bio.id,
      title: bio.title,
      tagline: bio.tagline,
      summary: bio.summary,
      description: bio.description,
      identityMode: bio.identityMode,
      currentEra: bio.currentEra,
      species: bio.species,
    },
    eras: filterByIds(bio.eras, include.eraIds),
    abilities: filterByIds(bio.abilities, include.abilityIds),
    dcosFiles: clipLongDocs(filterByIds(bio.dcosFiles, include.dcosIds)),
    references: filterByIds(bio.references, include.referenceIds),
    worlds: filterByIds(bio.worlds, include.worldIds),
  };
}
```

```ts
// src/lib/nuwa/orchestrator.ts
export async function runNuwaDistillation(runId: string) {
  const run = await prisma.nuwaRun.findUnique({ where: { id: runId } });
  if (!run) throw new Error('run not found');

  await prisma.nuwaRun.update({
    where: { id: runId },
    data: { status: 'processing', startedAt: new Date() },
  });

  const snapshot = await buildNuwaSourceSnapshot(run.oasisBioId, run.include as any);

  const buckets = mapSnapshotToNuwaBuckets(snapshot, {
    sourcePolicy: run.sourcePolicy,
  });

  const research = await parallelExtract([
    extractWritings(buckets.writings),
    extractConversations(buckets.conversations),
    extractExpressionDNA(buckets.expression),
    extractExternalViews(buckets.external),
    extractDecisions(buckets.decisions),
    extractTimeline(buckets.timeline),
  ]);

  const distilled = await synthesizeFrameworkWithNuwaContract(research, {
    mentalModelCount: [3, 7],
    heuristicCount: [5, 10],
  });

  const suggestions = mapFrameworkToSuggestions(distilled, snapshot);

  await prisma.$transaction([
    prisma.nuwaRun.update({
      where: { id: runId },
      data: {
        status: 'completed',
        distilled,
        summary: summarize(distilled),
        completedAt: new Date(),
      },
    }),
    ...suggestions.map((item) =>
      prisma.nuwaSuggestion.create({
        data: { runId, ...item },
      })
    ),
  ]);
}
```

```ts
// src/lib/nuwa/apply.ts
export async function applyNuwaSuggestions(runId: string, itemIds: string[], opts: ApplyOptions) {
  const items = await prisma.nuwaSuggestion.findMany({
    where: { runId, id: { in: itemIds }, decision: { in: ['pending', 'accepted'] } },
    include: { run: true },
  });

  const created: Array<{ itemId: string; entityType: string; entityId: string }> = [];

  for (const item of items) {
    await prisma.$transaction(async (tx) => {
      if (item.scope === 'description') {
        const current = await tx.oasisBio.findUnique({
          where: { id: item.run.oasisBioId },
          select: { description: true },
        });

        const nextDescription =
          opts.descriptionMode === 'replace'
            ? item.payload.markdown
            : mergeDescription(current?.description, item.payload.markdown);

        await tx.oasisBio.update({
          where: { id: item.run.oasisBioId },
          data: { description: nextDescription },
        });

        created.push({ itemId: item.id, entityType: 'oasisBio.description', entityId: item.run.oasisBioId });
      }

      if (item.scope === 'ability') {
        const ability = await tx.ability.create({
          data: {
            oasisBioId: item.run.oasisBioId,
            name: item.payload.name,
            category: item.payload.category,
            level: item.payload.level,
            description: item.payload.description ?? null,
            relatedEraId: item.payload.relatedEraId ?? null,
            relatedWorldId: item.payload.relatedWorldId ?? null,
          },
        });
        created.push({ itemId: item.id, entityType: 'ability', entityId: ability.id });
      }

      if (item.scope === 'era') {
        const maxOrder = await tx.eraIdentity.aggregate({
          where: { oasisBioId: item.run.oasisBioId },
          _max: { sortOrder: true },
        });

        const era = await tx.eraIdentity.create({
          data: {
            oasisBioId: item.run.oasisBioId,
            name: item.payload.name,
            eraType: item.payload.eraType,
            startYear: item.payload.startYear ?? null,
            endYear: item.payload.endYear ?? null,
            description: item.payload.description ?? null,
            sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
          },
        });
        created.push({ itemId: item.id, entityType: 'era', entityId: era.id });
      }

      await tx.nuwaSuggestion.update({
        where: { id: item.id },
        data: {
          decision: 'applied',
          appliedAt: new Date(),
        },
      });
    });
  }

  return created;
}
```

## 前端交互与用户采纳机制

### 触发方式

我建议不要只做一个“隐藏按钮”。最自然的入口有三个。第一，在角色 Identity 页右上角的主操作区新增一个 `Nuwa 深化` 按钮，与当前 Save / Publish 同级；第二，在现有子导航里增加一个 `Nuwa` tab，让 AI 建议成为角色编辑的正式工作区；第三，在 Abilities、Worlds、Eras、References 各页顶部放 scope-specific CTA，比如“基于现有资料生成能力建议”“从时间线生成 Era 建议”。这样做的原因很简单：当前角色页已经有稳定的子导航与 toast/save 机制，而世界模块也已经验证过“卡片 + 向导”的交互成立。Nuwa 最好长成 OasisBio 原生模块，而不是浮层外挂。citeturn27view1turn26view0turn26view2turn24view0turn30view0

### 审阅页信息架构

推荐新增页面：

`/dashboard/oasisbios/[id]/nuwa`

页面分三栏。

左栏是**素材选择器**。默认勾选 `Bio Core + Eras + DCOS + References + Worlds`，并显示每类条数。对于包含隐私内容的 DCOS，允许用户取消勾选。若用户开启 `local_plus_web`，这里额外展示一个醒目的隐私提醒：“将基于你选中的资料做外部延展搜索”。

中栏是**任务状态与建议列表**。顶部显示三段式状态：`采集 → 提炼 → 审阅`。完成后按 scope 分组展示建议：Description、Abilities、Worlds、References、Eras。每张建议卡片上显示标题、摘要、来源数、confidence、编辑按钮、拒绝按钮、采纳按钮。对于 `description`，显示 diff viewer；对于 `ability/era/reference`，显示内联可编辑表单；对于 world suggestion，显示“应用后 completion score 会从 X 提升到 Y”的提示，因为现有 world 模块已经有 completion score 逻辑。citeturn35view1turn30view2turn29view1

右栏是**证据面板**。点击任意建议卡后，右侧展示：
- 这条建议为什么出现；
- 证据片段；
- 证据来自哪类对象（DCOS / era / reference / world / bio core / web）；
- 可信度；
- 如果是 web 模式，还显示原始 URL。

这是对 Nuwa “每条研究都标注来源与可信度”的直接产品化。建议不要只显示“AI 认为”，而要显示“AI 基于哪些你自己的内容作出这个判断”。citeturn38view0

### 采纳、拒绝与冲突处理

采纳机制必须是**可局部采纳**而非“全量覆盖”。我建议每条建议支持三种状态：`pending`、`accepted`、`rejected`；页面底部再提供一个 `Apply selected`。用户可以先接受十条建议中的三条，再批量落库。这样做既符合你们“最终控制权始终在用户手中”的目标，也符合 OasisBio 当前资源是分表 CRUD 的形态。citeturn21view0turn20search1

冲突处理则分两类。结构化 create 型建议（abilities / eras / references / new worlds）只需在采纳前做重复检测即可，例如相同名称、相同年份段、相同 URL。文本 merge 型建议（description / update-existing-world）则要在 `NuwaRun` 创建时保存一个 `baseFingerprint`；当用户点击采纳时，如果底层内容已经变化，就提示“建议基于旧版本生成，请重新合并”，并进入手动 merge。因为 `OasisBio` 与 `WorldItem` 都有 `updatedAt`，而角色编辑页又是本地 state 驱动，做这层 stale check 是值得的。citeturn20search1turn26view0

有一个很适合你们现有 UI 的小设计：**“采纳前可改写”**。世界创建向导与角色主编辑页都已经是强编辑场景，不是只读场景；所以 Nuwa 建议卡本身就应该是可编辑 draft，而不是静态文本。用户在 ability 草案上临时把 `category` 从 `technology` 改成 `worldbuilding-skills`，或在 era 草案上改 `eraType`，应该直接支持。这能显著降低“AI 乱猜字段”的心理阻力。citeturn29view1turn18view0

## 性能、安全与实施路径

### 性能与缓存

Nuwa 类任务的性能关键不在数据库，而在**输入裁剪、去重缓存与异步化**。我建议每次 run 基于所选素材生成 `snapshotHash = sha256(normalizedSnapshot)`；如果同一个角色、同一组素材、同一 `promptVersion`、同一 `mode` 已经有完成结果，而且用户没有 `forceRefresh`，就直接返回缓存。这样可以避免“每次打开页面都重新蒸馏”。由于 OasisBio 的主角色 GET 已经能集中返回多数关系数据，快照构建成本并不高。citeturn32view2

输入裁剪方面，`quick` 模式只取 `bio core + eras + 最近 N 个 DCOS + 最近 N 个 references + 已有关联 worlds`，并限制每个 bucket 的最大字符数；`deep` 模式才跑全量。Nuwa 原生方法是 6 路并行研究与多阶段提炼，直接照搬到线上时延会爆炸，所以必须在产品层做 mode 分层。这一建议是对 Nuwa 方法和 OasisBio 线上形态做出的工程优化。citeturn39search4turn38view0turn38view1

并发上，我建议设置两道闸：同一 `oasisBioId` 同时只能有 1 个 `processing` run；同一 `userId` 同时最多 3 个排队/处理中 run。这样既保证体验，也能防止少数用户把后台 token 打爆。

### 错误处理与降级

当前 OasisBio 的通用错误规范已经比较明确：API 层通过 `handleApiError()` 返回 `{ error: { code, message } }`；技术文档里的 planned Edge Functions 也要求统一这个格式并附带 `request_id`。Nuwa 模块应该严格沿用这个规范，不要另起一套。citeturn8view3turn40view1

降级策略我建议写死成下面几条：

- 如果 `local_plus_web` 的 web enrich 失败，**自动退回 local_only**，但保留已生成的本地建议。
- 如果只成功生成了 `description + eras`，而 `references` 失败，run 仍标记为 `completed_with_warnings`，前端显示黄条提示，而不是整单失败。
- 如果 reference suggestion 缺少合法 URL，就只保留在 suggestion layer，不写入 `reference_items`。
- 如果 description merge 检测到底层已变更，就禁止一键应用，要求手动 merge。
- 如果模型输出不符合 JSON schema，就做一次 repair；修复仍失败，写入 `failed` 并保留 raw output 到 `NuwaRun.error/raw`.

这套设计遵循的原则是：**AI 建议可以部分成功，但不能静默污染主数据**。

### 安全、隐私与审计

这部分必须比普通 AI 功能更严，因为你们处理的是人格资料库。

第一，**默认只用站内资料**。Nuwa 的方法虽然支持 web research，但它同样明确支持 pure local mode，且在非公众人物场景下应该优先本地材料。对 OasisBio 来说，`sourcePolicy` 默认应是 `local_only`；只有用户显式勾选，才允许 `local_plus_web`。citeturn37view0

第二，所有模型/外部服务凭证必须是 server-only 环境变量。无论你们最后用 Anthropic、OpenAI、还是别的推理服务，都应放在服务端；前端永远只拿 `runId` 和状态，不拿任何 provider key。

第三，采纳与拒绝动作要进审计。技术文档已经定义了 `audit_logs` 的 `action / target_type / target_id / request_id / metadata` 结构，也说明插入是 service-role only。建议新增三类 action：`nuwa.run.create`、`nuwa.suggestion.apply`、`nuwa.suggestion.reject`。如果你们的后端链路已经有 service role 能力，就顺手把 `NuwaRun.summary`、采纳项数与实体 ID 一起记进 metadata。citeturn40view2

第四，建议完成与应用事件可以写入 `domain_events`，例如 `nuwa.completed`、`nuwa.applied`。这不是 MVP 必需，但文档已经说明 publish / unpublish 都会写 domain events，而且未来 Edge Function / async consumer 也会围绕它工作。Nuwa 跟进这一模式，后面做搜索索引、推荐系统或“身份成长回顾”都会舒服很多。citeturn40view0turn40view1

第五，如果未来把 Nuwa 变成独立服务，不要给它直连数据库。OasisBio 现有 OAuth Provider 已经支持第三方通过 `oasisbios:read`、`oasisbios:full`、`dcos:read` 等 scope 读取角色数据；因此二期完全可以把 Nuwa Worker 外置成 first-party app，经 OAuth 拿到最小必要授权。MVP 阶段因为你们是同一产品内集成，可以走内部服务；但中长期最干净的边界仍是 OAuth。citeturn10search4turn22search2

### 分阶段实施方案

我建议按下面四段推进，而不是一口气做“大一统 AI 大脑”。

第一阶段，做**后端基础设施**：新增 `NuwaRun / NuwaSuggestion` 表；实现 `POST create run`、`GET run/list`、`POST apply`；完成 source snapshot builder；先只支持 `description + eras + abilities` 三个 scope。因为这三个 scope 映射最稳定，且都不依赖 world/reference 的额外歧义处理。citeturn20search1turn32view5turn32view7

第二阶段，做**前端工作台**：新增 `/dashboard/oasisbios/[id]/nuwa` 页面；接入 run 状态、建议卡、证据面板、逐条采纳；在 Identity 页加 `Nuwa 深化` 按钮。交互风格直接复用现有 `Card / Button / Toast / Sub-navigation` 与世界向导的节奏。citeturn26view2turn27view1turn29view1turn30view0

第三阶段，扩到**worlds + references**。这时同时补上两条规则：world suggestions 对 existing/new world 做目标选择；reference suggestions 只允许 URL 型建议一键落盘，站内证据继续保留在 suggestion layer。citeturn32view6turn32view8turn35view0

第四阶段，再做**异步 worker 化与外部化能力**：把处理器迁移到 Edge Function/后台队列；接入 `audit_logs` 与 `domain_events`；增加 `web enrich`；可选生成一份归档到 DCOS 的 Nuwa report；如果未来需要独立服务，再走 Oasis OAuth。这样路线最稳，也最符合你们当前代码库的成熟度。citeturn40view1turn40view0turn17view3turn10search4

从工程落地角度，**最值得马上做的，不是“先把 LLM 调很好”，而是先把中间层建对**：任务表、建议表、证据结构、局部采纳、回滚审计、字段冲突处理。一旦这层搭好，Nuwa 的 prompt 可以不断迭代；如果这层没搭好，任何“AI 很聪明”的 demo 很快都会在真实用户数据里失控。基于 OasisBio 当前源码与 Nuwa 当前仓库形态，这是我认为最稳、也最可执行的集成路径。citeturn20search1turn39search1turn38view1