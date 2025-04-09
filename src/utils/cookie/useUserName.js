import { useState, useEffect } from 'react';
import { getUserName } from './cookieUtils';
import useParentMessage from './useParentMessage';

/**
 * 自定义 Hook，用于获取当前用户的工号
 * 优先从父页面传递的消息中获取，如果没有则从本地 cookie 获取
 * @returns {string} 当前用户的工号
 */
const useUserName = () => {
  const [userName, setUserName] = useState('');

  // 处理从父页面接收到的 cookie
  const handleCookieReceived = (data) => {
    if (data && data.userName) {
      setUserName(data.userName);
    }
  };

  // 使用自定义 hook 监听父页面消息
  useParentMessage(handleCookieReceived);

  useEffect(() => {
    // 如果还没有从父页面获取到用户名，则尝试从本地 cookie 获取
    if (!userName) {
      const name = getUserName();
      if (name) {
        setUserName(name);
      }
    }
  }, [userName]);

  return userName;
};

export default useUserName;