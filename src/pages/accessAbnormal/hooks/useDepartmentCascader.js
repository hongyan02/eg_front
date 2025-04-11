import { useState, useEffect, useCallback } from 'react';

const useDepartmentCascader = () => {
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 将API返回的树形结构转换为Cascader需要的格式
  const transformTreeData = useCallback((treeData) => {
    if (!treeData || !Array.isArray(treeData)) return [];

    return treeData.map(node => ({
      value: Number(node.dept_id), // 确保部门ID是数字类型
      label: node.dept_name,
      children: node.children && node.children.length > 0 
        ? transformTreeData(node.children) 
        : undefined
    }));
  }, []);

  // 使用 useCallback 包装 fetchDepartmentTree 函数
  const fetchDepartmentTree = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://10.22.161.62:8083/api/inspection/dept/tree');
      const result = await response.json();
      
      if (result.code === 200 && Array.isArray(result.data)) {
        const transformedData = transformTreeData(result.data);
        setDepartmentOptions(transformedData);
      } else {
        setError('获取部门树数据格式不正确');
        setDepartmentOptions([]);
      }
    } catch (error) {
      setError('获取部门树数据失败');
      setDepartmentOptions([]);
    } finally {
      setLoading(false);
    }
  }, [transformTreeData]);  // 添加 transformTreeData 作为依赖

  // 修复 useEffect 依赖
  useEffect(() => {
    fetchDepartmentTree();
  }, [fetchDepartmentTree]);  // 添加 fetchDepartmentTree 作为依赖

  return {
    departmentOptions,
    loading,
    error,
    refreshDepartmentTree: fetchDepartmentTree
  };
};

export default useDepartmentCascader;