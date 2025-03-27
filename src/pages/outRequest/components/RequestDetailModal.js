import React from 'react';
import { Modal, Descriptions, Tag, Divider } from 'antd';

const RequestDetailModal = ({ visible, onCancel, record }) => {
  // 如果没有记录，不渲染内容
  if (!record) return null;

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

  // 格式化时间
  const formatTime = (timeStr) => {
    if (!timeStr) return '-';
    return new Date(timeStr).toLocaleString('zh-CN');
  };

  return (
    <Modal
      title="外出申请详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      maskClosable={false}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="申请单号" span={2}>{record.request_code || '-'}</Descriptions.Item>
        <Descriptions.Item label="状态">{renderStatus(record.status)}</Descriptions.Item>
        <Descriptions.Item label="门禁区域">{record.door_area || '-'}</Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions bordered column={2}>
        <Descriptions.Item label="开始时间">{formatTime(record.start_time)}</Descriptions.Item>
        <Descriptions.Item label="结束时间">{formatTime(record.end_time)}</Descriptions.Item>
        <Descriptions.Item label="外出原因" span={2}>{record.reason || '-'}</Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions bordered column={2}>
        <Descriptions.Item label="申请人">{record.nick_name || '-'}</Descriptions.Item>
        <Descriptions.Item label="工号">{record.user_name || '-'}</Descriptions.Item>
        <Descriptions.Item label="审核人">{record.approver_name || '-'}</Descriptions.Item>
        <Descriptions.Item label="审核人工号">{record.approver_id || '-'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default RequestDetailModal;