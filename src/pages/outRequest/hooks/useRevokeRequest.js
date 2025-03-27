import { useState } from 'react';
import useUserName from '../../../utils/cookie/useUserName';

/**
 * 撤回外出申请的 hook
 * @returns {Object} 撤回相关的状态和方法
 */
function useRevokeRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // 获取当前用户工号
  const userName = useUserName();

  /**
   * 撤回外出申请
   * @param {string} requestCode - 申请单号
   * @returns {Promise<Object>} 撤回结果
   */
  const revokeRequest = async (requestCode) => {
    if (!userName || !requestCode) {
      setError('用户工号或申请单号不能为空');
      return { success: false, error: '用户工号或申请单号不能为空' };
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 准备请求数据
      const revokeData = {
        request_code: requestCode,
        user_name: userName
      };

      console.log('撤回申请数据:', revokeData);
      
      // 调用撤回接口
      const response = await fetch('http://10.22.161.62:8083/api/out-request/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(revokeData),
      });
      
      const result = await response.json();
      
      if (result && result.code === 200) {
        console.log('撤回外出申请成功:', result);
        setSuccess(true);
        return { success: true, data: result.data };
      } else {
        console.error('撤回外出申请失败:', result);
        setError(result.message || '撤回失败');
        return { success: false, error: result.message || '撤回失败' };
      }
    } catch (error) {
      console.error('撤回申请出错:', error);
      setError(error.message || '撤回出错');
      return { success: false, error: error.message || '撤回出错' };
    } finally {
      setLoading(false);
    }
  };

  return {
    revokeRequest,
    loading,
    error,
    success,
    resetState: () => {
      setError(null);
      setSuccess(false);
    }
  };
}

export default useRevokeRequest;