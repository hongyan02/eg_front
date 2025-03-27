import React from 'react';
import { Modal, Table, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const AuditModal = ({ visible, onCancel, onApprove, onReject, auditData, loading }) => {
  // 表格列定义
  const columns = [
    {
      title: '规则单号',
      dataIndex: 'ruleNumber',
      key: 'ruleNumber',
      width: 130,
      ellipsis: true,
      render: (text) => <span>{text || '-'}</span>,
    },
    {
      title: '编制人',
      dataIndex: 'creator',
      key: 'creator',
      width: 80,
      ellipsis: true,
      render: (text) => <span>{text || '-'}</span>,
    },
    {
      title: '门禁区域',
      dataIndex: ['door_area', 'area'],
      key: 'door_area',
      width: 100,
      ellipsis: true,
      render: (text) => <span>{text || '-'}</span>,
    },
    {
      title: '门禁名称',
      dataIndex: ['door_name', 'name'],
      key: 'door_name',
      width: 100,
      ellipsis: true,
      render: (text) => <span>{text || '-'}</span>,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 90,
      ellipsis: true,
      render: (text) => <span>{text || '-'}</span>,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 90,
      ellipsis: true,
      render: (text) => <span>{text || '-'}</span>,
    },
    {
      title: '规则说明',
      dataIndex: 'description',
      key: 'description',
      width: 180,
      ellipsis: true,
      render: (text) => <span>{text || '-'}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <button 
            type="button"
            className="text-blue-500 flex items-center border-0 bg-transparent cursor-pointer p-0"
            onClick={() => onApprove(record)}
          >
            <CheckCircleOutlined className="mr-1" /> 通过
          </button>
          <button 
            type="button"
            className="text-red-500 flex items-center border-0 bg-transparent cursor-pointer p-0"
            onClick={() => onReject(record)}
          >
            <CloseCircleOutlined className="mr-1" /> 驳回
          </button>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="我的审核"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1100}
      maskClosable={false}
      destroyOnClose
    >
      <Table
        columns={columns}
        dataSource={auditData}
        rowKey="ruleNumber"
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1050 }}
      />
    </Modal>
  );
};

export default AuditModal;