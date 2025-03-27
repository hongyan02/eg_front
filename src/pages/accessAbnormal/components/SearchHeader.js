import React from 'react';
import { Form, Input, Select, Button, Space, DatePicker, Cascader, Spin } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import useDepartmentCascader from '../hooks/useDepartmentCascader';

const { RangePicker } = DatePicker;

const SearchHeader = ({ form, onSearchFormSubmit }) => {
  const { departmentOptions, loading } = useDepartmentCascader();

  // 处理表单重置
  const handleReset = () => {
    form.resetFields();
    // 重置后立即触发搜索，使用空参数
    onSearchFormSubmit({});
  };

  return (
    <Form 
      form={form}
      layout="inline"
      onFinish={onSearchFormSubmit}
      className="flex items-center flex-wrap"
    >
      <Form.Item name="dateRange" label="异常日期范围" className="mb-2">
        <RangePicker 
          placeholder={['开始日期', '结束日期']} 
          className="w-64"
        />
      </Form.Item>
      <Form.Item name="employeeId" label="工号" className="mb-2">
        <Input 
          placeholder="请输入工号" 
          prefix={<SearchOutlined />}
          className="w-48"
        />
      </Form.Item>
      <Form.Item name="department" label="部门" className="mb-2">
        <Spin spinning={loading} size="small">
          <Cascader 
            options={departmentOptions}
            placeholder="请选择部门"
            className="w-64"
            expandTrigger="hover" // 设置为鼠标移入展开
            changeOnSelect
            showSearch={{
              filter: (inputValue, path) => {
                return path.some(option => 
                  option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                );
              }
            }}
          />
        </Spin>
      </Form.Item>
      <Form.Item name="confirmed" label="异常确认" className="mb-2">
        <Select 
          placeholder="是否已确认" 
          className="w-48"
          allowClear
        >
          <Select.Option value="yes">是</Select.Option>
          <Select.Option value="no">否</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="submitted" label="是否提交" className="mb-2">
        <Select 
          placeholder="是否已提交" 
          className="w-48"
          allowClear
        >
          <Select.Option value="yes">已提交</Select.Option>
          <Select.Option value="no">未提交</Select.Option>
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
            onClick={handleReset}
          >
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SearchHeader;