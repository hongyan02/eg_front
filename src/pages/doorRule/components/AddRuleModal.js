import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, TimePicker, Button, Checkbox, Row, Col, Select, Divider, Tooltip, InputNumber } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import useEntryList from '../hooks/useEntryList';

const { TextArea } = Input;
const { Option } = Select;

// 定义职级选项
const levelOptions = [
  { label: '员工', value: '0' },
  { label: '职员', value: '4' },
  { label: '主管', value: '14' },
  { label: '经理', value: '12' },
  { label: '高级经理', value: '9' },
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
  const { entryList, loading: entryListLoading } = useEntryList();

  // 当编辑记录变化时，重置表单数据
  useEffect(() => {
    if (visible && isEdit && editRecord) {
      console.log('编辑记录原始数据:', editRecord);
      
      // 处理时间格式，将字符串转换为moment对象
      let startTime = editRecord.startTime ? moment(editRecord.startTime, 'HH:mm:ss') : null;
      let endTime = editRecord.endTime ? moment(editRecord.endTime, 'HH:mm:ss') : null;
      
      // 如果直接的时间字段为空，尝试从rawData中获取
      if (!startTime && editRecord.rawData?.start_time) {
        startTime = moment(editRecord.rawData.start_time, 'HH:mm:ss');
        console.log('从rawData获取开始时间:', editRecord.rawData.start_time, '转换后:', startTime);
      } else if (!startTime && editRecord.start_time) {
        // 直接从编辑记录中获取start_time字段
        startTime = moment(editRecord.start_time, 'HH:mm:ss');
        console.log('直接从编辑记录获取开始时间:', editRecord.start_time, '转换后:', startTime);
      }
      
      if (!endTime && editRecord.rawData?.end_time) {
        endTime = moment(editRecord.rawData.end_time, 'HH:mm:ss');
        console.log('从rawData获取结束时间:', editRecord.rawData.end_time, '转换后:', endTime);
      } else if (!endTime && editRecord.end_time) {
        // 直接从编辑记录中获取end_time字段
        endTime = moment(editRecord.end_time, 'HH:mm:ss');
        console.log('直接从编辑记录获取结束时间:', editRecord.end_time, '转换后:', endTime);
      }
      
      // 打印完整的编辑记录，查看所有可能的字段名
      console.log('编辑记录字段:', {
        directFields: Object.keys(editRecord),
        rawDataFields: editRecord.rawData ? Object.keys(editRecord.rawData) : [],
        startTime: startTime,
        endTime: endTime
      });
      
      // 处理例外时间段数据
      let formattedExceptionTimes = [];
      
      // 检查 rawData 中是否有 exception_time 字段
      if (editRecord.rawData && editRecord.rawData.exception_time && Array.isArray(editRecord.rawData.exception_time)) {
        formattedExceptionTimes = editRecord.rawData.exception_time.map(item => ({
          startTime: item.start ? moment(item.start) : null,
          endTime: item.end ? moment(item.end) : null,
          description: item.explain || '' // 从 explain 字段映射到 description
        }));
      } 
      // 如果没有在 rawData 中找到，则尝试在 exceptionTimes 中查找
      else if (editRecord.exceptionTimes && Array.isArray(editRecord.exceptionTimes)) {
        formattedExceptionTimes = editRecord.exceptionTimes.map(item => ({
          startTime: item.startTime ? moment(item.startTime) : null,
          endTime: item.endTime ? moment(item.endTime) : null,
          description: item.description || item.explain || '' // 支持两种字段名
        }));
      }
      // 直接从编辑记录中获取exception_time字段
      else if (editRecord.exception_time && Array.isArray(editRecord.exception_time)) {
        formattedExceptionTimes = editRecord.exception_time.map(item => ({
          startTime: item.start ? moment(item.start) : null,
          endTime: item.end ? moment(item.end) : null,
          description: item.explain || '' // 从 explain 字段映射到 description
        }));
      }
      
      // 处理职级数据，如果有的话
      const assessmentLevel = editRecord.rawData?.assessment_level ? 
        editRecord.rawData.assessment_level.split(',') : ['4'];
      
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
      
      // 确定是否跨天
      let isCrossDay = false;
      
      // 根据开始时间和时间差计算是否跨天（优先使用这种方式）
      if (editRecord.rawData?.start_time && editRecord.rawData?.time_diff) {
        // 直接从字符串提取小时数
        const startHour = parseInt(editRecord.rawData.start_time.split(':')[0]);
        const diffHour = parseInt(editRecord.rawData.time_diff.split(':')[0]);
        
        // 简单判断：如果开始时间加上时间差的小时数大于等于24，则为跨天
        isCrossDay = (startHour + diffHour) >= 24;
        
        console.log('跨天计算详情:', {
          startHour,
          diffHour,
          sum: startHour + diffHour,
          isCrossDay
        });
      }
      // 然后检查原始数据中的 is_cross_day 字段
      else if (editRecord.rawData?.is_cross_day !== undefined) {
        isCrossDay = editRecord.rawData.is_cross_day === 1;
      }
      // 根据开始时间和结束时间计算是否跨天
      else if (editRecord.rawData?.start_time && editRecord.rawData?.end_time) {
        const [startHours, startMinutes] = editRecord.rawData.start_time.split(':').map(Number);
        const [endHours, endMinutes] = editRecord.rawData.end_time.split(':').map(Number);
        
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        
        // 如果结束时间小于开始时间，则认为是跨天
        isCrossDay = endTotalMinutes < startTotalMinutes;
      }
      // 最后根据开始时间和结束时间计算是否跨天
      else if (startTime && endTime) {
        const startMinutes = startTime.hours() * 60 + startTime.minutes();
        const endMinutes = endTime.hours() * 60 + endTime.minutes();
        
        // 如果结束时间小于开始时间，则认为是跨天
        isCrossDay = endMinutes < startMinutes;
      }
      // 使用记录中的 isCrossDay 字段（最低优先级）
      else if (editRecord.isCrossDay !== undefined) {
        isCrossDay = editRecord.isCrossDay;
      }
      
      console.log('跨天判断:', {
        startTime: editRecord.rawData?.start_time,
        endTime: editRecord.rawData?.end_time,
        timeDiff: editRecord.rawData?.time_diff,
        isCrossDay,
        calculation: editRecord.rawData?.start_time && editRecord.rawData?.time_diff ? 
          `${editRecord.rawData.start_time.split(':')[0]} + ${editRecord.rawData.time_diff.split(':')[0]} = ${
            Number(editRecord.rawData.start_time.split(':')[0]) + Number(editRecord.rawData.time_diff.split(':')[0])
          }` : ''
      });
      
      form.setFieldsValue({
        ...editRecord,
        startTime,
        endTime,
        isCrossDay: isCrossDay,
        doorName: editRecord.doorName || '',
        approverId: editRecord.approverId || '',
        exceptionTimes: formattedExceptionTimes.length > 0 ? formattedExceptionTimes : undefined,
        assessmentLevel: assessmentLevel,
        schedule: schedule
      });
    }
  }, [visible, editRecord, isEdit, form]);

  // 当编辑记录变化时，重置表单数据
  useEffect(() => {
    if (visible && isEdit && editRecord) {
      console.log('编辑记录原始数据:', editRecord);
      
      // 处理时间格式，将字符串转换为moment对象
      let startTime = editRecord.startTime ? moment(editRecord.startTime, 'HH:mm:ss') : null;
      let endTime = editRecord.endTime ? moment(editRecord.endTime, 'HH:mm:ss') : null;
      
      // 如果直接的时间字段为空，尝试从rawData中获取
      if (!startTime && editRecord.rawData?.start_time) {
        startTime = moment(editRecord.rawData.start_time, 'HH:mm:ss');
        console.log('从rawData获取开始时间:', editRecord.rawData.start_time, '转换后:', startTime);
      } else if (!startTime && editRecord.start_time) {
        // 直接从编辑记录中获取start_time字段
        startTime = moment(editRecord.start_time, 'HH:mm:ss');
        console.log('直接从编辑记录获取开始时间:', editRecord.start_time, '转换后:', startTime);
      }
      
      if (!endTime && editRecord.rawData?.end_time) {
        endTime = moment(editRecord.rawData.end_time, 'HH:mm:ss');
        console.log('从rawData获取结束时间:', editRecord.rawData.end_time, '转换后:', endTime);
      } else if (!endTime && editRecord.end_time) {
        // 直接从编辑记录中获取end_time字段
        endTime = moment(editRecord.end_time, 'HH:mm:ss');
        console.log('直接从编辑记录获取结束时间:', editRecord.end_time, '转换后:', endTime);
      }
      
      // 打印完整的编辑记录，查看所有可能的字段名
      console.log('编辑记录字段:', {
        directFields: Object.keys(editRecord),
        rawDataFields: editRecord.rawData ? Object.keys(editRecord.rawData) : [],
        startTime: startTime,
        endTime: endTime
      });
      
      // 处理例外时间段数据
      let formattedExceptionTimes = [];
      
      // 检查 rawData 中是否有 exception_time 字段
      if (editRecord.rawData && editRecord.rawData.exception_time && Array.isArray(editRecord.rawData.exception_time)) {
        formattedExceptionTimes = editRecord.rawData.exception_time.map(item => ({
          startTime: item.start ? moment(item.start) : null,
          endTime: item.end ? moment(item.end) : null,
          description: item.explain || '' // 从 explain 字段映射到 description
        }));
      } 
      // 如果没有在 rawData 中找到，则尝试在 exceptionTimes 中查找
      else if (editRecord.exceptionTimes && Array.isArray(editRecord.exceptionTimes)) {
        formattedExceptionTimes = editRecord.exceptionTimes.map(item => ({
          startTime: item.startTime ? moment(item.startTime) : null,
          endTime: item.endTime ? moment(item.endTime) : null,
          description: item.description || item.explain || '' // 支持两种字段名
        }));
      }
      // 直接从编辑记录中获取exception_time字段
      else if (editRecord.exception_time && Array.isArray(editRecord.exception_time)) {
        formattedExceptionTimes = editRecord.exception_time.map(item => ({
          startTime: item.start ? moment(item.start) : null,
          endTime: item.end ? moment(item.end) : null,
          description: item.explain || '' // 从 explain 字段映射到 description
        }));
      }
      
      // 处理职级数据，如果有的话
      const assessmentLevel = editRecord.rawData?.assessment_level ? 
        editRecord.rawData.assessment_level.split(',') : ['4'];
      
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
      
      // 确定是否跨天
      let isCrossDay = false;
      
      // 根据开始时间和时间差计算是否跨天（优先使用这种方式）
      if (editRecord.rawData?.start_time && editRecord.rawData?.time_diff) {
        // 直接从字符串提取小时数
        const startHour = parseInt(editRecord.rawData.start_time.split(':')[0]);
        const diffHour = parseInt(editRecord.rawData.time_diff.split(':')[0]);
        
        // 简单判断：如果开始时间加上时间差的小时数大于等于24，则为跨天
        isCrossDay = (startHour + diffHour) >= 24;
        
        console.log('跨天计算详情:', {
          startHour,
          diffHour,
          sum: startHour + diffHour,
          isCrossDay
        });
      }
      // 然后检查原始数据中的 is_cross_day 字段
      else if (editRecord.rawData?.is_cross_day !== undefined) {
        isCrossDay = editRecord.rawData.is_cross_day === 1;
      }
      // 根据开始时间和结束时间计算是否跨天
      else if (editRecord.rawData?.start_time && editRecord.rawData?.end_time) {
        const [startHours, startMinutes] = editRecord.rawData.start_time.split(':').map(Number);
        const [endHours, endMinutes] = editRecord.rawData.end_time.split(':').map(Number);
        
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        
        // 如果结束时间小于开始时间，则认为是跨天
        isCrossDay = endTotalMinutes < startTotalMinutes;
      }
      // 最后根据开始时间和结束时间计算是否跨天
      else if (startTime && endTime) {
        const startMinutes = startTime.hours() * 60 + startTime.minutes();
        const endMinutes = endTime.hours() * 60 + endTime.minutes();
        
        // 如果结束时间小于开始时间，则认为是跨天
        isCrossDay = endMinutes < startMinutes;
      }
      // 使用记录中的 isCrossDay 字段（最低优先级）
      else if (editRecord.isCrossDay !== undefined) {
        isCrossDay = editRecord.isCrossDay;
      }
      
      console.log('跨天判断:', {
        startTime: editRecord.rawData?.start_time,
        endTime: editRecord.rawData?.end_time,
        timeDiff: editRecord.rawData?.time_diff,
        isCrossDay,
        calculation: editRecord.rawData?.start_time && editRecord.rawData?.time_diff ? 
          `${editRecord.rawData.start_time.split(':')[0]} + ${editRecord.rawData.time_diff.split(':')[0]} = ${
            Number(editRecord.rawData.start_time.split(':')[0]) + Number(editRecord.rawData.time_diff.split(':')[0])
          }` : ''
      });
      
      form.setFieldsValue({
        ...editRecord,
        startTime,
        endTime,
        isCrossDay: isCrossDay,
        doorName: editRecord.doorName || '',
        approverId: editRecord.approverId || '',
        exceptionTimes: formattedExceptionTimes.length > 0 ? formattedExceptionTimes : undefined,
        assessmentLevel: assessmentLevel,
        schedule: schedule
      });
    }
  }, [visible, editRecord, isEdit, form]);

  // 处理门禁选择变化
  const handleEntryChange = (values, options) => {
    // 当选择门禁时，获取所有选中项的门禁区域
    if (options && options.length > 0) {
      // 获取第一个选中项的门禁区域作为表单值
      // 通常多个门禁应该属于同一区域
      const firstOption = options[0];
      if (firstOption && firstOption.doorArea) {
        form.setFieldsValue({
          doorArea: firstOption.doorArea
        });
      }
    }
  };

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
          assessmentLevel: ['4'],
          schedule: ['mon', 'tue', 'wed', 'thu', 'fri'],
          time: 30 // 添加默认值
        }}
        style={{ maxHeight: 'none' }}
      >
        <Row gutter={16}>
        <Col span={24}>
            <Form.Item
              name="doorName"
              label="门禁名称"
              rules={[{ required: true, message: '请选择门禁名称' }]}
            >
              <Select
                placeholder="请选择门禁名称"
                loading={entryListLoading}
                onChange={handleEntryChange}
                showSearch
                mode="multiple"
                optionFilterProp="label"
                style={{ width: '100%' }}
                dropdownMatchSelectWidth={false}
                optionLabelProp="label"
              >
                {entryList.map(option => (
                  <Option 
                    key={option.value} 
                    value={option.value}
                    doorArea={option.doorArea}
                    label={option.label}
                  >
                    <Tooltip title={option.value} placement="right">
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{option.label}</span>
                        <span style={{ color: '#999', fontSize: '12px', marginLeft: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                          {option.value}
                        </span>
                      </div>
                    </Tooltip>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="doorArea"
              label="门禁区域"
              rules={[{ required: true, message: '请输入门禁区域' }]}
            >
              <Input placeholder="请输入门禁区域" disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="time"
              label="稽查时间标准"
              rules={[{ required: true, message: '请输入稽查时间标准' }]}
            >
              <InputNumber 
                min={0}
                style={{ width: '100%' }}
                placeholder="请输入稽查时间标准"
              />
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
        
        {/* 其余表单内容保持不变 */}
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
              <TimePicker 
                format="HH:mm:ss" 
                placeholder="开始时间" 
                style={{ width: '100%' }} 
                showNow={true}
                inputReadOnly={true}
                mouseWheel={false}
                use12Hours={false}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="endTime"
              label="稽查结束时间"
              rules={[{ required: false, message: '请选择结束时间' }]}
            >
              <TimePicker 
                format="HH:mm:ss" 
                placeholder="结束时间" 
                style={{ width: '100%' }} 
                showNow={true}
                inputReadOnly={true}
                mouseWheel={false}
                use12Hours={false}
              />
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
        
        {/* 例外时间段 */}
        <Divider orientation="left">例外时间段</Divider>
        <Form.List name="exceptionTimes">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="mb-4 p-3 border border-gray-200 rounded-md">
                  <Row gutter={16}>
                    <Col span={11}>
                      <Form.Item
                        {...restField}
                        name={[name, 'startTime']}
                        label="开始时间"
                        rules={[{ required: true, message: '请选择开始时间' }]}
                      >
                        <TimePicker 
                          format="HH:mm:ss" 
                          style={{ width: '100%' }} 
                          inputReadOnly={true}
                          mouseWheel={false}
                          use12Hours={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item
                        {...restField}
                        name={[name, 'endTime']}
                        label="结束时间"
                        rules={[{ required: true, message: '请选择结束时间' }]}
                      >
                        <TimePicker 
                          format="HH:mm:ss" 
                          style={{ width: '100%' }} 
                          inputReadOnly={true}
                          mouseWheel={false}
                          use12Hours={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2} className="flex items-center justify-end mt-8">
                      <MinusCircleOutlined onClick={() => remove(name)} className="text-red-500" />
                    </Col>
                  </Row>
                  
                  {/* 添加例外时间说明字段 */}
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                    label="例外时间说明"
                    rules={[{ required: true, message: '请输入例外时间说明' }]}
                  >
                    <Input placeholder="请输入此例外时间段的说明" />
                  </Form.Item>
                </div>
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