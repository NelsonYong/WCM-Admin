import React, { useState } from 'react';
import { Table, Space, Divider, Typography } from 'antd';
import { request } from 'umi';
import { useRequest } from 'ahooks';
import { NoToBase64 } from '@/common/utils';

type Columns = {
  dataIndex?: string;
  key: string;
  title: string;
  render?: any;
};

type MainComment = {
  date: string;
  userid: string;
  aid: string;
  cid: string;
  comment: string;
  allCount: number;
};

const PAGE_SIZE = 10;

/**
 * 获取文章主评论
 */

async function getComment(pageCurrent = 1) {
  return request<MainComment[]>('/Comment/getMainComment.php', {
    skipErrorHandler: true,
    method: 'get',
    params: {
      pageSize: PAGE_SIZE,
      page: pageCurrent,
    },
  });
}

const MainCom = () => {
  const [pageCurrent, setPageCurrent] = useState<number>(1);
  const { data } = useRequest(() => getComment(pageCurrent), {
    refreshDeps: [pageCurrent],
    formatResult: (res) => {
      const arr = res.map((item) => {
        return {
          ...item,
          comment: NoToBase64(item.comment),
        };
      });
      return arr;
    },
  });

  const ChangePage = (page: number) => {
    setPageCurrent(page);
  };
  const columns: Columns[] = [
    {
      title: '日期',
      key: 'date',
      dataIndex: 'date',
    },
    {
      title: '用户ID',
      dataIndex: 'userid',
      key: 'userid',
    },
    {
      title: '评论对应文章ID',
      dataIndex: 'aid',
      key: 'aid',
    },
    {
      title: '评论ID',
      dataIndex: 'cid',
      key: 'cid',
    },
    {
      title: '评论内容',
      dataIndex: 'comment',
      key: 'comment',
    },

    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space split={<Divider type="vertical" />} size="middle">
          <Typography.Link>删除</Typography.Link>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={data ?? []}
        pagination={{
          onChange: ChangePage,
          total: data?.[0]?.allCount ?? 0,
          pageSize: PAGE_SIZE,
          current: pageCurrent,
        }}
      />
    </div>
  );
};

export default MainCom;
