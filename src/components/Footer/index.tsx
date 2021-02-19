import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="华南理工大学广州学院-17计算机科学与技术1班"
    links={[
      {
        key: 'YangJie',
        title: 'YangJie',
        href: 'https://github.com/NelsonYong',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/NelsonYong',
        blankTarget: true,
      },
      {
        key: '杨杰',
        title: '杨杰',
        href: 'https://github.com/NelsonYong',
        blankTarget: true,
      },
    ]}
  />
);
