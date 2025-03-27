import React, { useState } from 'react';
import { Layout, ConfigProvider } from 'antd';
import OutRequestSearch from './components/OutRequestSearch';
import OutRequestTable from './components/OutRequestTable';
import AddRequestModal from './components/AddRequestModal';
import AuditModal from './components/AuditModal';
import RequestDetailModal from './components/RequestDetailModal';
import useOutRequest from './hooks/useOutRequest';

const { Content } = Layout;

const OutRequestManagement = () => {
  const {
    requestData,
    allRequestData,
    loading,
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
  } = useOutRequest();

  // 添加搜索状态
  const [filteredData, setFilteredData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // 实现搜索功能
  const handleSearch = (values) => {
    if (!values || Object.keys(values).length === 0) {
      setHasSearched(false);
      setFilteredData([]);
      return;
    }

    setHasSearched(true);
    
    // 过滤数据
    const filtered = allRequestData.filter(item => {
      // 申请单号搜索
      if (values.requestCode && !item.request_code.includes(values.requestCode)) {
        return false;
      }
      
      // 状态筛选
      if (values.status && item.status !== values.status) {
        return false;
      }
      
      return true;
    });
    
    setFilteredData(filtered);
  };

  // 处理状态变化
  const handleStatusChange = (status) => {
    if (!status) {
      if (form.current) {
        form.current.resetFields(['status']);
        handleSearch(form.current.getFieldsValue());
      }
      return;
    }
    
    if (form.current) {
      handleSearch({
        ...form.current.getFieldsValue(),
        status
      });
    }
  };

  // 获取表单实例
  const form = React.useRef(null);
  const getForm = (formInstance) => {
    form.current = formInstance;
  };

  // 确定显示的数据
  const displayData = hasSearched ? filteredData : requestData;

  return (
    <ConfigProvider>
      <Layout className="min-h-screen">
        <Content className="p-6">
          <OutRequestSearch 
            onSearch={handleSearch}
            onStatusChange={handleStatusChange}
            getForm={getForm}
          />
          
          <OutRequestTable 
            requestData={displayData}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={hasSearched ? filteredData.length : totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRevoke={handleRevoke}
            onEdit={handleEdit}
            onAdd={handleAdd}
            onSubmit={handleSubmitRequest}
            onMyAudit={handleMyAudit}
            onViewDetail={handleViewDetail}
          />
          
          <AddRequestModal 
            visible={addModalVisible || editModalVisible}
            onCancel={handleModalCancel}
            onSubmit={handleSubmit}
            confirmLoading={confirmLoading}
            editRecord={editRecord}
            isEdit={!!editRecord}
          />
          
          <AuditModal
            visible={auditModalVisible}
            onCancel={handleAuditModalCancel}
            onApprove={handleApprove}
            onReject={handleReject}
            auditData={auditData}
            loading={auditLoading}
          />
          
          <RequestDetailModal
            visible={detailModalVisible}
            onCancel={handleDetailModalCancel}
            record={detailRecord}
          />
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default OutRequestManagement;