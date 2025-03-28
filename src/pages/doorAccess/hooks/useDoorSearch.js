import { Form } from 'antd';
import { useState } from 'react';

function useDoorSearch(fetchDoorData, setLoading) {
  const [form] = Form.useForm();
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  // 初始化数据
  const initData = (data) => {
    setOriginalData(data);
    setFilteredData(data);
    return data;
  };

  // 处理搜索表单提交
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    setLoading(true);
    
    // 根据搜索条件过滤数据
    const filtered = originalData.filter(item => {
      // 门禁编号搜索 (模糊匹配)
      if (values.doorNumber && !item.door_code.toLowerCase().includes(values.doorNumber.toLowerCase())) {
        return false;
      }
      
      // 门禁区域搜索 (精确匹配)
      if (values.area && item.door_area !== values.area) {
        return false;
      }
      
      // 门禁类型搜索 (精确匹配)
      if (values.type && item.door_type !== values.type) {
        return false;
      }
      
      // 进出类型搜索 (精确匹配)
      if (values.inOutType && item.in_out_type !== values.inOutType) {
        return false;
      }
      
      return true;
    });
    
    setFilteredData(filtered);
    setLoading(false);
    
    return filtered;
  };

  // 处理表单重置
  const handleReset = () => {
    form.resetFields();
    setLoading(true);
    setFilteredData(originalData);
    fetchDoorData();
    setLoading(false);
  };

  return {
    form,
    filteredData,
    initData,
    handleSearch,
    handleReset
  };
}

export default useDoorSearch;