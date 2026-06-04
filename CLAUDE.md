# CLAUDE.md

## 项目概述

AI PPT 讲解员 — 用户上传 .pptx 文件，AI 识别内容后生成中文讲解稿并合成语音播报。课程项目，三人协作。

## 技术栈

- 后端：Spring Boot 3.5 + Java 17 + Maven
- 前端：React 18 + Vite + TypeScript（项目根目录 `frontend/`）
- PPT 解析：Apache POI (poi-ooxml)
- AI 讲解：DeepSeek API (`deepseek-chat`)
- 语音合成：Microsoft Edge TTS

## 构建与运行

```bash
# 后端
./mvnw spring-boot:run          # 开发模式（带 devtools 热重载）
./mvnw test                     # 运行测试

# 前端
cd frontend && npm install && npm run dev
```

后端默认 `http://localhost:8080`，前端 `http://localhost:5173`。

## 项目结构

```
PPT Reader/
├── src/main/java/cn/edu/zju/chen/
│   ├── PptReaderApplication.java    # Spring Boot 入口
│   ├── controller/                  # REST Controller
│   ├── service/                     # 业务逻辑
│   └── model/                       # DTO / 数据模型
├── frontend/                        # React 前端
│   └── src/
│       ├── pages/                   # 页面组件
│       └── components/              # UI 组件
├── docs/                            # 团队文档
│   ├── Git 合作指南.md
│   └── 分工文档.md
└── pom.xml
```

## 团队分工

| 成员 | 模块 | 关键类 |
|---|---|---|
| A | PPT 解析 + REST API | `PptController`, `PptParserService`, `Slide` |
| B | AI 讲解 + TTS 语音 | `DeepSeekService`, `EdgeTTSService`, `Narration` |
| C | React 前端 | `UploadPage`, `PresentPage`, `AudioPlayer` 等 |

详见 `docs/分工文档.md`。

## API 接口约定（前后端对接关键）

```
POST /api/ppt/upload          → { id, slides: [{index, title, content, notes}] }
GET  /api/ppt/{id}/slides     → 同上 slides 数组
POST /api/ppt/{id}/narrate    → { fullScript, slideScripts: [...] }
GET  /api/ppt/{id}/audio      → audio/mpeg 二进制
```

## 配置管理

**所有配置通过 `.env` 文件管理，不在代码中硬编码密钥或敏感信息。**

### 使用方式

1. 复制模板文件：`cp .env.example .env`
2. 编辑 `.env`，填入实际的 API Key 等配置
3. Spring Boot 启动时自动读取 `.env`（通过 `spring-boot-starter-dotenv` 或 IDEA 的 EnvFile 插件）

### .env 变量清单

| 变量名 | 说明 | 示例 |
|---|---|---|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | `sk-xxxx` |
| `DEEPSEEK_BASE_URL` | DeepSeek API 地址（可选） | `https://api.deepseek.com` |
| `UPLOAD_DIR` | PPT 文件上传目录（可选） | `./uploads` |
| `AUDIO_DIR` | 生成的 MP3 存放目录（可选） | `./audio` |

### 安全约定

- `.env` **已加入 `.gitignore`**，不会被提交到 Git
- `.env.example` 提供模板（不含真实密钥），可安全提交
- 新成员加入时，从 `.env.example` 复制并填入自己的密钥

### 其他配置

- CORS：后端需允许 `http://localhost:5173` 跨域
- 任务 ID：使用 UUID 生成

## 编码约定

- Java 包路径：`cn.edu.zju.chen`
- 使用 Lombok（`@Data`, `@Slf4j` 等）
- 提交信息遵循 Conventional Commits（中文）：`feat:`, `fix:`, `docs:`, `chore:`
- 代码规范：四人小组开发，无自动格式化配置，注意缩进统一

## 当前状态

项目处于初始化阶段：Spring Boot 脚手架已就绪（仅 `spring-boot-starter` + `devtools` + `lombok`），`application.properties` 仅配置了应用名。前端尚未创建。AI 和 TTS 的依赖尚未添加。
