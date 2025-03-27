import React from 'react';
import { Table, Switch } from 'antd';

const EmployeeTable = ({ employeeData, onSwitchChange }) => {
  // 表格列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '工号',
      dataIndex: 'employeeId',
      key: 'employeeId',
      width: 120,
    },
    {
      title: '用户姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 180,
    },
    {
      title: '稽查状态',
      dataIndex: 'checked',
      key: 'checked',
      width: 100,
      render: (checked, record) => (
        <Switch
          checked={checked}
          onChange={(newChecked) => onSwitchChange(record.id, newChecked)}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={employeeData}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      className="bg-white rounded shadow"
    />
  );
};

export default EmployeeTable;