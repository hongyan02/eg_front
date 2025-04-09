import { useState, useEffect } from 'react';
import { message } from 'antd';

function useEntryCodeList() {
  const [entryCodeList, setEntryCodeList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取门禁编号列表
  const fetchEntryCodeList = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://10.22.161.62:8083/api/entry-list/getEntryCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      
      if (result && Array.isArray(result.data)) {
        // 将数据转换为 Select 组件需要的格式
        const options = result.data.map(item => ({
          label: item.entry_code,
          value: item.entry_code
        }));
        
        setEntryCodeList(options);
      } else {
        console.error('获取门禁编号列表格式不正确:', result);
        setEntryCodeList([]);
      }
    } catch (error) {
      console.error('获取门禁编号列表失败:', error);
      message.error('获取门禁编号列表失败');
      setEntryCodeList([]);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchEntryCodeList();
  }, []);

  return {
    entryCodeList,
    loading,
    fetchEntryCodeList
  };
}

export default useEntryCodeList;