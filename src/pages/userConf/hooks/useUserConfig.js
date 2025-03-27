import { Form, message } from 'antd';
import { useState, useEffect } from 'react';
import useDepartmentTree from './useDepartmentTree';

const useUserConfig = () => {
  const [form] = Form.useForm();
  const [employeeDataWithStatus, setEmployeeDataWithStatus] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchValues, setSearchValues] = useState(null);
  const [loading, setLoading] = useState(false); // 添加loading状态
  
  // 使用分离出来的部门树 hook
  const {
    selectedDepartment,
    expandedKeys,
    searchDepartmentValue,
    filteredTreeData,
    departmentEmployees, // 新增：获取部门员工数据
    handleDepartmentSearch,
    handleDepartmentSelect
  } = useDepartmentTree();

  // 获取用户稽查状态
  const fetchUserInspectionStatus = async (userId) => {
    try {
      const response = await fetch('http://10.22.161.62:8083/api/inspection/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: userId
        }),
      });
      
      const result = await response.json();
      
      if (result.code === 200) {
        // 修改返回值：0为打开，1为关闭
        return result.data.is_inspection === "0";
      } else {
        console.error('获取用户稽查状态失败:', result.msg);
        return false;
      }
    } catch (error) {
      console.error('获取用户稽查状态出错:', error);
      return false;
    }
  };

  // 当部门员工数据更新时，获取每个员工的稽查状态
  useEffect(() => {
    const updateEmployeesStatus = async () => {
      if (!departmentEmployees || departmentEmployees.length === 0) {
        setEmployeeDataWithStatus([]);
        return;
      }

      try {
        setLoading(true); // 开始加载
        // 创建一个包含所有员工数据的新数组
        const updatedEmployees = [...departmentEmployees];
        
        // 分批次处理，每批10个
        const batchSize = 10;
        const batches = Math.ceil(updatedEmployees.length / batchSize);
        
        for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
          const startIndex = batchIndex * batchSize;
          const endIndex = Math.min(startIndex + batchSize, updatedEmployees.length);
          const batchPromises = [];
          
          // 为当前批次的每个员工创建请求
          for (let i = startIndex; i < endIndex; i++) {
            const employee = updatedEmployees[i];
            batchPromises.push(
              fetchUserInspectionStatus(employee.employeeId)
                .then(isInspection => {
                  updatedEmployees[i] = {
                    ...employee,
                    checked: isInspection
                  };
                })
            );
          }
          
          // 等待当前批次的所有请求完成
          await Promise.all(batchPromises);
          
          // 更新状态，显示已加载的部分
          setEmployeeDataWithStatus([...updatedEmployees]);
        }
      } catch (error) {
        console.error('更新员工稽查状态失败:', error);
        message.error('获取员工稽查状态失败');
        // 如果出错，仍然使用原始数据
        setEmployeeDataWithStatus(departmentEmployees);
      } finally {
        setLoading(false); // 结束加载
      }
    };

    updateEmployeesStatus();
  }, [departmentEmployees]);

  // 当员工数据或搜索条件变化时，应用搜索过滤
  useEffect(() => {
    if (!employeeDataWithStatus.length) {
      setFilteredEmployees([]);
      return;
    }

    if (!searchValues) {
      setFilteredEmployees(employeeDataWithStatus);
      return;
    }

    // 应用搜索过滤
    const filtered = employeeDataWithStatus.filter(employee => {
      // 按部门名称过滤
      if (searchValues.department && 
          !employee.department?.toLowerCase().includes(searchValues.department.toLowerCase())) {
        return false;
      }
      
      // 按姓名过滤
      if (searchValues.name && 
          !employee.name?.toLowerCase().includes(searchValues.name.toLowerCase())) {
        return false;
      }
      
      // 按状态过滤
      if (searchValues.status) {
        if (searchValues.status === 'active' && !employee.checked) return false;
        if (searchValues.status === 'inactive' && employee.checked) return false;
      }
      
      return true;
    });
    
    setFilteredEmployees(filtered);
  }, [employeeDataWithStatus, searchValues]);

  // 处理搜索表单提交
  const handleSearchFormSubmit = (values) => {
    console.log('Search form values:', values);
    setSearchValues(values);
  };

  // 处理开关变化
  const handleSwitchChange = async (id, newChecked) => {
    // 找到要更新的员工记录
    const employee = employeeDataWithStatus.find(item => item.id === id);
    if (!employee) return;

    try {
      // 调用API更新用户稽查状态
      const response = await fetch('http://10.22.161.62:8083/api/inspection/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: employee.employeeId,
          is_inspection: newChecked ? "0" : "1" // 0为打开，1为关闭
        }),
      });
      
      const result = await response.json();
      
      if (result.code === 200) {
        // 更新本地状态
        const newData = employeeDataWithStatus.map(item => 
          item.id === id ? { ...item, checked: newChecked } : item
        );
        setEmployeeDataWithStatus(newData);
        
        message.success('更新稽查状态成功');
        console.log('更新员工状态:', employee, '新状态:', newChecked);
      } else {
        message.error('更新稽查状态失败: ' + (result.msg || '未知错误'));
        console.error('更新稽查状态失败:', result);
      }
    } catch (error) {
      message.error('更新稽查状态失败: ' + (error.message || '未知错误'));
      console.error('更新员工状态失败:', error);
    }
  };

  return {
    selectedDepartment,
    employeeData: filteredEmployees.length > 0 ? filteredEmployees : employeeDataWithStatus, // 使用过滤后的员工数据
    expandedKeys,
    searchDepartmentValue,
    form,
    loading, // 返回loading状态
    handleDepartmentSearch,
    handleDepartmentSelect,
    handleSearchFormSubmit,
    handleSwitchChange,
    filteredTreeData
  };
};

export default useUserConfig;