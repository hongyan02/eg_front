import { useState } from 'react';
import useUserName from '../../../utils/cookie/useUserName';

/**
 * 获取待审核申请的 hook
 * @returns {Object} 审核相关的状态和方法
 */
function useAuditRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auditData, setAuditData] = useState([]);
  
  // 获取当前用户工号
  const userName = useUserName();

  /**
   * 获取待审核申请列表
   * @returns {Promise<Object>} 获取结果
   */
  const fetchPendingList = async () => {
    if (!userName) {
      setError('用户工号不能为空');
      return { success: false, error: '用户工号不能为空' };
    }

    setLoading(true);
    setError(null);

    try {
      // 准备请求数据
      const requestData = {
        user_name: userName
      };

      console.log('获取待审核数据请求:', requestData);
      
      // 调用待审核列表接口
      const response = await fetch('http://10.22.161.62:8083/api/out-request/pending-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();
      
      if (result && result.code === 200) {
        console.log('获取待审核数据成功:', result);
        // 处理数据，添加key属性用于表格渲染
        const processedData = Array.isArray(result.data) ? result.data.map(item => ({
          ...item,
          key: item.request_code, // 添加唯一key
        })) : [];
        
        setAuditData(processedData);
        return { success: true, data: processedData };
      } else {
        console.error('获取待审核数据失败:', result);
        setError(result.message || '获取失败');
        setAuditData([]);
        return { success: false, error: result.message || '获取失败' };
      }
    } catch (error) {
      console.error('获取待审核数据出错:', error);
      setError(error.message || '获取出错');
      setAuditData([]);
      return { success: false, error: error.message || '获取出错' };
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchPendingList,
    auditData,
    loading,
    error,
    resetState: () => {
      setError(null);
      setAuditData([]);
    }
  };
}

export default useAuditRequest;