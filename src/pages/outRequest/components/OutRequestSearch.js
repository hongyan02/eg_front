import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Space, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const OutRequestSearch = ({ onSearch, onStatusChange, getForm }) => {
  const [form] = Form.useForm();

  // 将表单实例传递给父组件
  useEffect(() => {
    if (getForm) {
      getForm(form);
    }
  }, [form, getForm]);

  const handleReset = () => {
    form.resetFields();
    onSearch({});
  };

  const handleFinish = (values) => {
    onSearch(values);
  };

  return (
    <Card className="mb-6 shadow-sm">
      <Form
        form={form}
        layout="inline"
        onFinish={handleFinish}
        className="flex flex-wrap gap-4"
      >
        <Form.Item name="requestCode" label="申请单号">
          <Input 
            placeholder="请输入申请单号" 
            allowClear
            className="w-64"
          />
        </Form.Item>
        
        <Form.Item name="status" label="状态">
          <Select 
            placeholder="请选择状态" 
            allowClear
            className="w-40"
            onChange={(value) => onStatusChange(value)}
          >
            <Select.Option value="0">草稿</Select.Option>
            <Select.Option value="1">待审核</Select.Option>
            <Select.Option value="2">已审核</Select.Option>
            <Select.Option value="3">已作废</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item className="ml-auto">
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SearchOutlined />}
              className="bg-blue-500"
            >
              搜索
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleReset}
            >
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default OutRequestSearch;