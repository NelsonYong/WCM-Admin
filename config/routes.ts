export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: '登录',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcome',
    name: '欢迎',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/context-table',
    name: '文章管理',
    icon: 'table',
    component: './ContextInfo',
  },
  {
    path: '/user-table',
    name: '用户管理',
    icon: 'user',
    component: './UserInfo',
  },
  {
    path: '/com-table',
    name: '评论管理',
    icon: 'book',
    component: './ComInfo',
    routes: [
      {
        path: '/com-table/main',
        name: '主评论',
        component: './ComInfo/MainCom',
      },
      {
        path: '/com-table/children',
        name: '子评论',
        component: './ComInfo/ChildrenCom',
      },
    ],
  },
  {
    path: '/mean-table',
    name: '资料管理',
    icon: 'smile',
    component: './MeanInfo',
  },
  {
    path: '/mean-chart',
    name: '分析页',
    icon: 'table',
    component: './Chart',
  },

  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
