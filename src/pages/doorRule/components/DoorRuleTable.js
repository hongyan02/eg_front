import React from 'react';
import { Table, Button, Space, Pagination, Tag } from 'antd';
import { UndoOutlined, EditOutlined, PlusOutlined, SendOutlined, AuditOutlined } from '@ant-design/icons';

const DoorRuleTable = ({ 
  ruleData, 
  loading, 
  currentPage, 
  pageSize,
  totalItems,
  onPageChange, 
  onPageSizeChange,
  onRevoke,
  onEdit,
  onAdd,
  onSubmit,
  onMyAudit,
  onViewDetail // 添加查看详情处理函数
}) => {
  // 状态标签渲染
  const renderStatus = (status) => {
    const statusMap = {
      draft: { color: 'gold', text: '草稿' },
      pending: { color: 'blue', text: '待审核' },
      approved: { color: 'green', text: '已审核' },
      cancelled: { color: 'gray', text: '已作废' }
    };
    
    const { color, text } = statusMap[status] || { color: 'default', text: '未知状态' };
    
    return <Tag color={color}>{text}</Tag>;
  };

  // 表格列定义
  const columns = [
    {
      title: '规则单号',
      dataIndex: 'ruleNumber',
      key: 'ruleNumber',
      width: 150,
      render: (text, record) => (
        <Button 
          type="link" 
          onClick={() => onViewDetail(record)}
          style={{ padding: 0 }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: '编制人',
      dataIndex: 'creator',
      key: 'creator',
      width: 120,
    },
    {
      title: '审核人',
      dataIndex: 'reviewer',
      key: 'reviewer',
      width: 120,
    },
    {
      title: '规则说明',
      dataIndex: 'description',
      key: 'description',
      width: 250,
    },
    {
      title: '审批日期',
      dataIndex: 'approvalDate',
      key: 'approvalDate',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: renderStatus,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<SendOutlined />}
            onClick={() => onSubmit && onSubmit(record)}
            disabled={record.status !== 'draft'}
            className="text-purple-500 p-0"
          >
            提交
          </Button>
          <Button 
            type="link" 
            icon={<UndoOutlined />}
            onClick={() => onRevoke(record)}
            disabled={!['pending', 'approved'].includes(record.status)}
            className="text-blue-500 p-0"
          >
            撤回
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            disabled={!['draft', 'cancelled'].includes(record.status)}
            className="text-green-500 p-0"
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between mb-4">
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onAdd}
          className="bg-blue-500"
        >
          新建规则
        </Button>
        
        <Button
          type="primary"
          icon={<AuditOutlined />}
          onClick={onMyAudit}
          className="bg-green-500"
        >
          我的审核
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={ruleData}
        rowKey="ruleNumber"
        loading={loading}
        pagination={false}
        className="mb-4"
      />
      
      <div className="flex justify-end">
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={onPageChange}
          onShowSizeChange={onPageSizeChange}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条`}
        />
      </div>
    </div>
  );
};

export default DoorRuleTable;