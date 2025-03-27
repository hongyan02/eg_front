import React from 'react';
import { Table, Button, Space, Pagination, Tag } from 'antd';
import { UndoOutlined, EditOutlined, PlusOutlined, SendOutlined, AuditOutlined } from '@ant-design/icons';

const OutRequestTable = ({ 
  requestData, 
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
  onViewDetail
}) => {
  // 状态标签渲染
  const renderStatus = (status) => {
    const statusMap = {
      '0': { color: 'gold', text: '草稿' },
      '1': { color: 'blue', text: '待审核' },
      '2': { color: 'green', text: '已审核' },
      '3': { color: 'gray', text: '已作废' }
    };
    
    const { color, text } = statusMap[status] || { color: 'default', text: '未知状态' };
    
    return <Tag color={color}>{text}</Tag>;
  };

  // 表格列定义
  const columns = [
    {
      title: '申请单号',
      dataIndex: 'request_code',
      key: 'request_code',
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
      title: '门禁区域',
      dataIndex: 'door_area',
      key: 'door_area',
      width: 120,
    },
    {
      title: '申请人',
      dataIndex: 'nick_name',
      key: 'nick_name',
      width: 100,
    },
    {
      title: '审核人',
      dataIndex: 'approver_name',
      key: 'approver_name',
      width: 100,
    },
    {
      title: '外出原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 200,
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
      width: 180,
      render: (text) => {
        if (!text) return '-';
        return new Date(text).toLocaleString('zh-CN');
      }
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
      width: 180,
      render: (text) => {
        if (!text) return '-';
        return new Date(text).toLocaleString('zh-CN');
      }
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
            disabled={record.status !== '0'}
            className="text-purple-500 p-0"
          >
            提交
          </Button>
          <Button 
            type="link" 
            icon={<UndoOutlined />}
            onClick={() => onRevoke(record)}
            disabled={!['1', '2'].includes(record.status)}
            className="text-blue-500 p-0"
          >
            撤回
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            disabled={!['0', '3'].includes(record.status)}
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
          新建申请
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
        dataSource={requestData}
        rowKey="request_code"
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

export default OutRequestTable;