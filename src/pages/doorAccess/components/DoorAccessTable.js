import React, { useMemo } from 'react';
import { Table, Button, Space, Pagination, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

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

  // 动态生成进出类型的筛选选项
  const inOutFilters = useMemo(() => [
    { text: '进门', value: '1' },
    { text: '出门', value: '0' }
  ], []);

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
      title: '进出类型',
      dataIndex: 'in_out_type',
      key: 'in_out_type',
      width: 100,
      filters: inOutFilters,
      onFilter: (value, record) => record.in_out_type === value,
      render: (text) => text === '1' ? '进门' : (text === '0' ? '出门' : '未知'),
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
  ], [areaFilters, typeFilters, inOutFilters, onEdit, onDelete]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onAddDoor}
          className="bg-blue-500"
        >
          新增门禁
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={safeData}
        loading={loading}
        pagination={false}
        scroll={{ x: 1200 }}
        rowKey="door_code"
      />
      <div className="mt-4 flex justify-end">
        <Pagination
          current={currentPage}
          onChange={onPageChange}
          total={safeData.length}
          showSizeChanger={false}
          showTotal={(total) => `共 ${total} 条记录`}
        />
      </div>
    </div>
  );
};

export default DoorAccessTable;