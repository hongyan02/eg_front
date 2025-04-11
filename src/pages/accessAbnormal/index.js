import React, { useState } from 'react';
import { Form, Card } from 'antd';
import SearchHeader from './components/SearchHeader';
import AbnormalTable from './components/AbnormalTable';

const AccessAbnormalPage = () => {
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
    
    if (values.department && Array.isArray(values.department) && values.department.length > 0) {
      // 只获取数组中的最后一个元素（最后一级部门ID）
      const lastDeptId = values.department[values.department.length - 1];
      // 将部门ID转换为数字类型
      params.dept_id = Number(lastDeptId);
      console.log('选择的最后一级部门ID:', params.dept_id, typeof params.dept_id);
    }
    
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
        <AbnormalTable searchParams={searchParams} />
      </Card>
    </div>
  );
};

export default AccessAbnormalPage;