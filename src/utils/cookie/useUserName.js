import { useState, useEffect } from 'react';
import { getUserName } from './cookieUtils';

/**
 * 自定义 Hook，用于获取当前用户的工号
 * @returns {string} 当前用户的工号
 */
const useUserName = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = getUserName();
    if (name) {
      setUserName(name);
    }
  }, []);

  return userName;
};

export default useUserName;