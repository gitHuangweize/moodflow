项目说明书：随笔流 (MoodFlow)
1. 项目愿景
一个轻量化的、具有社交属性的心得分享平台。用户可以发布“牢骚”或“心得”，主页以随机句子的形式呈现，带给用户一种“偶遇感”和“情感共鸣”。

2. 技术栈 (本地开发版)

/my-app
├── /src
│   ├── /app            # 前端路由与页面
│   │   ├── /page.tsx   # 主页（展示随机句子）
│   │   └── /layout.tsx
│   ├── /api            # 👈 后端 API 逻辑 (与前端分离)
│   │   ├── /posts      # 处理心得的增删改查
│   │   └── /ai         # 调用 DeepSeek/OpenAI 接口
│   ├── /lib            # 👈 共享工具库
│   │   ├── prisma.ts   # 数据库连接器 (ORM)
│   │   └── ai-client.ts
│   └── /components     # UI 组件

全栈框架: Next.js 14+ (App Router)

前端: React, Tailwind CSS, shadcn/ui (组件库)

后端 API: Next.js Route Handlers (与前端解耦)

数据库 ORM: Prisma

本地数据库: SQLite (开发阶段最简单) 或 PostgreSQL (Docker)

AI API: DeepSeek API (用于情感分析和内容处理)

3. 核心功能模块
第一阶段：基础架构 (当前重点)
API 分层: 所有数据库操作必须在 src/app/api/ 下，前端通过 fetch 调用。

数据模型:

Post: id, content, authorName, isAnonymous, moodTag, createdAt.

双模式主页:

沉浸模式 (Random Mode): 屏幕中心只显示一条随机句子。

卡片模式 (Feed Mode): 瀑布流展示多条心得卡片。

第二阶段：AI 与社交
AI 增强: 发布时自动调用 DeepSeek 识别情绪，生成对应的心情图标（如：💡 心得, 🌧️ 牢骚）。

互动: 支持游客点赞（共鸣），本地存储点赞状态。

4. 任务拆解 (Windsurf 执行顺序)
任务 1：初始化项目环境
Prompt: "请基于 Next.js, Tailwind CSS 和 Prisma 初始化项目。数据库先使用 SQLite 以便本地开发。安装必要的依赖。"

任务 2：创建数据库 Schema
Prompt: "请在 prisma/schema.prisma 中定义 Post 模型，包含内容、作者、是否匿名、情绪标签和时间戳。然后执行迁移并生成 Prisma Client。"

任务 3：编写后端 API (分离层)
Prompt: "请在 src/app/api/posts/ 下创建两个接口：

GET /api/posts/random: 随机返回一条心得。

GET /api/posts: 返回所有心得列表（支持分页）。

POST /api/posts: 保存用户发布的心得。"

任务 4：构建前端主页 (双模式切换)
Prompt: "请在主页实现两种布局。默认显示一个巨大的居中句子，下方有‘换一个’按钮。右上角有一个切换开关，点击后无缝切换为 Tailwind 卡片瀑布流布局。"

5. UI 布局建议 (参考)
配色: 极简主义。背景建议用浅灰色或米白色 (#F9F9F9)。

字体: 衬线体 (Serif) 用于随机句子，增加文学感。

交互: 切换模式时增加一个简单的淡入淡出动画（使用 framer-motion）。

6. 后续部署策略 (预留)
前端: 准备部署至 Vercel/Zeabur。

数据库: 后续将 SQLite 链接更换为 Supabase (PostgreSQL) 环境变量即可。

API 地址: 全站使用相对路径，确保部署后无需修改代码。