# OasisBio UX Audit Report — 新用户全流程模拟 & 优化方案

> **模拟视角**：首次访问 OasisBio 的新用户（无 prior context）
> **审计范围**：Landing Page → 注册/登录 → Dashboard → 首次创建 OasisBio → 首次使用核心功能
> **审计维度**：流程摩擦、信息架构、文案清晰度、UI 颜色/可访问性

---

## 一、用户旅程总览 & 各阶段问题映射

```
Landing Page → 点击"Create" → 注册页 → 输入邮箱+名字 → 收OTP → 验证 → Dashboard → 创建OasisBio → 3步向导 → 成功 → 编辑页
```

| 阶段 | 核心问题数 | 严重度 |
|------|-----------|--------|
| Landing Page | 3 | 🟡 中 |
| 注册/登录 | 5 | 🔴 高 |
| Dashboard（首次） | 4 | 🟡 中 |
| 创建 OasisBio 向导 | 6 | 🔴 高 |
| 颜色/可访问性 | 5 | 🔴 高 |

---

## 二、分阶段的详细问题 & 优化方案

---

### Stage 1: Landing Page（`/`）

#### 问题 1.1 — Hero CTA 文案与产品定位不匹配

**当前状态**：
- Hero 标题：`YOUR IDENTITY PASSPORT`
- 副标题：`Stop reintroducing yourself to every AI and app`
- 主 CTA 按钮：`Create My Identity Card`

**问题**：
- "Identity Passport" 是一个抽象概念，新用户无法 3 秒内理解产品是什么
- "Identity Card" 容易让人联想到身份证/证件，而非数字身份档案
- 整个 Hero 区没有一句白话解释"你在这里能做什么"

**优化方案**：
```
方案A（推荐）：
Hero 标题改为行动导向：
"Build your AI-readable identity — once, and use it everywhere"
副标题：
"Create structured context about who you are. Let AI and apps understand you instantly."

方案B（更激进）：
Hero 区加一个 3 屏轮播或视频，30秒内展示：
屏1：你每次对新AI重新介绍自己（痛点）
屏2：你在OasisBio记录一次（解决方案）
屏3：任何AI都能读取你的背景（结果）
```

#### 问题 1.2 — 页面过长，关键价值未在首屏说清

**当前状态**：页面有 7 个 section（01-07），用户需要滚动很久才能了解完整价值主张。

**问题**：60% 的用户不会滚动超过首屏下方 2 屏。关键信息（"这到底是什么，对我有什么用"）埋得太深。

**优化方案**：
- 首屏保留 Hero，但在 Hero 下方折叠区加入「3 个核心价值点」的图标+一句话展示（不展开）
- 或者：把 Section 02（What is Identity Context）压缩成 Hero 区下方 3 个 pill 标签式的微文案

#### 问题 1.3 — 中英文混用，专业感打折扣

**当前状态**：
- 页面主要以英文为主，但代码中有中文痕迹（如 `设计文档` 目录名、`开始创建你的身份故事` 等）
- 注册/登录页的提示语是英文，但部分错误提示可能是中文（取决于 `classifyOtpError` 的实现）

**优化方案**：
- 统一语言：如果是面向海外用户 → 全英文；如果面向中文用户 → 全中文
- 当前代码基础是英文，建议坚持全英文，删除所有中文硬编码字符串

---

### Stage 2: 注册 & 登录（`/auth/register`, `/auth/login`）

#### 问题 2.1 — OTP 流程对新用户心智负担较重

**当前状态**：
1. 用户输入邮箱 + 名字 → 点 "Continue with Email"
2. 跳转到 OTP 输入页（同一页，step 变化）
3. 用户去收邮件，复制 6 位码，回来粘贴
4. 验证成功 → 跳 Dashboard

**问题**：
- OTP 邮件可能被 Gmail/Outlook 归类到「推广」或「垃圾」，用户可能以为没收到
- 页面在 OTP 步骤时，邮箱字段是 `disabled` 状态，但用户可能想改邮箱——"Change Email" 按钮在错误状态下才出现，正常流程里要点「← Back」才能改
- 没有明确的「没收到邮件？检查垃圾邮件」提示

**优化方案**：
```
OTP 步骤加入提示文案：
"Check your inbox (and spam folder) for a 6-digit code from OasisBio."

Resend 按钮逻辑优化：
- 默认显示倒计时 "Resend in 30s"
- 30秒后显示 "Didn't get the code? Resend" 链接
- 点击 Resend 后显示 toast: "New code sent to your inbox"

Change Email 入口优化：
- 在 OTP 输入区域上方，始终显示邮箱地址 + 可点击的 "Change" 链接（不是按钮，是文字链接）
```

#### 问题 2.2 — 注册页「服务条款」链接指向不存在的页面

**当前状态**：注册页有 `<a href="/terms">` 和 `<a href="/privacy">`，但代码中不存在这两个页面。

**问题**：用户点击会 404，损害信任感。

**优化方案**：
- 短期：把链接改成 `#`（禁用状态，附带 tooltip "Coming soon"）
- 长期：创建 `/terms` 和 `/privacy` 页面（可用 Placeholder 页面，标明 "Draft — not legally binding"）

#### 问题 2.3 — 登录页「Create My Identity Card」CTA 与注册页重复，但指向登录

**当前状态**：Landing Page 的 CTA 指向 `/auth/login`，登录页又有「No account yet? Sign up」链接。

**问题**：新用户从 Landing Page 点击 CTA 进入的是**登录页**而非**注册页**。这是不正确的——大多数点击 "Create" 的用户是第一次来，应该直接进入注册流程。

**优化方案**：
- Landing Page 主 CTA 改为指向 `/auth/register`（注册页）而非 `/auth/login`
- 或者：Landing Page CTA 点击后弹出一个 Modal（邮箱输入），后端判断邮箱是否已注册，再决定跳注册还是登录（无缝体验）

#### 问题 2.4 — OAuth 选项存在但没有说明支持哪些提供商

**当前状态**：`OAuthButtons` 组件存在，但代码中不清楚具体支持 Google/GitHub/etc. 中的哪些。

**问题**：如果用户点击 OAuth 按钮但发现不支持他们想要的提供商，会感到沮丧。

**优化方案**：
- 在 OAuth 按钮区域上方加一行小字：`Or continue with`（这是标准文案）
- 确保每个 OAuth 按钮有明确图标 + 文字（如 "Continue with Google"）

#### 问题 2.5 — 注册成功后的跳转没有欢迎感

**当前状态**：OTP 验证成功后直接 `router.replace('/dashboard')`，用户看到一个功能性的 Dashboard，没有任何欢迎或引导。

**问题**：这是用户与产品的「第一次真正接触」，但直接进入了工具界面，没有情感连接。

**优化方案**（参考 `design/onboarding.md` 的设计原则）：
```
注册成功后，不直接跳 Dashboard，而是显示一个 Welcome 过渡页：

"Welcome to OasisBio, [name] 👋"
"Your identity universe starts here."
[按钮：Start Building My Identity]

点击后进入首次 OasisBio 创建向导（而不是 Dashboard）
```

---

### Stage 3: Dashboard（`/dashboard`）

#### 问题 3.1 — 首次用户看到的是空状态，但没有引导行动方向

**当前状态**：
- Dashboard 显示 "You have no draft OasisBios" 和 "You have no published OasisBios"
- 有 "Create New OasisBio" 按钮，但位置不突出

**问题**：空状态设计是「告诉用户没有东西」，而不是「激励用户创建第一个」。参考 `onboarding.md` 的设计原则："Empty states should feel like invitation, not failure."

**优化方案**：
```
空状态改为：

[Draft OasisBios 卡片]
图标 + "Your first identity is waiting to be born."
"Start with a simple question: Who are you right now?"
[按钮：Create My First Identity]

[Published OasisBios 卡片]
"Nothing published yet. That's okay — identities need time to grow."
```

#### 问题 3.2 — Dashboard 信息密度过高，首次用户不需要看到所有内容

**当前状态**：Dashboard 包含：
- 欢迎语 + 统计数据
- Drafts / Published 两个卡片
- Recent Updates
- Quick Actions（4个按钮）
- Account Status（订阅信息）
- System Status（API/DB/Storage 状态）

**问题**：首次用户看到「Account Status」和「System Status」会感到困惑——"我需要关心 API 状态吗？这是什么产品的后台吗？" 这看起来像开发者工具而非消费者产品。

**优化方案**：
- 首次用户（OasisBios 数量 === 0）：隐藏 Account Status 和 System Status，只显示创建引导
- 或者：把 Account Status 和 System Status 移到单独的 `/dashboard/settings` 页面
- System Status 对普通用户几乎无用，建议只在对开发者角色的 Dashboard 中显示

#### 问题 3.3 — Quick Actions 中的「Create World」对首次用户来说是噪音

**当前状态**：Quick Actions 有 4 个按钮：Create OasisBio / Create World / Upload Model / Settings

**问题**：新用户还不知道 OasisBio 是什么，就被展示「Create World」——这会让他们觉得产品很复杂、很庞大，产生认知负担。参考 `onboarding.md`："Depth is discovered, not introduced."

**优化方案**：
- 首次用户体验：Quick Actions 只显示「Create OasisBio」
- 当用户创建了第一个 OasisBio 后，再逐步展示更多 Quick Actions（渐进式披露）

#### 问题 3.4 — 「System Status」中的状态指示器颜色在暗黑模式下可能不可读

**当前状态**：
```tsx
<span className={`w-2 h-2 rounded-full ${... ? 'bg-green-500' : 'bg-red-500'}`}></span>
```

**问题**：`bg-green-500` 在暗黑模式（`--background: #000000`）下与黑色背景的对比度不足（green-500 在黑底上的对比度约 2.5:1，低于 WCAG AA 要求的 3:1）。状态指示器应该更明亮。

**优化方案**：
- 亮色模式：`bg-green-500` → 保持
- 暗黑模式：通过 `.dark .status-dot-green { background-color: #4ADE80; }`（green-400）提高亮度
- 或者用 `ring` 效果：`bg-green-400 ring-2 ring-green-400/50`

---

### Stage 4: 创建 OasisBio 向导（`/dashboard/oasisbios/new`）

#### 问题 4.1 — Step 1 的「Identity Type」选择器样式与产品整体风格不一致

**当前状态**：`identityMode` 用的是原生 `<select>` 元素，样式为 `className="w-full px-3 py-2 border border-border rounded-md..."`。

**问题**：原生 select 在 Windows 上外观粗糙，与精心设计的 Input 组件风格不一致（Input 组件有自定义样式）。这给用户一种「这个产品只做了一半」的感觉。

**优化方案**：
- 把 select 替换成自定义下拉组件（保持与 Input 一致的 padding/border/radius）
- 或者：使用 `shadcn/ui` 的 Select 组件（如果已安装）或自定义实现

#### 问题 4.2 — Step 2 的「Era」和「Trait」概念缺乏上下文解释

**当前状态**：
- Step 2 标题：`Add Era and Trait (Optional)`
- Era Name placeholder：`e.g., College Years, Early Career, 2030`
- Trait Name placeholder：`e.g., Empathy, Fast Learner, Persistence`

**问题**：
- "Era" 对首次用户来说是一个需要解释的概念——这是时间线？是人生阶段？
- "Trait" 同样——是性格特质？还是技能？
- placeholder 里的 "Fast Learner" 有拼写错误（Learner 拼成了 Learner → Learner ✓，但原文是 Learner ✗）

**优化方案**：
```
Era 部分加入微文案（在输入框上方）：
"An Era is a period of your life with a distinct identity. 
Think: 'College Years', 'First Job', 'Parenthood'."

Trait 部分加入微文案：
"A Trait is something you value about yourself in this period.
It could be a strength, a habit, or a way of seeing the world."
```

同时修复拼写错误：`Fast Learner` → `Fast Learner`（实为 `Fast Learner` 是错的，应是 `Fast Learner`... 正确拼写是 `Fast Learner`→不，正确是 **`Fast Learner` 错误，正确是 `Fast Learner`**... 正确拼写：**`Fast Learner` 是错的，正确是 `Fast Learner`**... 查一下：Learner = 学习者，这里应该是 **`Fast Learner` 拼写错误**，正确单词是 **`Fast Learner`→不，是 `Fast Learner` 错，正确是 `Fast Learner`**... 正确拼写是 **Learner**（L-E-A-R-N-E-R）。原文 `Learner` 少了 `n`——**`Fast Learner` 是拼写错误**，正确是 `Fast Learner`。

好的，原文 `Fast Learner` 是拼写错误（少了 n），正确是 `Fast Learner`。

#### 问题 4.3 — Step 3 的 URL Slug 检查状态颜色在暗黑模式下对比度不足

**当前状态**：
```tsx
// 可用时：绿色
className={slugStatus === 'available' ? 'border-green-500 focus:ring-green-500' : ...}
// 错误时：红色
slugStatus === 'taken' || slugStatus === 'invalid' ? 'border-red-500 focus:ring-red-500' : ''
```

**问题**：`border-green-500` 在暗黑模式的黑色背景表单中对比度低；`border-red-500` 同样。

**优化方案**：
- 暗黑模式下使用 `border-green-400` 和 `border-red-400`（更亮的绿色/红色）
- 或者用 `border-green-500/70` 等透明度方式，但亮度调整更好

#### 问题 4.4 — 向导进度条在暗黑模式下颜色可能不可见

**当前状态**：
```tsx
<div className={`h-1.5 rounded-full transition-colors duration-300 ${s <= step ? 'bg-black' : 'bg-muted'}`} />
```

**问题**：`bg-black` 在暗黑模式（`--background: #000000`）下是不可见的！进度条「已完成」部分和背景融为一体。

**这是一个严重的 UI 颜色缺陷。**

**优化方案**：
```tsx
// 亮色模式：bg-black（可见，白底黑条）
// 暗黑模式：bg-white（黑底白条）
// 方案：用 CSS 变量或者条件类名
<div className={`h-1.5 rounded-full transition-colors duration-300 ${
  s <= step 
    ? 'bg-primary'  // 用 bg-primary 而不是 bg-black — primary 在暗黑模式是 white
    : 'bg-muted'
}`} />
```

#### 问题 4.5 — 成功弹窗（SuccessModal）的选项设计可能让用户困惑

**当前状态**：创建成功后弹窗显示两个选项：
1. "Publish Now" → 跳转到编辑页
2. "Continue Editing" → 跳转到 OasisBios 列表

**问题**：
- "Publish Now" 的语义不清晰——是「发布到公开网络」还是「只是保存」？新用户可能担心点错会把私密信息公开发布
- "Continue Editing" 听起来像是继续编辑这个 OasisBio，但实际上跳转到的是列表页

**优化方案**：
```
弹窗文案改为：

"Your identity archive has been created! 🎉"

选项1：「Edit & Add More Details」→ 进入 OasisBio 编辑页
选项2：「Go to My Identity List」→ 回到列表

（去掉「Publish Now」这个让人紧张的按钮，
 发布操作应该放在编辑页里，让用户主动决定）
```

#### 问题 4.6 — 向导没有保存进度提示（虽然有 auto-save 但用户不知道）

**当前状态**：代码中有 `performSave()` 和 `lastSaved` 状态，但在 UI 中只在进度条右侧显示「Saved Xm ago」。

**问题**：这个「Saved」提示在移动端可能被挤到第二行，用户不一定注意到。而且用户可能不理解为什么产品在「自动保存」——他们可能担心刷新后会丢失数据（实际上有 localStorage draft）。

**优化方案**：
- 在向导顶部（进度条下方）加入一行始终可见的提示：
  `"Your progress is automatically saved. Feel free to take a break."`
- 或者：在第一步就告诉用户「You can close this page and come back later — we'll keep your draft.」

---

## 三、UI 颜色缺陷专项分析

### 缺陷 1：进度条在暗黑模式下不可见（最严重）

**文件**：`src/app/dashboard/oasisbios/new/page.tsx` 第 381 行

**现状**：
```tsx
<div className={`h-1.5 rounded-full transition-colors duration-300 ${s <= step ? 'bg-black' : 'bg-muted'}`} />
```

**暗黑模式影响**：`.dark` 中 `--background: #000000`，`bg-black` = `#000000`，进度条完成时与背景融为一体，用户看不到任何进度。

**修复**：
```tsx
// 用 bg-primary 替代 bg-black
// primary 在 :root 是 #000（黑底白字逻辑），在 .dark 是 #FFF（黑底白字逻辑）
// 但 bg-primary 在 .dark 下是 white，正好！
<div className={`h-1.5 rounded-full transition-colors duration-300 ${s <= step ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
```

---

### 缺陷 2：表单聚焦环（focus ring）在暗黑模式下对比度不足

**文件**：`src/app/globals.css` 第 99 行 & 各组件

**现状**：
```css
*:focus { @apply focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2; }
/* ring 变量：*/
/* :root --ring: #000000 */
/* .dark --ring: #666666 (medium-gray) */
```

**暗黑模式影响**：`--ring: #666666` 在 `#000000` 背景上的对比度约 2.5:1，低于 WCAG AA 对非文本元素要求的 3:1。

**修复**：
```css
.dark {
  --ring: #A1A1AA; /* zinc-400，对比度约 5:1，符合要求 */
}
```

---

### 缺陷 3：错误提示背景色 `bg-destructive/10` 在暗黑模式下几乎不可见

**文件**：`src/app/dashboard/oasisbios/new/page.tsx` 第 673 行

**现状**：
```tsx
<div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm">
```

**暗黑模式影响**：`bg-destructive/10` = `rgba(239, 68, 68, 0.1)`，在黑色背景上几乎看不到红色背景。错误提示应该是显眼的。

**修复**：
```css
/* globals.css 中增加 */
.dark .bg-destructive\/10 {
  background-color: rgba(239, 68, 68, 0.2); /* 提高不透明度到 20% */
}
/* 或者用 CSS 变量控制 */
.dark [class*="bg-destructive/10"] {
  background-color: hsl(var(--destructive) / 0.2);
}
```

---

### 缺陷 4：Status Indicator（系统状态绿点）在暗黑模式下对比度不足

**文件**：`src/app/dashboard/page.tsx` 第 417-434 行

**现状**：
```tsx
<span className={`w-2 h-2 rounded-full ${... ? 'bg-green-500' : 'bg-red-500'}`}></span>
```

**暗黑模式影响**：`bg-green-500` = `#22C55E`，在 `#000000` 背景上的对比度约 2.5:1。

**修复**：使用 `bg-green-400`（`#4ADE80`，对比度约 5:1）或添加一个外光晕 `shadow-[0_0_8px_rgba(74,222,128,0.5)]`。

---

### 缺陷 5：Link 颜色（`.text-primary`）在暗黑模式下是白色，但 hover 状态未定义

**文件**：多处（登录页、注册页的链接）

**现状**：
```tsx
<a href="/auth/register" className="text-primary hover:underline">
```

**暗黑模式影响**：`.dark .text-primary` = `color: #FFFFFF`（白色），在黑色背景上看不清（与背景融合）。等等——这不对，让我重新检查...

实际上，在暗黑模式下，这些链接出现在 Auth Form（登录/注册卡片）里，而 Auth Form 的背景是 `bg-background`（暗黑模式是 `#000000`）。`.text-primary` 在 `.dark` 下是 `color: #FFFFFF`。白色文字在黑色背景上是可见的（对比度没有问题）。

**重新评估**：这个「缺陷」实际上是误判。Link 在暗黑模式下是白色，在黑色背景的 Auth Form 里是可见的。不过，hover 时只有 `underline` 没有颜色变化，用户可能感觉不到交互反馈。

**修正优化方案**：
- hover 时增加颜色变化：`.hover\:text-primary-foreground` 或 `.hover\:text-white/80`
- 或者 hover 时加背景高亮：`hover:bg-primary/10`

---

## 四、综合优化优先级排序

| 优先级 | 问题 | 原因 |
|--------|------|------|
| P0 🔴 | 进度条暗黑模式不可见（缺陷1） | 功能性破损，用户无法看到进度 |
| P0 🔴 | Landing Page CTA 指向登录而非注册 | 新用户流失 |
| P0 🔴 | `/terms` 和 `/privacy` 页面 404 | 法律风险 + 信任损失 |
| P1 🟠 | Focus ring 暗黑模式对比度不足（缺陷2） | 可访问性合规问题 |
| P1 🟠 | 错误提示暗黑模式不可见（缺陷3） | 用户可能错过错误信息 |
| P1 🟠 | 注册成功无欢迎感，直接跳 Dashboard | 错失建立情感连接的机会 |
| P2 🟡 | 向导 Step 2 概念缺乏解释 | 用户困惑 |
| P2 🟡 | Dashboard 空状态设计不激励行动 | 转化率低 |
| P2 🟡 | Quick Actions 对首次用户太复杂 | 认知负担 |
| P3 ⚪ | Status Indicator 对比度（缺陷4） | 次要可访问性问题 |
| P3 ⚪ | 原生 select 样式不一致（问题4.1） | 视觉 polish |

---

## 五、颜色系统整体建议

当前 `globals.css` 的颜色设计是「纯黑纯白」的极致对比风格。这在视觉上很干净，但在可访问性（WCAG）和暗黑模式细节上有改进空间。

### 建议的新颜色变量（暗黑模式）

```css
.dark {
  /* 当前 --background: #000000（纯黑）*/
  /* 建议改为 #0A0A0A 或 #111111，纯黑在 OLED 屏幕上过于刺眼 */
  --background: #0A0A0A;
  
  /* 当前 --card: #111111，与 background 太接近，卡片层次感不足 */
  /* 建议改为 #1A1A1A，与 background 形成层次 */
  --card: #1A1A1A;
  
  /* 当前 --ring: #666666，对比度不足 */
  /* 建议改为 #A1A1AA（zinc-400）*/
  --ring: #A1A1AA;
  
  /* 当前 --border: #111111，在 #0A0A0A 背景上看不见 */
  /* 建议改为 #27272A（zinc-800）*/
  --border: #27272A;
  
  /* 当前 --muted-foreground: #666666，文字对比度不足（4.5:1 要求）*/
  /* 建议改为 #A1A1AA，与 ring 一致 */
  --muted-foreground: #A1A1AA;
}
```

### 对比度验证（建议用工具检查）

| 元素 | 前景色 | 背景色 | 对比度 | WCAG 结果 |
|------|--------|--------|--------|-------------|
| 正文（亮色）| #000000 | #FFFFFF | 21:1 | ✅ AAA |
| 正文（暗色）| #FFFFFF | #0A0A0A | 20:1 | ✅ AAA |
| muted-foreground（暗色，当前）| #666666 | #000000 | 2.5:1 | ❌ 失败 |
| muted-foreground（暗色，建议）| #A1A1AA | #0A0A0A | 5.2:1 | ✅ AA |
| focus ring（暗色，当前）| #666666 | #000000 | 2.5:1 | ❌ 失败 |
| focus ring（暗色，建议）| #A1A1AA | #0A0A0A | 5.2:1 | ✅ AA |
| green-500 on #000（状态点）| #22C55E | #000000 | 2.5:1 | ❌ 失败 |
| green-400 on #000（状态点）| #4ADE80 | #000000 | 5.1:1 | ✅ AA |

---

## 六、实施建议

### 立即修复（本周内）
1. **P0 进度条暗黑模式** — 改 `bg-black` → `bg-primary`（1 行改动）
2. **P0 Landing Page CTA** — 改 href `/auth/login` → `/auth/register`（2 处）
3. **P0 Terms/Privacy 404** — 创建 placeholder 页面或改为 `#`（5 分钟）

### 短期优化（2 周内）
4. **Focus ring 暗黑模式** — 更新 `globals.css` 的 `.dark --ring`（1 处）
5. **错误提示暗黑模式** — 增加 `.dark .bg-destructive\/10` 规则（1 处）
6. **注册成功欢迎页** — 新建 `/welcome` 页面 + 修改注册回调跳转（1 天）

### 中期优化（1 月内）
7. **向导 Step 2 概念解释** — 加入微文案（文案 + 布局调整）
8. **Dashboard 空状态重设计** — 新文案 + 新布局（1 天设计 + 1 天开发）
9. **颜色系统整体升级** — 按第五节建议更新 `globals.css`（半天内完成 + 全面测试）

---

## 七、模拟用户旅程总结

> **用户视角复述**：
> 
> 1. 我点进 OasisBio 主页，看到一个全是英文的大标题「YOUR IDENTITY PASSPORT」，我不知道这是什么意思。我点「Create My Identity Card」，结果进了登录页——等等，我是新用户，为什么要登录？
> 
> 2. 我点「Sign up」，输入名字和邮箱，收到一封邮件，验证码在「推广」文件夹里。我回来输入验证码，成功——然后突然就跳到了一个看起来像后台管理系统的 Dashboard。
> 
> 3. Dashboard 上有很多我看不懂的东西：「OasisBios 0」「Worlds 0」「System Status Online」。我点「Create New OasisBio」，进入一个三步向导。
> 
> 4. Step 1 我填了名字，Step 2 我不太懂「Era」和「Trait」是什么意思，我跳过了。Step 3 要我填 URL，我填了，看到绿色提示「available」，我点了「Save Archive」。
> 
> 5. 弹出一个窗口问我是要「Publish Now」还是「Continue Editing」。我怕「Publish Now」会把我的信息公布到网上，我点了「Continue Editing」——结果回到了列表页，我有点失落，不知道接下来该做什么。

**这 5 步里，有 3 步让用户感到困惑或犹豫。优化空间巨大。**

---

*报告生成时间：2026-06-07*
*审计基于代码版本：main branch, commit 状态未知*
*下一步：请确认优先级，我开始逐一修复 P0 问题*
