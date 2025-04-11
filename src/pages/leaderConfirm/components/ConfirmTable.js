import React, { useState, useEffect } from 'react';
import { Table, Tag, Tooltip, Button, Modal, Form, Input, Radio, message, Select, Popconfirm } from 'antd';
import { 
  CheckCircleOutlined, 
  QuestionCircleOutlined, 
  DownloadOutlined,
  EditOutlined
} from '@ant-design/icons';
import useAbnormalData from '../hooks/useAbnormalData';
import useConfirmOperations from '../hooks/useConfirmOperations';
import useViolationActions from '../hooks/useViolationActions';

const { TextArea } = Input;

const ConfirmTable = ({ searchParams }) => {
  const { data, loading, error, total, refresh } = useAbnormalData(searchParams);
  const [confirmForm] = Form.useForm();
  const [editingReason, setEditingReason] = useState(null);
  const [reasonText, setReasonText] = useState('');
  // 添加本地保存的原因数据
  const [localReasons, setLocalReasons] = useState({});
  
  // 使用分离出的hook
  const {
    confirmModalVisible,
    confirmLoading,
    handleConfirmChange,
    handleModalCancel,
    handleConfirmSubmit
  } = useConfirmOperations(refresh);
  
  // 使用提交操作的hook，传入本地原因数据
  const { submitViolation } = useViolationActions(refresh, localReasons);
  
  // 当数据刷新时，重置本地原因数据
  useEffect(() => {
    if (data && data.length > 0) {
      const initialReasons = {};
      data.forEach(item => {
        initialReasons[item.id] = item.reason || '';
      });
      setLocalReasons(initialReasons);
    }
  }, [data]);

  // 显示错误信息
  React.useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // 处理提交确认
  const onConfirmSubmit = async () => {
    try {
      const values = await confirmForm.validateFields();
      // 如果当前有编辑中的记录，将其原因添加到values中
      if (editingReason && localReasons[editingReason]) {
        values.reason = localReasons[editingReason];
      }
      handleConfirmSubmit(values, localReasons);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理原因编辑
  const handleReasonEdit = (record) => {
    setEditingReason(record.id);
    setReasonText(localReasons[record.id] || '');
  };

  // 保存原因到本地状态
  const handleReasonSave = (record) => {
    // 更新本地原因数据
    setLocalReasons(prev => ({
      ...prev,
      [record.id]: reasonText
    }));
    
    // 关闭编辑状态
    setEditingReason(null);
    message.success('原因已保存到本地，提交时将一并发送');
  };

  // 导出数据处理函数
  const handleExport = () => {
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
          
          // 处理本地保存的原因
          if (col.dataIndex === 'reason') {
            value = localReasons[item.id] || value;
          }
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

    const BOM = '\uFEFF';
    const csvContent = `${BOM}${headers}\n${rows}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `门禁异常确认数据_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  // 表格列定义
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
      title: '异常确认',
      dataIndex: 'confirmed',
      key: 'confirmed',
      width: 110,
      render: (confirmed, record) => (
        <Select
          defaultValue="yes"
          value={record.confirmed ? 'yes' : 'no'}
          style={{ width: 90 }}
          onChange={(value) => handleConfirmChange(record, value)}
          options={[
            { value: 'yes', label: '是' },
            { value: 'no', label: '否' },
          ]}
        />
      ),
    },
    {
      title: '原因说明',
      dataIndex: 'reason',
      key: 'reason',
      width: 150,
      render: (text, record) => {
        if (editingReason === record.id) {
          return (
            <div className="flex items-center">
              <TextArea 
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                autoSize={{ minRows: 1, maxRows: 3 }}
                style={{ width: '120px' }}
              />
              <Button 
                type="link" 
                size="small" 
                onClick={() => handleReasonSave(record)}
                className="ml-2"
              >
                保存
              </Button>
            </div>
          );
        }
        
        // 显示本地保存的原因或原始原因
        const displayReason = localReasons[record.id] || text;
        
        return (
          <div className="flex items-center">
            <Tooltip placement="topLeft" title={displayReason || '暂无说明'}>
              <span className="truncate max-w-[100px] inline-block">
                {displayReason || <span className="text-gray-400">暂无说明</span>}
              </span>
            </Tooltip>
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleReasonEdit(record)}
              className="ml-2"
            />
          </div>
        );
      },
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
    // 表格列定义中的操作列
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => {
        const reason = localReasons[record.id] || record.reason || '';
        const hasReason = reason.trim().length > 0;
        
        return hasReason ? (
          <Button 
            type="link" 
            onClick={() => submitViolation(record)}
            className="text-blue-500 p-0"
            disabled={record.submitted} // 如果已提交则禁用按钮
          >
            提交
          </Button>
        ) : (
          <Popconfirm
            title="提交失败"
            description="请先填写原因说明再提交"
            okText="去填写"
            cancelText="取消"
            onConfirm={() => handleReasonEdit(record)}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button 
              type="link" 
              className="text-blue-500 p-0"
              disabled={record.submitted} // 如果已提交则禁用按钮
            >
              提交
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        {/* <h2 className="text-lg font-semibold">部门异常确认</h2> */}
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
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          total: total,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ x: 1500 }}
      />
      
      {/* 确认模态框 */}
      <Modal
        title="异常确认"
        open={confirmModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={confirmLoading} 
            onClick={onConfirmSubmit}
          >
            提交
          </Button>,
        ]}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          form={confirmForm}
          layout="vertical"
        >
          <Form.Item
            name="confirmed"
            label="是否确认异常"
            rules={[{ required: true, message: '请选择是否确认异常' }]}
          >
            <Radio.Group>
              <Radio value="yes">确认</Radio>
              <Radio value="no">不确认</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item
            name="submitted"
            label="是否提交"
            rules={[{ required: true, message: '请选择是否提交' }]}
          >
            <Radio.Group>
              <Radio value="yes">提交</Radio>
              <Radio value="no">不提交</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="原因说明"
            rules={[{ required: true, message: '请输入异常原因说明' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="请输入异常原因说明"
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ConfirmTable;