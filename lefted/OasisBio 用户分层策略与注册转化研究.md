# OasisBio 用户分层策略与注册转化研究

## 研究摘要

基于 OasisBio 官方仓库与战略计划所透露的产品复杂度、当前完成度，以及复杂应用的通用 UX 规律，我建议把 **OasisBio 当前到未来 12 个月的注册用户结构工作假设**设为：**轻度用户 65%、中度用户 25%、重度用户 10%**。这个判断的核心不是“用户不够认真”，而是产品本身是一个高认知负荷的创作型系统：官方仓库显示其公开编辑体验至少包含角色编辑、时代线、能力池、世界构建、DCOS 文档、关系网、AI 工作区、公开页与开发者 OAuth 等深层模块；而战略计划也明确表明，当前阶段的首要目标仍是先让真实用户完整走通 “Register → Create Identity → Publish → Share Link”，Explore 还需要搜索与分页，关系 UI 也尚未补完。对这种复杂产品，注册用户里轻度用户天然会占大头。citeturn1view0turn4view0turn36view0

对于未登录用户的第一印象，**Explore 页应该优先做“快速浏览”，而不是把“深度发现”放在第一屏**。原因很直接：Nielsen Norman Group 的研究表明，首页首先要像电梯陈述一样在极短时间内说明“这是什么、我能在这里做什么”，而用户在网页上通常是扫描而不是通读；同时，渐进式披露正是复杂产品降低认知负担的关键方法。也就是说，OasisBio 不应该一上来把用户丢进复杂筛选器、术语墙和长篇设定，而应该先给用户一个“哇，这个角色/身份体系很完整，而且我也能做”的瞬间。citeturn35search1turn35search2turn35search3turn35search15

竞品侧，**Character.AI 的做法是“先消费、后创作、再社区化”**：它公开强调可接触海量角色，并在发现面上采用 For you、Try these、Featured、标签、搜索排序与社区 Feed 等机制，把第一次访问的门槛压到极低；**WorldAnvil 的做法则是“先按用途分流，再按深度分层”**：它把用户分成 Writers、Gamemasters、Creatives、Players 等入口，再用 Freeman / Master / Grandmaster / Sage 做成熟度与付费能力分层；**Campfire 则把分层做到模块化**，用免费额度和按模块付费为不同深度的创作者提供不同的进入方式。OasisBio 最适合借鉴的不是某一个单点，而是这三者组合出来的结构：**入口像 Character.AI 一样轻，内核像 WorldAnvil 一样深，付费与能力边界像 Campfire 一样渐进。** citeturn6search0turn6search1turn28view0turn28view1turn28view2turn28view3turn27view0turn26view0turn26view1turn26view2turn29view0turn29view1turn29view2

如果只让我指出 OasisBio 当前最该盯住的漏斗环节，我会选 **Register → First Character Created**，其次才是 **Explore → Register**。原因是公开基准几乎都指向同一件事：**激活决定留存，而不是单纯流量**。Amplitude 的产品基准显示，七日激活和三个月留存有强相关；七日回访达到 7% 已能进入激活前 25% 的组别。反过来，如果激活做不好，再多增加首页流量，都只是在往漏桶里倒更多水。citeturn18view0turn18view1turn40view0turn40view1

## OasisBio 的产品前提

从官方 README 看，OasisBio 将自己定位为 **“跨时代、跨世界、跨维度的数字身份基础设施”**，而不只是角色创建器；它支持多种身份模式，包括真实、自创、混合、未来、平行世界与 worldbound 身份，并把角色搭建延展到 Era Timeline、World Builder、Ability Pool、DCOS Repository、Relationships、Nuwa AI 和 OAuth Provider。仓库结构还显示这是一个相当“重”的系统：约 71K 行代码、23 个数据库模型、53 条 REST 路由、8 个角色编辑子页签，以及公开 profile 和开发者入口。citeturn1view0turn25search2

战略计划进一步说明了 OasisBio 当前的真实产品阶段。它明确写到：短期目标还只是让真实用户顺利完成“注册、创建身份、发布、分享”；Explore 页当前“会把全部内容都载入”，因此必须补搜索和分页；角色关系的前端还没做完；主页 CTA 也需要验证能否跑通。战略计划还写得很清楚：**不做 AI 自动生成、不做 social feed、早期不设 paywall**；但会强化公开 profile、用户主页和分享传播。换句话说，OasisBio 目前是一款 **高表达深度、低即时娱乐性、强创作工作流、弱社交回流** 的产品。这个前提会直接决定用户分层与漏斗表现。citeturn4view0

这也是为什么 OasisBio 不能简单复制 Character.AI。Character.AI 的核心价值可以在第一次聊天时立刻被感知，而 OasisBio 的价值必须在 **“搭建一个足够完整、能发布、能被别人理解的数字身份”** 之后才会显现。它更接近复杂创作工具，而不是纯消费型娱乐产品。对复杂应用，NN/g 强调不能只按“新手/专家”二分，而应同时照顾 Learner、Legacy、Legend 三种用户；其中 Learner 特别需要可学习性、引导、及时提示与低风险探索环境。OasisBio 的 Explore 和首创流程，实际上就是把陌生访问者转成 Learner 的关键界面。citeturn36view0

## 用户分层判断

我建议 OasisBio 先不要按“DAU/MAU 时长”做分层，而是按 **是否完成核心价值、是否形成发布/复访习惯、是否把 OasisBio 当作主档案系统** 来做分层。更适合产品运营和设计决策的定义如下：

| 层级 | 建议定义 | 预估占比 |
| --- | --- | --- |
| 轻度用户 | 注册后主要浏览、试填、开一个草稿、用一次 Nuwa 或只看公开角色；未发布，或 30 天内几乎不回访 | 60%–70% |
| 中度用户 | 完成首个角色；至少填完基础信息 + 时代线/世界观中的关键部分；可能发布 1 个角色；有周期性编辑行为 | 20%–30% |
| 重度用户 | 持续维护多个身份或多时代版本；频繁使用 World Builder、DCOS、关系网、发布系统；愿意把链接外发，甚至期待未来 API / OAuth 接入 | 8%–15% |

我建议把对外沟通和内部预算都先按 **65 / 25 / 10** 的中位盘来设计。这个比例比经典的 90-9-1 社区创作分布“更重”，是合理的：因为 Nielsen 的 90-9-1 更适用于开放社区的总人群，而 OasisBio 的样本是已经完成注册的用户，进入门槛更高、创作意图更强，所以重度与中度占比必然比公共社群更高。另一方面，OasisBio 又没有 social feed 这类轻互动留存机制，因此大量“只是看看”的注册用户会快速沉到轻度层。citeturn37search0turn4view0turn36view0

如果再进一步拆解原因，我会这样看。**第一，产品复杂度高，天然抬高轻度比例。** 角色并不是一次性表单，而是一个跨世界、跨时代、带版本与关系的身份容器；复杂应用的典型问题不是“有没有价值”，而是“用户能不能在第一次或第二次会话里看懂这价值”。citeturn1view0turn36view0

**第二，当前产品阶段还处在“先跑通流程”的阶段，决定了早期轻度用户更多。** 战略计划甚至把“确保 Start Creating 真能跑通”“Explore 加分页和搜索”“关系 UI 做完整”都列成近期事项。这意味着当前的阻塞点主要还不是审美，而是路径完整性。citeturn4view0

**第三，OasisBio 的愿景会吸引两类很不同的人：一类是高意图创作者，另一类是概念好奇者。** 仓库和宣言里强调的“digital immortality”“metaverse era infrastructure”等表述会带来高概念吸引力，但这类表达也会带来一部分“注册就是为了看一眼”而不是立刻动手的用户。没有强消费回路时，这些人会短暂停留后流失，进入轻度层。citeturn1view0turn4view0

**第四，留下来的重度用户会非常有价值。** WorldAnvil、Campfire 这类产品都证明了：在世界观/角色/创作赛道里，真正有粘性的并不是大量轻度浏览者，而是那群把工具当成世界观主数据库、作品圣经和角色知识库的人。OasisBio 的长期价值也会更接近这条路。citeturn27view0turn27view1turn27view2turn29view0turn29view1turn29view2

更具体一点，OasisBio 应该把三层用户各自服务成不同路径。轻度用户要被快速带到“我也能做一个”的感觉，中度用户要被推到“我第一次发布出去”，重度用户则要被服务成“这是我的主身份工作台”。现在很多产品输给竞品，不是因为只有一个层级做得差，而是因为所有用户都被迫走同一条路径。

## Explore 页策略

我的判断非常明确：**Explore 首页首屏要优先“快速浏览”，深度发现只能做第二层。**

这不是因为深度不重要，而是因为 **深度发现要求用户先拥有领域词汇和动机**。对 OasisBio 而言，“Era Timeline”“DCOS”“Worldbound”“能力池”“叙事文档”等词，对老手有吸引力，对第一次访问者却是认知障碍。NN/g 的研究非常稳定地表明：首页必须快速解释站点目的，用户在线上主要是扫描而不是细读；复杂界面又需要通过渐进式披露来控制初始认知负担。把深层过滤器、全量索引或复杂设定直接堆在第一屏，本质上是在用专家语言要求新手自我教育。citeturn35search1turn35search2turn35search3turn35search15

竞品也几乎都在用这个逻辑。Character.AI 公开面强化的是“立即接触海量角色”和极低门槛创建；它还有 Quick mode 与 Advanced mode 两套创作分支，实际上就是把轻度和重度创作分开承接。它近年的搜索与发现更新也都围绕更快地找到合适角色来做，包括 tags、按 relevance / likes / popularity / newest 排序、autocomplete、trending searches，以及移动端的 Community Feed。citeturn6search0turn6search1turn28view0turn28view1turn28view2turn28view3

WorldAnvil 也是类似的。它的公开社区页不是先扔你一个高级搜索器，而是先给出 **Browse Worlds、Browse Articles、Browse Manuscripts、Browse Challenges** 这样低门槛的入口；官方首页也先告诉你“Create your world / Manage your campaign / Plan your novel”，再往下铺 maps、timelines、search、organization 等深功能。它把“先知道这里能干什么”放在“先学会怎样精确检索”之前。citeturn26view0turn27view0

因此，我给 OasisBio 的 Explore 信息架构建议是：

| 区域 | 该展示什么 | 为什么这样排 |
| --- | --- | --- |
| 首屏 Hero | 一句明确价值主张；一个主 CTA“浏览公开角色”；一个次 CTA“创建我的第一个身份”；外加 3 个按动机场景分流的入口：写小说、跑团设定、AI 角色扮演 | 首先回答“这是什么、我能做什么、下一步是什么” citeturn35search1turn35search4 |
| 首屏样本卡片 | 6–9 个精选公开角色，不求多，只求风格差异明显；每张卡只显示头像/封面、角色一句话设定、时代标签、世界观标签、完成度、是否已发布 | 用户扫描而不是阅读，需要高信息密度、低理解门槛的样本 citeturn35search2turn35search14 |
| 第二屏内容轨道 | “适合小说作者”“适合 GM”“适合 AI 聊天”“跨时代身份实验”“世界观完整度高”“关系网复杂度高”等专题轨道 | 用使用意图组织内容，而不是用内部模块命名 |
| 预览层 | 点击卡片先弹出 30 秒可读完的 Preview Drawer：人物概览、世界一句话、关键能力、关系网摘要、开场叙事节选、创建者信息、CTA“以此为灵感创建” | 先让用户被启发，再要求注册 |
| 深度发现区 | 再放搜索、筛选、分页、标签树与排序；这部分可以在首屏之下或二级页 | 深度发现服务的是已经被吸引的用户，不是陌生访客的第一眼 |
| 转化桥 | 在每个预览与专题轨道后放极轻量的注册承接：“30 秒保存这个灵感”“Fork 这个结构开始写” | 把浏览和创建变成一条路径，而不是两张孤立页面 |

**所以答案不是“快速浏览还是深度发现只能二选一”，而是：首屏必须快速浏览，深度发现必须保留，但应当作为第二层、第三层。** 如果一定要排序，我会给出 **70% 快速浏览 / 30% 深度发现** 的首屏资源配比。

一个特别重要的动作是：**不要让 Explore 只是“看别人”，要让 Explore 变成“看了就想做自己的”。** 也就是说，所有精选角色都应该带一个转化桥，比如“Fork 世界观骨架”“用这个时代线开始”“复制关系模板”。这比单纯的 “Register to continue” 更像创作产品，而不是内容门户。

## 竞品参照与经典案例

### Character.AI

Character.AI 当前的公开策略核心是 **即时满足 + 大规模发现 + 低门槛创作**。公开站点强调可访问 “10M+ Characters”，并突出“10 秒注册”；发现面则采用 Create / Discover 导航和 For you、Try these、Featured 这类典型的内容轨道结构。它并不会假设第一次来的用户已经知道自己想找什么，而是先让人通过推荐和示例进入消费状态。citeturn6search0turn6search1

更重要的是，它把创作者也做了明显分层。官方 Character Book 明确说有 **Quick mode** 和 **Advanced mode** 两种创作者体验，并建议新用户先做 Quick Character，再去玩更强的定义与图像能力。这本质上就是“先让轻度用户成功，再把一部分人升级成重度创作者”。citeturn28view1

在发现层，Character.AI 这两年持续补强的也是便于新用户快速命中的信号：类别会影响角色如何被发现；角色支持 tags；搜索支持 relevance、likes、popularity、newest；官方还在推进 autocomplete、search suggestions、histories 和 trending searches；移动端 Community Feed 则把角色、Scenes、Streams 和创作者内容混成一个动态滚动发现流。整个策略非常清楚：**先用浅浏览和社交流把新用户留住，再逐步把其中一部分抬进创作者体系。** citeturn6search4turn28view0turn28view2turn28view3

对 OasisBio 的启发是：**不要把“深角色”误做成“难进入”。** 你可以有比 Character.AI 深得多的结构，但第一次接触时应该比它更像“一个让我马上理解并想试的角色宇宙入口”。

### WorldAnvil

WorldAnvil 的经典之处在于，它不是只做了一个“世界观工具”，而是做了两层分层。第一层是 **按用户任务分层**：官方首页与功能导航清楚地区分 Gamemasters、Writers、Creatives、Players；知识库也为 Writers、DM/GM、RPG 玩家等提供不同 workflow。第二层是 **按投入深度分层**：Freeman、Master、Grandmaster、Sage 四层 Guild 会员，把从尝试者到专业作者/工作室的路径整合进产品结构和定价结构里。citeturn27view0turn26view2turn26view1

它的社区与发现页同样很值得参考。Community 页不是只强调展示，而是把世界、文章、故事、挑战分开，使不同类型的轻度探索都能成立；而平台主页又持续把“搜索与探索”“组织能力”“地图、时间线、家谱”等深工具放在可理解的叙事顺序中。citeturn26view0turn27view0

对 OasisBio 来说，WorldAnvil 最有价值的参照不是 UI，而是它告诉你：**复杂创作工具真正需要的不是“人人都学会全部功能”，而是让不同成熟度、不同任务的用户都找到自己的上升路径。** OasisBio 目前已经具备这种潜力，因为它既有 world/timeline/relationship 等深工具，又有 publish / public profile / OAuth 这种对重度用户才真正有吸引力的外部价值。citeturn1view0turn4view0turn26view1

### 经典案例

如果要从这个赛道里挑一个“用户分层做得最值得学的经典套路”，我会总结成三种：

**Character.AI 型：消费先行。** 先让用户玩，再让部分用户创，再从创作者里培养头部。适合大盘很大、即时娱乐性强的产品。citeturn6search0turn28view0turn28view1

**WorldAnvil 型：用途分流 + 深度分层。** 先按使用场景把人导进不同 workflow，再用功能和定价把用户从免费尝鲜者一路抬到专业创作者。适合复杂工具型产品。citeturn27view0turn26view1turn26view2

**Campfire 型：模块化分层。** 官方首页强调可写、可读、可世界构建、可发布；定价页把 Characters、Timeline、Maps、Relationships、Encyclopedia 等拆成模块，免费版给每个模块少量额度，例如 10 个免费角色、2 张免费地图、5 篇免费百科，让用户按自身痛点逐步加深，而不是一次性购买整套复杂度。citeturn29view0turn29view1turn29view2

OasisBio 最适合的是 **Character.AI 式顶部漏斗 + WorldAnvil/Campfire 式中后段升级**。翻成产品语言就是：**“先让我看懂，再让我做成，再让我养成。”**

## 漏斗基准与关注重点

先说清楚：公开市场上几乎没有专门针对“角色身份/世界观创作工具”的完整漏斗 benchmark，所以以下必须区分 **公开可得的代理基准** 和 **我建议 OasisBio 采用的内部目标**。前者能帮助你判断是不是明显失常，后者才是更适合你们产品阶段的运营目标。

| 环节 | 公开基准或最接近代理 | OasisBio 首期目标 | 解读 |
| --- | --- | --- | --- |
| Landing Page → Explore | 没有直接行业基准。可参考的是：Unbounce 统计的 SaaS 落地页主转化中位数为 **3.8%**；ProductLed 统计的 PLG/freemium 访客到免费注册中位数约 **12%**。因此，“浏览公开角色”这种更软的 CTA，理论上应显著高于直接注册转化。 citeturn39search0turn39search1turn31view0 | **15%–30%** | 这是建议目标，不是行业真值。低于 10% 通常说明首页没把“这是什么”讲明白。 |
| Explore → Register Complete | 没有公开统一 benchmark。可用 12% 的访客→免费注册中位数，结合注册表单平均完成率 **60.7%** 倒推：已经在 Explore 看过样本、产生兴趣的用户，完成注册的比例应该明显高于全站平均。 citeturn31view0turn23view0 | **20%–35%** | 如果 Explore 访客注册完成长期低于 15%，大概率不是“用户不对”，而是样本内容与 CTA 之间没有形成价值桥。 |
| Register Start → Register Complete | Zuko 的表单基准显示，**Registration** 类表单 starter-to-completion 平均为 **60.7%**；全部表单平均是 **51.7%**。citeturn23view0 | **≥65%，优秀 ≥75%** | OasisBio README 显示使用的是 Supabase Auth 的 OTP / passwordless；理论上应优于很多传统注册表单。citeturn1view0 |
| Register Complete → First Character Created | Userpilot 的 2024 SaaS 数据显示平均 activation 约 **37.5%**，PLG 公司平均约 **34.6%**；Amplitude 的产品基准还表明，七日激活与三个月留存强相关，七日回访达到 **7%** 已能进入激活前 25%。同时，Userpilot 也指出 onboarding checklist 平均完成率只有 **19.2%**，不能把“走完向导”误认成真正激活。citeturn32view0turn33search6turn18view0turn40view1 | **30%–40% 在 7 天内创建首个角色** | OasisBio 的 activation 事件不该是“完成所有 6 步”，而该是“创建出第一个可预览、可保存、可继续完善的角色骨架”。 |
| First Character Created → First Publish | 没有标准公开 benchmark。OasisBio 战略计划把 Publish 明确视为短期核心里程碑，说明它是产品价值显性化的时刻。citeturn4view0 | **10%–20% 在 30 天内首发** | 对 OasisBio 来说，发布比“纯创建”更接近真正的价值兑现。 |

如果只看最关键的经营逻辑，我会这样判断：**当前最该盯的是 Register → First Character Created，而不是 Landing Page 转化率。** 原因很简单。Amplitude 的公开基准已经说明，早期激活和后续留存之间存在强联系；战略计划也说明 OasisBio 现在最大的挑战尚不是“如何吸更多人”，而是“如何让真实用户跑通”。citeturn18view1turn40view1turn4view0

但这不等于 Explore 不重要。**Explore 是 OasisBio 的第一印象页面，也是把“概念感兴趣”用户变成“我愿意试着做一个”用户的关键桥。** 因为战略计划已经明确指出 Explore 还缺搜索与分页，而且目前“会把全部内容都载入”，所以 Explore 的结构优化实际上会同时影响两个阶段：**Landing → Explore 的吸引力** 和 **Explore → Register 的说服力**。citeturn4view0

因此，我建议把接下来的增长优先级定成一句话：**先把“看见一个好样本”到“做出第一个自己的角色”变成一条连续路径。**

## 可执行建议

### 把 Explore 从内容陈列页改成启发式转化页

不要把 Explore 做成“公开角色列表”，而要把它做成 **“样本驱动的创作入口”**。首屏先呈现 6–9 个精选公开角色，每个都应该能在 3 秒内被理解：一句话角色钩子、时代/世界标签、完成度、关系强度、是否可公开访问。第一次访问者不应该先学会 DCOS 是什么，而应该先被一个完整角色样本打动。这样符合首页第一印象原则，也符合用户扫描式阅读习惯。citeturn35search1turn35search2

### 把“浏览”后的下一步从注册改成 Fork

当用户点击一个公开角色，不要只给“登录后查看更多”。更好的转化桥是：**“用这个结构创建我的角色”“复制这个时代线骨架”“按这个世界观模板开始”**。这会把 Explore 从消费区变成创作起点。Character.AI 用 Quick mode / Advanced mode 让新手更容易开始；Campfire 用免费角色额度和模块化入口降低第一次创作的心理成本。OasisBio 也需要一个同样直观的桥。citeturn28view1turn29view1turn29view2

### 首创流程只要求完成骨架，不要强迫一步到位

虽然你们当前有 6 步向导，但第一激活事件不应该是“完整填写所有模块”。NN/g 的复杂产品研究非常强调 Learner 需要的是可学习性与低风险探索，而不是一次性吃透系统。对于 OasisBio，更合理的首创路径是：**基础信息 → 一个时代版本 → 一段世界观摘要 → 自动生成预览页**。能力池、DCOS、关系网、发布说明，应该尽量放到第一次保存后的“继续完善”阶段。这样既符合渐进式披露，也更有可能把注册用户推过 activation 门槛。citeturn35search3turn35search15turn36view0

### Nuwa AI 应该在“写完一个草稿之后”介入，而不是替代开始动作

战略计划明确说 OasisBio 早期 **不做 AI 自动生成，只做建议**。这其实是很正确的方向。对作者、GM、设定党来说，他们想要的是“我写的东西变得更完整、更自洽”，而不是“AI 替我写了一个不属于我的角色”。所以最好的产品设计不是“空白页上先问 AI”，而是“用户写完一句设定后，Nuwa 给出 3 个补全方向：时代冲突、关系缺口、能力矛盾”。这会显著提高中度用户转重度用户的概率，也更符合官方战略。citeturn4view0

### 给中度用户一个明确的第二目标：发布，而不是继续填表

许多创作工具的问题在于，用户完成首次创建后只看到更多表单，结果流失。OasisBio 的第二目标应该是 **“发布第一个可分享的身份链接”**。战略计划已经把公开 profile 强化、用户主页和传播入口视为重点，你们应该在首个角色创建成功后立刻引导：“现在发布一个 Lite 版本”“让别人先看到这个角色的核心设定”。发布是第一个真正可被外部世界反馈的里程碑，它比“再填一个模块”更有动力。citeturn4view0

### 给重度用户单独开一条“专业创作者路径”

重度用户不是需要更多欢迎弹窗，而是需要更强的控制力。WorldAnvil 会为专业用户提供更高层级的展示、访问控制、协作、订阅者与专业化功能；Campfire 通过模块控制让深度创作者按需扩张。OasisBio 的重度路径应该优先补这几个东西：更强的版本历史、角色之间的群组管理、用户主页聚合、多身份组织、公开 API/OAuth waitlist、导出与备份可见性。这些功能不需要放到新手首屏，但必须让重度用户知道“这里值得长期沉淀”。citeturn26view1turn27view0turn29view1

### 先埋点再争论

在数据层面，我建议至少把以下事件定义为第一批北极星与诊断事件：`landing_view`、`click_explore`、`open_preview`、`click_fork_or_start_from_sample`、`register_started`、`register_completed`、`first_bio_started`、`first_bio_saved`、`first_bio_previewed`、`first_bio_published`、`return_day_1`、`return_day_7`。再按来源、意图入口与样本轨道分 cohort。Amplitude 的公开研究已经说明了早期激活对后续留存的重要性，所以你们的分析面板必须把“注册后 24 小时 / 7 天内是否创建角色”放到最前面，而不是只看注册数。citeturn18view0turn18view1turn40view0turn40view1

## 开放问题与限制

这份判断是 **基于公开仓库、公开说明、竞品官方页面与公开 benchmark 的推断模型**，而不是基于 OasisBio 自身真实 cohort 数据。所以，轻/中/重比例应该被视为 **运营假设**，不是最终答案。

另外，Character.AI 与 WorldAnvil 都在持续迭代公开入口与发现策略，尤其 Character.AI 的公共发现面和社区功能变化很快；因此我更建议你把它们当作 **模式参考**，而不是逐像素模仿对象。真正决定 OasisBio 成败的，不是页面像谁，而是它能否把“复杂身份系统”的第一次体验做得足够轻，并把“创作深度”的后劲保留下来。