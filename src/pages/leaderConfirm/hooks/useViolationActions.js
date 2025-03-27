import { message } from 'antd';

/**
 * 处理异常记录的提交和撤回操作
 * @param {Function} refresh 刷新数据的回调函数
 * @returns {Object} 包含提交和撤回操作的方法
 */
const useViolationActions = (refresh) => {
  // 提交异常记录
  const submitViolation = async (record) => {
    try {
      // 构建API请求数据
      const requestData = {
        id: String(record.id), // 确保 id 是字符串类型
        is_submit: '1', // 设置为已提交
        user_name: record.employeeId // 使用当前数据的工号，而不是cookie值
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

  // 撤回异常记录
  const withdrawViolation = async (record) => {
    try {
      // 构建API请求数据
      const requestData = {
        id: String(record.id), // 确保 id 是字符串类型
        is_submit: '0', // 设置为未提交
        user_name: record.employeeId // 使用当前数据的工号，而不是cookie值
      };
      
      console.log('撤回异常记录:', requestData);
      
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
        message.success('异常记录撤回成功');
        refresh(); // 刷新数据
      } else {
        message.error(result.msg || '撤回失败');
      }
    } catch (error) {
      console.error('异常记录撤回失败:', error);
      message.error('异常记录撤回失败: ' + (error.message || '未知错误'));
    }
  };

  return {
    submitViolation,
    withdrawViolation
  };
};

export default useViolationActions;