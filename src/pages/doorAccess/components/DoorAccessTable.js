import React, { useMemo } from 'react';
import { Table, Button, Space, Pagination, Popconfirm } from 'antd';
import {DeleteOutlined, EditOutlined } from '@ant-design/icons';

const DoorAccessTable = ({ 
  doorData = [], // 提供默认空数组
  loading, 
  currentPage, 
  onAddDoor, 
  onEdit, 
  onDelete, 
  onPageChange 
}) => {
  // 使用 useMemo 确保 doorData 是数组，避免每次渲染创建新引用
  const safeData = useMemo(() => {
    return Array.isArray(doorData) ? doorData : [];
  }, [doorData]);
  
  // 动态生成门禁区域和门禁类型的筛选选项
  const areaFilters = useMemo(() => {
    const areas = [...new Set(safeData.map(item => item.door_area).filter(Boolean))];
    return areas.map(area => ({ text: area, value: area }));
  }, [safeData]);
  
  const typeFilters = useMemo(() => {
    const types = [...new Set(safeData.map(item => item.door_type).filter(Boolean))];
    return types.map(type => ({ text: type, value: type }));
  }, [safeData]);

  const columns = useMemo(() => [
    {
      title: '门禁编号',
      dataIndex: 'door_code',
      rowkey: 'door_code',
      width: 150,
    },
    {
      title: '门禁名称',
      dataIndex: 'door_name',
      key: 'door_name',
      width: 250,
    },
    {
      title: '门禁区域',
      dataIndex: 'door_area',
      key: 'door_area',
      width: 120,
      filters: areaFilters,
      onFilter: (value, record) => record.door_area === value,
    },
    {
      title: '门禁类型',
      dataIndex: 'door_type',
      key: 'door_type',
      width: 120,
      filters: typeFilters,
      onFilter: (value, record) => record.door_type === value,
    },
    {
      title: 'IP 地址',
      dataIndex: 'ip_address',
      key: 'ip_address',
      width: 150,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => onEdit(record)} 
            className="text-blue-500 p-0"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条门禁记录吗?"
            onConfirm={() => onDelete(record.door_code || record.key)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="link" 
              icon={<DeleteOutlined />}
              className="text-red-500 p-0"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ], [areaFilters, typeFilters, onEdit, onDelete]); 

  return (
    <div className="bg-white p-4 rounded shadow">
      
      <Table
        columns={columns}
        dataSource={safeData}
        rowKey="door_area"
        loading={loading}
        pagination={false}
        className="mb-4"
      />
      
      <div className="flex justify-end">
        <Pagination
          current={currentPage}
          onChange={onPageChange}
          total={safeData.length}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default DoorAccessTable;