import { useState, useEffect, useCallback } from 'react';
import { formatDateTime, formatDate } from '../../../utils/dateUtils';
import useUserName from '../../../utils/cookie/useUserName';

const useAbnormalData = (searchParams = {}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const userName = useUserName();
  // 使用 useCallback 包装 fetchData 函数，确保它只在 searchParams 变化时重新创建
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 构建符合API要求的请求体
      const requestBody = {
        data_time_start: searchParams.data_time_start || "",
        data_time_end: searchParams.data_time_end || "",
        dept_id: searchParams.dept_id !== undefined ? Number(searchParams.dept_id) : 0,  // 默认值改为 0
        is_confirm: searchParams.is_confirm || "",
        is_submit: searchParams.is_submit || "",
        query_user_name: searchParams.username || "",
        user_name: userName || "", // 确保即使 userName 为 null 也传入空字符串
      };
      
      console.log('发送请求参数:', requestBody); 
      console.log('部门ID类型:', typeof requestBody.dept_id);
      console.log('用户名:', userName); // 添加日志检查 userName
      
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
          department: item.dept_name || item.deptname || '未知部门',
          // 使用 formatDateTime 格式化异常时间
          abnormalTime: item.exception_time+'分钟',
          // 修改为使用 out_door_time 作为出场时间
          exitTime: formatDateTime(item.out_door_time) || formatDateTime(item.datetime),
          exitAccessName: item.outdoor_name,
          // 修改为使用 in_door_time 作为入场时间
          entryTime: formatDateTime(item.in_door_time) || formatDateTime(item.datetime),
          entryAccessId: item.indoor_name,
          abnormalRuleId: item.rule_id,
          departmentManager: item.leader_id,
          confirmed: item.is_confirm === "1",
          reason: item.reason || "",
          submitted: item.is_submit === "1",
          abnormalDate: formatDate(item.datetime),
          doorArea: item.door_area,
          doorType: item.door_type,
          leaderId: item.leader_id,
          // 保存原始时间格式用于API提交
          originalDatetime: item.datetime,
          // 保存原始异常时间格式用于API提交
          originalExceptionTime: item.exception_time,
          // 保存原始入场和出场时间
          originalInDoorTime: item.in_door_time,
          originalOutDoorTime: item.out_door_time
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