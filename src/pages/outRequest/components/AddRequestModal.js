import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button } from 'antd';
import moment from 'moment';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const AddRequestModal = ({ visible, onCancel, onSubmit, confirmLoading, editRecord, isEdit }) => {
  const [form] = Form.useForm();

  // 当编辑记录变化时，重置表单数据
  useEffect(() => {
    if (visible && isEdit && editRecord) {
      // 处理时间格式，将字符串转换为moment对象
      const startTime = editRecord.start_time ? moment(editRecord.start_time) : null;
      const endTime = editRecord.end_time ? moment(editRecord.end_time) : null;
      
      form.setFieldsValue({
        ...editRecord,
        timeRange: startTime && endTime ? [startTime, endTime] : undefined,
        doorArea: editRecord.door_area || '',
        reason: editRecord.reason || '',
        approverId: editRecord.approver_id || '',
      });
    }
  }, [visible, editRecord, isEdit, form]);

  const handleFinish = async (values) => {
    try {
      // 处理时间范围
      const [startTime, endTime] = values.timeRange || [];
      
      const submitData = {
        ...values,
        start_time: startTime ? startTime.format() : undefined,
        end_time: endTime ? endTime.format() : undefined,
        // 如果是编辑模式，需要将编辑记录的 request_code 添加到 values 中
        request_code: isEdit && editRecord ? editRecord.request_code : undefined
      };
      
      onSubmit(submitData);
    } catch (error) {
      console.error('表单提交失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEdit ? "编辑外出申请" : "新建外出申请"}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="save" 
          onClick={() => form.submit()} 
          loading={confirmLoading}
          type="primary"
        >
          保存
        </Button>,
      ]}
      width={650}
      maskClosable={false}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          status: '0', // 默认为草稿状态
        }}
      >
        <Form.Item
          name="doorArea"
          label="门禁区域"
          rules={[{ required: true, message: '请输入门禁区域' }]}
        >
          <Input placeholder="请输入门禁区域" />
        </Form.Item>
        
        <Form.Item
          name="reason"
          label="外出原因"
          rules={[{ required: true, message: '请输入外出原因' }]}
        >
          <TextArea rows={3} placeholder="请输入外出原因" />
        </Form.Item>
        
        <Form.Item
          name="timeRange"
          label="外出时间"
          rules={[{ required: true, message: '请选择外出时间' }]}
        >
          <RangePicker 
            showTime 
            format="YYYY-MM-DD HH:mm:ss" 
            style={{ width: '100%' }}
            placeholder={['开始时间', '结束时间']}
          />
        </Form.Item>
        
        <Form.Item
          name="approverId"
          label="审核人工号"
          rules={[{ required: true, message: '请输入审核人工号' }]}
        >
          <Input placeholder="请输入审核人工号" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRequestModal;