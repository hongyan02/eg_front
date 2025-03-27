import { useState, useCallback, useEffect } from 'react';

const useSearch = (data = []) => {
  const [searchParams, setSearchParams] = useState({});
  const [filteredData, setFilteredData] = useState(data);

  // 根据搜索条件过滤数据
  const filterData = useCallback(() => {
    if (!Object.keys(searchParams).length) {
      setFilteredData(data);
      return;
    }
    
    const filtered = data.filter(item => {
      // 规则单号搜索
      if (searchParams.ruleNumber && !item.ruleNumber.includes(searchParams.ruleNumber)) {
        return false;
      }
      
      // 编制人搜索
      if (searchParams.creator && !item.creator.includes(searchParams.creator)) {
        return false;
      }
      
      // 状态筛选
      if (searchParams.status && item.status !== searchParams.status) {
        return false;
      }
      
      // 日期范围筛选
      if (searchParams.dateRange && searchParams.dateRange.length === 2) {
        const approvalDate = new Date(item.approvalDate);
        const startDate = new Date(searchParams.dateRange[0]);
        const endDate = new Date(searchParams.dateRange[1]);
        
        if (approvalDate < startDate || approvalDate > endDate) {
          return false;
        }
      }
      
      return true;
    });
    
    setFilteredData(filtered);
  }, [data, searchParams]);
  
  // 当搜索条件或数据变化时，重新过滤数据
  useEffect(() => {
    filterData();
  }, [filterData, data]);
  
  // 处理搜索
  const handleSearch = useCallback((values) => {
    console.log('搜索条件:', values);
    setSearchParams(values);
  }, []);
  
  // 处理状态变化
  const handleStatusChange = useCallback((status) => {
    console.log('状态筛选:', status);
    setSearchParams(prev => ({
      ...prev,
      status
    }));
  }, []);

  return {
    filteredData,
    searchParams,
    handleSearch,
    handleStatusChange
  };
};

export default useSearch;