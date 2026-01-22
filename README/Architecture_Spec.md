非常专业。既然我们已经确定了 Next.js + Supabase (PostgreSQL) 的技术架构，那么严格按照软件开发流程，现在进入**数据建模（Data Modeling）**阶段。

在 Prisma 中定义 Schema 是整个后端逻辑的灵魂。这份文件不仅决定了数据库的表结构，还会自动生成 TypeScript 的类型定义，确保你在 Windsurf 中编写 API 时拥有完美的自动补全和错误检查。

---

## 1. Prisma 数据模型定义 (`schema.prisma`)

针对你的 PRD 需求（280 字限制、配图、AI 情绪标签、自选分类、点赞评论），我为你设计了以下模型：

```prisma
// 数据源配置：开发环境下建议先使用 sqlite，上线时一键切换到 postgresql
datasource db {
  provider = "postgresql" // 部署时改为 postgresql
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 1. 用户模型
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // 存储加密后的哈希值
  name          String?
  avatar        String?   // 头像 URL
  posts         Post[]    // 一个用户可以发多条心得
  comments      Comment[] // 一个用户可以发多条评论
  likes         Like[]    // 一个用户可以点多次赞
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// 2. 心得/牢骚模型
model Post {
  id          String    @id @default(cuid())
  content     String    @db.VarChar(280) // 严格限制 280 字
  imageUrl    String?   // 配图 URL
  category    String    @default("未分类") // 用户自选分类
  moodTag     String?   // AI 识别的情感标签 (如: "Sad", "Happy")
  isPrivate   Boolean   @default(false)   // AI 风控触发后的树洞模式
  
  // 关联字段
  author      User      @relation(fields: [authorId], references: [id])
  authorId    String
  comments    Comment[]
  likes       Like[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // 索引优化：为了实现你要求的“随机展示高赞/最新”算法
  @@index([createdAt])
}

// 3. 评论模型
model Comment {
  id        String   @id @default(cuid())
  content   String   @db.VarChar(200)
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
}

// 4. 点赞模型 (用于记录谁给哪条动态点过赞)
model Like {
  id        String   @id @default(cuid())
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    String
  user      User     @relation(fields: [userId], references: [id])
  userId    String

  @@unique([postId, userId]) // 约束：一个用户对同一条动态只能点赞一次
}

```

---

## 2. 为什么这样建模？（设计思路）

1. **物理删除关联 (`onDelete: Cascade`)**: 当一个用户删除了某条“心得”时，它下属的所有评论和点赞会自动被数据库清理，避免产生垃圾数据。
2. **唯一性约束 (`@@unique`)**: 在 `Like` 表中设置了联合唯一索引，从数据库层面防止用户通过脚本重复点赞。
3. **查询性能优化 (`@@index`)**: 你要求主页优先展示 24 小时内的内容，通过在 `createdAt` 上建立索引，即使未来有数万条数据，查询速度依然极快。
4. **树洞模式逻辑**: `isPrivate` 字段默认是 `false`。如果 AI 风控接口返回该内容敏感，我们会自动将该字段设为 `true`，此时 API 逻辑将确保除了作者本人，没人能看到这条内容。

---

## 3. 本地开发准备步骤

在 Windsurf 中，你可以开始执行以下具体步骤来跑通这个架构：

### 第一步：初始化环境

```bash
# 创建 Next.js 项目
npx create-next-app@latest moodflow --typescript --tailwind --eslint

# 进入目录并安装 Prisma
cd moodflow
npm install prisma @prisma/client
npx prisma init

```

### 第二步：配置环境变量 (`.env`)

在项目根目录创建 `.env` 文件。本地开发建议先用 PostgreSQL 的本地版或 Supabase 的测试库：

```text
DATABASE_URL="postgresql://johndoe:mypassword@localhost:5432/moodflow?schema=public"
NEXTAUTH_SECRET="你的随机密钥"
DEEPSEEK_API_KEY="你的API密钥"

```

---

## 4. 记录到 `Architecture_Spec.md`

你可以让 Windsurf 帮你创建这个文件，并把上面的 Schema 贴进去。

**接下来的行动建议：**
如果你准备好了，我们可以开始编写**第一个 API 路由** —— `GET /api/posts/random`。

这个接口将包含你要求的**排序逻辑**：

1. 优先筛选 `isPrivate: false`。
2. 综合 `createdAt` (24小时内) 和 `likes` 数量进行加权计算。

**你需要我为你写出这个“随机推荐算法”的后端逻辑代码吗？**