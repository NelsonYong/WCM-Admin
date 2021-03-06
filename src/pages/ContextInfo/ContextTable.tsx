import React, { useState } from 'react';
import { Table, Typography, Popconfirm, message } from 'antd';
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
  return request<API.Basis<ContextInfo[]>>('/Context/SearchText.php', {
    skipErrorHandler: true,
    method: 'get',
    params: { page: pageCurrent },
  });
}

/**
 * 删除文章
 */
async function deleteContext(id: string | number) {
  return request<API.Basis>('/Context/deleteText.php', {
    skipErrorHandler: true,
    method: 'get',
    params: {
      id,
    },
  });
}

export default function UserTable() {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [pageCurrent, setPageCurrent] = useState<number>(1);
  const [textData, setTextData] = useState<ContextInfo[]>();

  const { run: getRun } = useRequest(() => getContext(pageCurrent), {
    refreshDeps: [pageCurrent],
    formatResult: ({ data, code, msg }) => {
      if (code === 0) setTextData(data);
      else message.error(msg);
    },
  });

  const { run: deleteRun } = useRequest(deleteContext, {
    manual:true,
    formatResult: ({ code, msg }) => {
      if (code === 0) {
        getRun();
        message.success(msg);
      } else message.error(msg);
    },
  });

  const ChangePage = (page: number) => {
    setPageCurrent(page);
  };

  const handleDelete = (id: React.Key) => {
    if (textData) {
      // const { id } = textData?.filter((item) => {
      //   return item.id === key;
      // })[0];
      deleteRun(id);
    } else {
      console.log('删除错误');
    }
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
      render: (_: any, record: { key: React.Key }) => (
        <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.key)}>
          <Typography.Link>删除</Typography.Link>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <ModelTags title={'详情信息'} isShow={isShow} showModal={showModal} />
      <Table
        columns={columns}
        dataSource={textData ?? []}
        pagination={{
          total: textData?.[0]?.allCount ?? 0,
          pageSize: 10,
          current: pageCurrent,
          onChange: ChangePage,
        }}
      />
    </>
  );
}
