# OasisBio 叙事优化报告

## 1. 总体判断

当前 OasisBio 的叙事**并未体现出“开放身份上下文基础设施”**的定位。仓库首页和 README 反复强调“跨时代身份”、“角色创建”、“世界观构建”等概念【96†L253-L258】【89†L1499-L1504】；SEO 元数据 title/description 也聚焦于“数字身份构建器与角色创建平台”【110†L439-L444】。这些表述容易让用户误以为 OasisBio 是一个面向个人角色扮演或社区创作的 profile 工具，而非用于 AI/应用协作的基础设施。**基础设施叙事完成度**很低，估计仅 10/100 左右。**AI 可读身份叙事**亦几乎未提及，完成度接近 0/100（当前没有任何页面讲述 AI 护照或机器可读上下文）。**社区传播叙事**目前也欠缺，项目侧重功能堆砌，未充分突出开放协作和贡献；完成度或许 20/100。**开发者集成叙事**几乎不存在，文档仅列出基本 API（身份、能力、世界等）【55†L25-L29】，没有说明如何通过 OAuth 或 API 获取用户上下文；完成度也非常低，大约 10/100。**普通用户的理解成本**偏高：由于现有页面语言围绕“多时空身份”、“世界构建”等专业和游戏化术语，普通用户很难快速理解产品实际用途，应回答“我能用 OasisBio 干什么”。综上，项目现有叙事偏向*profile/角色创建*工具，离“AI 时代身份上下文基础设施”目标尚有很大差距。

- **基础设施叙事完成度：10/100** – 页面表述主要集中在角色和跨时代身份，与基础设施定位不符【89†L1499-L1504】。  
- **AI 可读身份叙事完成度：5/100** – 完全没有以 AI 护照或机器可读上下文为核心的内容【110†L439-L444】。  
- **社区传播叙事完成度：20/100** – 缺少面向社区宣传的内容，GitHub 也无社群文件辅助传播。  
- **开发者集成叙事完成度：10/100** – 文档仅列出常规 API，未提及如何通过 OAuth/API 获取身份上下文【55†L25-L29】。  
- **普通用户理解成本：高** – 当前内容过度抽象、角色化，不直观说明可实现的场景，用户易感迷茫。  

## 2. 当前叙事的核心问题

- **Hero 与 SEO 标题抽象，缺乏场景说明**：首页 Hero “BUILD AN IDENTITY BEYOND TIME”【89†L1499-L1504】及 SEO title “Digital Identity Builder & Character Creator Platform”【110†L439-L444】等措辞过于抽象，未点明 OasiBio 的基础设施定位和核心价值（如 AI 护照）。例如，元数据描述中提到“角色创建平台”、“跨时代身份”【110†L439-L444】，给人感觉是一个角色扮演工具，而非面向应用和 AI 的身份上下文层。  
- **过度强调角色/世界构建**：README 和页面多次提到“角色创建”、“世界观”、“DCOS 框架”、“3D 模型”等概念【96†L253-L258】【48†L924-L928】。这些内容会让用户误以为 OasisBio 主要是用于幻想创作或个人档案展示，而忽视其作为开放身份层的意义。  
- **未讲清「别人能基于它做什么」**：当前页面多以特性列表形式介绍功能，却缺乏具体的使用场景描述。普通用户看不到“用 OasisBio 可以让 AI 快速了解你，实现什么功能”，如没有“使用场景”或“示例应用”板块，缺少故事引导。  
- **缺少 AI 场景入口**：整个项目没有以 AI 为核心的入口或标语。例如首页、文档中没有任何提及“AI 护照”、“可读上下文”等关键字，未利用“Stop reintroducing yourself to every AI.”等口号去吸引 AI 时代用户。SEO 描述也未提及 AI 相关【110†L439-L444】。  
- **开发者和社区定位模糊**：没有专门的“开发者”或“社区”页来引导。技术文档（`docs/technical.md`）只列出了基本 API【55†L25-L29】；没有 OAuth scopes、机器可读接口的说明。GitHub 缺少 CONTRIBUTING、CODE_OF_CONDUCT 等社区协作文件，难以引导贡献者。  
- **文案层次不够清晰**：当前首页和 About 页面缺少层次化的信息架构，比如“我们是谁”、“我们能做什么”、“联系我们”没有明确分区。首屏文案空洞，About 页面中多为感性描述（为何身份可扩展）、功能列表式的“Key Features”【48†L924-L928】【48†L954-L963】，而没有直接告知用户产品的关键价值点和使用指引。

## 3. 应该确立的新主叙事

**A. 面向普通用户**  
- **一句话定位**：*“创造一个一次设置、处处可用的身份上下文，让 AI、应用和社区瞬间了解你。”*  
- **首页 Hero 标题**：*Your AI-Powered Identity Passport*  
- **Hero 副标题**：*只需创建一个结构化身份，上百款应用和 AI 都能理解它。停下重复介绍自己吧！*  
- **CTA 文案**：*创建我的身份卡 (Create My Identity Card)*  
- **3 个核心价值点**：  
  1. **无需重复介绍**：一次建立身份，AI 和应用即刻获取你的背景信息。  
  2. **可携带的身份上下文**：掌控可分享的个人信息片段，随时授权不同平台读取。  
  3. **隐私可控**：公开可读部分，由你决定分享给谁、读取什么。  
- **不应再用的旧表达**：角色、人物介绍、世界观、3D模型等情景式用语（如 “角色创建”、“跨时代身份”）。  
- **推荐使用的新表达**：*Identity Context*、*AI Passport*、*machine-readable profile*、*structured identity*、*open identity infrastructure*。  
- **示例**：在网站或 README 中突出口号 “Stop reintroducing yourself to every AI.”、“Build once, use everywhere.”。  

**B. 面向 AI 重度用户**  
- **一句话定位**：*“为 AI 量身打造的开放身份层，让每个 AI 都能解读你的上下文。”*  
- **首页 Hero 标题**：*AI-Ready Identity Layer*  
- **Hero 副标题**：*让任意 AI 立即了解你的身份背景，无需重新输入信息。*  
- **CTA 文案**：*获取我的 AI 护照 (Get My AI Passport)*  
- **3 个核心价值点**：  
  1. **可读性**：身份信息以结构化格式呈现，AI 无缝读取。  
  2. **可拓展性**：一个身份可适配不同 AI 应用场景（助手、机器人、游戏 NPC 等）。  
  3. **一站式集成**：用 OAuth 或 API 将 OasisBio 嵌入你的 AI 平台，实现自动个性化。  
- **不应再用的旧表达**：仅针对“角色扮演”、“个人简历”的说法。  
- **推荐使用的新表达**：*AI Passport*、*Machine-readable Context*、*OAuth 身份上下文*、*MCP (Machine Consumable Profile)*。  

**C. 面向开发者和开源社区**  
- **一句话定位**：*“构建时使用身份上下文，而不是空的用户档案。”*  
- **首页 Hero 标题**：*Open Identity Context Infrastructure*  
- **Hero 副标题**：*借助 OAuth/OpenID 轻松集成用户身份上下文，为应用和服务提供精准的用户画像。*  
- **CTA 文案**：*查看开发者文档 (Developer Docs)*  
- **3 个核心价值点**：  
  1. **OAuth 接入**：通过标准 OAuth Scope 获取用户的结构化身份上下文（包括基本信息和偏好）。  
  2. **开放协议**：可通过 `.well-known/oasisbio.json` 和 `/api/context/{slug}` 等约定访问身份卡。  
  3. **社区贡献**：模板、扩展和示例随开源贡献增长，让每个人都能扩充身份上下文的可能。  
- **不应再用的旧表达**：将 OasisBio 简单定位为用户档案管理工具。  
- **推荐使用的新表达**：*身份上下文层 (Identity Context Layer)*、*OAuth Scope (context:read)*、*Machine Consumable Profile*、*开放身份协议 (Open Identity Protocol)*。

## 4. 需要修改的文件清单

| 优先级 | 文件路径                                     | 当前问题                                                       | 建议修改                                                        | 推荐新文案或结构                                             | 预期影响                                            | 单独 PR? |
| :----: | ---------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------- | :------: |
| P0     | `src/app/layout.tsx`                    | SEO 元数据强调“数字身份构建、角色创建平台”【110†L439-L444】            | 更新页面 `<title>`、`description` 为强调身份上下文和 AI 护照                | **title**: “OasisBio – Open Identity Context for the AI Era”; **description**: “Create one portable AI-readable identity. Stop reintroducing yourself to every app and AI.” | 符合新定位，提高搜索点击和品牌辨识度                    | ✓       |
| P0     | `src/app/page.tsx` (首页)                | 主页 Hero 标题“BUILD AN IDENTITY BEYOND TIME”及副标题【89†L1499-L1504】过于抽象 | 重写 Hero 部分，直接传递 “AI身份上下文” 核心概念                         | **标题**: “Your Identity Passport”; **副标题**: “Create a structured identity once, let apps and AI understand you everywhere.” **CTA1**: “Create My Identity Card”; **CTA2**: “Learn More”. | 让用户一目了然 OasisBio 的定位与价值                     | ✓       |
| P0     | `src/app/page.tsx` (首页)                | 首屏下方“Identity Container”、“Ability Pool”等卡片描述侧重角色和技能【89†L1585-L1593】 | 重新梳理核心功能模块标题和描述，突出身份上下文属性                       | 将“Identity Container”改为“Identity Context”; 内容示例：“Store one profile with past, present, future info so every AI gets your full context.”  | 引导用户理解每一块功能的身份上下文意图                | ✓       |
| P1     | `src/app/about/page.tsx` (关于页)         | “What is OasisBio? A modular identity system for people, characters…”【46†L654-L660】 | 改写 About 页开头，突出基础设施定位                               | **标题**: “什么是 OasisBio”；**副标题**: “开放身份上下文层，让 AI、应用与社区即刻获取你的结构化身份信息。” | 统一首页与关于页定位，消除混淆，提高用户理解度             | ✓       |
| P1     | `src/app/about/page.tsx` (关于页)         | “为什么身份应该可扩展” 等内容侧重个人成长和角色【46†L676-L684】       | 删除与 AI 无关的故事描述，加入 OasisBio 的实用场景说明                   | 添加“使用场景”区块，例如：“使用 OasisBio，你可以让智能助手无需额外输入即了解你的身份和偏好。” | 让普通用户快速看到实用价值和用途                      | ✓       |
| P1     | `src/app/about/page.tsx` (关于页)         | “Key Features” 列表包含“3D Model Support”、“Public Presence”【48†L924-L933】等，侧重个人主页 | 重构功能列表，突出 AI 可读性和 OAuth 集成                             | 将“Public Presence”改为“Machine-readable Profiles”；“3D Model Support”可修改为“可视化个人头像支持”并简化说明等 | 突出机器可读特性，弱化与角色扮演无关的功能             | ✓       |
| P1     | `README.md`                             | 第一段“comprehensive identity management…”【96†L253-L258】与角色创建相关               | 重写 README 头部，引入“身份上下文基础设施”概念和 AI 场景                    | **一句话定位**: “OasisBio is an open identity context infrastructure for the AI era.” 等；增加“AI Passport”“For Developers”板块示例。 | 改善项目在 GitHub 上的展示，使来访者迅速明白项目定位      | ✓       |
| P2     | `docs/technical.md`                     | 仅列出常规 API 路由，无 OAuth 或 AI 上下文相关说明【55†L25-L29】    | 补充 `/api/context/[slug]` 和身份上下文相关接口说明；加入 OAuth scope 信息           | 在技术文档中新增“Identity Context API: GET /api/context/:slug”等；建议新增 scope `context:read`。 | 提供给开发者明确的身份上下文调用文档，支持二次开发        | ✓       |
| P2     | 项目根目录 (`CONTRIBUTING.md`)          | 缺少社区贡献指南                                       | 新增 CONTRIBUTING 文件，说明如何贡献文案、模板、代码                        | 简要说明贡献步骤、提交规范及如何撰写示例身份模板等            | 降低贡献门槛，引导更多人参与                              | ✓       |
| P2     | 项目根目录 (`CODE_OF_CONDUCT.md`)        | 缺少行为准则                                         | 新增 Code of Conduct，鼓励尊重和包容的社区氛围                            | 使用通用模板，注明对歧视、骚扰零容忍等                        | 增强社区友好度，使贡献者感到受欢迎                       | ✓       |
| P2     | 项目根目录 (`SECURITY.md`)              | 缺少安全策略                                         | 新增 SECURITY 文件，说明漏洞报告方式                                    | 简要说明安全问题报告流程，联系邮箱等                            | 确保安全问题有规范通道，提高信任度                       | ✓       |
| P2     | `.github/ISSUE_TEMPLATE/`               | 缺少 issue 模板                                       | 添加 Good First Issue 和 Feature Request 模板                          | Good First Issue: “帮助完善文档中的身份上下文示例” 等             | 引导新人贡献、收集建设性反馈                              | ✓       |
| P2     | `.github/PULL_REQUEST_TEMPLATE.md`      | 缺少 PR 模板                                          | 添加 PR 模板，要求说明改动目的和关联 issue                              | 简短格式，如“更改内容”、“关联 issue”等                        | 提升 PR 质量，确保变更易于审查                            | ✓       |
| P2     | `src/app/bio/[slug]/page.tsx` (公开档案) | 当前公开个人档案页面主题依旧角色化 (若存在)                    | （若添加）新增 `/bio/[slug]/ai` 页面显示 AI 上下文信息                   | 页面示例标题：“AI Context Card for [Username]”，内容展示结构化 JSON 或摘要 | 为用户和开发者提供快速复制上下文的页面入口               | ✗ (需确认) |
| P2     | `src/app/api` （API 目录）               | 无 `/api/context` 路由                                  | 新增 `src/app/api/context/[slug]/route.ts` 返回 JSON 身份上下文              | 根据身份数据库返回结构化字段，如 `who_i_am`、`goals` 等         | 支持外部应用读取用户上下文，实现 AI 引入                   | ✓       |
| P2     | `src/app/api/auth`（若有）              | 可能缺少上下文相关 scope                                | 在 OAuth 登录流程中新增 `context:read` 权限选项                          | 让授权应用可以请求读取用户身份上下文                            | 扩展登录授权范围，便于第三方获取个人上下文                | ✗ (需确认) |

> **注**：列表中的文件和路径必须精准指向可修改的文件；对猜测路径列“需确认”以便人工核实。

## 5. 首页叙事重构建议

假设当前首页文件为 `src/app/page.tsx`，我们建议按照以下结构分区：

1. **Hero：OasisBio 是什么**  
   **标题**：OasisBio: Your AI-Powered Identity Passport  
   **副标题**：创建一个一次设置、处处可用的身份，让所有 AI、应用和社区瞬间了解你。  
   **正文**（3-5 行）：在数字时代，你只需建立一个结构化的身份档案。每次使用新应用或AI助手时，系统可自动读取你的身份上下文，无需重复填写信息。控制你共享的个人信息，让授权更加安全便捷。  
   **CTA**：“创建我的身份卡 (Create My Identity Card)”【对应文件：`src/app/page.tsx` 中 Hero 区块】

2. **Problem：重复介绍自己的困境**  
   **标题**：Stop Reintroducing Yourself  
   **副标题**：每次注册新应用或与 AI 交互时，都需要重新输入个人信息。  
   **正文**：想象一下，一个陌生的 AI 机器人又让你填表格介绍自己。OasisBio 解决了这个问题：你的身份信息可以被携带和授权，AI/应用自动认识你，无需额外设置。  
   **CTA**：“了解 OasisBio 的作用 (Learn How)”【对应文件：新增<section> 位置，或页面现有“Problem”区块】

3. **What it is：结构化身份上下文层**  
   **标题**：什么是结构化身份上下文？  
   **副标题**：开放且可扩展的身份信息层，让所有平台都能理解你的数字身份。  
   **正文**：OasisBio 并不是普通的个人主页或名片，而是为 AI 和应用准备的“可读身份卡”。它将你的基本信息、偏好、项目等整理成结构化数据，任何拥有授权的服务都能快速读取。创建一次，处处可用。  
   **CTA**：“探索身份上下文 (Explore Identity Context)”【对应文件：可能新增 Section】

4. **What it powers：意想不到的应用场景**  
   **标题**：OasisBio 能带来什么  
   **副标题**：查看使用 OasisBio 后可以实现的智能场景。  
   **正文**（要点）：  
   - **即时个性化**：AI 助手读取你的兴趣和技能后，立即为你定制建议。  
   - **便捷登录**：新应用通过 OAuth 获取你的基础数据，无需重复注册。  
   - **社区协作**：在创作社区或游戏中，用一个统一身份连接创作者和受众。  
   **CTA**：“查看示例 (See Examples)”【对应文件：新增场景示例组件】

5. **For AI：AI 护照 / 机器可读上下文**  
   **标题**：面向 AI 的身份护照  
   **副标题**：随时将你的身份上下文分享给 AI 平台。  
   **正文**：OasisBio 生成 AI 可读的 “Context Card”，你可以一键复制给 Copilot、ChatGPT 等工具，让它们瞬间了解你的背景。只需在对话框粘贴链接或上传文件，AI 即可加载你的个人简介、目标和偏好。  
   **CTA**：“复制给 AI (Copy to AI)”【对应文件：建议创建 `/bio/[slug]/ai` 页面和相关按钮链接】

6. **For Developers：集成指南**  
   **标题**：面向开发者：身份上下文 API  
   **副标题**：通过标准 API 和 OAuth 将用户上下文纳入你的应用。  
   **正文**：开发者可以使用 `/api/context/{slug}` 接口获取用户结构化信息，或通过 OAuth 获取用户授权。在产品中接入 OasisBio 后，用户登录即可自动填充资料，增强交互体验。  
   **CTA**：“查看开发者文档 (Developer Docs)”【对应文件：建议新增开发者文档页面或链接】

7. **For Creators：创作者 & 世界观**  
   **标题**：面向创作者与世界观构建者  
   **副标题**：用 OasisBio 管理角色和故事框架。  
   **正文**：游戏设计师、写手和世界观构建者可以把 OasisBio 作为角色数据基础库。每个角色都有自己的身份卡，便于在多个项目中重复使用，并支持多人协作和共创。探索模板系统，快速创建角色身份。  
   **CTA**：“浏览模板 (Browse Templates)”【对应文件：`src/app/templates` 目录（目前空），或新增内容】

8. **Community CTA：加入并贡献**  
   **标题**：加入 OasisBio 社区  
   **副标题**：贡献你的创意与案例，帮助更多人使用 OasisBio。  
   **正文**：欢迎展示你的 OasisBio 身份、提交创作模板或翻译文档。浏览 [Showcase](#) 了解其他用户的身份示例，用自己的经历来丰富这个开放身份协议。  
   **CTA**：“贡献你的 Identity Card”【对应文件：若有 Showcase 页面或 README 末尾链接】

以上各部分都建议在 `src/app/page.tsx` 中相应位置进行修改或新增对应组件，以符合新的叙事结构。

## 6. README 重写建议

**当前首屏问题**：现有 README 开头第一句为“*OasisBio is a comprehensive identity management system that allows users to create, manage, and showcase digital identities across multiple time periods and dimensions*”【96†L253-L258】。这一描述过于侧重“身份管理”、“多个时间维度”、“角色能力”等，难以传达项目作为开放身份层和 AI 护照的价值。

**新 README 开头示例**（英文可直接替换）：

```
# OasisBio

**Open Identity Context for the AI Era.** OasisBio lets you create *one* structured digital identity that any AI, app, or community can understand. Instead of filling out new profiles every time, simply authorize your OasisBio and instantly share your background, skills, and preferences in a machine-readable format.

[![MIT License][license-badge]][license-link] [![Chat on GitHub][discord-badge]][discord-link]

## Demo & Showcase

- Live Demo: [oasisbio.app](https://oasisbio.app)  
- Showcase: [Example OasisBios](#)  

## What can you build with OasisBio?

- **AI Assistant Personalization**: Let AI helpers fetch your OasisBio context to give tailored responses.  
- **Instant Onboarding**: New apps read your identity passport via OAuth and auto-populate user settings.  
- **Worldbuilding & Role-play**: Use OasisBio as the backend for consistent character info across games and stories.  

## The AI Passport

Your OasisBio acts as a portable *AI Passport*. It is represented as a JSON-LD context card accessible via a well-known URL and API. For example:
```
GET https://oasisbio.app/api/context/your-username
```
This returns structured data (who you are, what you do, preferences, etc.) that AI agents can consume. You can also generate a sharable `.json` or `.md` for use with any AI tool (e.g., paste into a prompt or browser extension).  

## For Developers

OasisBio provides OAuth / OpenID Connect support and REST APIs for identity context. After users sign in with OasisBio, your app can request the `context:read` scope to receive the user's full profile context. See [docs/API.md](docs/API.md) for endpoints and examples:
```js
const ctx = await fetch('https://oasisbio.app/api/context/alice', { headers: { Authorization: `Bearer ${token}` }})
```
This returns a JSON object with fields like `who_i_am`, `skills`, `projects`, etc., letting you personalize experiences out-of-box.

## Community

We’re building OasisBio together. Contributions welcome! Add templates, translations, example identities, or improve documentation. Check out [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute.  

```

**Badges/Links 建议**：顶部可加上许可徽章（MIT License）、持续集成状态、Discord/Slack 等社区链接、GitHub 关注/讨论按钮等。Demo 链接指向实际部署地址（例如 `oasisbio.app` 或 `oasisbio.com`）；Showcase 链接可指向一个用户案例展示页面。  

**“What can you build with OasisBio?”**：直接列举几个用例，以示范该项目价值。  
**“AI Passport”**：专门说明 OasisBio 生成可被机器读取的 JSON-LD 身份卡。  
**“For developers”**：强调 OAuth scope 和 API 例子，突出“使用身份上下文，而非空用户档案”。  
**“Community”**：说明如何贡献非代码内容（文案、模板、示例身份）。

## 7. AI Passport / AI-readable Context 产品叙事建议

**已有能力**：目前项目支持基本的用户身份和角色信息存储，并有 `/api/export` 等导出功能，文档列出了如 `/api/profiles`、`/api/oasisbios` 等接口【55†L25-L29】，但没有明确针对 AI 情境的接口。公开档案（`/bio/[slug]`）存在，可以作为基础，但尚未专门提供机器可读格式或协议。

**缺失入口**：尚无清晰的用户界面或 API 让人获得 AI 上下文。例如，没有 `.well-known` 文件或特定 “AI Passport” 页面，也没有 JSON-LD 输出。目前的导出功能导出的是 ZIP 人类可读内容，而非为 AI 设计的纯数据格式。

**建议新增功能**：
- 新增页面 `src/app/bio/[slug]/ai/page.tsx`：当访问 `/bio/{slug}/ai` 时，展示该身份的 AI 上下文（可视化摘要和原始 JSON）。
- 新增 API 路由 `src/app/api/context/[slug]/route.ts`：返回该用户身份的上下文 JSON（JSON-LD 格式），字段包括姓名、个人陈述、项目、技术栈、边界信息、许可权限等。
- 在根目录下新增 `.well-known/oasisbio.json`：用于身份发现，指向上下文 schema 版本、规范文档等。
- 文档：添加 `docs/ai-passport.md` 介绍 OasisBio AI 护照概念及使用；`docs/context-schema.md` 定义上下文字段规范；`docs/mcp.md`（MCP = Machine Consumable Profile）说明如何生成/使用机器可读个人档案。

**推荐的 AI Context Card Schema**（示例字段）：
```yaml
{
  "@context": "https://oasisbio.app/context.jsonld",
  "id": "https://oasisbio.app/bio/alice", 
  "who_i_am": "Alice Johnson, software engineer and musician",
  "what_i_am_working_on": "Building AI-powered identity solutions",
  "goals": "Automate user onboarding and personalization",
  "communication_preferences": "Email and Slack",
  "projects": ["OasisBio Identity Passport", "Open-Source Chatbot"],
  "technical_stack": ["Next.js", "Supabase", "Three.js"],
  "creative_worlds": ["Sci-fi writer for world Omega"],
  "boundaries": "Public info only (no private emails)",
  "permissions": "Allow read access via OAuth scope 'context:read'",
  "last_updated": "2026-05-10T12:34:56Z"
}
```
- `who_i_am`：基本身份简介。  
- `what_i_am_working_on`：目前项目或关注点。  
- `goals`：短期/长期目标。  
- `communication_preferences`：偏好的联系方式方式。  
- `projects`：主要项目或作品列表。  
- `technical_stack`：技术专长。  
- `creative_worlds`：如有参与的故事或概念世界。  
- `boundaries`：隐私边界（公开哪些信息）。  
- `permissions`：已授权哪些应用或使用 OAuth scope。  
- `last_updated`：时间戳，方便同步。  

以上 schema 可放在 `docs/context-schema.md` 中详述。新的 `/api/context/{slug}` 接口应返回类似结构的 JSON-LD，以方便 AI 或机器自动使用。

## 8. 开发者叙事与 OAuth 叙事优化

**当前问题**：开发者文档缺乏“身份上下文”场景描述。仅列出基础 API【55†L25-L29】，没有示例或使用案例。OAuth 部分（基于 Supabase Auth) 未提及扩展 scope。没有演示如何利用身份上下文构建应用。

**建议**：
- **增加开发者用例**：在 README 或 docs 中加入示例，比如用 Node.js 调用上下文 API：
  ```js
  // OAuth 登录后
  const res = await fetch('https://oasisbio.app/api/context/alice', {
    headers: { Authorization: `Bearer ${access_token}` }
  });
  const context = await res.json();
  console.log(context.who_i_am, context.projects);
  ```
  展示如何获得并使用 `who_i_am`、`projects` 等信息来个性化应用。
- **OAuth Scopes**：新增 `context:read` 范围。用户授权该权限后，开发者可通过 API 读取其全部上下文。  
- **开发者页面**：创建一个 `/developer` 或 `docs/developer-guide.md` 页面，介绍 OAuth 登录流程、Scope 说明、API 列表，以及如何解析 JSON-LD 身份卡。  
- **文档修改**：在 `docs/technical.md` 或专门的开发者文档中补充身份上下文相关接口（如 `/api/context`）及授权说明。强调“使用 OasisBio 获取用户身份上下文，而不是空白资料”。  
- **示例代码**：在文档中加入完整示例，如如何在前端调用 `/api/context` 并将结果传入 AI 请求；或如何配置 Next.js API 路由来处理 OasisBio 登录回调。  

引用现有 API 文档显示，只覆盖个人配置和 OasisBio 数据【55†L25-L29】，缺乏上下文端点。增加上述改动后，开发者能清晰知道如何把 OasisBio 当作身份服务来构建应用。

## 9. 社区传播叙事建议

**首批目标社区**：AI 开发者与爱好者社区（如 OpenAI 论坛、AI 公众号）；开源社群（如 GitHub Trending 中的身份认证相关项目）；世界观/科幻创作社区；游戏开发者社区；Web3 身份社区（如 Decentralized Identity 相关群组）。  

**第一次发布活动主题**：  
- 主题：“**Stop Re-Introducing Yourself**”，强调“一次创建，处处可用”。  
- Slogan 示例：“OasisBio: One Profile for Every AI.”、“你的身份，只需介绍一次。”、“Build once, use everywhere.”、“AI时代的身份护照”。  

**GitHub 社区文件缺口**：  
- 增加 `CONTRIBUTING.md`、`CODE_OF_CONDUCT.md`、`SECURITY.md`。  
- Issue 模板（Bug/Feature Request/Docs）和 PR 模板。  
- 增加讨论区或 GitHub Discussions（如果适用）来收集社区提问。  

**Showcase Gallery 建议**：  
- 在主页或 README 中链接一个「展示页」，展示真实用户创建的 OasisBio 示例。  
- 每个示例以“身份卡片”形式呈现，突出不同使用场景（AI助理、游戏角色、个人作品集等）。  
- 鼓励用户提交自己的 Profile 链接至此页，激发他人灵感。  

**模板系统建议**：  
- `src/app/templates` 文件夹目前空，建议实现一个模板页面。可以让用户基于不同类型的示例（如程序员身份、故事角色、游戏开发者、未来学家等）快速创建身份。  
- 模板可包含预设的能力词条和叙述，可鼓励社区贡献模板。  

**Good First Issue 列表示例**：  
- 翻译 README 和 About 中的文案（简单文本修改）。  
- 补充开发者文档示例代码。  
- 收集并提交 OasisBio 应用案例作为展示内容。  
- 设计身份上下文 schema 的示例 JSON-LD。  
- 改进页面布局或样式，突出AI相关标识。  

**非代码贡献路径**：  
- **文案**：翻译界面和文档、撰写发布公告、社交媒体宣传文案。  
- **设计**：设计网站 Banner、图标、宣传海报、演示视频。  
- **模板**：提供新的身份卡片模板和示例数据。  
- **示例身份**：贡献有趣的身份案例（如“宇宙探险家”、“AI科研员”等），以供新用户导入。  
- **社区管理**：帮助在 Discord/Reddit/论坛解答问题，收集反馈。  

## 10. 页面文案替换清单

以下列出需要更新或新增的文案示例，包括当前表述、建议表述、文件位置和修改原因：

- 当前（README）：“OasisBio is a comprehensive identity management system that allows users to create, manage, and showcase digital identities across multiple time periods and dimensions.”【96†L253-L258】  
  新：*“OasisBio is an open identity context infrastructure for the AI era, creating one portable identity that any app or AI can understand.”*  
  文件：`README.md`（顶部）  
  原因：突出基础设施和可携带的身份上下文概念，去掉“多时段、世界观”关键词。

- 当前（首页 `src/app/page.tsx`）：`<h1>BUILD AN IDENTITY BEYOND TIME</h1>`【89†L1487-L1494】  
  新：`<h1>Your AI-Powered Identity Passport</h1>`  
  原因：直接表明“AI 护照”定位，避免“超越时间”过于抽象。

- 当前（首页 `page.tsx`）：`<p>OasisBio is a modular identity system for people, characters, worlds, and future selves.</p>`【89†L1500-L1504】  
  新：`<p>OasisBio is an open identity context layer that lets AI and apps instantly understand who you are. Create once, use everywhere.</p>`  
  原因：强调“身份上下文层”和“一次创建，多处使用”，去掉角色/世界术语。

- 当前（首页 CTA）：“Create Your OasisBio”【89†L1514-L1516】  
  新：”Create My Identity Card” (或者 “Create My AI Passport”)  
  原因：用“Identity Card/Passport”更贴近新定位。

- 当前（首页 CTA）：“Explore Identities”【89†L1522-L1524】  
  新：”Explore Use Cases” 或 “How It Works”  
  原因：提供更具体的行动指引，而非抽象的“身份”。

- 当前（首页功能卡 `Identity Container`）：`CardTitle: “Identity Container”; 内容：“Create multiple identity versions across different time periods and worlds.”`【89†L1579-L1587】  
  新：`CardTitle: “Identity Context Layer”; 内容：“Store one unified identity with past, present, and future info so every AI has your full context.”`  
  原因：重命名为“上下文层”，强调一个统一身份，多时段信息可由AI读取。

- 当前（首页功能卡 `Ability Pool`）：`CardTitle: “Ability Pool”; 内容：“Define and manage skills, traits, and abilities…”`【89†L1627-L1635】  
  新：`CardTitle: “Skills & Traits”; 内容可保留或精简为：“Define your skills and preferences in one place.”`  
  原因：删除“池子”的游戏化说法，突出技能和偏好描述，保持结构化内容。

- 当前（关于页 `src/app/about/page.tsx`）：“What is OasisBio? A modular identity system for people, characters, worlds, and future selves.”【46†L654-L660】  
  新：`“What is OasisBio? An open identity context layer.”`  
  原因：简化定位词，不再提多角色/世界。

- 当前（关于页）：“Why Identity Should Be Expandable” 标题【46†L676-L684】  
  新：可改为“Why One Identity Passport Is Not Enough”，内容描述从“单一身份到上下文身份”的过渡。  
  原因：从强调“身份可扩展”转为强调“身份上下文丰富”。

- 当前（关于页 Key Features `Public Presence`）：`CardTitle: “Public Presence”; 内容: “Generate beautiful public pages for your OasisBios…”`【48†L924-L933】  
  新：`CardTitle: “Machine-readable Profile”; 内容: “Expose only the info you want on a structured profile page for apps and AI to consume.”`  
  原因：将重点从“华美页面”改为“机器可读的身份概览”，符合基础设施定位。

- 当前（关于页 Key Features `3D Model Support`）  
  新：如果保留，可改标题为 “3D Avatar Support”，强调可视化展现，但文案简化；或完全删除此卡片，将位置用于更贴合身份上下文的功能（如“API Integration”）。  
  原因：3D 模型与身份上下文关联度低，可弱化或以视觉说明替代主要文本。

- 当前（关于页 Key Features `Flexible Identity System`）：`“Create any type of identity—real, fictional, hybrid, future, or alternate.”`【48†L954-L963】  
  新：`“One unified identity context: your real-world profile expanded with future goals and any creative aspects.”`  
  原因：保留灵活性表述，但去掉“角色扮演/虚构”等词，强调真实和扩展。

- 当前（FAQ/文档）：所有提及“角色创建”、“人物”、“角色卡片”的文字，均建议改用“身份”、“档案”、“上下文”等词汇。  
  原因：改变中心概念用词，将焦点从人物角色转移到身份上下文。

- **其他新增文案**：在关键位置插入口号“Stop reintroducing yourself to every AI.” 和 “Build once, use everywhere.”（例如 Hero 或 footer）。  
  文件：`src/app/page.tsx` 或全局布局组件。  
  原因：直接传递核心信息，吸引 AI 时代用户。

（注：表中所列仅为重点示例，实际修改时请依据上下文细化。）

## 11. PR 拆分计划

- **PR 1: Rewrite Homepage Narrative**  
  **目标**：重构首页 `src/app/page.tsx` 的文案和结构。修改 Hero 标题/副标题、功能卡标题内容、CTA 文案等，使其突出身份上下文定位和 AI 场景。  
  **涉及文件**：`src/app/page.tsx`（以及可能用到的相关 CSS/组件）。  
  **修改摘要**：将页面文本替换为新定位描述，如将“BUILD AN IDENTITY BEYOND TIME”换为“Your AI-Powered Identity Passport”，更新卡片标题（Identity Container→Identity Context），调整按钮文案。  
  **验收标准**：首页加载后，第一屏（Hero）清晰展示“一次创建处处可用的身份”主题；所有旧有“角色/世界”描述被替换。

- **PR 2: README 重新定位**  
  **目标**：重写 `README.md` 前半部分，使之符合“身份上下文基础设施”主题。  
  **涉及文件**：`README.md`。  
  **修改摘要**：替换项目一句话定位、引言段落；增加新徽章和链接；添加“What can you build”、”AI Passport“、”For developers“ 等新节标题与内容示例。  
  **验收标准**：README 首段体现身份上下文定位；新增版块逻辑清晰；旧的“多时段身份”、“角色创作”等表述消除。

- **PR 3: AI Passport 页面与文档**  
  **目标**：添加 AI 护照相关功能和文档。  
  **涉及文件**：新增文件 `src/app/bio/[slug]/ai/page.tsx`、`src/app/api/context/[slug]/route.ts`、`docs/ai-passport.md`、`docs/context-schema.md`。  
  **修改摘要**：实现一个 `/bio/:slug/ai` 页面展示用户上下文，增加后端接口返回 JSON 格式的身份上下文；编写说明文档。  
  **验收标准**：访问示例用户的 `/ai` 页面可见结构化身份摘要；`/api/context/:slug` 返回合理的 JSON-LD；文档说明了如何使用这些接口。

- **PR 4: Developer/OAuth Context Narrative**  
  **目标**：完善开发者文档，添加 OAuth 说明和开发者用例。  
  **涉及文件**：`docs/technical.md`（或新增 `docs/developer-guide.md`）、`.env.example`（若需示例 scope），`README.md`（开发者部分）。  
  **修改摘要**：在技术文档中新增身份上下文 API 和 `context:read` Scope；在 README 或专门页面示例如何调用 API 并集成。  
  **验收标准**：文档列出新的 OAuth scope；示例代码片段能正确获取并展示上下文；开发者清楚理解用 OAuth 方式获取用户身份上下文。

- **PR 5: Community Contribution Files**  
  **目标**：完善 GitHub 项目治理文件，鼓励社区参与。  
  **涉及文件**：`CONTRIBUTING.md`、`CODE_OF_CONDUCT.md`、`SECURITY.md`、`.github/ISSUE_TEMPLATE/` 目录、`.github/PULL_REQUEST_TEMPLATE.md`。  
  **修改摘要**：增加贡献指南和行为准则文件、Issue/PR 模板。  
  **验收标准**：仓库根目录含上述文件，内容完整；提交 PR 时自动展示模板；网站 CONTRIBUTING 引导明确非代码贡献路径。

- **PR 6: Showcase and Templates Narrative**  
  **目标**：为用户展示和身份模板提供页面。  
  **涉及文件**：新增 `src/app/showcase/page.tsx`、完善 `src/app/templates` 目录文件。  
  **修改摘要**：创建展示页列出示例 OasisBio，完善模板页说明如何使用。  
  **验收标准**：访问 `/showcase` 可看到示例卡片；模板页包含一两个示例链接；引导用户下载或创建模板的 CTA 存在。

- **PR 7: SEO & Metadata Updates**  
  **目标**：更新网站全局元数据。  
  **涉及文件**：`src/app/layout.tsx`。  
  **修改摘要**：修改 `title`、`description`、Open Graph 等字段为新定位文本，调整关键字列表。  
  **验收标准**：页面 `<title>` 反映“身份上下文”主题；元描述包含关键词“AI、Passport、Context”，并不再出现“角色创建”等旧词汇。

- **PR 8: Page Copy Replacements**  
  **目标**：批量替换页面中的文案词汇。  
  **涉及文件**：`src/app/page.tsx`、`src/app/about/page.tsx`、组件文件等。  
  **修改摘要**：根据文案替换清单，将所有“角色”、“世界”、“角色系统”等词改为“身份”、“上下文”等；更新 CTA 文案，增加新宣传口号。  
  **验收标准**：代码中不再出现“character creator”、“worldbuilding”等词；新文案吻合叙事目标。

- **PR 9: Identity Context Schema and Well-Known Setup**  
  **目标**：添加上下文协议相关文件。  
  **涉及文件**：新增 `.well-known/oasisbio.json`、`docs/context-schema.md`。  
  **修改摘要**：在项目根目录或 `public/.well-known` 下新增 `.json` 文件，编写内容指向 `/api/context` 等；更新文档说明规范。  
  **验收标准**：访问 `/.well-known/oasisbio.json` 返回有效 JSON；`context-schema.md` 包含完整字段说明和例子。

- **PR 10: Contribution Path Enhancements**  
  **目标**：明确非代码贡献路径。  
  **涉及文件**：`CONTRIBUTING.md`（可能已由 PR5 创建）。  
  **修改摘要**：在贡献指南中添加“文案”、“模板”、“示例身份”、“翻译” 等章节，说明如何具体操作。  
  **验收标准**：贡献指南中明列多种贡献形式，降低贡献门槛，提高覆盖度。

## 12. 最终优先级建议

1. **修改元数据（`src/app/layout.tsx`）**：立即更新 `<title>` 和 `description`【110†L439-L444】为强调身份上下文/AI 护照的文案，以在搜索中传达正确定位。  
2. **重写首页 Hero 文案（`src/app/page.tsx`）**：按照新叙事修改标题、副标题和 CTA，如“Your AI-Powered Identity Passport”，突出“Stop reintroducing yourself”概念。  
3. **完善 README 开头（`README.md`）**：替换第一句话和前两段，引入项目定位、AI 护照等内容，并添加徽章、Demo 链接等。  
4. **调整 About 页面开头（`src/app/about/page.tsx`）**：将“What is OasisBio”段落改为基础设施定位，删除“角色”、“世界”字眼。  
5. **引入 AI 上下文界面**：新增 `/bio/[slug]/ai` 页面和 `/api/context/[slug]` 路由（文件待确认），提供机器可读的身份上下文出口。  
6. **开发者文档更新**：在技术文档中加入 OAuth Scope `context:read` 和上下文 API；在 README/Docs 增加调用示例。  
7. **添加社区文件**：创建 `CONTRIBUTING.md`、`CODE_OF_CONDUCT.md`、`SECURITY.md`，以及适当的 Issue/PR 模板，引导社区贡献。  
8. **首页功能卡重命名和文案修改（`page.tsx`）**：将“Identity Container”→“Identity Context”，“Public Presence”→“Machine-readable Profile”等，匹配新概念。  
9. **“停止自我介绍”标语植入**：在首页或全局横幅中加入“Stop reintroducing yourself to every AI.”口号，强调用户痛点。  
10. **构建示例和模板页面**：实现 `/showcase` 展示示例身份，并完善 `/templates` 页面说明，引导用户创建自己的身份模板。  

---

**实施提示（可复制给 Code Agent）**：

```
根据上述报告内容进行改造： 
1. PR1 (Homepage rewrite)：修改 src/app/page.tsx，更新 Hero 标题/副标题/按钮为“Your AI-Powered Identity Passport”等新文案。删除或重写与“角色”、“世界”有关的功能卡文本。 
2. PR2 (README rewrite)：重写 README 前半部分，加入 AI Passport 和开发者段落。替换第一句定位，加入徽章和 Demo/Showcase 链接。 
3. PR3 (AI Passport features)：新增 src/app/bio/[slug]/ai 页面展示身份上下文，新增 src/app/api/context/[slug]/route.ts 提供 JSON 上下文。编写 docs/ai-passport.md 说明使用方式。 
4. PR4 (Developer/OAuth)：在 docs/technical.md 或新增 docs 中增加上下文 API 描述和 OAuth scopes (context:read)。在 README 或 docs 中加入调用示例代码。 
5. PR5 (Community files)：新增 CONTRIBUTING.md、CODE_OF_CONDUCT.md、SECURITY.md，以及 .github/ISSUE_TEMPLATE/ 和 .github/PULL_REQUEST_TEMPLATE.md，引导贡献者和新手。 
6. PR6 (Showcase/Templates)：实现 /showcase 页面列出示例身份，完善 /templates 页面说明如何使用模板。更新对应组件或路由。 
7. PR7 (SEO Update)：修改 src/app/layout.tsx 的 metadata 字段，将 title/description 改为强调身份上下文/AI 护照（如 “Identity Context Infrastructure” 等）。 
8. PR8 (文案批量替换)：在 src/app/page.tsx、src/app/about/page.tsx 等文件中，将所有“character”、“world”、“persona”等旧词汇替换为“identity”、“context”等，并应用新口号。 
9. PR9 (Well-Known and Schema)：添加 .well-known/oasisbio.json 文件和 docs/context-schema.md，定义身份上下文字段规范。 
10. PR10 (Good-first-issues)：在 CONTRIBUTING.md 中列出适合初学者的任务（文案翻译、示例制作、设计贡献等），以便快速上手贡献。 
每个 PR 应包括修改目标、受影响文件列表、修改说明和验收条件。```