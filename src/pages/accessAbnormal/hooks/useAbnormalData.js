import { useState, useEffect, useCallback } from 'react';

const useAbnormalData = (searchParams = {}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // 使用 useCallback 包装 fetchData 函数，确保它只在 searchParams 变化时重新创建
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 构建符合API要求的请求体
      const requestBody = {
        data_time_start: searchParams.data_time_start || "",
        data_time_end: searchParams.data_time_end || "",
        dept_id: searchParams.dept_id || "",  // 这里应该已经是最后一级部门ID
        is_confirm: searchParams.is_confirm || "",
        is_submit: searchParams.is_submit || "",
        username: searchParams.username || ""
      };
      
      console.log('请求参数:', requestBody); // 添加日志查看请求参数
      
      const response = await fetch('http://10.22.161.62:8083/api/get-violations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const result = await response.json();
      
      if (result.code === 200) {
        // 转换数据格式以匹配表格组件的需求
        const formattedData = result.data.map(item => ({
          id: item.id,
          employeeId: item.username,
          name: item.nickname,
          department: item.dept_name || item.deptname || '未知部门', // 修改这里，使用dept_name而不是dept_id
          abnormalTime: item.exception_time,
          exitTime: item.datetime,
          exitAccessName: item.outdoor_name,
          entryTime: item.datetime, // 假设入场时间与异常时间相同
          entryAccessId: item.door_code,
          abnormalRuleId: item.rule_id,
          departmentManager: item.leader,
          confirmed: item.is_confirm === "1",
          reason: "", // API 中没有提供原因说明
          submitted: item.is_submit === "1",
          abnormalDate: new Date(item.datetime).toLocaleDateString(),
          doorArea: item.door_area,
          doorType: item.door_type,
          leaderId: item.leader_id
        }));
        
        setData(formattedData);
        setTotal(formattedData.length);
      } else {
        setError(result.msg || '获取数据失败');
      }
    } catch (err) {
      setError(err.message || '网络请求失败');
    } finally {
      setLoading(false);
    }
  }, [searchParams]); // 将 searchParams 作为依赖项

  // 使用 fetchData 作为依赖项
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    total,
    refresh: fetchData,
  };
};

export default useAbnormalData;