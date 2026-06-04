# AI PPT 讲解员

上传 PPTX 文件，AI 自动识别幻灯片内容，生成中文讲解稿并合成语音播报。

## 功能特性

- **PPT 解析**：上传 .pptx 文件，自动提取每页标题、正文和备注
- **AI 讲解稿生成**：调用 DeepSeek 大模型，基于幻灯片内容生成自然流畅的中文讲解
- **语音合成**：通过 Microsoft Edge TTS 将讲解稿转为 MP3 音频，支持在线播放
- **逐页联动**：幻灯片、讲解文字、语音播报三者同步联动

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + Vite + TypeScript |
| 后端 | Spring Boot 3.5 + Java 17 |
| PPT 解析 | Apache POI (XSLF) |
| AI 文本生成 | DeepSeek API (`deepseek-chat`) |
| 语音合成 | Microsoft Edge TTS |
| 构建工具 | Maven (后端) + npm (前端) |

## 系统架构

```
┌──────────────────────────────────────────────┐
│               Frontend (React)               │
│  Upload → SlideViewer → ScriptView → Player  │
└──────────────────┬───────────────────────────┘
                   │ REST API
┌──────────────────▼───────────────────────────┐
│            Backend (Spring Boot)             │
│                                              │
│  Controller → Service → POIParser  (.pptx)   │
│                      → DeepSeekClient (讲解)  │
│                      → EdgeTTSClient  (语音)  │
└──────────────────────────────────────────────┘
```

## 快速开始

### 环境要求

- JDK 17+
- Maven 3.8+
- Node.js 18+
- DeepSeek API Key

### 后端配置

1. 设置 DeepSeek API Key 环境变量：

```bash
export DEEPSEEK_API_KEY=your-api-key
```

2. 启动后端：

```bash
./mvnw spring-boot:run
```

后端默认运行在 `http://localhost:8080`。

### 前端配置

```bash
cd frontend
npm install
npm run dev
```

前端开发服务器默认运行在 `http://localhost:5173`。

## API 文档

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/ppt/upload` | 上传 PPTX 文件（multipart/form-data），返回任务 ID 及幻灯片列表 |
| GET | `/api/ppt/{id}/slides` | 获取已解析的幻灯片（标题、正文、备注） |
| POST | `/api/ppt/{id}/narrate` | 生成 AI 讲解稿，返回完整讲解文本及每页讲解片段 |
| GET | `/api/ppt/{id}/audio` | 获取合成的语音文件（audio/mpeg） |

### 数据模型

**Slide**
```json
{
  "index": 0,
  "title": "幻灯片标题",
  "content": "正文内容",
  "notes": "备注内容"
}
```

**Narration**
```json
{
  "fullScript": "完整讲解稿...",
  "slideScripts": ["第一页讲解...", "第二页讲解..."]
}
```

## 项目结构

```
PPT Reader/
├── src/main/java/cn/edu/zju/chen/
│   ├── PptReaderApplication.java
│   ├── controller/
│   │   └── PptController.java
│   ├── service/
│   │   ├── PptParserService.java
│   │   ├── DeepSeekService.java
│   │   └── EdgeTTSService.java
│   └── model/
│       ├── Slide.java
│       └── Narration.java
├── src/main/resources/
│   └── application.properties
├── frontend/                          # React 前端
│   ├── src/
│   │   ├── components/
│   │   │   ├── Uploader.tsx
│   │   │   ├── SlideViewer.tsx
│   │   │   ├── NarrationPanel.tsx
│   │   │   └── AudioPlayer.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   └── PresentPage.tsx
│   │   └── App.tsx
│   └── package.json
└── pom.xml
```
