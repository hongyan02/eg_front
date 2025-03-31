import React from 'react';
import { Layout, ConfigProvider } from 'antd';
import DoorRuleSearch from './components/DoorRuleSearch';
import DoorRuleTable from './components/DoorRuleTable';
import AddRuleModal from './components/AddRuleModal';
import AuditModal from './components/AuditModal';
import RuleDetailModal from './components/RuleDetailModal';
import useDoorRule from './hooks/useDoorRule';

const { Content } = Layout;

const DoorRuleManagement = () => {
  const {
    loading,
    ruleData,
    currentPage,
    pageSize,
    totalItems,
    isModalVisible,
    isEdit,
    editRecord,
    auditModalVisible,
    auditData,
    auditLoading,
    detailModalVisible,
    detailRecord,
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
    handleMyAudit,
    handleApprove,
    handleReject,
    handleAuditModalCancel,
    handleViewDetail,
    handleDetailModalCancel,
    handleDiscard  // 添加废弃处理函数
  } = useDoorRule();

  return (
    <ConfigProvider>
      <Layout className="min-h-screen">
        <Content className="p-6">
          <DoorRuleSearch 
            onSearch={handleSearch}
            onStatusChange={handleStatusChange}
          />
          
          <DoorRuleTable 
            ruleData={ruleData}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRevoke={handleRevoke}
            onEdit={handleEdit}
            onAdd={handleAdd}
            onSubmit={handleSubmitRule}
            onMyAudit={handleMyAudit}
            onViewDetail={handleViewDetail}
            onDiscard={handleDiscard}  // 传递废弃处理函数
          />
          
          <AddRuleModal 
            visible={isModalVisible}
            onCancel={handleModalCancel}
            onSubmit={handleModalSubmit}
            confirmLoading={loading}
            editRecord={editRecord}
            isEdit={isEdit}
          />
          
          <AuditModal
            visible={auditModalVisible}
            onCancel={handleAuditModalCancel}
            onApprove={handleApprove}
            onReject={handleReject}
            auditData={auditData}
            loading={auditLoading}
          />
          
          <RuleDetailModal
            visible={detailModalVisible}
            onCancel={handleDetailModalCancel}
            record={detailRecord}
          />
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default DoorRuleManagement;