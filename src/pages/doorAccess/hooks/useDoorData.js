import { useState, useEffect } from 'react';

function useDoorData() {
  const [doorData, setDoorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 初始加载数据
  useEffect(() => {
    fetchDoorData();
  }, []);

  // 获取门禁数据的函数
  const fetchDoorData = async () => {
    setLoading(true);
    try {
      // 这里应该是实际的API调用
      const response = await fetch('http://10.22.161.62:8083/api/entry-list');
      const result = await response.json();
      
      // 从响应中提取数据数组并处理门禁类型
      if (result && Array.isArray(result.data)) {
        // 处理门禁类型：1 -> 园区门禁，0 -> 车间门禁
        // 处理进出类型：1 -> 进门，0 -> 出门
        // 处理状态：0 -> 启用，1 -> 禁用
        const processedData = result.data.map(item => ({
          ...item,
          key: item.door_code, // 添加唯一key，用于删除操作
          door_type: item.door_type === '0' ? '园区门禁' : '车间门禁',
          in_out_type: item.in_out_type || '', // 确保即使API没有返回该字段也不会报错
          status: item.status || '0', // 默认为启用状态
          statusText: item.status === '1' ? '禁用' : '启用'
        }));
        
        setDoorData(processedData);
      } else {
        console.error('获取门禁数据格式不正确:', result);
        setDoorData([]);
      }
    } catch (error) {
      console.error('获取门禁数据失败:', error);
      setDoorData([]);
    } finally {
      setLoading(false);
    }
  };

  // 处理分页变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 这里可以添加分页加载数据的逻辑
  };

  return {
    doorData,
    setDoorData,
    loading,
    setLoading,
    currentPage,
    fetchDoorData,
    handlePageChange
  };
}

export default useDoorData;