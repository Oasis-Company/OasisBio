# Implementation Plan: World Builder

## Overview

完全重写世界观填写功能。按依赖顺序：先建工具函数和类型，再建 API，再建 UI 组件，最后组装页面。

## Tasks

- [x] 1. 建立类型定义和工具函数
  - 创建 `src/types/world.ts`：定义 `WorldFormData`、`WorldModule`、`WorldStepConfig` 等类型
  - 创建 `src/lib/world-utils.ts`：实现 `calculateCompletionScore`、`getModuleCompletion`、`truncateSummary`
  - 定义 6 个步骤的配置数组（标题、描述、字段列表、示例文字）
  - _Requirements: 2.1, 2.2, 3.6_

- [ ]* 1.1 为工具函数编写属性测试
  - **Property 3: Completion score formula correctness**
  - 生成随机 WorldItem（任意字段组合），验证 `calculateCompletionScore` 返回值等于 `Math.round((filledCount / 10) * 100)`
  - **Property 5: Validation — name and summary are required**
  - 生成随机表单数据（name 或 summary 为空），验证 `validateWorldForm` 返回错误
  - **Validates: Requirements 1.7, 3.6**

- [x] 2. 修复 API 路由
  - 更新 `src/app/api/worlds/[id]/route.ts`：PUT 方法支持所有 WorldItem 字段（当前只处理 name/description/type/setting）
  - 更新 `src/app/api/oasisbios/[id]/worlds/route.ts`：GET 返回时包含关联的 OasisBio 基本信息
  - 确保 `requireAuth` 使用新的 `getServerUser`（已在 auth-fix 中完成）
  - _Requirements: 6.1, 6.2, 6.6_

- [x] 3. 实现 WorldCard 组件
  - 创建 `src/components/world/WorldCard.tsx`
  - 显示：世界名称、genre/tone 标签、摘要截断（≤80字符）、完整度进度条、更新时间
  - 创建 `src/components/world/CreateWorldCard.tsx`：引导创建的占位卡片
  - _Requirements: 3.1, 3.2, 3.4_

- [ ]* 3.1 为 WorldCard 编写属性测试
  - **Property 4: World card renders all required display fields**
  - 生成随机 WorldItem，渲染 WorldCard，验证包含 name、summary excerpt（≤80字符）、completion score
  - **Validates: Requirements 3.2**

- [x] 4. 实现 StepWizard 组件
  - 创建 `src/components/world/StepWizard.tsx`：主向导容器，管理步骤状态
  - 创建 `src/components/world/WizardStep.tsx`：单步内容渲染，包含字段、示例提示
  - 创建 `src/components/world/WizardProgress.tsx`：步骤进度指示器
  - 实现步骤导航逻辑（Next / Back / Skip）
  - 实现表单验证（Step 1 的 name + summary 必填）
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.7, 2.1, 2.2, 2.3-2.9_

- [ ]* 4.1 为 StepWizard 编写属性测试
  - **Property 1: Step wizard renders correct metadata for every step**
  - 遍历步骤 1-6，验证每步渲染包含非空标题、描述、示例
  - **Property 2: Navigation preserves data (round-trip)**
  - 生成随机步骤数据，模拟 Next → Back，验证数据不变
  - **Validates: Requirements 1.2, 1.3, 1.4, 2.2**

- [x] 5. 实现 WorldDetailPage 组件
  - 创建 `src/components/world/ModuleSection.tsx`：可折叠模块，支持 view/edit 两种模式
  - 创建 `src/components/world/CharacterSection.tsx`：展示关联角色列表
  - 实现内联编辑：点击 Edit → 表单 → Save/Cancel
  - 实现乐观更新：保存时立即更新 UI，失败时回滚
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.1, 5.2, 5.3_

- [x] 6. 组装页面路由
  - 重写 `src/app/dashboard/oasisbios/[id]/worlds/page.tsx`：世界列表页（卡片网格 + 空状态）
  - 创建 `src/app/dashboard/oasisbios/[id]/worlds/new/page.tsx`：向导页（包含 StepWizard）
  - 创建 `src/app/dashboard/oasisbios/[id]/worlds/[wid]/page.tsx`：详情页（包含 WorldDetailPage）
  - _Requirements: 1.6, 1.8, 3.1, 3.3, 3.5, 4.6, 6.3, 6.4_

- [x] 7. Checkpoint — 确保所有测试通过
  - 运行所有测试，确保 Property 1-5 全部通过
  - 验证三个页面路由可正常访问
  - 验证创建 → 详情 → 编辑 → 删除的完整流程无报错

## Notes

- 所有测试注释格式：`// Feature: world-builder, Property N: <description>`
- genre/tone 暂存入 `aestheticKeywords` 字段（JSON 格式），不修改 Prisma schema
- 完整度计算基于 10 个核心字段：name, summary, timeSetting, timeline, physicsRules, rules, socialStructure, factions, geography, majorConflict
- 属性测试使用 fast-check，每个属性最少 100 次迭代
