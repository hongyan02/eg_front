import React from 'react';
import { Layout } from 'antd';
import SearchHeader from './SearchHeader';
import DepartmentSider from './DepartmentSider';
import EmployeeTable from './EmployeeTable';

const { Content } = Layout;

const UserLayout = ({
  selectedDepartment,
  employeeData,
  expandedKeys,
  searchDepartmentValue,
  form,
  // 移除 loading 属性
  onDepartmentSearch,
  onDepartmentSelect,
  onSearchFormSubmit,
  onSwitchChange,
  treeData
}) => {
  return (
    <Layout className="min-h-screen">
      <Layout>
        {/* 左侧部门树 */}
        <DepartmentSider 
          selectedDepartment={selectedDepartment}
          expandedKeys={expandedKeys}
          searchDepartmentValue={searchDepartmentValue}
          onDepartmentSearch={onDepartmentSearch}
          onDepartmentSelect={onDepartmentSelect}
          treeData={treeData}
        />
        
        {/* 右侧内容区域 */}
        <Content className="p-6 bg-gray-50">
          {/* 搜索栏 */}
          <div className="bg-white p-4 mb-4 rounded shadow">
            <SearchHeader 
              form={form}
              onSearchFormSubmit={onSearchFormSubmit}
            />
          </div>
          
          {/* 员工表格 - 移除 Spin 组件包裹 */}
          <EmployeeTable 
            employeeData={employeeData}
            onSwitchChange={onSwitchChange}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;