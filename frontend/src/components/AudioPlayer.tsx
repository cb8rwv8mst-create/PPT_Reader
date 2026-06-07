import React from 'react';

export const AudioPlayer: React.FC<{ audioUrl: string | null }> = ({ audioUrl }) => {
  if (!audioUrl) return null;

  return (
    <div style={{ padding: '20px', borderTop: '1px solid #e0e0e0', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 -2px 10px rgba(0,0,0,0.03)' }}>
      <div style={{ marginBottom: '8px', fontSize: '13px', color: '#8c8c8c' }}>🎧 Edge TTS 语音流已就绪，点击下方播放按钮全自动讲解</div>
      <audio controls src={audioUrl} style={{ width: '60%', minWidth: '400px' }} autoPlay>
        您的浏览器暂不支持原生音频播放。
      </audio>
    </div>
  );
};