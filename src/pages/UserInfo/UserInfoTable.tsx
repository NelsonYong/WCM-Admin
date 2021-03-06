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
  message,
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

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: UserItem;
  index: number;
  children: React.ReactNode;
}

/**
 * 获取用户
 */
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

/**
 * 删除用户
 */
async function deleteUser(id: string | number) {
  return request<API.Basis>('/User/deleteUser.php', {
    skipErrorHandler: true,
    method: 'get',
    params: {
      id,
    },
  });
}

/**
 * 修改用户
 */
async function editUser(info: Omit<UserItem, "key"|"password"|"allCount">) {
  return request<API.Basis>('/User/deleteUser.php', {
    skipErrorHandler: true,
    method: 'post',
    params: {
      ...info,
    },
  });
}

const originData: UserItem[] = [];

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

const UserInfoTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const [pageCurrent, setPageCurrent] = useState(1);

  const { run: getRun } = useRequest(() => getAllUser(pageCurrent), {
    refreshDeps: [pageCurrent],
    formatResult: (res) => {
      setData(res);
      return res;
    },
  });

  const { run: deleteRun } = useRequest(deleteUser, {
    manual: true,
    formatResult: ({ code, msg }) => {
      if (code === 0) {
        getRun();
        message.success(msg);
      } else message.error(msg);
    },
  });

  const { run: editRun } = useRequest(editUser, {
    manual: true,
    formatResult: ({ code, msg }): number => {
      if (code === 0) {
        getRun();
        message.success(msg);
        return 0;
      }
      message.error(msg);
      return -1;
    },
  });

  const isEditing = (record: UserItem) => record.key === editingKey;

  const edit = (record: Partial<UserItem> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key);
  };

  const handleDelete = (id: number | string) => {
    if (data) {
      deleteRun(id);
    } else {
      console.log('删除错误');
    }
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
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        const { userid, username, sex, age, skill } = item;
        editRun({ userid, username, sex, age, skill }).then((res) => {
          if (res === 0) {
            setData(newData);
            setEditingKey('');
          } else {
            message.error('修改失败');
          }
        });
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
      editable: false,
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
      // defaultSortOrder: 'descend',
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
            <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.key)}>
              <Typography.Link>删除</Typography.Link>
            </Popconfirm>
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

export default UserInfoTable;
