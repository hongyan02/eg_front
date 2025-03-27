import { useState, useEffect, useCallback } from 'react';
import useUserName from '../../../utils/cookie/useUserName';

function useOutRequestData() {
  const [requestData, setRequestData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // 获取当前用户工号
  const userName = useUserName();

  // 获取外出申请数据的函数
  const fetchRequestData = useCallback(async () => {
    if (!userName) {
      console.error('未获取到用户工号，无法请求数据');
      return;
    }

    setLoading(true);
    try {
      // 调用API获取数据
      const response = await fetch('http://10.22.161.62:8083/api/out-request/dept-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name: userName }),
      });
      
      const result = await response.json();
      
      // 检查响应状态码
      if (result && result.code === 200) {
        // 从响应中提取数据数组，如果data为null则使用空数组
        const dataArray = result.data || [];
        
        // 确保dataArray是数组
        if (Array.isArray(dataArray)) {
          // 处理数据，添加key属性用于表格渲染
          const processedData = dataArray.map(item => ({
            ...item,
            key: item.request_code, // 添加唯一key
          }));
          
          setRequestData(processedData);
          setTotalItems(processedData.length);
        } else {
          console.error('获取外出申请数据格式不正确，data不是数组:', result);
          setRequestData([]);
          setTotalItems(0);
        }
      } else {
        console.error('获取外出申请数据失败，状态码不为200:', result);
        setRequestData([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('获取外出申请数据失败:', error);
      setRequestData([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [userName]);

  // 初始加载数据
  useEffect(() => {
    if (userName) {
      fetchRequestData();
    }
  }, [userName, fetchRequestData]);

  // 处理分页变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 处理每页条数变化
  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(1); // 重置到第一页
  };

  // 获取当前页数据
  const getCurrentPageData = useCallback(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return requestData.slice(startIndex, endIndex);
  }, [requestData, currentPage, pageSize]);

  return {
    requestData,
    setRequestData,
    loading,
    setLoading,
    currentPage,
    pageSize,
    totalItems,
    fetchRequestData,
    handlePageChange,
    handlePageSizeChange,
    getCurrentPageData
  };
}

export default useOutRequestData;