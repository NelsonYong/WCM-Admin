import React, { useState } from 'react';
import { Table, Typography, message, Popconfirm } from 'antd';
import { request } from 'umi';
import { useRequest } from 'ahooks';
import { NoToBase64 } from '@/common/utils';

type Columns = {
  dataIndex?: string;
  key: string;
  title: string;
  render?: any;
};

type ChildComment = {
  key: string,
  userid: string;
  aid: string;
  cid: string;
  comment: string;
  tid: string,
  allCount: number;
};

const PAGE_SIZE = 10;

/**
 * 获取文章子评论
 */

async function getComment(pageCurrent = 1) {
  return request<ChildComment[]>('/Comment/getChildrenComment.php', {
    skipErrorHandler: true,
    method: 'get',
    params: {
      pageSize: PAGE_SIZE,
      page: pageCurrent,
    },
  });
}


/**
 * 删除子评论
 */
async function deleteChildComment(id: string | number) {
  return request<API.Basis>('/Comment/deleteChildComment.php', {
    skipErrorHandler: true,
    method: 'get',
    params: {
      id,
    },
  });
}

const ChildrenCom = () => {
  const [pageCurrent, setPageCurrent] = useState<number>(1);
  const [comData, setComData] = useState<ChildComment[]>();

  const { run:getRun } = useRequest(() => getComment(pageCurrent), {
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

  const { run: deleteRun } = useRequest(deleteChildComment, {
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
      render: (_: any, record: ChildComment) => (
        <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.key)}>
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

export default ChildrenCom;
