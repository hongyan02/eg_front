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
    if (Array.isArray(doorName)) {
      return doorName.join('、');
    }
    if (typeof doorName === 'object' && doorName !== null) {
      return doorName.name || JSON.stringify(doorName);
    }
    return doorName || '-';
  };

  // 处理职级信息的显示
  const getAssessmentLevel = () => {
    if (!record.rawData?.assessment_level) return '-';
    
    const levelMap = {
      '4': '职员',
      '14': '主管',
      '12': '经理',
      '9': '高级经理',
      '0': '员工',
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
    
    // 二进制位从左到右: 0(最高位), 周日, 周一, 周二, 周三, 周四, 周五, 周六
    const dayMap = {
      '1': '周日',
      '2': '周一',
      '3': '周二',
      '4': '周三',
      '5': '周四',
      '6': '周五',
      '7': '周六'
    };
    
    const days = [];
    // 从第1位(索引为1)开始，对应周日，到第7位(索引为7)，对应周六
    for (let i = 1; i <= 7; i++) {
      if (scheduleBinary.charAt(i) === '1') {
        days.push(dayMap[i]);
      }
    }
    
    return days.length > 0 ? days.join(', ') : '-';
  };

  // 渲染例外时间段
  // 添加例外时间段的显示
  const renderExceptionTimes = () => {
    if (!record.rawData?.exception_time || !Array.isArray(record.rawData.exception_time) || record.rawData.exception_time.length === 0) {
      return <span>无</span>;
    }
    
    return (
      <div>
        {record.rawData.exception_time.map((item, index) => (
          <div key={index} className="mb-2">
            <div>开始时间: {item.start || '-'}</div>
            <div>结束时间: {item.end || '-'}</div>
            <div>说明: {item.explain || '-'}</div>
            {index < record.rawData.exception_time.length - 1 && <Divider style={{ margin: '8px 0' }} />}
          </div>
        ))}
      </div>
    );
  };

  // 处理是否跨天的显示
  const getIsCrossDay = () => {
    // 优先使用记录中的 isCrossDay 字段
    if (record.isCrossDay !== undefined) {
      return record.isCrossDay ? '是' : '否';
    }
    
    // 如果原始数据中有 is_cross_day 字段
    if (record.rawData?.is_cross_day !== undefined) {
      return record.rawData.is_cross_day === 1 ? '是' : '否';
    }
    
    // 根据开始时间和时间差计算是否跨天
    if (record.rawData?.start_time && record.rawData?.time_diff) {
      const [startHours, startMinutes] = record.rawData.start_time.split(':').map(Number);
      const [diffHours, diffMinutes] = record.rawData.time_diff.split(':').map(Number);
      
      // 计算总分钟数
      const startTotalMinutes = startHours * 60 + startMinutes;
      const diffTotalMinutes = diffHours * 60 + diffMinutes;
      
      // 如果开始时间加上时间差超过24小时（1440分钟），则为跨天
      return (startTotalMinutes + diffTotalMinutes) >= 1440 ? '是' : '否';
    }
    
    // 如果以上都没有，则根据开始时间和结束时间计算
    if (record.startTime && record.endTime) {
      const [startHours, startMinutes] = record.startTime.split(':').map(Number);
      const [endHours, endMinutes] = record.endTime.split(':').map(Number);
      
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      
      // 如果结束时间小于开始时间，则认为是跨天
      return endTotalMinutes < startTotalMinutes ? '是' : '否';
    }
    
    return '-';
  };

  return (
    <Modal
      title="规则详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="规则单号" span={2}>{record.ruleNumber || record.rule_id || '-'}</Descriptions.Item>
        <Descriptions.Item label="状态">{renderStatus(record.status)}</Descriptions.Item>
        <Descriptions.Item label="审批日期">{record.approvalDate || '-'}</Descriptions.Item>
        <Descriptions.Item label="门禁区域">{getDoorArea()}</Descriptions.Item>
        <Descriptions.Item label="门禁名称">{getDoorName()}</Descriptions.Item>
        <Descriptions.Item label="规则说明" span={2}>{record.description || record.rule_explanation || '-'}</Descriptions.Item>
        <Descriptions.Item label="适用职级">{getAssessmentLevel()}</Descriptions.Item>
        <Descriptions.Item label="适用排班">{getSchedule()}</Descriptions.Item>
        <Descriptions.Item label="稽查开始时间">{record.startTime || record.start_time || record.rawData?.start_time || '-'}</Descriptions.Item>
        <Descriptions.Item label="稽查结束时间">{record.endTime || record.end_time || record.rawData?.end_time || '-'}</Descriptions.Item>
        <Descriptions.Item label="是否跨天">{getIsCrossDay()}</Descriptions.Item>
        <Descriptions.Item label="时间差">{record.timeDiff || record.time_diff || record.rawData?.time_diff || '-'}</Descriptions.Item>
        <Descriptions.Item label="编制人">{record.creator || record.nick_name || '-'}</Descriptions.Item>
        <Descriptions.Item label="编制日期">{record.createDate || record.create_time || '-'}</Descriptions.Item>
        <Descriptions.Item label="审核人">{record.reviewer || record.approver_name || '-'}</Descriptions.Item>
        
        {/* 添加例外时间段显示 */}
        <Descriptions.Item label="例外时间段" span={2}>
          {renderExceptionTimes()}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default RuleDetailModal;