import React, { useState } from 'react';
import { PresentPage } from './pages/PresentPage';
import { UploadPage } from './pages/UploadPage';

const App: React.FC = () => {
  // 💡 恢复上传口：将初始状态改回 null，刚进入时就会显示上传 PPT 的界面
  const [taskId, setTaskId] = useState<string | null>(null);

  return (
    <>
      {/* 🌟 核心改进：注入全局强行样式重置，彻底消灭左侧黑色空白和滚动条 */}
      <style>{`
        body {
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          background-color: #0b0816 !important; /* 统一暗夜底色 */
          width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
        }
        #root {
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
          text-align: left !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>

      {/* 主页面视口容器 */}
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        {taskId ? (
          <PresentPage taskId={taskId} />
        ) : (
          <UploadPage onUploadSuccess={(id) => setTaskId(id)} />
        )}
      </div>
    </>
  );
};

export default App;