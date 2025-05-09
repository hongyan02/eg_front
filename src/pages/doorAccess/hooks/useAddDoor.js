import { useState } from 'react';
import { message } from 'antd';
import useUserName from '../../../utils/cookie/useUserName';

function useAddDoor(fetchDoorData) {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const userName = useUserName();

  // 打开新增模态框
  const handleAddDoor = () => {
    setAddModalVisible(true);
  };

  // 处理取消
  const handleAddCancel = () => {
    setAddModalVisible(false);
  };

  // 处理提交
  const handleAddSubmit = async (values) => {
    console.log('新增门禁提交:', values);
    setConfirmLoading(true);
    try {
      // 添加用户名到请求体
      const requestBody = {
        ...values,
        user_name: userName || ""
      };

      const response = await fetch('http://10.22.161.62:8083/api/entry-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (response.ok) {
        // 显示成功提示
        message.success('门禁添加成功');
        
        // 关闭模态框
        setAddModalVisible(false);
        
        // 刷新数据列表
        if (fetchDoorData) {
          fetchDoorData();
        }
        
        return { success: true, data: values };
      } else {
        // 显示错误提示
        const errorData = await response.json();
        message.error(`添加失败: ${errorData.message || '服务器错误'}`);
      }
    } catch (error) {
      console.error('添加门禁失败:', error);
      // 显示错误提示
      message.error(`添加门禁失败: ${error.message || '未知错误'}`);
    } finally {
      setConfirmLoading(false);
    }
  };

  return {
    addModalVisible,
    confirmLoading,
    handleAddDoor,
    handleAddCancel,
    handleAddSubmit
  };
}

export default useAddDoor;