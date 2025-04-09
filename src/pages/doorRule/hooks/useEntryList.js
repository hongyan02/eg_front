import { useState, useEffect } from 'react';
import { message } from 'antd';

const useEntryList = () => {
  const [entryList, setEntryList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEntryList = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://10.22.161.62:8083/api/entry-list/getAllEnableEntry', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.data) {
          setEntryList(result.data.map(item => ({
            value: item.door_code,
            label: item.door_name,
            doorArea: item.door_area,
            doorCode: item.door_code
          })));
        }
      } catch (error) {
        console.error('获取门禁列表失败:', error);
        message.error('获取门禁列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchEntryList();
  }, []);

  return { entryList, loading };
};

export default useEntryList;