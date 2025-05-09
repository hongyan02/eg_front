import { useState } from 'react';
import { message } from 'antd';
import useUserName from '../../../utils/cookie/useUserName';

function useDeleteDoor(doorData, setDoorData, fetchDoorData) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const userName = useUserName();
  // 处理删除
  const handleDelete = async (key) => {
    setDeleteLoading(true);
    try {
      // 找到要删除的记录
      const record = doorData.find(item => item.key === key || item.door_code === key);
      if (!record) {
        message.error('未找到要删除的门禁记录');
        setDeleteLoading(false);
        return;
      }
      
      console.log('删除门禁:', record);
      
      // 调用API删除数据
      const response = await fetch(`http://10.22.161.62:8083/api/entry-list/${record.door_code}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          door_code: record.door_code,
          user_name: userName || ""
        })
      });
      
      if (response.ok) {
        // 先更新本地数据状态，提供即时反馈
        setDoorData(doorData.filter(item => item.door_code !== record.door_code));
        message.success('门禁删除成功');
        
        // 然后重新获取最新数据，确保与服务器同步
        // 使用 setTimeout 避免可能的竞态条件
        setTimeout(() => {
          if (fetchDoorData) {
            fetchDoorData().catch(err => {
              console.error('刷新数据失败:', err);
            });
          }
        }, 300);
      } else {
        const errorText = await response.text();
        console.error('删除失败响应:', errorText);
        message.error('删除门禁失败');
      }
    } catch (error) {
      console.error('删除门禁失败:', error);
      message.error(`删除门禁失败: ${error.message || '未知错误'}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    deleteLoading,
    handleDelete
  };
}

export default useDeleteDoor;