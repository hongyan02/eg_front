import React from 'react';
import { Table, Tag, Tooltip, Button, Modal, Form, Input, Radio, message, Select } from 'antd';
import { 
  CheckCircleOutlined, 
  QuestionCircleOutlined, 
  DownloadOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import useAbnormalData from '../hooks/useAbnormalData';
import useConfirmOperations from '../hooks/useConfirmOperations';
import useViolationActions from '../hooks/useViolationActions';

const { TextArea } = Input;

const ConfirmTable = ({ searchParams }) => {
  const { data, loading, error, total, refresh } = useAbnormalData(searchParams);
  const [confirmForm] = Form.useForm();
  
  // 使用分离出的hook
  const {
    confirmModalVisible,
    confirmLoading,
    handleConfirmChange,
    handleModalCancel,
    handleConfirmSubmit
  } = useConfirmOperations(refresh);
  
  // 使用提交和撤回操作的hook
  const { submitViolation, withdrawViolation } = useViolationActions(refresh);
  
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
      handleConfirmSubmit(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
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
        if (col.dataIndex === 'confirmed') {
          return item.confirmed ? '已确认' : '未确认';
        }
        if (col.dataIndex === 'submitted') {
          return item.submitted ? '已提交' : '未提交';
        }
        const value = item[col.dataIndex] || '';
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
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
      title: '异常确认',
      dataIndex: 'confirmed',
      key: 'confirmed',
      width: 120,
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
    {
      title: '操作',
      key: 'action',
      width: 150, // 增加宽度以容纳两个按钮
      render: (_, record) => (
        record.submitted ? 
          <Button 
            type="link" 
            icon={<RollbackOutlined />}
            onClick={() => withdrawViolation(record)}
            className="text-orange-500 p-0"
          >
            撤回
          </Button> : 
          <Button 
            type="link" 
            onClick={() => submitViolation(record)}
            className="text-blue-500 p-0"
          >
            提交
          </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">部门异常确认</h2>
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