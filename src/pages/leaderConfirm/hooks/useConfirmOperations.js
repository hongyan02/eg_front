import { useState } from 'react';
import { message } from 'antd';
import useUserName from '../../../utils/cookie/useUserName';

/**
 * 处理异常确认和提交操作的自定义Hook
 * @param {Function} refresh 刷新数据的回调函数
 * @returns {Object} 包含确认和提交操作的状态和方法
 */
const useConfirmOperations = (refresh) => {
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const userName = useUserName();

  // 处理确认状态变更的函数
  const handleConfirmChange = async (record, value) => {
    try {
      // 构建API请求数据
      const requestData = {
        id: Number(record.id), // 确保 id 是字符串类型
        is_confirm: value === 'yes' ? '1' : '0',
        user_name: userName, 
      };
      
      console.log('更新确认状态:', requestData);
      
      // 调用实际的API
      const response = await fetch('http://10.22.161.62:8083/api/confirm-violation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();
      
      if (result.code === 200) {
        message.success('异常确认状态更新成功');
        refresh(); // 刷新数据
      } else {
        message.error(result.msg || '更新失败');
      }
    } catch (error) {
      console.error('确认状态更新失败:', error);
      message.error('确认状态更新失败: ' + (error.message || '未知错误'));
    }
  };

  // 添加提交异常记录的函数
  const handleSubmitViolation = async (record) => {
    try {
      // 构建API请求数据
      const requestData = {
        id: String(record.id), // 确保 id 是字符串类型
        is_submit: '1', // 设置为已提交
        user_name: record.employeeId // 使用当前数据的工号，而不是cookie值
      };
      
      console.log('提交异常记录:', requestData);
      
      // 调用实际的API
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

  // 打开确认模态框
  const handleConfirmClick = (record) => {
    setCurrentRecord(record);
    return {
      initialValues: {
        confirmed: record.confirmed ? 'yes' : 'no',
        submitted: record.submitted ? 'yes' : 'no',
        reason: record.reason || ''
      },
      onOpen: () => setConfirmModalVisible(true)
    };
  };

  // 关闭确认模态框
  const handleModalCancel = () => {
    setConfirmModalVisible(false);
    setCurrentRecord(null);
  };

  // 提交确认
  const handleConfirmSubmit = async (values, localReasons = {}) => {
    if (!currentRecord) return;
    
    try {
      setConfirmLoading(true);
      
      // 构建API请求数据
      const requestData = {
        id: String(currentRecord.id),
        user_name: currentRecord.employeeId,
        is_confirm: values.confirmed === 'yes' ? '1' : '0',
        is_submit: values.submitted === 'yes' ? '1' : '0',
        // 使用本地保存的原因或表单中的原因
        reason: (localReasons[currentRecord.id] || values.reason || ''),
        // 如果API需要时间字段，使用原始格式
        datetime: currentRecord.originalDatetime
      };
      
      console.log('提交确认数据:', requestData);
      
      // 调用实际的API
      const response = await fetch('http://10.22.161.62:8083/api/update-violation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();
      
      if (result.code === 200) {
        message.success('异常确认状态更新成功');
        setConfirmModalVisible(false);
        refresh(); // 刷新数据
      } else {
        message.error(result.msg || '更新失败');
      }
    } catch (error) {
      console.error('确认提交失败:', error);
      message.error('确认提交失败: ' + (error.message || '未知错误'));
    } finally {
      setConfirmLoading(false);
    }
  };

  return {
    confirmModalVisible,
    confirmLoading,
    currentRecord,
    handleConfirmChange,
    handleSubmitViolation,
    handleConfirmClick,
    handleModalCancel,
    handleConfirmSubmit
  };
};

export default useConfirmOperations;