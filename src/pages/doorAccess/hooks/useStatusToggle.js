import { useState } from 'react';
import { message } from 'antd';

function useStatusToggle(fetchDoorData) {
  const [statusLoading, setStatusLoading] = useState(false);

  // 处理状态切换
  const handleStatusToggle = async (record, checked) => {
    setStatusLoading(true);
    try {
      // 构建请求数据
      const requestData = {
        id: record.id,
        status: checked ? '0' : '1' // 切换状态：true -> 启用(0)，false -> 禁用(1)
      };
      
      console.log('切换门禁状态:', requestData);
      
      // 调用API更新状态
      const response = await fetch('http://10.22.161.62:8083/api/entry-list/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (response.ok) {
        // 显示成功提示
        message.success(`门禁已${checked ? '启用' : '禁用'}`);
        
        // 刷新数据列表
        if (fetchDoorData) {
          fetchDoorData();
        }
        
        return { success: true };
      } else {
        // 显示错误提示
        const errorData = await response.json();
        message.error(`状态更新失败: ${errorData.message || '服务器错误'}`);
        return { success: false };
      }
    } catch (error) {
      console.error('切换门禁状态失败:', error);
      // 显示错误提示
      message.error(`切换门禁状态失败: ${error.message || '未知错误'}`);
      return { success: false };
    } finally {
      setStatusLoading(false);
    }
  };

  return {
    statusLoading,
    handleStatusToggle
  };
}

export default useStatusToggle;