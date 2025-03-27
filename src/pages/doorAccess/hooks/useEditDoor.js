import { useState } from 'react';
import { message } from 'antd';

function useEditDoor(fetchDoorData) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 处理编辑
  const handleEdit = (record) => {
    setCurrentRecord(record);
    setEditModalVisible(true);
  };

  // 处理取消
  const handleEditCancel = () => {
    setEditModalVisible(false);
    setCurrentRecord(null);
  };

  // 处理提交
  const handleEditSubmit = async (values) => {
    console.log('编辑门禁提交:', values);
    setConfirmLoading(true);
    try {
      // 这里应该是实际的API调用
      const response = await fetch(`http://10.22.161.62:8083/api/entry-list`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (response.ok) {
        // 显示成功提示
        message.success('门禁信息更新成功');
        
        // 关闭模态框
        setEditModalVisible(false);
        setCurrentRecord(null);
        
        // 刷新数据列表
        if (fetchDoorData) {
          fetchDoorData();
        }
        
        // 返回成功结果
        return { success: true, data: values };
      } else {
        // 显示错误提示
        const errorData = await response.json();
        message.error(`更新失败: ${errorData.message || '服务器错误'}`);
      }
    } catch (error) {
      console.error('编辑门禁失败:', error);
      // 显示错误提示
      message.error(`编辑门禁失败: ${error.message || '未知错误'}`);
    } finally {
      setConfirmLoading(false);
    }
  };

  return {
    editModalVisible,
    currentRecord,
    confirmLoading,
    handleEdit,
    handleEditCancel,
    handleEditSubmit
  };
}

export default useEditDoor;