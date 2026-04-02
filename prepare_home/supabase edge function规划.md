最终建议

先只做 4 个 Edge Functions：

asset-token

publish-bio

reference-enrich

auth-profile-sync

原因是 Supabase Edge Functions 更适合做轻量 API、Webhook、鉴权、签名 URL、第三方集成，而不是承接你们现有那类 Node 风格的重文件处理。Supabase 官方文档对 Edge Functions 和在函数里用 Auth / Storage 的推荐用法也基本是这个方向；Prisma 官方虽然支持 edge 部署，但也明确说明 edge 方案需要额外关注 runtime 和连接方式，不适合把现有 Prisma-heavy 逻辑一股脑搬过去。

你们的最佳边界

放到 Edge：

JWT 校验

资源归属校验

上传/下载签名

发布命令入口

URL 元数据抓取

轻量 RPC 调用

继续留在 Node：

ZIP import/export

大文件聚合

模型预处理

复杂 Prisma 事务服务

这是最稳的拆法。Prisma 在 edge 可用，不等于应该优先迁；而 Supabase 官方对 Edge 的定位也更偏“边缘入口层”。

一、目录结构
supabase/
  functions/
    _shared/
      cors.ts
      env.ts
      clients.ts
      auth.ts
      response.ts
      logger.ts
      idempotency.ts
      types.ts

    asset-token/
      index.ts
      schema.ts
      service.ts

    publish-bio/
      index.ts
      schema.ts
      service.ts

    reference-enrich/
      index.ts
      schema.ts
      service.ts

    auth-profile-sync/
      index.ts
      schema.ts
      service.ts
_shared 约定

clients.ts

createUserClient(req)：带用户 Authorization

createAdminClient()：带 SUPABASE_SERVICE_ROLE_KEY

这符合 Supabase 官方建议：用户上下文走 Authorization，服务端高权限存储操作走 service role key。

二、4 个函数的职责
1) asset-token

统一取代：

signed-upload-url

signed-download-url

输入
{
  "action": "upload",
  "resourceType": "character_cover",
  "resourceId": "bio_xxx",
  "filename": "cover.webp",
  "contentType": "image/webp",
  "size": 245123
}
输出示例：上传
{
  "provider": "supabase",
  "method": "signed-upload",
  "bucket": "character-covers",
  "path": "user_123/bio_456/cover.webp",
  "token": "xxx",
  "expiresIn": 300
}
输出示例：下载
{
  "provider": "supabase",
  "method": "signed-download",
  "url": "https://...",
  "expiresIn": 60
}
内部规则

先用 user client 验证当前用户

校验 resourceId 是否属于当前用户

根据 resourceType 决定 provider

图片类走 Supabase Storage

大模型文件继续走 R2

统一限制 MIME、大小、路径

2) publish-bio

它只做命令入口，不做一串副作用。

输入
{
  "bioId": "bio_xxx",
  "visibility": "public",
  "requestId": "uuid"
}
它做的事

验证用户

校验 ownership

调数据库 RPC：validate_publishable_bio

调数据库 RPC：publish_bio

返回发布结果

不在这里做

OG 图生成

搜索索引更新

页面 revalidate

通知

这些都改成异步消费 domain_events。

3) reference-enrich
输入
{
  "url": "https://example.com/article"
}
输出
{
  "title": "Example Article",
  "description": "....",
  "coverImage": "https://...",
  "provider": "example",
  "sourceType": "article",
  "metadata": {
    "siteName": "Example",
    "author": "..."
  }
}
适合放 Edge 的原因

这是典型的：

外部请求

轻量处理

无本地文件依赖

对用户体验收益大

4) auth-profile-sync
输入
{
  "displayName": "Stephen",
  "avatarUrl": "https://...",
  "locale": "zh-CN"
}
输出
{
  "userId": "user_xxx",
  "profileId": "profile_xxx",
  "username": "stephen-johnson"
}
职责

若没有 profile 就创建

自动生成唯一 username

只补空字段，不覆盖用户已编辑字段

三、最关键的数据库设计

这部分比函数本身更重要。

1) domain_events
create table if not exists domain_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  aggregate_type text not null,
  aggregate_id text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending',
  retry_count int not null default 0,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);
用法

publish_bio() 成功后写：

bio.published

bio.unpublished

asset.uploaded

2) audit_logs
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  action text not null,
  target_type text not null,
  target_id text not null,
  request_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
记录什么

谁发布了什么

谁申请了什么 token

谁修改了 visibility

哪次请求失败了

3) publish_bio() RPC

建议把真正的事务沉到 DB。

validate_publishable_bio(bio_id, actor_id)

返回：

ok boolean

errors text[]

publish_bio(bio_id, actor_id, request_id, visibility)

内部完成：

ownership 再校验

状态切换

publication upsert

slug 唯一性校验

published_at 更新

审计日志写入

domain_events 插入

这样发布动作就是原子事务。

四、推荐的请求流
上传封面

前端：

调 asset-token

拿到签名

直接上传到 Storage / R2

上传成功后再写业务表

发布 Bio

前端：

调 publish-bio

立即得到成功/失败

其余副作用异步完成

添加参考链接

前端：

用户输入 URL

调 reference-enrich

用户确认后写入 ReferenceItem

五、每个函数都统一这 5 个规则
1. 强制 request_id

没有就后端生成，有就透传。

2. 输入必须 schema 校验

建议 Zod。

3. 所有错误都结构化
{
  "error": {
    "code": "NOT_OWNER",
    "message": "You do not own this bio"
  }
}
4. 日志统一字段

request_id

user_id

function

resource_id

duration_ms

5. 不在 Edge 里复用 Prisma-heavy service

避免后面越来越重。

六、优先级
第一周

先落：

asset-token

auth-profile-sync

这两个最能立刻统一边界。

第二周

落：

publish-bio

domain_events

audit_logs

publish_bio() / validate_publishable_bio() RPC

第三周

落：

reference-enrich

七、你们团队可以直接照抄的准则

一句话版：

Edge Functions 只做“命令入口 + 能力签发”，数据库负责事务一致性，Node 继续负责重文件任务。

这套结构和 Supabase 官方对 Edge Functions/Auth/Storage 的最佳实践是一致的，也能避开 Prisma 在 edge 场景下不必要的复杂度。