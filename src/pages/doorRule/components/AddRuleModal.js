import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, TimePicker, Button, Checkbox, Row, Col, Select } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

// 定义职级选项
const levelOptions = [
  { label: '职员', value: '10' },
  { label: '主管', value: '9' },
  { label: '经理', value: '8' },
  { label: '高级经理', value: '5' },
];

// 定义排班选项
const scheduleOptions = [
  { label: '周一', value: 'mon' },
  { label: '周二', value: 'tue' },
  { label: '周三', value: 'wed' },
  { label: '周四', value: 'thu' },
  { label: '周五', value: 'fri' },
  { label: '周六', value: 'sat' },
  { label: '周日', value: 'sun' },
];

const AddRuleModal = ({ visible, onCancel, onSubmit, confirmLoading, editRecord, isEdit }) => {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(true); // 用于标记是保存草稿还是提交

  // 当编辑记录变化时，重置表单数据
  useEffect(() => {
    if (visible && isEdit && editRecord) {
      // 处理时间格式，将字符串转换为moment对象
      const startTime = editRecord.startTime ? moment(editRecord.startTime, 'HH:mm:ss') : null;
      const endTime = editRecord.endTime ? moment(editRecord.endTime, 'HH:mm:ss') : null;
      
      // 处理例外时间段数据，如果有的话
      const exceptionTimes = editRecord.exceptionTimes || [];
      const formattedExceptionTimes = exceptionTimes.map(item => ({
        startTime: item.startTime ? moment(item.startTime, 'HH:mm:ss') : null,
        endTime: item.endTime ? moment(item.endTime, 'HH:mm:ss') : null
      }));
      
      // 处理职级数据，如果有的话
      const assessmentLevel = editRecord.rawData?.assessment_level ? 
        editRecord.rawData.assessment_level.split(',') : ['10'];
      
      // 处理排班数据，如果有的话
      const scheduleInt = editRecord.rawData?.work_schedule || 0;
      
      // 将数字转换为二进制字符串，然后解析每一位
      const scheduleBinary = parseInt(scheduleInt).toString(2).padStart(8, '0');
      
      const schedule = [];
      if (scheduleBinary.charAt(7) === '1') schedule.push('mon');
      if (scheduleBinary.charAt(6) === '1') schedule.push('tue');
      if (scheduleBinary.charAt(5) === '1') schedule.push('wed');
      if (scheduleBinary.charAt(4) === '1') schedule.push('thu');
      if (scheduleBinary.charAt(3) === '1') schedule.push('fri');
      if (scheduleBinary.charAt(2) === '1') schedule.push('sat');
      if (scheduleBinary.charAt(1) === '1') schedule.push('sun');
      
      form.setFieldsValue({
        ...editRecord,
        startTime,
        endTime,
        isCrossDay: editRecord.isCrossDay || false,
        doorName: editRecord.doorName || '',
        approverId: editRecord.approverId || '',
        exceptionTimes: formattedExceptionTimes.length > 0 ? formattedExceptionTimes : undefined,
        assessmentLevel: assessmentLevel,
        schedule: schedule
      });
    }
  }, [visible, editRecord, isEdit, form]);

  // 保存草稿
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 保存草稿时不进行完整验证
      const values = await form.validateFields(['doorArea']); // 只验证必填的门禁区域
      const allValues = form.getFieldsValue(true); // 获取所有字段值
      
      // 合并验证通过的字段和其他字段
      const mergedValues = { ...allValues, ...values };
      
      // 如果是编辑模式，需要将编辑记录的 ruleNumber 添加到 values 中
      if (isEdit && editRecord) {
        mergedValues.ruleNumber = editRecord.ruleNumber;
      } 
      
      onSubmit(mergedValues, 'save');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEdit ? "编辑门禁规则" : "新建门禁规则"}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="save" 
          onClick={handleSave} 
          loading={confirmLoading && isSaving}
        >
          保存草稿
        </Button>,
        // 移除提交按钮
      ]}
      width={650}
      maskClosable={false}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'draft',
          isCrossDay: false,
          assessmentLevel: ['10'], // 默认选中职员
          schedule: ['mon', 'tue', 'wed', 'thu', 'fri'] // 默认选中周一到周五
        }}
        style={{ maxHeight: 'none' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="doorArea"
              label="门禁区域"
              rules={[{ required: true, message: '请输入门禁区域' }]}
            >
              <Input placeholder="请输入门禁区域" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="doorName"
              label="门禁名称"
              rules={[{ required: false, message: '请输入门禁名称' }]}
            >
              <Input placeholder="请输入门禁名称" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="规则说明"
              rules={[{ required: false, message: '请输入规则说明' }]}
            >
              <TextArea rows={2} placeholder="请输入规则说明" />
            </Form.Item>
          </Col>
        </Row>
        
        {/* 添加职级下拉框 */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="assessmentLevel"
              label="适用职级"
              rules={[{ required: false, message: '请选择适用职级' }]}
            >
              <Select
                mode="multiple"
                placeholder="请选择适用职级"
                style={{ width: '100%' }}
                allowClear
              >
                {levelOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        {/* 添加排班下拉框 */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="schedule"
              label="适用排班"
              rules={[{ required: false, message: '请选择适用排班' }]}
            >
              <Select
                mode="multiple"
                placeholder="请选择适用排班"
                style={{ width: '100%' }}
                allowClear
              >
                {scheduleOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16} align="middle">
          <Col span={10}>
            <Form.Item
              name="startTime"
              label="稽查开始时间"
              rules={[{ required: false, message: '请选择开始时间' }]}
            >
              <TimePicker format="HH:mm:ss" placeholder="开始时间" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="endTime"
              label="稽查结束时间"
              rules={[{ required: false, message: '请选择结束时间' }]}
            >
              <TimePicker format="HH:mm:ss" placeholder="结束时间" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={4} style={{ paddingLeft: '8px', display: 'flex', alignItems: 'center' }}>
            <Form.Item
              name="isCrossDay"
              valuePropName="checked"
              noStyle
            >
              <Checkbox>跨天</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        
        {/* 添加例外时间段 */}
        <Form.List name="exceptionTimes">
          {(fields, { add, remove }) => (
            <>
              <div className="mb-2 font-medium">例外时间段</div>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={16} align="middle" className="mb-2">
                  <Col span={10}>
                    <Form.Item
                      {...restField}
                      name={[name, 'startTime']}
                      rules={[{ required: false, message: '请选择开始时间' }]}
                    >
                      <TimePicker format="HH:mm:ss" placeholder="开始时间" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      {...restField}
                      name={[name, 'endTime']}
                      rules={[{ required: false, message: '请选择结束时间' }]}
                    >
                      <TimePicker format="HH:mm:ss" placeholder="结束时间" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={4} style={{ display: 'flex', justifyContent: 'center' }}>
                    <MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button 
                  type="dashed" 
                  onClick={() => add()} 
                  block 
                  icon={<PlusOutlined />}
                >
                  添加例外时间段
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        
        {/* 移除审核人字段 */}
      </Form>
    </Modal>
  );
};

export default AddRuleModal;