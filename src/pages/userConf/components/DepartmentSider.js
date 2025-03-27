import React from 'react';
import { Layout, Input, Tree } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

const { Sider } = Layout;
const { Search } = Input;

const DepartmentSider = ({
  selectedDepartment,
  expandedKeys,
  searchDepartmentValue,
  onDepartmentSearch,
  onDepartmentSelect,
  treeData
}) => {
  return (
    <Sider width={300} theme="light" className="overflow-auto">
      <div className="p-4">
        <Search
          placeholder="请输入部门名称"
          onSearch={onDepartmentSearch}
          onChange={(e) => onDepartmentSearch(e.target.value)}
          className="mb-4"
          value={searchDepartmentValue}
        />
        <Tree
          showLine={{ showLeafIcon: false }}
          switcherIcon={<CaretRightOutlined />}
          onSelect={onDepartmentSelect}
          fieldNames={{ title: 'dept_name', key: 'dept_id', children: 'children' }}
          treeData={treeData}
          selectedKeys={[selectedDepartment]}
          expandedKeys={expandedKeys}
          onExpand={(keys) => onDepartmentSelect(keys, 'expand')}
          className="department-tree"
        />
      </div>
    </Sider>
  );
};

export default DepartmentSider;