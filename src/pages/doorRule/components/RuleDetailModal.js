import React from 'react';
import { Modal, Descriptions, Tag, Divider } from 'antd';

const RuleDetailModal = ({ visible, onCancel, record }) => {
  // 如果没有记录，不渲染内容
  if (!record) return null;

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

  // 处理门禁区域和门禁名称的显示
  const getDoorArea = () => {
    const doorArea = record.rawData?.door_area;
    if (typeof doorArea === 'object' && doorArea !== null) {
      return doorArea.area || JSON.stringify(doorArea);
    }
    return doorArea || '-';
  };

  const getDoorName = () => {
    const doorName = record.rawData?.door_name;
    if (typeof doorName === 'object' && doorName !== null) {
      return doorName.name || JSON.stringify(doorName);
    }
    return doorName || '-';
  };

  // 处理职级信息的显示
  const getAssessmentLevel = () => {
    if (!record.rawData?.assessment_level) return '-';
    
    const levelMap = {
      '10': '职员',
      '9': '主管',
      '8': '经理',
      '5': '高级经理'
    };
    
    return record.rawData.assessment_level.split(',')
      .map(level => levelMap[level] || level)
      .join(', ');
  };

  // 处理排班信息的显示
  const getSchedule = () => {
    if (!record.rawData?.work_schedule) return '-';
    
    const scheduleInt = parseInt(record.rawData.work_schedule);
    const scheduleBinary = scheduleInt.toString(2).padStart(8, '0');
    
    const dayMap = {
      7: '周一',
      6: '周二',
      5: '周三',
      4: '周四',
      3: '周五',
      2: '周六',
      1: '周日'
    };
    
    const days = [];
    for (let i = 1; i <= 7; i++) {
      if (scheduleBinary.charAt(8-i) === '1') {
        days.push(dayMap[i]);
      }
    }
    
    return days.length > 0 ? days.join(', ') : '-';
  };

  return (
    <Modal
      title="门禁规则详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      maskClosable={false}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="规则单号" span={2}>{record.ruleNumber || '-'}</Descriptions.Item>
        <Descriptions.Item label="状态">{renderStatus(record.status)}</Descriptions.Item>
        <Descriptions.Item label="审批日期">{record.approvalDate || '-'}</Descriptions.Item>
        <Descriptions.Item label="门禁区域">{getDoorArea()}</Descriptions.Item>
        <Descriptions.Item label="门禁名称">{getDoorName()}</Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions bordered column={2}>
        <Descriptions.Item label="开始时间">{record.rawData?.start_time || '-'}</Descriptions.Item>
        <Descriptions.Item label="结束时间">{record.rawData?.end_time || '-'}</Descriptions.Item>
        <Descriptions.Item label="是否跨天">{record.rawData?.is_cross_day === 1 ? '是' : '否'}</Descriptions.Item>
        <Descriptions.Item label="时间差">{record.rawData?.time_diff || '-'}</Descriptions.Item>
        <Descriptions.Item label="适用职级">{getAssessmentLevel()}</Descriptions.Item>
        <Descriptions.Item label="适用排班">{getSchedule()}</Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions bordered column={2}>
        <Descriptions.Item label="规则说明" span={2}>{record.description || '-'}</Descriptions.Item>
        <Descriptions.Item label="编制人">{record.creator || '-'}</Descriptions.Item>
        <Descriptions.Item label="审核人">{record.reviewer || '-'}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{record.rawData?.create_time || '-'}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{record.rawData?.update_time || '-'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default RuleDetailModal;