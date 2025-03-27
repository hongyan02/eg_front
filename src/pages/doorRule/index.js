import React from 'react';
import { Layout, ConfigProvider } from 'antd';
import DoorRuleSearch from './components/DoorRuleSearch';
import DoorRuleTable from './components/DoorRuleTable';
import AddRuleModal from './components/AddRuleModal';
import AuditModal from './components/AuditModal';
import RuleDetailModal from './components/RuleDetailModal'; // 导入详情模态框
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
    detailModalVisible, // 添加详情模态框可见状态
    detailRecord, // 添加详情记录
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
    handleViewDetail, // 添加查看详情处理函数
    handleDetailModalCancel // 添加详情模态框关闭处理函数
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
            onViewDetail={handleViewDetail} // 添加查看详情处理函数
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
          
          {/* 添加规则详情模态框 */}
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