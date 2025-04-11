import React from 'react';
import { Form, Input, Select, Button, Space, DatePicker, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const SearchHeader = ({ form, onSearchFormSubmit }) => {
  // 处理表单重置
  const handleReset = () => {
    form.resetFields();
    // 重置后立即触发搜索，使用空参数
    onSearchFormSubmit({});
  };

  return (
    <Form 
      form={form}
      layout="horizontal"
      onFinish={onSearchFormSubmit}
      className="w-full"
    >
      <Row gutter={[16, 16]} className="w-full">
        <Col xs={24} sm={24} md={12} lg={8} xl={6}>
          <Form.Item 
            name="dateRange" 
            label="异常日期范围" 
            className="w-full mb-2"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <RangePicker 
              placeholder={['开始日期', '结束日期']} 
              className="w-full"
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={4} xl={4}>
          <Form.Item 
            name="employeeId" 
            label="工号" 
            className="w-full mb-2"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input 
              placeholder="请输入工号" 
              prefix={<SearchOutlined />}
              className="w-full"
            />
          </Form.Item>
        </Col>
        
        {/* 部门选择器已移除 */}
        
        <Col xs={24} sm={12} md={6} lg={4} xl={4}>
          <Form.Item 
            name="confirmed" 
            label="异常确认" 
            className="w-full mb-2"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Select 
              placeholder="是否已确认" 
              className="w-full"
              allowClear
            >
              <Select.Option value="yes">已确认</Select.Option>
              <Select.Option value="no">未确认</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={4} xl={4}>
          <Form.Item 
            name="submitted" 
            label="是否提交" 
            className="w-full mb-2"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Select 
              placeholder="是否已提交" 
              className="w-full"
              allowClear
            >
              <Select.Option value="yes">已提交</Select.Option>
              <Select.Option value="no">未提交</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={24} md={12} lg={8} xl={6} className="flex items-end justify-end">
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
        </Col>
      </Row>
    </Form>
  );
};

export default SearchHeader;