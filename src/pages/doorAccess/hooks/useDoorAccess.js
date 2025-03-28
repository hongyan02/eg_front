import useDoorData from './useDoorData';
import useDoorSearch from './useDoorSearch';
import useEditDoor from './useEditDoor';
import useDeleteDoor from './useDeleteDoor';
import useAddDoor from './useAddDoor';
import { useEffect, useState } from 'react';

function useDoorAccess() {
  // 添加一个状态来跟踪是否已执行搜索
  const [hasSearched, setHasSearched] = useState(false);
  
  // 使用数据加载 hook
  const {
    doorData,
    setDoorData,
    loading,
    setLoading,
    currentPage,
    fetchDoorData,
    handlePageChange
  } = useDoorData();

  // 使用搜索功能 hook，传入原始数据和设置数据的函数
  const {
    form,
    filteredData,
    initData,
    handleSearch,
    handleReset
  } = useDoorSearch(fetchDoorData, setLoading);

  // 初始化搜索数据 - 只在未搜索过的情况下初始化
  if (doorData.length > 0 && filteredData.length === 0 && !hasSearched) {
    initData(doorData);
  }
  
  // 添加调试代码，监控数据变化
  useEffect(() => {
    console.log('doorData 长度:', doorData.length);
    console.log('filteredData 长度:', filteredData.length);
    console.log('是否已搜索:', hasSearched);
  }, [doorData, filteredData, hasSearched]);

  // 包装搜索函数，确保正确处理
  const wrappedHandleSearch = (values) => {
    setHasSearched(true); // 标记已执行搜索
    const result = handleSearch(values);
    console.log('搜索结果长度:', result.length);
    return result;
  };

  // 包装重置函数
  const wrappedHandleReset = () => {
    setHasSearched(false); // 重置搜索状态
    handleReset();
  };

  // 自定义更新本地数据的函数
  const updateLocalData = (updatedRecord) => {
    // 更新 doorData
    const newDoorData = doorData.map(item => 
      item.id === updatedRecord.id ? updatedRecord : item
    );
    setDoorData(newDoorData);
    
    // 如果已经搜索过，也更新 filteredData
    if (hasSearched || filteredData.length > 0) {
      initData(newDoorData);
      // 如果当前有搜索条件，重新应用搜索
      if (hasSearched) {
        const formValues = form.getFieldsValue();
        handleSearch(formValues);
      }
    }
  };

  // 使用编辑门禁 hook
  const {
    editModalVisible,
    currentRecord,
    confirmLoading: editConfirmLoading,
    handleEdit,
    handleEditCancel,
    handleEditSubmit
  } = useEditDoor(fetchDoorData); // 传入 fetchDoorData 函数

  // 使用新增门禁 hook
  const {
    addModalVisible,
    confirmLoading: addConfirmLoading,
    handleAddDoor,
    handleAddCancel,
    handleAddSubmit
  } = useAddDoor(fetchDoorData);

  // 包装编辑提交函数，添加本地数据更新
  const wrappedHandleEditSubmit = async (values) => {
    const result = await handleEditSubmit(values);
    if (result && result.success) {
      // 编辑成功，更新本地数据
      updateLocalData(values);
    }
    return result;
  };

  // 使用删除门禁 hook
  const {
    deleteLoading,
    handleDelete
  } = useDeleteDoor(doorData, setDoorData, fetchDoorData);

  // 包装删除函数，确保同时更新 filteredData
  const wrappedHandleDelete = async (key) => {
    await handleDelete(key);
  };

  return {
    doorData: hasSearched ? filteredData : doorData,
    loading,
    currentPage,
    form,
    editModalVisible,
    currentRecord,
    editConfirmLoading,
    addModalVisible,
    addConfirmLoading,
    handleSearch: wrappedHandleSearch,
    handleReset: wrappedHandleReset,
    handleAddDoor,
    handleAddCancel,
    handleAddSubmit,
    handleEdit,
    handleEditCancel,
    handleEditSubmit: wrappedHandleEditSubmit,
    handleDelete: wrappedHandleDelete,
    handlePageChange
  };
}

export default useDoorAccess;