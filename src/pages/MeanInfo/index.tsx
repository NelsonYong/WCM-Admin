import React, { useState } from 'react';
import { Table, Space, Typography, Popconfirm, message } from 'antd';
import { request } from 'umi';
import { useRequest } from 'ahooks';
import Search from 'antd/lib/input/Search';

type Columns = {
  dataIndex?: string;
  key: string;
  title: string;
  render?: any;
};

type Mean = {
  id: string;
  userid: string;
  title: string;
  desc1: string;
  desc2: string;
  desc3: string;
  desc4: string;
  url: string;
  type: string;
  allCount: number;
};

const PAGE_SIZE = 10;

/**
 * 获取资料
 */

async function getMean(pageCurrent = 1, type_ = '00') {
  return request<API.Basis<Mean[]>>('/Mean/getMean.php', {
    skipErrorHandler: true,
    method: 'get',
    params: {
      pageSize: PAGE_SIZE,
      page: pageCurrent,
      type: type_,
    },
  });
}

/**
 * 删除资料
 */
async function deleteMean(id: string | number) {
  return request<API.Basis>('/Mean/deleteMean.php', {
    skipErrorHandler: true,
    method: 'get',
    params: {
      id,
    },
  });
}

const MeanInfo = () => {
  const [pageCurrent, setPageCurrent] = useState<number>(1);
  const [type, setType] = useState<string>('00');
  const [meanData, setMeanData] = useState<Mean[]>();

  const { run: getRun } = useRequest(() => getMean(pageCurrent, type), {
    refreshDeps: [pageCurrent, type],
    onSuccess: ({ data, code, msg }) => {
      if (code === 0) setMeanData(data);
      else {
        message.error(msg);
      }
    },
  });

  const { run: deleteRun } = useRequest(deleteMean, {
    manual: true,
    onSuccess: ({ code, msg }) => {
      if (code === 0) {
        getRun();
        message.success(`delete ${msg}`);
        return;
      }
      message.error(msg);
    },
  });

  const ChangePage = (page: number) => {
    setPageCurrent(page);
  };

  const onSearch = (text: string) => {
    setPageCurrent(1);
    setType(text === '' ? '00' : text);
  };

  const handleDelete = (key: React.Key) => {
    if (meanData) {
      const { id } = meanData?.filter((item) => {
        return item.id === key;
      })[0];
      deleteRun(id);
    } else {
      console.log('删除错误');
    }
  };

  const columns: Columns[] = [
    {
      title: '用户ID',
      dataIndex: 'userid',
      key: 'userid',
    },
    {
      title: '资料卡标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '描述一',
      dataIndex: 'desc1',
      key: 'desc1',
    },
    {
      title: '描述二',
      dataIndex: 'desc2',
      key: 'desc2',
    },
    {
      title: '描述三',
      dataIndex: 'desc3',
      key: 'desc3',
    },
    {
      title: '描述四',
      dataIndex: 'desc4',
      key: 'desc4',
    },
    {
      title: '地址',
      dataIndex: 'url',
      key: 'url',
      render: (text: string) => {
        return <a href={text}>{text}</a>;
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },

    {
      title: '操作',
      key: 'action',
      render: (_: any, record: { key: React.Key }) => (
        <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.key)}>
          <Typography.Link>删除</Typography.Link>
        </Popconfirm>
      ),
    },
  ];
  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Search
          placeholder="请输入type 00|01|02|"
          allowClear
          enterButton="搜索"
          size="middle"
          style={{
            width: '20%',
          }}
          onSearch={onSearch}
        />
        <Table
          columns={columns}
          dataSource={meanData ?? []}
          pagination={{
            onChange: ChangePage,
            total: meanData?.[0]?.allCount ?? 0,
            pageSize: PAGE_SIZE,
            current: pageCurrent,
          }}
        />
      </Space>
    </div>
  );
};

export default MeanInfo;
