import type { Slide, UploadResponse, NarrateResponse } from './types';

const API_BASE = '/api/ppt';

// 是否使用 Mock 数据（通过 Vite 环境变量 VITE_USE_MOCK 控制）
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/** 解包 ApiResponse，取出 data 字段 */
async function unwrap<T>(res: Response): Promise<T> {
    const json = await res.json();
    if (!res.ok || json.code !== 200) {
        throw new Error(json.message || '请求失败');
    }
    return json.data as T;
}

export const api = {
    // 1. 上传 PPT 接口
    async upload(file: File): Promise<UploadResponse> {
        if (USE_MOCK) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            return {
                id: 'task_mock_abc123',
                slides: [
                    { index: 0, title: '第一页：项目概述', content: '欢迎来到 AI PPT 讲解员项目。这是一个基于 React 和 Spring Boot 的全栈应用。', notes: '这里说话语气要稳重、自信。' },
                    { index: 1, title: '第二页：系统架构', content: '前端：React + TS (零库依赖)\n后端：Spring Boot + Apache POI\nAI 层：DeepSeek + Edge TTS', notes: '注意强调我们没有使用任何多余的状态管理库。' },
                    { index: 2, title: '第三页：未来展望', content: '未来我们将支持更多动效高亮，以及多国语言解说合成。', notes: '结语部分，语速可以适当放慢。' },
                ],
            };
        }
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
        return unwrap<UploadResponse>(res);
    },

    // 2. 查询幻灯片接口
    async getSlides(id: string): Promise<Slide[]> {
        if (USE_MOCK) {
            return [
                { index: 0, title: '第一页：项目概述', content: '欢迎来到 AI PPT 讲解员项目。', notes: '语气稳重。' },
                { index: 1, title: '第二页：系统架构', content: '前端：React + TS\n后端：Spring Boot + POI', notes: '强调零库依赖。' },
                { index: 2, title: '第三页：未来展望', content: '支持更多动效高亮及多国语言。', notes: '结语放慢语速。' },
            ];
        }
        const res = await fetch(`${API_BASE}/${id}/slides`);
        return unwrap<Slide[]>(res);
    },

    // 3. 生成 AI 讲解稿接口
    async narrate(id: string, slides: Slide[], vision = true): Promise<NarrateResponse> {
        if (USE_MOCK) {
            const delay = vision ? 3000 : 1500;
            await new Promise((resolve) => setTimeout(resolve, delay));
            const prefix = vision ? '【图像识别增强】' : '【纯文本分析】';
            return {
                fullScript: prefix + '完整讲解稿：大家好…',
                slideScripts: [
                    prefix + '【第一页】大家好！欢迎来到 AI PPT 讲解员项目。',
                    prefix + '【第二页】现在请看第二页，我们的系统架构非常精简。',
                    prefix + '【第三页】最后展望未来，谢谢大家！',
                ],
            };
        }
        const res = await fetch(`${API_BASE}/${id}/narrate?vision=${vision}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slides),
        });
        return unwrap<NarrateResponse>(res);
    },

    // 4. 获取音频 URL
    getAudioUrl(id: string): string {
        if (USE_MOCK) {
            return 'https://www.w3school.com.cn/i/horse.mp3';
        }
        return `${API_BASE}/${id}/audio`;
    },
};
