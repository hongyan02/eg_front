import React from 'react';
import { ConfigProvider } from 'antd';
import UserLayout from './components/UserLayout';
import useUserConfig from './hooks/useUserConfig';

const UserConfigPage = () => {
  const {
    selectedDepartment,
    employeeData,
    expandedKeys,
    searchDepartmentValue,
    form,
    // 移除 loading 属性
    handleDepartmentSearch,
    handleDepartmentSelect,
    handleSearchFormSubmit,
    handleSwitchChange,
    filteredTreeData
  } = useUserConfig();

  return (
    <ConfigProvider>
      <UserLayout 
        selectedDepartment={selectedDepartment}
        employeeData={employeeData}
        expandedKeys={expandedKeys}
        searchDepartmentValue={searchDepartmentValue}
        form={form}
        // 移除 loading 属性传递
        onDepartmentSearch={handleDepartmentSearch}
        onDepartmentSelect={handleDepartmentSelect}
        onSearchFormSubmit={handleSearchFormSubmit}
        onSwitchChange={handleSwitchChange}
        treeData={filteredTreeData}
      />
    </ConfigProvider>
  );
};

export default UserConfigPage;