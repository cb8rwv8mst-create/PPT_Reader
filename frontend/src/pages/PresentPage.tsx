import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import type { Slide, NarrateResponse } from '../types';

interface Props {
    taskId: string;
}

export const PresentPage: React.FC<Props> = ({ taskId }) => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [narration, setNarration] = useState<NarrateResponse | null>(null);
    const [generating, setGenerating] = useState<boolean>(false);
    const [audioReady, setAudioReady] = useState<boolean>(false);
    const [visionEnabled, setVisionEnabled] = useState<boolean>(true);
    const audioCheckingRef = useRef(false);

    // 获取幻灯片数据
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const data = await api.getSlides(taskId);
                setSlides(data);
            } catch (err) {
                console.error('加载幻灯片失败:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, [taskId]);

    const startNarration = async () => {
        setGenerating(true);
        try {
            const data = await api.narrate(taskId, slides, visionEnabled);
            setNarration(data);
        } catch (err) {
            console.error('生成讲解稿失败:', err);
        } finally {
            setGenerating(false);
        }
    };

    // 讲解稿生成后轮询音频是否就绪
    useEffect(() => {
        if (!narration || audioReady) return;

        const checkAudio = async () => {
            if (audioCheckingRef.current) return;
            audioCheckingRef.current = true;
            try {
                const url = api.getAudioUrl(taskId);
                const res = await fetch(url, { method: 'HEAD' });
                if (res.ok) {
                    setAudioReady(true);
                }
            } catch {
                // 继续轮询
            } finally {
                audioCheckingRef.current = false;
            }
        };

        checkAudio();
        const interval = setInterval(checkAudio, 5000);
        return () => clearInterval(interval);
    }, [narration, audioReady, taskId]);

    if (loading) {
        return (
            <div style={{
                width: '100vw', height: '100vh', backgroundColor: '#0c091a',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}>
                <div style={{ fontSize: '40px', marginBottom: '20px' }}>🔮</div>
                <div style={{ fontSize: '14px', color: '#a78bfa', letterSpacing: '2px', fontWeight: '600' }}>正在加载幻灯片...</div>
            </div>
        );
    }

    const currentSlide = slides[currentIndex] || { index: 0, title: '', content: '', notes: '' };
    const currentNarration = narration?.slideScripts?.[currentIndex] || '';

    // 模式选择界面：幻灯片已加载但讲解稿未生成
    if (!narration && !generating) {
        return (
            <div style={{
                width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                backgroundImage: `
                    linear-gradient(135deg, rgba(12, 9, 26, 0.45) 0%, rgba(12, 9, 26, 0.8) 100%),
                    url('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1920&q=80')
                `,
                backgroundSize: 'cover', backgroundPosition: 'center',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                gap: '24px',
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)', padding: '48px 56px', borderRadius: '28px',
                    backdropFilter: 'blur(35px)', border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 40px 100px rgba(0, 0, 0, 0.5)', textAlign: 'center', maxWidth: '480px',
                }}>
                    <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
                        选择分析模式
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '32px' }}>
                        已加载 {slides.length} 页幻灯片，请选择讲解稿生成方式
                    </p>

                    {/* 模式选择 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                        <label style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '16px 20px', borderRadius: '14px', cursor: 'pointer',
                            background: !visionEnabled ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255,255,255,0.03)',
                            border: !visionEnabled ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255,255,255,0.06)',
                            boxShadow: !visionEnabled ? '0 0 20px rgba(139, 92, 246, 0.15)' : 'none',
                            transition: 'all 0.2s ease',
                        }}>
                            <input type="radio" name="vision" checked={!visionEnabled} onChange={() => setVisionEnabled(false)}
                                style={{ accentColor: '#8b5cf6', width: '16px', height: '16px' }} />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '700' }}>⚡ 仅文本分析</div>
                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>仅根据文字内容生成讲解稿，速度较快</div>
                            </div>
                        </label>

                        <label style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '16px 20px', borderRadius: '14px', cursor: 'pointer',
                            background: visionEnabled ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255,255,255,0.03)',
                            border: visionEnabled ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255,255,255,0.06)',
                            boxShadow: visionEnabled ? '0 0 20px rgba(139, 92, 246, 0.15)' : 'none',
                            transition: 'all 0.2s ease',
                        }}>
                            <input type="radio" name="vision" checked={visionEnabled} onChange={() => setVisionEnabled(true)}
                                style={{ accentColor: '#8b5cf6', width: '16px', height: '16px' }} />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '700' }}>🔮 图像识别分析</div>
                                <div style={{ color: '#fbbf24', fontSize: '12px', marginTop: '4px' }}>识别图片中的公式和图表后再生成讲解稿，用时较长</div>
                            </div>
                        </label>
                    </div>

                    <button onClick={startNarration} style={{
                        width: '100%', padding: '14px 0', borderRadius: '14px', border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                        color: '#fff', fontSize: '16px', fontWeight: '700',
                        boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
                        letterSpacing: '1px',
                    }}>
                        🚀 开始生成讲解稿
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column',
            position: 'relative', overflow: 'hidden', boxSizing: 'border-box',
            backgroundImage: `
                linear-gradient(135deg, rgba(12, 9, 26, 0.45) 0%, rgba(12, 9, 26, 0.8) 100%),
                url('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1920&q=80')
            `,
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>

            {/* 顶部标题栏 */}
            <header style={{
                height: '64px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex', alignItems: 'center', padding: '0 24px',
                background: 'rgba(10, 9, 18, 0.25)', backdropFilter: 'blur(20px)', zIndex: 10,
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

            {/* 三栏布局 */}
            <div style={{
                flex: 1, display: 'flex', width: '100%', height: 'calc(100vh - 154px)',
                padding: '20px', boxSizing: 'border-box', gap: '20px', position: 'relative', zIndex: 1,
            }}>

                {/* 左侧：幻灯片缩略图列表 */}
                <aside style={{
                    width: '240px', background: 'rgba(255, 255, 255, 0.015)',
                    border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '20px',
                    backdropFilter: 'blur(30px)', display: 'flex', flexDirection: 'column',
                    padding: '16px 12px', boxSizing: 'border-box', gap: '12px', overflowY: 'auto',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
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
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <div style={{ fontSize: '11px', color: currentIndex === idx ? '#a78bfa' : '#475569', fontWeight: '700', marginBottom: '4px' }}>PAGE {idx + 1}</div>
                            <div style={{ fontSize: '13px', color: currentIndex === idx ? '#fff' : '#94a3b8', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {slide.title || '无标题页面'}
                            </div>
                        </div>
                    ))}
                </aside>

                {/* 中间：幻灯片主画布 */}
                <main style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.03)',
                    borderRadius: '20px', backdropFilter: 'blur(10px)', padding: '30px', boxSizing: 'border-box',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
                }}>
                    <div style={{
                        width: '100%', maxWidth: '840px', aspectRatio: '16/9',
                        background: 'linear-gradient(145deg, #0b0914 0%, #120e24 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px',
                        padding: '45px 50px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
                        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255,255,255,0.2)',
                    }}>
                        <h1 style={{
                            fontSize: '28px', color: '#fff', margin: '0 0 30px 0', fontWeight: '800',
                            lineHeight: '1.3', background: 'linear-gradient(to right, #ffffff, #e2e8f0)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '20px',
                        }}>
                            {currentSlide.title}
                        </h1>
                        <div style={{
                            flex: 1, color: '#cbd5e1', fontSize: '16px', lineHeight: '1.8',
                            whiteSpace: 'pre-wrap', fontWeight: '400', letterSpacing: '0.5px',
                        }}>
                            {currentSlide.content}
                        </div>
                    </div>
                </main>

                {/* 右侧：AI 讲解稿面板 */}
                <aside style={{
                    width: '320px', background: 'rgba(255, 255, 255, 0.015)',
                    border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '20px',
                    backdropFilter: 'blur(30px)', display: 'flex', flexDirection: 'column',
                    padding: '20px', boxSizing: 'border-box', boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px' }}>
                        <span style={{ fontSize: '16px' }}>🧠</span>
                        <div style={{ fontSize: '13px', color: '#f8fafc', fontWeight: '700', letterSpacing: '0.5px' }}>
                            DEEPSEEK 智能讲解稿
                        </div>
                        {generating && (
                            <span style={{ fontSize: '11px', color: '#fbbf24', marginLeft: 'auto' }}>生成中…</span>
                        )}
                    </div>
                    <div style={{
                        flex: 1, overflowY: 'auto', color: '#94a3b8', fontSize: '14px',
                        lineHeight: '1.7', whiteSpace: 'pre-wrap', paddingRight: '4px',
                        textAlign: 'justify', fontWeight: '400', letterSpacing: '0.3px',
                    }}>
                        {currentNarration || currentSlide.notes || '大模型正在组织语言中...'}
                    </div>
                </aside>

            </div>

            {/* 底部：音频播放卡 + 翻页控制 */}
            <footer style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                background: 'rgba(10, 9, 18, 0.35)', backdropFilter: 'blur(25px)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 30px',
                position: 'relative', zIndex: 10, gap: '20px', flexWrap: 'wrap',
            }}>

                {/* 左侧：翻页控制 */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    background: 'rgba(255,255,255,0.03)', padding: '10px 28px', borderRadius: '100px',
                    border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}>
                    <button
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex((prev) => prev - 1)}
                        style={{
                            background: 'transparent', border: 'none', color: currentIndex === 0 ? '#475569' : '#fff',
                            fontSize: '14px', fontWeight: '600', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        ⏮ 上一页
                    </button>

                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                        {currentIndex + 1} / {slides.length}
                    </div>

                    <button
                        disabled={currentIndex === slides.length - 1}
                        onClick={() => setCurrentIndex((prev) => prev + 1)}
                        style={{
                            background: 'transparent', border: 'none', color: currentIndex === slides.length - 1 ? '#475569' : '#fff',
                            fontSize: '14px', fontWeight: '600', cursor: currentIndex === slides.length - 1 ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        下一页 ⏭
                    </button>
                </div>

                {/* 右侧：音频播放卡 */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: audioReady
                        ? 'rgba(139, 92, 246, 0.12)'
                        : 'rgba(255,255,255,0.03)',
                    padding: '10px 24px', borderRadius: '100px',
                    border: audioReady
                        ? '1px solid rgba(139, 92, 246, 0.25)'
                        : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: audioReady ? '0 0 20px rgba(139, 92, 246, 0.15)' : 'none',
                    transition: 'all 0.3s ease',
                    minWidth: '320px',
                }}>
                    <span style={{
                        fontSize: '20px',
                        filter: audioReady ? 'none' : 'grayscale(100%)',
                        opacity: audioReady ? 1 : 0.4,
                    }}>
                        🎵
                    </span>

                    {audioReady ? (
                        <audio
                            controls
                            autoPlay
                            src={api.getAudioUrl(taskId)}
                            style={{
                                height: '36px',
                                background: 'transparent',
                                filter: 'invert(0.9)',
                            }}
                        />
                    ) : narration ? (
                        <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: '600' }}>
                            语音合成中…
                        </span>
                    ) : (
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                            等待讲解稿生成
                        </span>
                    )}
                </div>
            </footer>

        </div>
    );
};
