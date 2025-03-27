import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import usePagination from './usePagination';
import useSearch from './useSearch';
import useRuleOperation from './useRuleOperation';
import useAudit from './useAudit'; // 引入审核 hook
import useUserName from '../../../utils/cookie/useUserName'; // 引入工号 hook

const useDoorRule = () => {
  // 基础状态管理
  const [loading, setLoading] = useState(false);
  const [ruleData, setRuleData] = useState([]);
  const userName = useUserName(); // 使用自定义 Hook 获取工号
  
  // 模态框状态
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  
  // 详情模态框状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);

  // 将API返回的状态码映射为组件使用的状态
  const mapStatusCode = useCallback((statusCode) => {
    const statusMap = {
      '0': 'draft',      // 草稿
      '1': 'pending',    // 待审核
      '2': 'approved',   // 已审核
      '3': 'cancelled'   // 已作废
    };
    
    return statusMap[statusCode] || 'draft';
  }, []);

  // 获取所有规则数据
  const fetchRuleData = useCallback(async () => {
    // 如果没有获取到工号，则不进行请求
    if (!userName) {
      console.log('工号未获取到，暂不发送请求');
      return;
    }
    
    setLoading(true);
    try {
      // 在请求体中传入工号
      const response = await fetch('http://10.22.161.62:8083/api/rule/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_name: userName
        })
      });
      const result = await response.json();
      
      if (Array.isArray(result)) {
        // 处理API返回的数据格式，转换为组件需要的格式
        const processedData = result.map(item => ({
          ruleNumber: item.rule_id,
          creator: item.nick_name,
          reviewer: item.approver_name,
          description: item.remark,
          approvalDate: item.update_time ? new Date(item.update_time).toLocaleDateString() : '',
          status: mapStatusCode(item.status),
          // 保留原始数据，以便在编辑时使用
          rawData: item
        }));
        
        setRuleData(processedData);
      } else {
        console.error('获取规则数据格式不正确:', result);
        setRuleData([]);
      }
    } catch (error) {
      console.error('获取规则数据失败:', error);
      setRuleData([]);
    } finally {
      setLoading(false);
    }
  }, [mapStatusCode, userName]); // 添加 userName 作为依赖项

  // 处理模态框取消 - 移到这里，在handleOperationSuccess之前定义
  const handleModalCancel = useCallback(() => {
    if (editModalVisible) {
      setEditModalVisible(false);
      setEditRecord(null);
    } else {
      setAddModalVisible(false);
    }
  }, [editModalVisible]);
  
  // 添加处理查看详情的函数
  const handleViewDetail = useCallback((record) => {
    setDetailRecord(record);
    setDetailModalVisible(true);
  }, []);
  
  // 添加处理详情模态框关闭的函数
  const handleDetailModalCancel = useCallback(() => {
    setDetailModalVisible(false);
    setDetailRecord(null);
  }, []);

  // 成功回调
  const handleOperationSuccess = useCallback(() => {
    message.success('操作成功');
    handleModalCancel();
    fetchRuleData();
  }, [handleModalCancel, fetchRuleData]);

  // 失败回调
  const handleOperationError = useCallback((error) => {
    message.error('操作失败: ' + (error.message || '未知错误'));
  }, []);

  // 使用规则操作 hook
  const { createRule, updateRule, commitRule, withdrawRule } = useRuleOperation(
    handleOperationSuccess,
    handleOperationError
  );

  // 组件加载时获取数据
  useEffect(() => {
    fetchRuleData();
  }, [fetchRuleData]);
  
  // 使用搜索 hook
  const { filteredData, handleSearch, handleStatusChange } = useSearch(ruleData);
  
  // 使用分页 hook，使用过滤后的数据
  const {
    currentPage,
    pageSize,
    totalItems,
    paginatedData,
    handlePageChange,
    handlePageSizeChange
  } = usePagination(filteredData);
  
  // 使用审核 hook
  const {
    auditModalVisible,
    auditData,
    auditLoading,
    handleMyAudit,
    handleApprove,
    handleReject,
    handleAuditModalCancel
  } = useAudit(fetchRuleData); // 传递 fetchRuleData 作为成功回调

  // 处理撤回规则
  const handleRevoke = useCallback(async (record) => {
    console.log('撤回规则:', record);
    setLoading(true);
    
    try {
      // 调用撤回规则的 API
      await withdrawRule(record);
      // 撤回成功后刷新数据
      fetchRuleData();
    } catch (error) {
      console.error('撤回规则失败:', error);
      message.error('撤回规则失败: ' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  }, [withdrawRule, fetchRuleData]);
  
  // 处理编辑规则
  const handleEdit = useCallback((record) => {
    // 从原始数据中提取需要编辑的字段
    const doorArea = record.rawData.door_area;
    const doorName = record.rawData.door_name;
    
    // 处理门禁区域和门禁名称，如果是对象则提取值
    const processedDoorArea = typeof doorArea === 'object' && doorArea !== null 
      ? (doorArea.area || JSON.stringify(doorArea)) 
      : doorArea;
    
    const processedDoorName = typeof doorName === 'object' && doorName !== null 
      ? (doorName.name || JSON.stringify(doorName)) 
      : doorName;
    
    const editData = {
      ruleNumber: record.ruleNumber,
      description: record.description,
      doorArea: processedDoorArea,
      doorName: processedDoorName,
      startTime: record.rawData.start_time,
      endTime: record.rawData.end_time,
      isCrossDay: record.rawData.is_cross_day === 1,
      creator: record.creator,
      reviewer: record.reviewer,
      approverId: record.rawData.approver_id,
      rawData: record.rawData // 传递原始数据，以便在表单中获取职级信息
    };
    
    console.log('编辑数据:', editData);
    setEditRecord(editData);
    setEditModalVisible(true);
  }, []);
  
  // 处理添加规则
  const handleAdd = useCallback(() => {
    setAddModalVisible(true);
  }, []);
  
  // 处理模态框提交
  const handleModalSubmit = useCallback(async (values, action) => {
    setLoading(true);
    
    try {
      // 确保在编辑模式下传递完整的数据
      if (editModalVisible && editRecord && action === 'commit') {
        // 如果没有schedule字段，从editRecord中获取
        if (!values.schedule && editRecord.rawData && editRecord.rawData.work_schedule) {
          // 将work_schedule转换为schedule数组
          const scheduleInt = parseInt(editRecord.rawData.work_schedule);
          const scheduleBinary = scheduleInt.toString(2).padStart(8, '0');
          const schedule = [];
          if (scheduleBinary.charAt(7) === '1') schedule.push('mon');
          if (scheduleBinary.charAt(6) === '1') schedule.push('tue');
          if (scheduleBinary.charAt(5) === '1') schedule.push('wed');
          if (scheduleBinary.charAt(4) === '1') schedule.push('thu');
          if (scheduleBinary.charAt(3) === '1') schedule.push('fri');
          if (scheduleBinary.charAt(2) === '1') schedule.push('sat');
          if (scheduleBinary.charAt(1) === '1') schedule.push('sun');
          values.schedule = schedule;
        }
        
        // 如果没有assessmentLevel字段，从editRecord中获取
        if (!values.assessmentLevel && editRecord.rawData && editRecord.rawData.assessment_level) {
          values.assessmentLevel = editRecord.rawData.assessment_level.split(',');
        }
      }
      
      // 根据action决定是保存草稿还是提交审核
      if (action === 'submit') {
        // 提交审核
        if (editModalVisible) {
          // 编辑模式下提交
          await commitRule(values, true);
        } else {
          // 新增模式下提交
          await commitRule(values, false);
        }
      } else {
        // 保存草稿
        if (editModalVisible) {
          // 编辑模式
          await updateRule(values);
        } else {
          // 新增模式
          await createRule(values);
        }
      }
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败: ' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  }, [createRule, updateRule, commitRule, editModalVisible, editRecord]);

  // 处理提交规则
  const handleSubmitRule = useCallback(async (record) => {
    // 如果没有获取到工号，则不进行请求
    if (!userName) {
      message.error('未获取到工号信息，无法提交');
      return;
    }
    
    setLoading(true);
    
    try {
      // 从记录中获取必要的数据，并添加工号
      const values = {
        ruleNumber: record.ruleNumber,
        description: record.description,
        doorArea: record.rawData.door_area,
        doorName: record.rawData.door_name,
        creator: record.creator,
        reviewer: record.reviewer,
        approverId: record.rawData.approver_id, 
        isCrossDay: record.rawData.is_cross_day === 1,
        // 使用原始数据中的时间
        startTime: { format: () => record.rawData.start_time },
        endTime: { format: () => record.rawData.end_time },
        user_name: userName, // 添加工号
        // 添加排班和职级数据
        rawData: record.rawData // 传递原始数据，以便在commitRule中获取work_schedule和assessment_level
      };
      
      // 调用提交规则的 API
      await commitRule(values, true);
    } catch (error) {
      console.error('提交规则失败:', error);
      message.error('提交规则失败: ' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  }, [commitRule, userName]); // 添加 userName 作为依赖项
  
  return {
    loading,
    ruleData: paginatedData, 
    currentPage,
    pageSize,
    totalItems,
    addModalVisible,
    editModalVisible,
    isModalVisible: addModalVisible || editModalVisible,
    isEdit: !!editRecord,
    editRecord,
    auditModalVisible,
    auditData,
    auditLoading,
    detailModalVisible,
    detailRecord,
    userName, // 返回工号，以便在组件中使用
    handleMyAudit,
    handleApprove,
    handleReject,
    handleAuditModalCancel,
    handleSearch,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    handleRevoke,
    handleEdit,
    handleAdd,
    handleModalCancel,
    handleModalSubmit,
    handleSubmitRule,
    handleViewDetail,
    handleDetailModalCancel
  };
};

export default useDoorRule;