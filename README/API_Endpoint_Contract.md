# API 契约规范 (API Endpoint Contract)

## 1. 交互原则
- **格式**: 所有请求与响应均采用 `application/json`。
- **认证**: 使用 NextAuth.js JWT 策略，受限接口需在 Header 携带 Token。
- **图片处理**: 采用客户端直接上传至 Supabase Storage (Presigned URL) 模式以减轻服务器压力。

## 2. 核心接口清单

### 2.1 内容获取 (Posts)
- **GET /api/v1/posts/random**: 
    - 逻辑：加权随机算法（24h内权重 0.7，点赞权重 0.3）。
    - 响应：`{ id, content, imageUrl, authorName, moodTag, likeCount }`
- **GET /api/v1/posts/feed**: 
    - 分页获取瀑布流数据，支持 `cursor` 分页。

### 2.2 交互与发布 (Actions)
- **POST /api/v1/posts/upload-url**: 
    - 获取 Supabase 预签名上传链接。
- **POST /api/v1/posts**: 
    - 入参：`{ content, imageKey, category, moodTag, isPrivate }`
- **POST /api/v1/posts/:id/like**: 
    - 切换点赞状态（Toggle）。

### 2.3 AI 服务 (AI Intelligence)
- **POST /api/v1/ai/suggest**: 
    - 触发：用户停止输入 1.5s 后。
    - 入参：`{ currentContent }`
    - 响应：`{ polishedContent, moodAnalysis, isSensitive }`

### 2.4 数据导出 (Export)
- **GET /api/v1/user/export**: 
    - Query 参数：`format=json|pdf|md`
    - 响应：对应格式的文件流。