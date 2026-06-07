import React from 'react';
import type { Slide } from '../types';

interface Props {
  slides: Slide[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const SlideList: React.FC<Props> = ({ slides, currentIndex, onSelect }) => {
  return (
    <div style={{ 
      width: '260px', height: '100%', overflowY: 'auto', 
      // 🌟 去掉 border，改为全透明，融入背景
      backgroundColor: 'rgba(0, 0, 0, 0.12)',
      backdropFilter: 'blur(5px)',
      padding: '10px 0'
    }}>
      <div style={{ 
        padding: '20px 20px 15px 20px', fontSize: '11px', fontWeight: '800', 
        color: 'rgba(255,255,255,0.35)', letterSpacing: '2px'
      }}>
        OUTLINE // 大纲视图
      </div>
      <div style={{ padding: '0 12px' }}>
        {slides.map((slide, i) => {
          const isActive = i === currentIndex;
          return (
            <div
              key={i}
              onClick={() => onSelect(i)}
              style={{
                padding: '15px 15px', cursor: 'pointer', borderRadius: '12px',
                // 选中项是微透的水晶白，未选中项完全透明
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.07)' : 'transparent',
                marginBottom: '6px',
                transition: 'all 0.2s ease',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '12px',
                border: isActive ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                boxShadow: isActive ? '0 8px 25px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              <span style={{ 
                fontSize: '12px', color: isActive ? '#06b6d4' : 'rgba(255,255,255,0.2)',
              }}>
                {isActive ? '●' : `0${i + 1}`}
              </span>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {slide.title || '未命名视图'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};