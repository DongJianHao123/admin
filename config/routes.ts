/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,title 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/message',
    layout: false,
    routes: [
      {
        name: 'message',
        path: '/message/transfer',
        component: './Message/Transfer',
      },
    ],
  },
  {
    path: '/',
    redirect: '/message/transfer',
  },
  {
    path: '*',
    layout: false,
    redirect: '/message/transfer',
  },
  // {
  //   path: '/user',
  //   layout: false,
  //   routes: [
  //     {
  //       name: 'login',
  //       path: '/user/login',
  //       component: './User/Login',
  //     },
  //   ],
  // },
  // {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   icon: 'dashboard',
  //   component: './Dashboard',
  // },
  // {
  //   path: '/homepage',
  //   name: 'homepage',
  //   icon: 'home',
  //   component: './Homepage',
  // },
  // {
  //   path: '/course',
  //   name: 'course',
  //   icon: 'book',
  //   routes: [
  //     {
  //       path: '/course',
  //       component: './Course',
  //     },
  //     {
  //       path: '/course/edit/:courseId',
  //       component: './Course/CourseEdit',
  //     },
  //     {
  //       path: '/course/member-manage/:courseId',
  //       component: './Course/MemberManage',
  //     },
  //     {
  //       path: '/course/classroom-manage/:courseId',
  //       component: './Course/ClassroomManage',
  //     },
  //     {
  //       path: '/course/classroom-manage/edit/:courseId/:classroomId',
  //       component:"./Course/ClassroomManage/ClassroomEdit"
  //     },
  //   ],
  // },
  // {
  //   path: '/students',
  //   name: 'students',
  //   icon: 'user',
  //   component: './Students',
  // },
  // {
  //   path: '/operate',
  //   name: 'operate',
  //   icon: 'FundProjectionScreenOutlined',
  //   component: './Operate',
  // },
  // {
  //   path: '/class/hour/statistics',
  //   name: 'class.hour.statistics',
  //   icon: 'CarryOutOutlined',
  //   component: './ClassHourStatistics',
  // },
  // {
  //   path: '/actions',
  //   name: 'actions',
  //   icon: 'EyeOutlined',
  //   component: './Actions',
  // },

];
