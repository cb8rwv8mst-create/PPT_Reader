import React from 'react';

interface Props {
  slideScript: string;
  isLoading: boolean;
}

export const NarrationPanel: React.FC<Props> = ({ slideScript, isLoading }) => {
  return (
    <div style={{ 
      width: '380px', padding: '30px 25px', height: '100%', overflowY: 'auto', 
      // 🌟 去掉 border，改为全透明，融入背景
      backgroundColor: 'rgba(0, 0, 0, 0.12)',
      backdropFilter: 'blur(5px)',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '10px', 
        borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '18px', marginBottom: '25px' 
      }}>
        <span style={{ fontSize: '18px', filter: 'drop-shadow(0 0 6px #a855f7)' }}>🔮</span>
        <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: '15px', fontWeight: '800' }}>DeepSeek 智能演说稿</h3>
      </div>
      
      {isLoading ? (
        <div style={{ 
          color: '#c084fc', padding: '30px 20px', textAlign: 'center', 
          fontWeight: '600', fontSize: '13px', backgroundColor: 'rgba(168, 85, 247, 0.05)', 
          borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.1)',
          letterSpacing: '0.5px'
        }}>
          🔮 正在注入 AI 认知网络，正在为您通读全局上下文并重塑拟人化讲稿，请稍候...
        </div>
      ) : (
        <div style={{ 
          whiteSpace: 'pre-wrap', lineHeight: '2.1', fontSize: '14px', color: 'rgba(255,255,255,0.7)', 
          background: 'rgba(255, 255, 255, 0.02)', padding: '22px', borderRadius: '16px', 
          border: '1px solid rgba(255, 255, 255, 0.03)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          {slideScript || '💡 构想就绪。点击顶部魔法按钮，AI 将全面接管本页大纲。'}
        </div>
      )}
    </div>
  );
};