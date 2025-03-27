import React from 'react';
import { Form, Input, Select, Button, Space, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';


const DoorRuleSearch = ({ onSearch, onStatusChange }) => {
  const [form] = Form.useForm();

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
        <Form.Item name="ruleNumber" label="规则单号">
          <Input 
            placeholder="请输入规则单号" 
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
            <Select.Option value="draft">草稿</Select.Option>
            <Select.Option value="pending">待审核</Select.Option>
            <Select.Option value="approved">已审核</Select.Option>
            <Select.Option value="cancelled">已作废</Select.Option>
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

export default DoorRuleSearch;