import { message } from 'antd';

/**
 * 处理异常记录的提交操作
 * @param {Function} refresh 刷新数据的回调函数
 * @param {Object} localReasons 本地保存的原因数据
 * @returns {Object} 包含提交操作的方法
 */
const useViolationActions = (refresh, localReasons = {}) => {
  // 提交异常记录
  const submitViolation = async (record) => {
    try {
      // 检查是否有原因说明
      const reason = localReasons[record.id] || record.reason || '';
      if (!reason.trim()) {
        message.error('请先填写原因说明再提交');
        return;
      }
      
      // 构建API请求数据
      const requestData = {
        id: String(record.id), // 确保 id 是字符串类型
        is_submit: '1', // 设置为已提交
        user_name: record.employeeId, // 使用当前数据的工号，而不是cookie值
        // 使用本地保存的原因或原始原因
        reason: reason
      };
      
      console.log('提交异常记录:', requestData);
      
      // 调用API
      const response = await fetch('http://10.22.161.62:8083/api/submit-violation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();
      
      if (result.code === 200) {
        message.success('异常记录提交成功');
        refresh(); // 刷新数据
      } else {
        message.error(result.msg || '提交失败');
      }
    } catch (error) {
      console.error('异常记录提交失败:', error);
      message.error('异常记录提交失败: ' + (error.message || '未知错误'));
    }
  };

  return {
    submitViolation
  };
};

export default useViolationActions;