import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, Button } from 'antd';

const { Option } = Select;

const AddDoorModal = ({ visible, onCancel, onSubmit, confirmLoading, areaOptions, typeOptions }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
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
      title="新增门禁"
      open={visible}
      onCancel={handleCancel}
      maskClosable={false}
      destroyOnClose
      width={550}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={confirmLoading} 
          onClick={handleOk}
          className="bg-blue-500"
        >
          确定
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        size="middle"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="door_code"
              label="门禁编号"
              rules={[{ required: true, message: '请输入门禁编号' }]}
            >
              <Input placeholder="请输入门禁编号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="door_name"
              label="门禁名称"
              rules={[{ required: true, message: '请输入门禁名称' }]}
            >
              <Input placeholder="请输入门禁名称" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
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
                ) : (
                  <Option value="新区域">新区域</Option>
                )}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="door_type"
              label="门禁类型"
              rules={[{ required: true, message: '请选择门禁类型' }]}
            >
              <Select placeholder="请选择门禁类型">
                <Option value="0">园区门禁</Option>
                <Option value="1">车间门禁</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="in_out_type"
              label="进出类型"
              rules={[{ required: true, message: '请选择进出类型' }]}
            >
              <Select placeholder="请选择进出类型">
                <Option value="1">进门</Option>
                <Option value="0">出门</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ip_address"
              label="IP地址"
              rules={[{ required: false, message: '请输入IP地址' }]}
            >
              <Input placeholder="请输入IP地址" />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="remark"
          label="备注"
        >
          <Input.TextArea placeholder="请输入备注信息" rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDoorModal;