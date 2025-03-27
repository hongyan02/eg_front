import { useState } from 'react';
import useUserName from '../../../utils/cookie/useUserName';

/**
 * 编辑外出申请的 hook
 * @returns {Object} 编辑相关的状态和方法
 */
function useEditRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // 获取当前用户工号
  const userName = useUserName();

  /**
   * 编辑外出申请
   * @param {Object} requestData - 申请数据
   * @returns {Promise<Object>} 编辑结果
   */
  const editRequest = async (requestData) => {
    if (!userName || !requestData.request_code) {
      setError('用户工号或申请单号不能为空');
      return { success: false, error: '用户工号或申请单号不能为空' };
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 准备请求数据
      const editData = {
        approver_id: requestData.approver_id,
        create_time: requestData.create_time || new Date().toISOString(),
        door_area: requestData.door_area,
        end_time: requestData.end_time,
        reason: requestData.reason,
        request_code: requestData.request_code,
        start_time: requestData.start_time,
        status: requestData.status || "0",
        update_time: new Date().toISOString(),
        user_name: userName
      };

      console.log('编辑申请数据:', editData);
      
      // 调用编辑接口
      const response = await fetch('http://10.22.161.62:8083/api/out-request/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
      
      const result = await response.json();
      
      if (result && result.code === 200) {
        console.log('编辑外出申请成功:', result);
        setSuccess(true);
        return { success: true, data: result.data };
      } else {
        console.error('编辑外出申请失败:', result);
        setError(result.message || '编辑失败');
        return { success: false, error: result.message || '编辑失败' };
      }
    } catch (error) {
      console.error('编辑申请出错:', error);
      setError(error.message || '编辑出错');
      return { success: false, error: error.message || '编辑出错' };
    } finally {
      setLoading(false);
    }
  };

  return {
    editRequest,
    loading,
    error,
    success,
    resetState: () => {
      setError(null);
      setSuccess(false);
    }
  };
}

export default useEditRequest;