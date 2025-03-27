import { useState, useCallback } from 'react';
import { message } from 'antd';

const useAudit = (onAuditSuccess) => {
  // 审核模态框状态
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [auditData, setAuditData] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // 从接口获取审核数据
  const fetchAuditData = useCallback(async () => {
    setAuditLoading(true);
    try {
      const response = await fetch('http://10.22.161.62:8083/api/rule/pending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name: "128578" }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('原始审核数据:', result);
      
      // 处理数据，确保与表格列定义匹配
      // 注意：result 直接是数组，不需要访问 data 属性
      const processedData = (result || []).map(item => {
        // 创建一个新对象，包含表格需要的所有字段
        const processedItem = {
          ruleNumber: item.rule_id,
          creator: item.nick_name,
          description: item.remark,
          startTime: item.start_time,
          endTime: item.end_time,
        };
        
        // 处理 door_area，可能是对象或字符串
        if (typeof item.door_area === 'object' && item.door_area !== null) {
          processedItem.door_area = item.door_area;
        } else {
          processedItem.door_area = { area: item.door_area || '' };
        }
        
        // 处理 door_name，可能是对象或字符串
        if (typeof item.door_name === 'object' && item.door_name !== null) {
          processedItem.door_name = item.door_name;
        } else {
          processedItem.door_name = { name: item.door_name || '' };
        }
        
        console.log('处理后的单条数据:', processedItem);
        return processedItem;
      });
      
      console.log('处理后的审核数据:', processedData);
      setAuditData(processedData);
      setAuditLoading(false);
    } catch (error) {
      console.error('获取审核数据失败:', error);
      message.error('获取审核数据失败: ' + (error.message || '未知错误'));
      setAuditLoading(false);
    }
  }, []);

  // 处理我的审核
  const handleMyAudit = useCallback(() => {
    console.log('查看我的审核');
    setAuditModalVisible(true);
    fetchAuditData();
  }, [fetchAuditData]);

  // 处理审核同意
  const handleApprove = useCallback(async (record) => {
    console.log('同意规则:', record);
    setAuditLoading(true);
    
    try {
      const response = await fetch('http://10.22.161.62:8083/api/rule/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          rule_id: record.ruleNumber,
          user_name: "128578",
          status: "2" // 同意状态为2
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // 修改这里的判断逻辑，处理成功消息
      if (result.code === 200 || result.message === "规则审批成功") {
        message.success('审核通过成功');
        // 重新获取审核数据
        fetchAuditData();
        // 调用父组件的刷新函数
        if (onAuditSuccess) {
          onAuditSuccess();
        }
      } else {
        throw new Error(result.message || '操作失败');
      }
    } catch (error) {
      console.error('审核通过失败:', error);
      // 如果错误消息包含"成功"，则视为成功
      if (error.message && error.message.includes("成功")) {
        message.success('审核通过成功');
        fetchAuditData();
        // 调用父组件的刷新函数
        if (onAuditSuccess) {
          onAuditSuccess();
        }
      } else {
        message.error('审核通过失败: ' + (error.message || '未知错误'));
      }
      setAuditLoading(false);
    }
  }, [fetchAuditData, onAuditSuccess]);

  // 处理审核驳回 - 同样修改
  const handleReject = useCallback(async (record) => {
    console.log('驳回规则:', record);
    setAuditLoading(true);
    
    try {
      const response = await fetch('http://10.22.161.62:8083/api/rule/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          rule_id: record.ruleNumber,
          user_name: "128578",
          status: "0" // 驳回状态为0
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // 修改这里的判断逻辑，处理成功消息
      if (result.code === 200 || result.message === "规则审批成功") {
        message.success('审核驳回成功');
        // 重新获取审核数据
        fetchAuditData();
        // 调用父组件的刷新函数
        if (onAuditSuccess) {
          onAuditSuccess();
        }
      } else {
        throw new Error(result.message || '操作失败');
      }
    } catch (error) {
      console.error('审核驳回失败:', error);
      // 如果错误消息包含"成功"，则视为成功
      if (error.message && error.message.includes("成功")) {
        message.success('审核驳回成功');
        fetchAuditData();
        // 调用父组件的刷新函数
        if (onAuditSuccess) {
          onAuditSuccess();
        }
      } else {
        message.error('审核驳回失败: ' + (error.message || '未知错误'));
      }
      setAuditLoading(false);
    }
  }, [fetchAuditData, onAuditSuccess]);

  // 处理审核模态框取消
  const handleAuditModalCancel = useCallback(() => {
    setAuditModalVisible(false);
  }, []);

  return {
    auditModalVisible,
    auditData,
    auditLoading,
    handleMyAudit,
    handleApprove,
    handleReject,
    handleAuditModalCancel
  };
};

export default useAudit;