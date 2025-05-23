import React, { useState } from 'react';
import { Form, Card } from 'antd';
import SearchHeader from './components/SearchHeader';
import ConfirmTable from './components/ConfirmTable';

const LeaderConfirmPage = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState({});

  const handleSearch = (values) => {
    // 转换搜索参数格式以匹配API需求
    const params = {};
    
    if (values.dateRange && values.dateRange.length === 2) {
      params.data_time_start = values.dateRange[0].format('YYYY-MM-DD');
      params.data_time_end = values.dateRange[1].format('YYYY-MM-DD');
    }
    
    if (values.employeeId) {
      params.username = values.employeeId;
    }
    
    // 部门搜索相关代码已移除
    
    if (values.confirmed) {
      params.is_confirm = values.confirmed === 'yes' ? '1' : '0';
    }
    
    if (values.submitted) {
      params.is_submit = values.submitted === 'yes' ? '1' : '0';
    }
    
    console.log('最终搜索参数:', params);
    setSearchParams(params);
  };

  return (
    <div className="p-6">
      <Card className="mb-6">
        <SearchHeader form={form} onSearchFormSubmit={handleSearch} />
      </Card>
      <Card>
        <ConfirmTable searchParams={searchParams} />
      </Card>
    </div>
  );
};

export default LeaderConfirmPage;