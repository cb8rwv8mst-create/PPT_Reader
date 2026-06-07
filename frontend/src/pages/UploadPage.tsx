import React, { useState } from 'react';
import { api } from '../api';

interface Props {
    onUploadSuccess: (id: string, slides: unknown[]) => void;
}

export const UploadPage: React.FC<Props> = ({ onUploadSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.pptx')) {
            alert('请上传标准的 .pptx 格式文件！');
            return;
        }

        setLoading(true);
        try {
            const data = await api.upload(file);
            onUploadSuccess(data.id, data.slides);
        } catch (err) {
            alert('解析 PPT 失败: ' + (err instanceof Error ? err.message : '未知错误'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', width: '100vw',
            position: 'relative',
            backgroundImage: `
                linear-gradient(135deg, rgba(12, 9, 26, 0.4) 0%, rgba(12, 9, 26, 0.75) 100%),
                url('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1920&q=80')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '40px 20px', boxSizing: 'border-box',
            overflowX: 'hidden',
        }}>

            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '55px 50px',
                borderRadius: '28px',
                boxShadow: '0 40px 100px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(35px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'center', width: '100%', maxWidth: '580px', boxSizing: 'border-box',
                position: 'relative', zIndex: 1,
            }}>

                <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '64px', height: '64px', borderRadius: '18px',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px',
                    fontSize: '28px', filter: 'drop-shadow(0 4px 12px rgba(139, 92, 246, 0.3))',
                }}>
                    🔮
                </div>

                <h1 style={{
                    fontSize: '36px',
                    background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: '0 0 12px 0',
                    fontWeight: '900',
                    letterSpacing: '-0.5px',
                    lineHeight: '1.3',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                }}>
                    AI PPT 演示馆
                </h1>

                <p style={{ color: 'rgba(255, 255, 255, 0.65)', marginBottom: '40px', fontSize: '14px', fontWeight: '400', letterSpacing: '0.5px' }}>
                    让静态的幻灯片，蜕变为震撼的智能视听大片
                </p>

                <div
                    onDragOver={() => setIsDragOver(true)}
                    onDragLeave={() => setIsDragOver(false)}
                    style={{
                        border: isDragOver ? '1px dashed #a855f7' : '1px dashed rgba(255, 255, 255, 0.18)',
                        padding: '55px 20px', borderRadius: '18px',
                        backgroundColor: isDragOver ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.25)',
                        cursor: 'pointer', position: 'relative',
                        boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    <input
                        type="file"
                        accept=".pptx"
                        onChange={handleFileChange}
                        disabled={loading}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: loading ? 'not-allowed' : 'pointer' }}
                    />
                    <span style={{
                        fontSize: '32px', display: 'block', marginBottom: '16px',
                        filter: 'drop-shadow(0 0 10px rgba(6,182,212,0.4))',
                    }}>
                        {loading ? '🧠' : '✨'}
                    </span>
                    <p style={{ margin: '0', fontSize: '15px', color: '#f8fafc', fontWeight: '700', letterSpacing: '0.5px' }}>
                        {loading ? 'AI 正在深度重组文本结构...' : '将您的 .pptx 投放至此空间'}
                    </p>
                    <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', fontWeight: '500' }}>
                        POWERPOINT PRESENTATION
                    </p>
                </div>

                {loading && (
                    <div style={{
                        marginTop: '25px', color: '#c084fc', fontSize: '12px', fontWeight: '600',
                        letterSpacing: '1.5px',
                    }}>
                        ⚡ DEEPSEEK CORE WORKING...
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '45px', maxWidth: '850px', width: '100%', position: 'relative', zIndex: 1 }}>
                {[
                    { icon: '⚡', title: '全景解析', desc: '深度抽取结构化文本与潜藏备注' },
                    { icon: '🧠', title: '智能叙事', desc: 'DeepSeek 重塑大师级演说文本' },
                    { icon: '🎵', title: '多维声学', desc: '微软高保真自然语音全自动合成' },
                ].map((item, index) => (
                    <div key={index} style={{
                        flex: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.015)',
                        padding: '24px 20px',
                        borderRadius: '18px',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        backdropFilter: 'blur(15px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    }}>
                        <div style={{ fontSize: '20px', marginBottom: '12px' }}>{item.icon}</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9', marginBottom: '6px', letterSpacing: '0.5px' }}>{item.title}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)', lineHeight: '1.6', fontWeight: '400' }}>{item.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
