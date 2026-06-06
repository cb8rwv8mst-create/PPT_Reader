import type { Slide, UploadResponse, NarrateResponse } from './types';

const API_BASE = 'http://localhost:8080/api/ppt';

// ==========================================
const USE_MOCK = true; 

export const api = {
  // 1. 上传 PPT 接口
  upload: async (file: File): Promise<UploadResponse> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 模拟网络延迟
      return {
        id: "task_mock_abc123",
        slides: [
          { index: 0, title: "第一页：项目概述", content: "欢迎来到 AI PPT 讲解员项目。这是一个基于 React 和 Spring Boot 的全栈应用。", notes: "这里说话语气要稳重、自信。" },
          { index: 1, title: "第二页：系统架构", content: "前端：React + TS (零库依赖)\n后端：Spring Boot + Apache POI\nAI 层：DeepSeek + Edge TTS", notes: "注意强调我们没有使用任何多余的状态管理库。" },
          { index: 2, title: "第三页：未来展望", content: "未来我们将支持更多动效高亮，以及多国语言解说合成。", notes: "结语部分，语速可以适当放慢。" }
        ]
      };
    }
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
    return res.json();
  },
  
  // 2. 查询幻灯片接口
  getSlides: async (id: string): Promise<any> => {
    if (USE_MOCK) {
      return [
        { index: 0, title: "第一页：项目概述", content: "欢迎来到 AI PPT 讲解员项目。这是一个基于 React 和 Spring Boot 的全栈应用。", notes: "这里说话语气要稳重、自信。" },
        { index: 1, title: "第二页：系统架构", content: "前端：React + TS (零库依赖)\n后端：Spring Boot + Apache POI\nAI 层：DeepSeek + Edge TTS", notes: "注意强调我们没有使用任何多余的状态管理库。" },
        { index: 2, title: "第三页：未来展望", content: "未来我们将支持更多动效高亮，以及多国语言解说合成。", notes: "结语部分，语速可以适当放慢。" }
      ];
    }
    const res = await fetch(`${API_BASE}/${id}/slides`);
    return res.json();
  },

  // 3. 生成 AI 讲解稿接口
  narrate: async (id: string, slides: Slide[]): Promise<NarrateResponse> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        fullScript: "完整讲解稿：大家好...",
        slideScripts: [
          "【AI 读第一页】大家好！欢迎来到 AI PPT 讲解员项目。这是一个非常具有前瞻性的全栈应用，旨在通过 AI 降低人类的演讲成本。",
          "【AI 读第二页】现在请看第二页。我们的系统架构非常精简。前端采用 React 搭配 TypeScript，真正做到了零库依赖。后端则依托于 Spring Boot 和 DeepSeek 大模型进行语言驱动。",
          "【AI 读第三页】最后，我们来展望一下未来。未来系统将支持更加智能的动态高亮，以及多语种合成，谢谢大家！"
        ]
      };
    }
    const res = await fetch(`${API_BASE}/${id}/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slides })
    });
    return res.json();
  },

  // 4. 获取音频 URL 
  getAudioUrl: (id: string): string => {
    if (USE_MOCK) {
      // 纯前端测试时，使用一条公共测试音频流
      return 'https://www.w3school.com.cn/i/horse.mp3';
    }
    return `${API_BASE}/${id}/audio`;
  }
};