import React from 'react';
import { Table, Space } from 'antd';
import { request } from 'umi';
import { useRequest } from 'ahooks';

type Columns = {
  dataIndex?: string;
  key: string;
  title: string;
  render?: any;
};

type Userinfo = {
  userid: string;
  id: string;
  Mvurl: string;
  text: string;
  title: string;
  date: string;
  type: string;
  titleimg: string;
  recommend: number;
};

async function getContext() {
  return request<Userinfo[]>('SearchText.php', { skipErrorHandler: true });
}

export default function UserTable() {
  const { data } = useRequest(() => getContext(), {
    formatResult: (res) => {
      return res;
    },
  });
  const columns: Columns[] = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '用户ID',
      dataIndex: 'userid',
      key: 'userid',
    },
    {
      title: '文章ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
    },
    // {
    //   title: '文章封面',
    //   key: 'titleimg',
    //   dataIndex: 'titleimg',
    // },

    {
      title: '文章类型',
      key: 'type',
      dataIndex: 'type',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>查看</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data ?? []} />;
}
