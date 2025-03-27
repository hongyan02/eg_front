import React from 'react';
import { Table, Tag, Tooltip, message, Button } from 'antd';
import { CheckCircleOutlined, QuestionCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import useAbnormalData from '../hooks/useAbnormalData';

const AbnormalTable = ({ searchParams }) => {
  const { data, loading, error, total } = useAbnormalData(searchParams);
  
  // 显示错误信息
  React.useEffect(() => {
    if (error) {
      message.error(error);
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
        // 处理特殊字段的显示
        if (col.dataIndex === 'confirmed') {
          return item.confirmed ? '已确认' : '未确认';
        }
        if (col.dataIndex === 'submitted') {
          return item.submitted ? '已提交' : '未提交';
        }
        // 处理可能包含逗号的字段，用双引号包裹
        const value = item[col.dataIndex] || '';
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
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
      width: 100,
    },
    {
      title: '工号',
      dataIndex: 'employeeId',
      key: 'employeeId',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 80,
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
      width: 100,
    },
    {
      title: '出场时间',
      dataIndex: 'exitTime',
      key: 'exitTime',
      width: 100,
    },
    {
      title: '出场门禁名称',
      dataIndex: 'exitAccessName',
      key: 'exitAccessName',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: '入场时间',
      dataIndex: 'entryTime',
      key: 'entryTime',
      width: 100,
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
      width: 120,
    },
    {
      title: '部门负责人',
      dataIndex: 'departmentManager',
      key: 'departmentManager',
      width: 100,
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
        dataSource={data} 
        rowKey="id"
        loading={loading}
        scroll={{ x: 1500 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          defaultPageSize: 10,
          total: total,
        }}
      />
    </div>
  );
};

export default AbnormalTable;