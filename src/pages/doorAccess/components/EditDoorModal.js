import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const EditDoorModal = ({ visible, onCancel, onSubmit, confirmLoading, record, areaOptions, typeOptions }) => {
  const [form] = Form.useForm();

  // 当记录变化时，重置表单数据
  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        door_code: record.door_code,
        door_name: record.door_name,
        door_area: record.door_area,
        door_type: record.door_type,
        ip_address: record.ip_address,
        remark: record.remark || ''
      });
    }
  }, [visible, record, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({ ...values, id: record?.id });
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
      title="编辑门禁"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      maskClosable={false}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="door_code"
          label="门禁编号"
          rules={[{ required: true, message: '请输入门禁编号' }]}
        >
          <Input placeholder="请输入门禁编号" disabled />
        </Form.Item>
        
        <Form.Item
          name="door_name"
          label="门禁名称"
          rules={[{ required: true, message: '请输入门禁名称' }]}
        >
          <Input placeholder="请输入门禁名称" />
        </Form.Item>
        
        <Form.Item
          name="door_area"
          label="门禁区域"
          rules={[{ required: true, message: '请选择门禁区域' }]}
        >
          <Select placeholder="请选择门禁区域">
            {areaOptions && areaOptions.length > 0 ? (
              areaOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.text}
                </Option>
              ))
            ) : null}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="door_type"
          label="门禁类型"
          rules={[{ required: true, message: '请选择门禁类型' }]}
        >
          <Select placeholder="请选择门禁类型">
            {typeOptions && typeOptions.length > 0 ? (
              typeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.text}
                </Option>
              ))
            ) : null}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="ip_address"
          label="IP 地址"
          rules={[
            { required: true, message: '请输入IP地址' },
            { 
              pattern: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 
              message: '请输入有效的IP地址' 
            }
          ]}
        >
          <Input placeholder="请输入IP地址" />
        </Form.Item>
        
        <Form.Item
          name="remark"
          label="备注"
        >
          <Input.TextArea placeholder="请输入备注信息" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDoorModal;