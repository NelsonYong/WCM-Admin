import React from 'react';
import { Card } from 'antd';

import { Table } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: 150,
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

let data: readonly any[] | undefined=[];
for (let i = 0; i < 100; i += 1) {
  data = [
    ...data,
    {
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    },
  ];
}

const LoginChart = () => {
  return (
    <Card title="登录人员概况" bordered={false}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 280 }}
      />
    </Card>
  );
};

export default LoginChart;
