import React, { useEffect, useState } from 'react';
import { Table, Tag, Tooltip, message, Button } from 'antd';
import { CheckCircleOutlined, QuestionCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import useAbnormalData from '../hooks/useAbnormalData';

const AbnormalTable = ({ searchParams }) => {
  const { data, loading, error, total } = useAbnormalData(searchParams);
  const [tableData, setTableData] = useState([]);
  const [tableTotal, setTableTotal] = useState(0);
  
  // 当 data 和 total 变化时更新表格数据和总数
  useEffect(() => {
    // 确保 data 是数组且有内容，否则设置为空数组
    setTableData(Array.isArray(data) && data.length > 0 ? data : []);
    // 同时更新总数
    setTableTotal(Array.isArray(data) && data.length > 0 ? total : 0);
  }, [data, total]);
  
  // 显示错误信息
  React.useEffect(() => {
    if (error) {
      message.error(error);
      // 出错时清空表格数据和总数
      setTableData([]);
      setTableTotal(0);
    }
  }, [error]);

  // 导出数据处理函数
  const handleExport = () => {
    // 如果没有数据，提示用户
    if (!data || data.length === 0) {
      message.warning('没有可导出的数据');
      return;
    }

    // 创建CSV内容
    const headers = columns.map(col => col.title).join(',');
    const rows = data.map(item => {
      return columns.map(col => {
        let value = '';
        
        // 特殊处理某些列
        if (col.dataIndex === 'confirmed') {
          value = item.confirmed ? '已确认' : '未确认';
        } else if (col.dataIndex === 'submitted') {
          value = item.submitted ? '已提交' : '未提交';
        } else {
          // 获取原始值，如果为空则使用空字符串
          value = item[col.dataIndex] || '';
        }
        
        // 将值转换为字符串并处理特殊字符
        const strValue = String(value);
        
        // 如果包含逗号、引号或换行符，需要用引号包裹并处理内部引号
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n') || strValue.includes('\r')) {
          // 将内部的引号替换为两个引号（CSV标准）
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        
        return strValue;
      }).join(',');
    }).join('\n');

    // 添加UTF-8 BOM头，确保Excel正确识别中文
    const BOM = '\uFEFF';
    const csvContent = `${BOM}${headers}\n${rows}`;
    
    // 使用UTF-8编码创建Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // 创建下载链接并点击
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `门禁异常数据_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 释放URL对象
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  // 表格列定义
  // 修改表格列定义中的异常确认列
  const columns = [
    {
      title: '异常日期',
      dataIndex: 'abnormalDate',
      key: 'abnormalDate',
      width: 120,
    },
    {
      title: '工号',
      dataIndex: 'employeeId',
      key: 'employeeId',
      width: 90,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 90,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: '异常时间',
      dataIndex: 'abnormalTime',
      key: 'abnormalTime',
      width: 110,
    },
    {
      title: '出场时间',
      dataIndex: 'exitTime',
      key: 'exitTime',
      width: 110,
    },
    {
      title: '出场门禁名称',
      dataIndex: 'exitAccessName',
      key: 'exitAccessName',
      width: 120,
      // ellipsis: {
      //   showTitle: false,
      // },
      // render: (text) => (
      //   <Tooltip placement="topLeft" title={text}>
      //     {text}
      //   </Tooltip>
      // ),
    },
    {
      title: '入场时间',
      dataIndex: 'entryTime',
      key: 'entryTime',
      width: 110,
    },
    {
      title: '入场门禁编号',
      dataIndex: 'entryAccessId',
      key: 'entryAccessId',
      width: 120,
    },
    {
      title: '异常规则编号',
      dataIndex: 'abnormalRuleId',
      key: 'abnormalRuleId',
      width: 150,
    },
    {
      title: '部门负责人',
      dataIndex: 'departmentManager',
      key: 'departmentManager',
      width: 110,
    },
    {
      title: '异常确认',
      dataIndex: 'confirmed',
      key: 'confirmed',
      width: 100,
      render: (confirmed) => (
        confirmed ? 
          <Tag color="success">是</Tag> : 
          <Tag color="error">否</Tag>
      ),
    },
    {
      title: '原因说明',
      dataIndex: 'reason',
      key: 'reason',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text || '暂无说明'}>
          {text || <span className="text-gray-400">暂无说明</span>}
        </Tooltip>
      ),
    },
    {
      title: '是否提交',
      dataIndex: 'submitted',
      key: 'submitted',
      width: 100,
      render: (submitted) => (
        submitted ? 
          <Tag icon={<CheckCircleOutlined />} color="success">已提交</Tag> : 
          <Tag icon={<QuestionCircleOutlined />} color="warning">未提交</Tag>
      ),
    },
    // 删除操作列
  ];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={handleExport}
          className="bg-green-600"
        >
          导出数据
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={tableData}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1500 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          defaultPageSize: 10,
          total: tableTotal, 
        }}
      />
    </div>
  );
};

export default AbnormalTable;