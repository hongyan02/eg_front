import { useState, useEffect, useCallback } from 'react';
import useUserName from '../../../utils/cookie/useUserName';

const useAbnormalData = (searchParams = {}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  
  // 获取当前用户工号
  const userName = useUserName();

  // 使用 useCallback 包装 fetchData 函数，确保它只在 searchParams 变化时重新创建
  const fetchData = useCallback(async () => {
    if (!userName) {
      setError('未获取到用户工号');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 构建符合API要求的请求体
      const requestBody = {
        data_time_start: searchParams.data_time_start || "",
        data_time_end: searchParams.data_time_end || "",
        dept_id: searchParams.dept_id || "",
        is_confirm: searchParams.is_confirm || "",
        is_submit: searchParams.is_submit || "",
        query_user_name: searchParams.username || "", // 修改为 query_user_name
        user_name: userName // 使用 cookie 中的用户工号
      };
      
      console.log('请求参数:', requestBody);
      
      // 调用实际的API
      const response = await fetch('http://10.22.161.62:8083/api/get-violations-leader', {
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
          department: item.dept_name || item.deptname || '未知部门',
          abnormalTime: item.exception_time,
          exitTime: item.datetime,
          exitAccessName: item.outdoor_name,
          entryTime: item.datetime,
          entryAccessId: item.door_code,
          abnormalRuleId: item.rule_id,
          departmentManager: item.leader,
          confirmed: item.is_confirm === "1",
          reason: item.reason || "",
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
  }, [searchParams, userName]);

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