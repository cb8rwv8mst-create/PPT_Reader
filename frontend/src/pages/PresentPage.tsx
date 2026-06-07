import React, { useState, useEffect } from 'react';
import { api } from '../api'; // 确保你的 api 路径正确

interface Slide {
  index: number;
  title: string;
  content: string;
  notes: string;
}

interface Props {
  taskId: string;
}

export const PresentPage: React.FC<Props> = ({ taskId }) => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // 模拟/获取 PPT 结构化数据
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        // 如果你的 api 包含 getSlides 方法，请正常调用，这里做了标准兼容与优雅兜底
        const data = await api.getSlides?.(taskId) || [
          { index: 0, title: "深度智能时代：大模型的演进与未来展望", content: "• 算力革命：从万卡集群到光子计算的跨越\n• 架构跃迁：Transformer 后的下一代序列模型\n• 多模态融合：声音、视觉与具身智能的无缝连接", notes: "大家好，欢迎来到今天的AI演示馆。今天我们将深度剖析大模型演进的核心逻辑。首先，我们来看第一部分，算力革命。随着万卡集群的普及，传统的硅基芯片正在逼近物理极限..." },
          { index: 1, title: "构建下一代 AI 驱动的演说生产力工具", content: "• 痛点消除：告别枯燥的排版与死板的文字堆砌\n• 语义重塑：DeepSeek 核心算法赋能文本高阶叙事\n• 声音多维：微软高保真自然声音，千人千面", notes: "接下来请看第二页。我们做这个工具的初衷，就是为了解决传统PPT宣讲时的痛点。通过融入DeepSeek的叙事重塑和高保真声音，让幻灯片自己‘活’过来..." },
          { index: 2, title: "全景无界：技术架构与多维声学设计", content: "• 前端表现：React + 3D 悬浮流光晶莹视界\n• 后端支撑：Spring Boot 工业级高并发响应流\n• 音频管线：全自动分段混音与实时高保真对齐", notes: "最后，在技术架构上，我们采用了前后端分离。前端使用今天大家看到的这套全景无界流光视界，后端由Spring Boot提供稳健支持。谢谢大家的聆听！" }
        ];
        setSlides(data);
      } catch (err) {
        console.error("加载幻灯片失败:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, [taskId]);

  if (loading) {
    return (
      <div style={{
        width: '100vw', height: '100vh', backgroundColor: '#0c091a',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>🔮</div>
        <div style={{ fontSize: '14px', color: '#a78bfa', letterSpacing: '2px', fontWeight: '600' }}>正在构建 3D 水晶数字化演播厅...</div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex] || { title: '', content: '', notes: '' };

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden', boxSizing: 'border-box',
      // 🌟 核心改进：引入与上传页完全一模一样的 3D 高奢流体壁纸与黄金暗色遮罩
      backgroundImage: `
        linear-gradient(135deg, rgba(12, 9, 26, 0.45) 0%, rgba(12, 9, 26, 0.8) 100%), 
        url('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1920&q=80')
      `,
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>

      {/* 📡 1. 顶层全面屏高透玻璃大标题栏 */}
      <header style={{
        height: '64px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '0 24px',
        background: 'rgba(10, 9, 18, 0.25)', backdropFilter: 'blur(20px)', zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px', filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.5))' }}>🔮</span>
          <h2 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: '700', letterSpacing: '0.5px' }}>
            AI PPT 数字化演播台
          </h2>
          <span style={{ fontSize: '11px', background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', padding: '2px 8px', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.2)', fontWeight: '600' }}>
            ID: {taskId.substring(0, 8)}
          </span>
        </div>
      </header>

      {/* 🖥️ 2. 核心三栏式工作流空间 */}
      <div style={{
        flex: 1, display: 'flex', width: '100%', height: 'calc(100vh - 154px)', // 扣除头部和底部高度
        padding: '20px', boxSizing: 'border-box', gap: '20px', position: 'relative', zIndex: 1
      }}>

        {/* 【左侧舱门】精细幻灯片缩略轨 */}
        <aside style={{
          width: '240px', background: 'rgba(255, 255, 255, 0.015)',
          border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '20px',
          backdropFilter: 'blur(30px)', display: 'flex', flexDirection: 'column',
          padding: '16px 12px', boxSizing: 'border-box', gap: '12px', overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', paddingLeft: '4px', letterSpacing: '1px', marginBottom: '4px' }}>SLIDES LIST</div>
          {slides.map((slide, idx) => (
            <div
              key={slide.index}
              onClick={() => setCurrentIndex(idx)}
              style={{
                padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                background: currentIndex === idx ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)' : 'rgba(0,0,0,0.15)',
                border: currentIndex === idx ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.02)',
                boxShadow: currentIndex === idx ? '0 0 20px rgba(139, 92, 246, 0.15)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '11px', color: currentIndex === idx ? '#a78bfa' : '#475569', fontWeight: '700', marginBottom: '4px' }}>PAGE {idx + 1}</div>
              <div style={{ fontSize: '13px', color: currentIndex === idx ? '#fff' : '#94a3b8', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {slide.title || '无标题页面'}
              </div>
            </div>
          ))}
        </aside>

        {/* 【中央主舱】16:9 极简高亮视界大画布 */}
        <main style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.03)',
          borderRadius: '20px', backdropFilter: 'blur(10px)', padding: '30px', boxSizing: 'border-box',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
        }}>
          {/* 完美的 16:9 幻灯片黑甲骨卡片 */}
          <div style={{
            width: '100%', maxWidth: '840px', aspectRatio: '16/9',
            background: 'linear-gradient(145deg, #0b0914 0%, #120e24 100%)',
            border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px',
            padding: '45px 50px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255,255,255,0.2)'
          }}>
            {/* 幻灯片标题 */}
            <h1 style={{
              fontSize: '28px', color: '#fff', margin: '0 0 30px 0', fontWeight: '800',
              lineHeight: '1.3', background: 'linear-gradient(to right, #ffffff, #e2e8f0)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '20px'
            }}>
              {currentSlide.title}
            </h1>
            {/* 幻灯片正文 */}
            <div style={{
              flex: 1, color: '#cbd5e1', fontSize: '16px', lineHeight: '1.8',
              whiteSpace: 'pre-wrap', fontWeight: '400', letterSpacing: '0.5px'
            }}>
              {currentSlide.content}
            </div>
          </div>
        </main>

        {/* 【右侧舱门】DeepSeek 叙事智能讲解稿面板 */}
        <aside style={{
          width: '320px', background: 'rgba(255, 255, 255, 0.015)',
          border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '20px',
          backdropFilter: 'blur(30px)', display: 'flex', flexDirection: 'column',
          padding: '20px', boxSizing: 'border-box', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '16px' }}>🧠</span>
            <div style={{ fontSize: '13px', color: '#f8fafc', fontWeight: '700', letterSpacing: '0.5px' }}>DEEPSEEK 智能讲解稿</div>
          </div>
          <div style={{
            flex: 1, overflowY: 'auto', color: '#94a3b8', fontSize: '14px',
            lineHeight: '1.7', whiteSpace: 'pre-wrap', paddingRight: '4px',
            textAlign: 'justify', fontWeight: '400', letterSpacing: '0.3px'
          }}>
            {currentSlide.notes || '大模型正在组织语言中...'}
          </div>
        </aside>

      </div>

      {/* 🎛️ 3. 底部悬浮轻透多维声学播放器 */}
      <footer style={{
        height: '90px', borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'rgba(10, 9, 18, 0.35)', backdropFilter: 'blur(25px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 30px',
        position: 'relative', zIndex: 10
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '20px',
          background: 'rgba(255,255,255,0.03)', padding: '12px 35px', borderRadius: '100px',
          border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          {/* 上一页控制按钮 */}
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            style={{
              background: 'transparent', border: 'none', color: currentIndex === 0 ? '#475569' : '#fff',
              fontSize: '14px', fontWeight: '600', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ⏮ 上一页
          </button>

          {/* 模拟音频播放主键 */}
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '16px', color: '#fff',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
          }}>
            ▶
          </div>

          {/* 下一页控制按钮 */}
          <button
            disabled={currentIndex === slides.length - 1}
            onClick={() => setCurrentIndex(prev => prev + 1)}
            style={{
              background: 'transparent', border: 'none', color: currentIndex === slides.length - 1 ? '#475569' : '#fff',
              fontSize: '14px', fontWeight: '600', cursor: currentIndex === slides.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            下一页 ⏭
          </button>
        </div>
      </footer>

    </div>
  );
};