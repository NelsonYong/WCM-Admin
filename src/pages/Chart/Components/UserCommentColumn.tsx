import React from 'react';
import { Bar } from '@ant-design/charts';
import type { BarConfig } from '@ant-design/charts/es/bar';
import { Card } from 'antd';

const DemoBar: React.FC = () => {
  const data = [
    {
      year: '1951 年',
      value: 38,
    },
    {
      year: '1952 年',
      value: 52,
    },
    {
      year: '1956 年',
      value: 61,
    },
    {
      year: '1957 年',
      value: 145,
    },
    {
      year: '1958 年',
      value: 48,
    },
  ];
  const config: BarConfig = {
    data,
    xField: 'value',
    yField: 'year',
    seriesField: 'year',
    legend: { position: 'top-left' },
  };
  return (
    <Card title="前十评论文章名" bordered={false} className="h-full">
      <Bar {...config} />
    </Card>
  );
};
export default DemoBar;
