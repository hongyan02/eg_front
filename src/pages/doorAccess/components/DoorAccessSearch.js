import React, { useEffect, useState, useRef } from 'react';
import { Form, Select, Button, Space, Input, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

const DoorAccessSearch = ({ form, onSearch, onReset, doorData = [] }) => {
  // 保存所有可能的选项
  const [allAreaOptions, setAllAreaOptions] = useState([]);
  const [allTypeOptions, setAllTypeOptions] = useState([]);
  // 使用ref来跟踪是否已经初始化了选项
  const initialized = useRef(false);

  // 只在初始加载时提取所有可能的选项
  useEffect(() => {
    // 只有当doorData有数据且尚未初始化时才执行
    if (doorData.length > 0 && !initialized.current) {
      // 提取所有唯一的门禁区域
      const areas = [...new Set(doorData.map(item => item.door_area).filter(Boolean))];
      setAllAreaOptions(areas.map(area => ({ text: area, value: area })));
      
      // 提取所有唯一的门禁类型
      const types = [...new Set(doorData.map(item => item.door_type).filter(Boolean))];
      setAllTypeOptions(types.map(type => ({ text: type, value: type })));
      
      // 标记为已初始化
      initialized.current = true;
    }
  }, [doorData]);

  return (
    <Form 
      form={form}
      layout="inline"
      onFinish={onSearch}
      className="w-full"
    >
      <Row gutter={[16, 16]} className="w-full">
        <Col xs={24} sm={12} md={6} lg={5} xl={5}>
          <Form.Item name="doorNumber" label="门禁编号" className="w-full">
            <Input 
              placeholder="请输入门禁编号" 
              allowClear
              className="w-full"
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={5} xl={5}>
          <Form.Item name="area" label="门禁区域" className="w-full">
            <Select 
              placeholder="全部" 
              allowClear
              className="w-full"
            >
              <Option value="">全部</Option>
              {allAreaOptions && allAreaOptions.length > 0 ? (
                allAreaOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.text}
                  </Option>
                ))
              ) : null}
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={5} xl={5}>
          <Form.Item name="type" label="门禁类型" className="w-full">
            <Select 
              placeholder="全部" 
              allowClear
              className="w-full"
            >
              <Option value="">全部</Option>
              {allTypeOptions && allTypeOptions.length > 0 ? (
                allTypeOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.text}
                  </Option>
                ))
              ) : null}
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={5} xl={5}>
          <Form.Item name="inOutType" label="进出类型" className="w-full">
            <Select 
              placeholder="全部" 
              allowClear
              className="w-full"
            >
              <Option value="">全部</Option>
              <Option value="0">进门</Option>
              <Option value="1">出门</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={24} md={24} lg={4} xl={4} className="flex justify-end">
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SearchOutlined />}
                className="bg-blue-500"
              >
                查询
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={onReset}
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

export default DoorAccessSearch;