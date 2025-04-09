import { useState, useEffect } from 'react';

/**
 * 自定义 Hook，用于监听父页面通过 postMessage 传递的 cookie 信息
 * @param {Function} onCookieReceived - 接收到 cookie 后的回调函数
 * @returns {Object} 包含从父页面接收到的数据
 */
const useParentMessage = (onCookieReceived) => {
  const [parentData, setParentData] = useState(null);

  useEffect(() => {
    // 监听来自父页面的消息
    const handleMessage = (event) => {
      // 安全检查：确保消息来源可信
      // 如果需要限制特定域名，可以在这里添加 event.origin 的检查
      
      try {
        const data = event.data;
        
        // 检查是否包含 cookie 数据
        if (data && data.type === 'cookie') {
          setParentData(data);
          
          // 如果提供了回调函数，则调用它
          if (typeof onCookieReceived === 'function') {
            onCookieReceived(data);
          }
        }
      } catch (error) {
        console.error('解析父页面消息时出错:', error);
      }
    };

    // 添加消息事件监听器
    window.addEventListener('message', handleMessage);

    // 通知父页面已准备好接收消息
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'ready', from: 'iframe' }, '*');
    }

    // 组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onCookieReceived]);

  return parentData;
};

export default useParentMessage;