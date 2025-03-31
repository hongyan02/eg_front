import React, { useMemo } from 'react';
import { Layout, ConfigProvider } from 'antd';
import DoorAccessSearch from './components/DoorAccessSearch';
import DoorAccessTable from './components/DoorAccessTable';
import EditDoorModal from './components/EditDoorModal';
import AddDoorModal from './components/AddDoorModal';
import useDoorAccess from './hooks/useDoorAccess';

const { Header, Content } = Layout;

const DoorAccessManagement = () => {
  const {
    doorData,
    loading,
    currentPage,
    form,
    editModalVisible,
    currentRecord,
    editConfirmLoading,
    addModalVisible,
    addConfirmLoading,
    handleSearch,
    handleReset,
    handleAddDoor,
    handleAddCancel,
    handleAddSubmit,
    handleEdit,
    handleEditCancel,
    handleEditSubmit,
    handleDelete,
    handlePageChange,
    handleStatusToggle // 添加状态切换处理函数
  } = useDoorAccess();

  // 提取所有唯一的门禁区域和类型选项
  const areaOptions = useMemo(() => {
    const areas = [...new Set(doorData.map(item => item.door_area).filter(Boolean))];
    return areas.map(area => ({ text: area, value: area }));
  }, [doorData]);
  
  const typeOptions = useMemo(() => {
    const types = [...new Set(doorData.map(item => item.door_type).filter(Boolean))];
    return types.map(type => ({ text: type, value: type }));
  }, [doorData]);

  return (
    <ConfigProvider>
      <Layout className="min-h-screen">
        <Header className="bg-white p-4 shadow-sm">
          <DoorAccessSearch 
            form={form} 
            onSearch={handleSearch} 
            onReset={handleReset}
            doorData={doorData}
          />
        </Header>
        
        <Content className="p-6 bg-gray-50">
          <DoorAccessTable 
            doorData={doorData}
            loading={loading}
            currentPage={currentPage}
            onAddDoor={handleAddDoor}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={handlePageChange}
            onStatusToggle={handleStatusToggle} // 传递状态切换处理函数
          />
          
          {/* 编辑门禁模态框 */}
          <EditDoorModal
            visible={editModalVisible}
            onCancel={handleEditCancel}
            onSubmit={handleEditSubmit}
            confirmLoading={editConfirmLoading}
            record={currentRecord}
            areaOptions={areaOptions}
            typeOptions={typeOptions}
          />
          
          {/* 新增门禁模态框 */}
          <AddDoorModal
            visible={addModalVisible}
            onCancel={handleAddCancel}
            onSubmit={handleAddSubmit}
            confirmLoading={addConfirmLoading}
            areaOptions={areaOptions}
            typeOptions={typeOptions}
          />
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default DoorAccessManagement;