import { useState, useEffect } from 'react';

const useDepartmentTree = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchDepartmentValue, setSearchDepartmentValue] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [departmentEmployees, setDepartmentEmployees] = useState([]); // 新增：存储部门员工数据

  // 初始加载数据
  useEffect(() => {
    fetchDepartmentTree();
  }, []);

  // 获取部门树数据
  const fetchDepartmentTree = async () => {
    try {
      const response = await fetch('http://10.22.161.62:8083/api/inspection/dept/tree');
      const result = await response.json();
      
      // 从API响应中提取实际的部门树数据
      if (result.code === 200 && Array.isArray(result.data)) {
        setTreeData(result.data);
      } else {
        console.error('获取部门树数据格式不正确:', result);
        setTreeData([]);
      }
    } catch (error) {
      console.error('获取部门树数据失败:', error);
      setTreeData([]);
    }
  };

  // 获取部门员工数据
  const fetchDepartmentEmployees = async (deptId) => {
    try {
      const response = await fetch('http://10.22.161.62:8083/api/inspection/dept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dept_id: deptId }),
      });
      
      const result = await response.json();
      
      if (result.code === 200 && Array.isArray(result.data)) {
        // 处理API返回的员工数据
        const processedData = result.data.map((employee, index) => ({
          id: index + 1, // 添加序号
          employeeId: employee.username,
          name: employee.nickname,
          department: employee.dept_name || employee.deptname || '未知部门', // 修改这里，优先使用dept_name
          checked: employee.status === '1', // 假设status为1表示已稽查
          number: employee.number,
          deptid: employee.deptid,
          rawData: employee // 保存原始数据
        }));
        
        setDepartmentEmployees(processedData);
        return processedData;
      } else {
        console.error('获取部门员工数据格式不正确:', result);
        setDepartmentEmployees([]);
        return [];
      }
    } catch (error) {
      console.error('获取部门员工数据失败:', error);
      setDepartmentEmployees([]);
      return [];
    }
  };

  // 处理部门树的搜索
  const handleDepartmentSearch = (value) => {
    setSearchDepartmentValue(value);
    
    // 搜索时自动展开匹配的节点
    if (value) {
      const expandKeys = findMatchingKeys(treeData, value);
      setExpandedKeys(expandKeys);
    }
  };

  // 查找匹配搜索条件的所有节点的key，用于自动展开
  const findMatchingKeys = (nodes, searchValue) => {
    let keys = [];
    
    const traverse = (nodes, parentKeys = []) => {
      if (!nodes || !Array.isArray(nodes)) return [];
      
      nodes.forEach(node => {
        const deptName = node.dept_name || '';
        const currentKeys = [...parentKeys, node.dept_id];
        
        // 如果当前节点匹配，添加所有父节点key以确保路径展开
        if (deptName.toLowerCase().includes(searchValue.toLowerCase())) {
          keys = [...keys, ...currentKeys];
        }
        
        // 递归处理子节点
        if (node.children && node.children.length > 0) {
          traverse(node.children, currentKeys);
        }
      });
    };
    
    traverse(nodes);
    return [...new Set(keys)]; // 去重
  };

  // 处理部门选择
  const handleDepartmentSelect = (selectedKeys, info) => {
    if (info === 'expand') {
      setExpandedKeys(selectedKeys);
    } else if (selectedKeys.length > 0) {
      const deptId = selectedKeys[0];
      setSelectedDepartment(deptId);
      
      // 当选择部门时，获取该部门的员工数据
      fetchDepartmentEmployees(deptId);
    }
  };

  // 过滤部门树数据
  const filterTreeData = (treeData, searchValue) => {
    if (!searchValue) return treeData;

    const filterNodes = (nodes) => {
      return nodes.filter(node => {
        // 修复：使用 dept_name 而不是 title，并添加安全检查
        const deptName = node.dept_name || '';
        const match = deptName.toLowerCase().includes(searchValue.toLowerCase());
        const childrenMatch = node.children ? filterNodes(node.children).length > 0 : false;
        return match || childrenMatch;
      }).map(node => {
        return {
          ...node,
          children: node.children ? filterNodes(node.children) : []
        };
      });
    };

    return filterNodes(treeData);
  };

  // 获取过滤后的树数据
  const filteredTreeData = filterTreeData(treeData, searchDepartmentValue);

  return {
    selectedDepartment,
    expandedKeys,
    searchDepartmentValue,
    treeData,
    filteredTreeData,
    departmentEmployees, // 新增：返回部门员工数据
    handleDepartmentSearch,
    handleDepartmentSelect,
    fetchDepartmentEmployees, // 新增：暴露获取部门员工数据的方法
    setSelectedDepartment
  };
};

export default useDepartmentTree;