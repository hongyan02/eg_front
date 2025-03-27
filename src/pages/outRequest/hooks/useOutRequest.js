import { useState } from 'react';
import useOutRequestData from './useOutRequestData';
import useUserName from '../../../utils/cookie/useUserName';
import useSubmitRequest from './useSubmitRequest';
import useRevokeRequest from './useRevokeRequest';
import useEditRequest from './useEditRequest';
import useAuditRequest from './useAuditRequest';

function useOutRequest() {
  // 获取当前用户工号
  const userName = useUserName();
  
  // 使用数据加载 hook
  const {
    requestData,
    loading,
    setLoading,
    currentPage,
    pageSize,
    totalItems,
    fetchRequestData,
    handlePageChange,
    handlePageSizeChange,
    getCurrentPageData
  } = useOutRequestData();

  // 使用提交申请 hook
  const { 
    submitRequest, 
    loading: submitLoading, 
    error: submitError 
  } = useSubmitRequest();
  
  // 使用撤回申请 hook
  const {
    revokeRequest,
    loading: revokeLoading,
    error: revokeError
  } = useRevokeRequest();
  
  // 使用编辑申请 hook
  const {
    editRequest,
    loading: editLoading,
    error: editError
  } = useEditRequest();

  // 模态框状态
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  // 审核模态框状态
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [auditData, setAuditData] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  
  // 详情模态框状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);

  // 使用审核申请 hook
  const {
    fetchPendingList
  } = useAuditRequest();

  // 处理新建申请
  const handleAdd = () => {
    setEditRecord(null);
    setAddModalVisible(true);
  };

  // 处理编辑申请
  const handleEdit = (record) => {
    setEditRecord(record);
    setEditModalVisible(true);
  };

  // 处理模态框取消
  const handleModalCancel = () => {
    if (editModalVisible) {
      setEditModalVisible(false);
    } else {
      setAddModalVisible(false);
    }
    setEditRecord(null);
  };

  // 处理提交申请
  const handleSubmit = async (values) => {
    setConfirmLoading(true);
    try {
      // 如果是编辑模式
      if (editRecord) {
        // 准备编辑请求数据
        const editData = {
          approver_id: values.approverId,
          create_time: editRecord.create_time || new Date().toISOString(),
          door_area: values.doorArea,
          end_time: values.end_time,
          reason: values.reason,
          request_code: editRecord.request_code,
          start_time: values.start_time,
          status: editRecord.status || "0",
          update_time: new Date().toISOString(),
          user_name: userName
        };
        
        console.log('编辑申请数据:', editData);
        
        // 调用编辑接口
        const result = await editRequest(editData);
        
        if (result.success) {
          console.log('编辑外出申请成功:', result);
          // 关闭模态框
          handleModalCancel();
          // 重新获取数据
          fetchRequestData();
        } else {
          console.error('编辑外出申请失败:', result.error);
          // 这里可以添加错误提示
        }
      } else {
        // 新建申请
        // 准备请求数据
        const submitData = {
          approver_id: values.approverId,
          create_time: new Date().toISOString(),
          door_area: values.doorArea,
          end_time: values.end_time,
          reason: values.reason,
          start_time: values.start_time,
          status: "0", // 默认为草稿状态
          user_name: userName // 从 cookie 中获取
        };

        console.log('提交申请数据:', submitData);
        
        // 调用创建外出申请接口
        const response = await fetch('http://10.22.161.62:8083/api/out-request/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
        
        const result = await response.json();
        
        if (result && result.code === 200) {
          console.log('创建外出申请成功:', result);
          // 关闭模态框
          handleModalCancel();
          // 重新获取数据
          fetchRequestData();
        } else {
          console.error('创建外出申请失败:', result);
          // 这里可以添加错误提示
        }
      }
    } catch (error) {
      console.error('提交申请失败:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  // 处理撤回申请
  const handleRevoke = async (record) => {
    try {
      // 调用撤回接口
      const result = await revokeRequest(record.request_code);
      
      if (result.success) {
        // 撤回成功，重新获取数据
        fetchRequestData();
      } else {
        // 撤回失败，可以在这里处理错误
        console.error('撤回申请失败:', result.error);
      }
    } catch (error) {
      console.error('撤回申请失败:', error);
    }
  };

  // 处理提交审核
  const handleSubmitRequest = async (record) => {
    setLoading(true);
    try {
      // 调用提交接口
      const result = await submitRequest(record.request_code);
      
      if (result.success) {
        // 提交成功，重新获取数据
        fetchRequestData();
      } else {
        // 提交失败，可以在这里处理错误
        console.error('提交审核失败:', result.error);
      }
    } catch (error) {
      console.error('提交审核失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理我的审核
  const handleMyAudit = async () => {
    setAuditLoading(true);
    try {
      // 调用获取待审核数据接口
      const result = await fetchPendingList();
      
      if (result.success && Array.isArray(result.data)) {
        // 设置审核数据，确保每条记录有唯一的key
        const processedData = result.data.map(item => ({
          ...item,
          key: item.request_code // 添加唯一key
        }));
        setAuditData(processedData);
        // 显示审核模态框
        setAuditModalVisible(true);
      } else {
        console.error('获取待审核数据失败或数据格式不正确:', result);
        // 设置为空数组，避免显示旧数据
        setAuditData([]);
        setAuditModalVisible(true);
      }
    } catch (error) {
      console.error('获取待审核数据失败:', error);
      setAuditData([]);
    } finally {
      setAuditLoading(false);
    }
  };

  // 处理审核通过
  const handleApprove = async (record) => {
    setAuditLoading(true);
    try {
      // 准备请求数据
      const approveData = {
        request_code: record.request_code,
        status: "2", // 通过状态为2
        user_name: userName
      };

      console.log('审核通过数据:', approveData);
      
      // 调用审批接口
      const response = await fetch('http://10.22.161.62:8083/api/out-request/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(approveData),
      });
      
      const result = await response.json();
      
      if (result && result.code === 200) {
        console.log('审核通过成功:', result);
        // 关闭审核模态框
        setAuditModalVisible(false);
        // 重新获取数据
        fetchRequestData();
      } else {
        console.error('审核通过失败:', result);
        // 这里可以添加错误提示
      }
    } catch (error) {
      console.error('审核通过失败:', error);
    } finally {
      setAuditLoading(false);
    }
  };

  // 处理审核驳回
  const handleReject = async (record) => {
    setAuditLoading(true);
    try {
      // 准备请求数据
      const rejectData = {
        request_code: record.request_code,
        status: "0", // 驳回状态为0
        user_name: userName
      };

      console.log('审核驳回数据:', rejectData);
      
      // 调用审批接口
      const response = await fetch('http://10.22.161.62:8083/api/out-request/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rejectData),
      });
      
      const result = await response.json();
      
      if (result && result.code === 200) {
        console.log('审核驳回成功:', result);
        // 关闭审核模态框
        setAuditModalVisible(false);
        // 重新获取数据
        fetchRequestData();
      } else {
        console.error('审核驳回失败:', result);
        // 这里可以添加错误提示
      }
    } catch (error) {
      console.error('审核驳回失败:', error);
    } finally {
      setAuditLoading(false);
    }
  };

  // 处理查看详情
  const handleViewDetail = (record) => {
    setDetailRecord(record);
    setDetailModalVisible(true);
  };

  // 处理详情模态框取消
  const handleDetailModalCancel = () => {
    setDetailModalVisible(false);
    setDetailRecord(null);
  };

  // 处理审核模态框取消
  const handleAuditModalCancel = () => {
    setAuditModalVisible(false);
  };

  return {
    requestData: getCurrentPageData(),
    allRequestData: requestData,
    loading: loading || submitLoading || revokeLoading || editLoading,
    currentPage,
    pageSize,
    totalItems,
    addModalVisible,
    editModalVisible,
    editRecord,
    confirmLoading,
    auditModalVisible,
    auditData,
    auditLoading,
    detailModalVisible,
    detailRecord,
    submitError,
    revokeError,
    editError,
    handleAdd,
    handleEdit,
    handleModalCancel,
    handleSubmit,
    handleRevoke,
    handleSubmitRequest,
    handleMyAudit,
    handleApprove,
    handleReject,
    handleViewDetail,
    handleDetailModalCancel,
    handleAuditModalCancel,
    handlePageChange,
    handlePageSizeChange
  };
}

export default useOutRequest;