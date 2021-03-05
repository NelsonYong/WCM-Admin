import React, { useState } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Button,
  Space,
  Divider,
} from 'antd';
import { request } from 'umi';
import { useRequest } from 'ahooks';

const PAGE_SIZE = 10;

type UserItem = {
  key: string;
  userid: string;
  password: string;
  username: string;
  sex: string;
  age: number;
  skill: string;
  allCount: number;
};

async function getAllUser(pageCurrent = 1) {
  return request<UserItem[]>('/User/SearchAllUser.php', {
    skipErrorHandler: true,
    method: 'get',
    params: {
      page: pageCurrent,
      pageSize: PAGE_SIZE,
    },
  });
}
const originData: UserItem[] = [];
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: UserItem;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const [pageCurrent, setPageCurrent] = useState(1);

  useRequest(() => getAllUser(pageCurrent), {
    refreshDeps: [pageCurrent],
    formatResult: (res) => {
      setData(res);
      return res;
    },
  });

  const isEditing = (record: UserItem) => record.key === editingKey;

  const edit = (record: Partial<UserItem> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const ChangePage = (page: number) => {
    setPageCurrent(page);
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as UserItem;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        console.log(item);

        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: '账号',
      dataIndex: 'userid',
      editable: false,
    },
    {
      title: '密码',
      dataIndex: 'password',
      editable: true,
    },
    {
      title: '姓名',
      dataIndex: 'username',
      editable: true,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      editable: true,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      defaultSortOrder: 'descend',
      sorter: (a: UserItem, b: UserItem) => a.age - b.age,
      editable: true,
    },
    {
      title: '领域',
      dataIndex: 'skill',
      width: '20%',
      editable: true,
    },
    {
      title: '操作',
      width: '10%',
      dataIndex: 'operation',
      render: (_: any, record: UserItem) => {
        const editable = isEditing(record);
        return editable ? (
          <div style={{ display: 'flex' }}>
            <Button type="primary" onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              保存
            </Button>
            <Popconfirm title="确定取消?" onConfirm={cancel}>
              <Button>取消</Button>
            </Popconfirm>
          </div>
        ) : (
          <Space split={<Divider type="vertical" />}>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              编辑
            </Typography.Link>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              删除
            </Typography.Link>
          </Space>
        );
      },
    },
  ];

  const mergedColumns: any = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: UserItem) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered={false}
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: ChangePage,

          total: data?.[0]?.allCount ?? 0,
          pageSize: PAGE_SIZE,
          current: pageCurrent,
        }}
      />
    </Form>
  );
};

export default EditableTable;
