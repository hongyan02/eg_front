import { useCallback } from 'react';
import useUserName from '../../../utils/cookie/useUserName'; // 引入工号 Hook

const useRuleOperation = (onSuccess, onError) => {
  // 获取当前用户工号
  const userName = useUserName();
  
  // 计算时间差的方法
  const calculateTimeDiff = useCallback((startTime, endTime, isCrossDay) => {
    if (!startTime || !endTime) return '';
    
    // 将时间字符串转换为分钟数
    const getMinutes = (timeStr) => {
      const [hours, minutes, seconds] = timeStr.split(':').map(Number);
      return hours * 60 + minutes + seconds / 60;
    };
    
    let startMinutes = getMinutes(startTime);
    let endMinutes = getMinutes(endTime);
    
    // 处理跨天情况
    if (isCrossDay && endMinutes < startMinutes) {
      endMinutes += 24 * 60; // 加上一天的分钟数
    }
    
    // 计算差值（分钟）
    const diffMinutes = endMinutes - startMinutes;
    
    // 转换回 hh:mm:ss 格式
    const hours = Math.floor(diffMinutes / 60);
    const minutes = Math.floor(diffMinutes % 60);
    const seconds = Math.round((diffMinutes % 1) * 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []); // 添加闭合的括号和空依赖数组

  // 处理排班数据的通用函数
  const processScheduleData = useCallback((schedule) => {
    // 创建一个8位的二进制字符串
    let scheduleBinary = '';
    scheduleBinary += '0'; // 最高位为0
    scheduleBinary += schedule.includes('sun') ? '1' : '0'; // 周日
    scheduleBinary += schedule.includes('sat') ? '1' : '0'; // 周六
    scheduleBinary += schedule.includes('fri') ? '1' : '0'; // 周五
    scheduleBinary += schedule.includes('thu') ? '1' : '0'; // 周四
    scheduleBinary += schedule.includes('wed') ? '1' : '0'; // 周三
    scheduleBinary += schedule.includes('tue') ? '1' : '0'; // 周二
    scheduleBinary += schedule.includes('mon') ? '1' : '0'; // 周一
    
    // 将二进制字符串转换为整数
    const scheduleInt = parseInt(scheduleBinary, 2);
    
    return scheduleInt;
  }, []); // 同样使用 useCallback 包装，添加空依赖数组

  // 处理规则保存或提交
  const handleRule = useCallback(async (values, isEdit) => {
    try {
      // 处理时间格式，将moment对象转换为字符串
      const startTime = values.startTime ? values.startTime.format('HH:mm:ss') : '';
      const endTime = values.endTime ? values.endTime.format('HH:mm:ss') : '';
      
      // 计算时间差
      const timeDiff = calculateTimeDiff(startTime, endTime, values.isCrossDay);
      
      // 设置状态为草稿
      const status = '0'; // 0-草稿
      
      // 处理职级数据，将数组转换为逗号分隔的字符串
      const assessmentLevel = values.assessmentLevel ? values.assessmentLevel.join(',') : '';
      
      // 处理排班数据，使用通用函数
      const scheduleInt = processScheduleData(values.schedule || []);
      
      // 处理例外时间段
      const exceptionTimes = values.exceptionTimes ? values.exceptionTimes.map(item => ({
        start: item.startTime ? item.startTime.format('YYYY-MM-DD HH:mm:ss') : '',
        end: item.endTime ? item.endTime.format('YYYY-MM-DD HH:mm:ss') : '',
        explain: item.description || '' // 将 description 映射到 explain 字段
      })) : [];
      
      // 构建请求数据
      const requestData = {
        remark: values.description,
        door_area: values.doorArea,
        door_name: values.doorName,
        start_time: startTime,
        end_time: endTime,
        status: status,
        user_name: userName, // 使用 Hook 获取的工号
        nick_name: userName, // 使用 Hook 获取的工号
        approver_name: values.reviewer || '',
        // approver_id: userName,
        is_cross_day: values.isCrossDay ? 1 : 0,
        time_diff: timeDiff,
        assessment_level: assessmentLevel, // 添加职级字段
        work_schedule: scheduleInt, // 使用整数类型
        exception_time: exceptionTimes, // 添加例外时间字段
        time:values.time || 30,
      };
      
      // 如果是编辑模式，添加rule_id字段
      if (isEdit && values.ruleNumber) {
        requestData.rule_id = values.ruleNumber;
      }
      
      // 根据isEdit决定使用哪个API
      const apiUrl = isEdit 
        ? 'http://10.22.161.62:8083/api/rule/reEdit' 
        : 'http://10.22.161.62:8083/api/rule/add';
      
      // 发送请求
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();
      
      // 判断请求是否成功
      if (result && (result.message?.includes('成功') || (result.data && result.data.rule_id))) {
        // 请求成功
        if (onSuccess) onSuccess(result);
        return { success: true, data: result };
      } else {
        // 请求失败
        if (onError) onError(result);
        return { success: false, error: result };
      }
    } catch (error) {
      if (onError) onError(error);
      return { success: false, error };
    }
  }, [onSuccess, onError, userName, calculateTimeDiff, processScheduleData]); // 添加缺失的依赖项

  // 为了保持向后兼容，保留原来的函数名称
  const createRule = useCallback((values) => {
    return handleRule(values, false);
  }, [handleRule]);
  
  const updateRule = useCallback((values) => {
    return handleRule(values, true);
  }, [handleRule]);

  // 提交规则审核
  const commitRule = useCallback(async (values, isEdit) => {
    try {
      // 处理时间格式，将moment对象转换为字符串
      const startTime = values.startTime ? values.startTime.format('HH:mm:ss') : '';
      const endTime = values.endTime ? values.endTime.format('HH:mm:ss') : '';
      
      // 计算时间差
      const timeDiff = calculateTimeDiff(startTime, endTime, values.isCrossDay);
      
      // 设置状态为待审核
      const status = '1'; // 1-待审核
      
      // 处理职级数据，将数组转换为逗号分隔的字符串
      // 如果values中没有assessmentLevel，则从rawData中获取
      let assessmentLevel = '';
      if (values.assessmentLevel) {
        assessmentLevel = values.assessmentLevel.join(',');
      } else if (values.rawData && values.rawData.assessment_level) {
        assessmentLevel = values.rawData.assessment_level;
      } else {
        assessmentLevel = '4'; // 默认值
      }
      
      // 处理排班数据
      let scheduleInt = 0;
      if (values.schedule) {
        // 如果values中有schedule，使用通用函数处理
        scheduleInt = processScheduleData(values.schedule);
      } else if (values.rawData && values.rawData.work_schedule) {
        // 如果values中没有schedule，但rawData中有work_schedule，直接使用
        scheduleInt = parseInt(values.rawData.work_schedule);
      } else {
        // 默认值：周一到周五 (31)
        scheduleInt = 31;
      }
      
      // 处理例外时间段
      const exceptionTimes = values.exceptionTimes ? values.exceptionTimes.map(item => ({
        start: item.startTime ? item.startTime.format('YYYY-MM-DD HH:mm:ss') : '',
        end: item.endTime ? item.endTime.format('YYYY-MM-DD HH:mm:ss') : '',
        explain: item.description || '' // 将 description 映射到 explain 字段
      })) : [];
      
      // 构建请求数据
      const requestData = {
        remark: values.description,
        door_area: values.doorArea,
        door_name: values.doorName, // 使用 Hook 获取的工号
        start_time: startTime,
        end_time: endTime,
        status: status,
        user_name: userName, // 使用 Hook 获取的工号
        nick_name: userName, // 使用 Hook 获取的工号
        approver_name: values.reviewer,
        approver_id: values.approverId, 
        is_cross_day: values.isCrossDay ? 1 : 0,
        time_diff: timeDiff,
        assessment_level: assessmentLevel,
        work_schedule: scheduleInt,
        exception_time: exceptionTimes, // 使用正确的字段名 exception_time
        time: values.time || 30, // 添加稽查时间标准字段
      };
      
      // 如果是编辑模式，添加rule_id字段
      if (isEdit && values.ruleNumber) {
        requestData.rule_id = values.ruleNumber;
      }
      
      // 发送请求
      const response = await fetch('http://10.22.161.62:8083/api/rule/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();
      
      // 判断请求是否成功
      if (result && (result.message?.includes('成功') || (result.data && result.data.rule_id))) {
        // 请求成功
        if (onSuccess) onSuccess(result);
        return { success: true, data: result };
      } else {
        // 请求失败
        if (onError) onError(result);
        return { success: false, error: result };
      }
    } catch (error) {
      if (onError) onError(error);
      return { success: false, error };
    }
  }, [calculateTimeDiff, onSuccess, onError, userName, processScheduleData]); // 添加 userName 作为依赖项

  // 撤回规则
  const withdrawRule = useCallback(async (record) => {
    try {
      const response = await fetch('http://10.22.161.62:8083/api/rule/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rule_id: record.ruleNumber,
          status: "0", // 撤回后状态为草稿
          user_name: userName // 使用 Hook 获取的工号
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      
      if (result.code === 200 || result.message?.includes('成功')) {
        onSuccess();
        return { success: true };
      } else {
        throw new Error(result.message || '撤回规则失败');
      }
    } catch (error) {
      console.error('撤回规则失败:', error);
      onError(error);
      return { success: false, error };
    }
  }, [onSuccess, onError, userName]); // 添加 userName 作为依赖项

  // 废弃规则
  const discardRule = useCallback(async (ruleId) => {
    try {
      console.log('废弃规则:', ruleId, '用户:', userName);
      
      // 构建请求数据
      const requestData = {
        rule_id: ruleId,
        user_name: userName
      };
      
      // 发送请求
      const response = await fetch('http://10.22.161.62:8083/api/rule/discard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();
      console.log('废弃规则响应:', result);
      
      // 判断请求是否成功
      if (response.ok) {
        // 请求成功
        if (onSuccess) onSuccess(result);
        return { success: true, data: result };
      } else {
        // 请求失败
        const errorMsg = result.message || '废弃规则失败';
        if (onError) onError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('废弃规则异常:', error);
      if (onError) onError(error.message || '废弃规则异常');
      return { success: false, error };
    }
  }, [onSuccess, onError, userName]);

  return {
    createRule,
    updateRule,
    commitRule,
    withdrawRule,
    discardRule  // 确保这里返回了 discardRule
  };
};

export default useRuleOperation;