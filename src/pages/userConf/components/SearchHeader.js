import React from 'react';
import { Form, Input, Select, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const SearchHeader = ({ form, onSearchFormSubmit }) => {
  return (
    <Form 
      form={form}
      layout="inline"
      onFinish={onSearchFormSubmit}
      className="flex items-center flex-wrap"
    >
      <Form.Item name="department" label="部门" className="mb-2">
        <Input 
          placeholder="请输入部门名称" 
          prefix={<SearchOutlined />}
          className="w-64"
        />
      </Form.Item>
      <Form.Item name="name" label="姓名" className="mb-2">
        <Input 
          placeholder="请输入姓名" 
          prefix={<SearchOutlined />}
          className="w-48"
        />
      </Form.Item>
      <Form.Item name="status" label="状态" className="mb-2">
        <Select 
          placeholder="用户状态(是否稽查)" 
          className="w-48"
          allowClear
        >
          <Select.Option value="active">是</Select.Option>
          <Select.Option value="inactive">否</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item className="mb-2">
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
            onClick={() => form.resetFields()}
          >
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SearchHeader;