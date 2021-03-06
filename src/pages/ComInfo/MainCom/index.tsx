import React, { useState } from 'react';
import { Table,  Typography, Popconfirm, message } from 'antd';
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

/**
 * 删除评论
 */
async function deleteMainComment(id: string | number) {
  return request<API.Basis>('/Comment/deleteMainComment.php', {
    skipErrorHandler: true,
    method: 'get',
    params: {
      id,
    },
  });
}

const MainCom = () => {
  const [pageCurrent, setPageCurrent] = useState<number>(1);
  const [comData, setComData] = useState<MainComment[]>();

  const { run: getRun } = useRequest(() => getComment(pageCurrent), {
    refreshDeps: [pageCurrent],
    formatResult: (res) => {
      const arr = res.map((item) => {
        return {
          ...item,
          comment: NoToBase64(item.comment),
        };
      });
      setComData(arr);
      return arr;
    },
  });

  const { run: deleteRun } = useRequest(deleteMainComment, {
    manual: true,
    formatResult: ({ code, msg }) => {
      if (code === 0) {
        getRun();
        message.success(msg);
      } else message.error(msg);
    },
  });

  const handleDelete = (id: string | number) => {
    if (comData) {
      deleteRun(id);
    } else {
      console.log('删除错误');
    }
  };

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
      render: (_: any, record: MainComment) => (
        <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.cid)}>
          <Typography.Link>删除</Typography.Link>
        </Popconfirm>
      )
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={comData ?? []}
        pagination={{
          onChange: ChangePage,
          total: comData?.[0]?.allCount ?? 0,
          pageSize: PAGE_SIZE,
          current: pageCurrent,
        }}
      />
    </div>
  );
};

export default MainCom;
