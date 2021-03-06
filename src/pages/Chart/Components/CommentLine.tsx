import React, { useState } from 'react';
import { Line } from '@ant-design/charts';
import type { LineConfig } from '@ant-design/charts/es/line';
import { Card, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';

const CommentLine: React.FC = () => {
  const [date, setDate] = useState<string>('周');
  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];
  const handleSizeChange = (e: RadioChangeEvent) => {
    setDate(e.target.value);
  };
  const config: LineConfig = {
    data,
    appendPadding:10,
    height: 400,
    xField: 'year',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
  };
  return (
    <Card title="一周评论趋势" bordered={false} className="h-full">
      <div className="h-1/5 flex justify-end">
        <Radio.Group value={date} onChange={handleSizeChange}>
          <Radio.Button value="week">周</Radio.Button>
          <Radio.Button value="month">月</Radio.Button>
          <Radio.Button value="year">年</Radio.Button>
        </Radio.Group>
      </div>
      <div className="h-4/5">
        <Line {...config} />
      </div>
    </Card>
  );
};
export default CommentLine;
