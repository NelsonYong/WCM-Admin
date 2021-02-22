import React, { useState } from 'react';
import { Table, Space, Typography, Divider } from 'antd';
import { request } from 'umi';
import { useRequest } from 'ahooks';
import ModelTags from './ModelTags';

type Columns = {
  dataIndex?: string;
  key: string;
  title: string;
  render?: any;
  width?: string;
};

type ContextInfo = {
  userid: string;
  id: string;
  Mvurl: string;
  text: string;
  title: string;
  date: string;
  type: string;
  titleimg: string;
  recommend: number;
  allCount: number;
};

async function getContext(pageCurrent = 1) {
  return request<ContextInfo[]>('SearchText.php', {
    skipErrorHandler: true,
    method: 'get',
    params: { page: pageCurrent },
  });
}

export default function UserTable() {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [pageCurrent, setPageCurrent] = useState<number>(1);
  const { data } = useRequest(() => getContext(pageCurrent), {
    refreshDeps: [pageCurrent],
    formatResult: (res) => {
      return res;
    },
  });

  const ChangePage = (page: number) => {
    setPageCurrent(page);
  };

  const showModal = (flag?: boolean) => {
    setIsShow(flag ?? true);
  };
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
      width: '40%',
      key: 'title',
    },
    {
      title: '文章类型',
      key: 'type',
      dataIndex: 'type',
    },
    {
      title: '操作',
      key: 'action',
      width: '10%',
      render: () => (
        <Space split={<Divider type="vertical" />} size="middle">
          <Typography.Link>编辑</Typography.Link>
          <Typography.Link>删除</Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ModelTags title={'详情信息'} isShow={isShow} showModal={showModal} />
      <Table
        columns={columns}
        dataSource={data ?? []}
        pagination={{
          total: data?.[0]?.allCount ?? 0,
          pageSize: 10,
          current: pageCurrent,
          onChange: ChangePage,
        }}
      />
    </>
  );
}
