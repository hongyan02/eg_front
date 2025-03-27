import { useState, useMemo } from 'react';

const usePagination = (data = [], defaultPageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // 计算总条数
  const totalItems = data.length;

  // 计算当前页数据
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  // 处理页码变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 处理每页条数变化
  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    // 当每页条数变化时，重置为第一页
    setCurrentPage(1);
  };

  return {
    currentPage,
    pageSize,
    totalItems,
    paginatedData,
    handlePageChange,
    handlePageSizeChange
  };
};

export default usePagination;