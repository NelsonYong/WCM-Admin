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
  return request<MainComment[]>('/Comment/getChildrenComment.php', {
    skipErrorHandler: true,
    method: 'get',
    params: {
      pageSize: PAGE_SIZE,
      page: pageCurrent,
    },
  });
}

const ChildrenCom = () => {
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
      title: '评论ID',
      key: 'cid',
      dataIndex: 'cid',
    },
    {
      title: '发送评论用户ID',
      dataIndex: 'userid',
      key: 'userid',
    },
    {
      title: '子评论ID',
      dataIndex: 'com_cid',
      key: 'aid',
    },
    {
      title: '子评论内容',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: '被回复人ID',
      dataIndex: 'tid',
      key: 'tid',
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

export default ChildrenCom;
