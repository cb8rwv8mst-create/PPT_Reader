import React from 'react';
import type { Slide } from '../types';

export const SlideContent: React.FC<{ slide: Slide | undefined }> = ({ slide }) => {
  if (!slide) return <div style={{ flex: 1, padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>无数据</div>;

  return (
    <div style={{ 
      flex: 1, padding: '40px 50px', overflowY: 'auto', 
      // 🌟 核心：外层容器彻底透明，把底层的全景大图露出来
      backgroundColor: 'transparent', 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      {/* 16:9 纸张仿真大屏（带有霓虹质感的柔和外发光） */}
      <div style={{ 
        width: '100%', maxWidth: '820px', aspectRatio: '16/9', 
        backgroundColor: '#ffffff', borderRadius: '24px',
        // 🌟 极度华丽、大范围的柔和炫光阴影，消除生硬的边界
        boxShadow: '0 30px 80px rgba(168, 85, 247, 0.18), 0 15px 40px rgba(6, 182, 212, 0.12)',
        padding: '50px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
        position: 'relative', marginBottom: '30px'
      }}>
        {/* 右上角水印页码 */}
        <div style={{ position: 'absolute', top: '30px', right: '35px', fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '2px', fontFamily: 'monospace' }}>
          SLIDE_WORKSPACE // 0{slide.index + 1}
        </div>

        {/* 幻灯片标题 */}
        <h1 style={{ 
          margin: '0 0 25px 0', fontSize: '28px', color: '#0f172a', 
          fontWeight: '900', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px',
          letterSpacing: '-0.5px'
        }}>
          {slide.title || '（Untitled Section）'}
        </h1>
        
        {/* 幻灯片正文 */}
        <div style={{ 
          whiteSpace: 'pre-wrap', fontSize: '16.5px', lineHeight: '1.9', 
          color: '#334155', flex: 1, overflowY: 'auto' 
        }}>
          {slide.content || '暂无文本信息'}
        </div>
      </div>
      
      {/* 底部悬浮晶体备注栏 */}
      <div style={{ 
        width: '100%', maxWidth: '820px', 
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        padding: '20px 25px', borderRadius: '16px', 
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '15px' }}>💡</span>
          <strong style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13.5px', fontWeight: '700' }}>原始讲者备注 (Notes)：</strong>
        </div>
        <p style={{ whiteSpace: 'pre-wrap', margin: '0', color: 'rgba(255,255,255,0.45)', fontSize: '13.5px', lineHeight: '1.6' }}>
          {slide.notes || '本页大纲未附带额外备注。'}
        </p>
      </div>
    </div>
  );
};