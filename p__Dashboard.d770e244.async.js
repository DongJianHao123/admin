"use strict";(self.webpackChunkant_design_pro=self.webpackChunkant_design_pro||[]).push([[906],{83451:function(T,d,t){t.r(d),t.d(d,{default:function(){return F}});var g=t(11281),c=t.n(g),y=t(97983),v=t.n(y),x=t(40794),p=t.n(x),m=t(36275);function j(){return l.apply(this,arguments)}function l(){return l=p()(v()().mark(function u(){return v()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,m.request)("/analysis/api/room-timesget/getTotalSummaryDetailsByClientId?clientId=385"));case 1:case"end":return n.stop()}},u)})),l.apply(this,arguments)}var h=t(8601),s=t(85322),C=t(93056),Z=t(74763),D=t(71230),f=t(15746),S=t(39048),B=t(67294),a=t(85893),I=function(e){var n=((e==null?void 0:e.daySummaryList)||[]).reverse();return{tooltip:{formatter:""},xAxis:{type:"category",data:n.map(function(r){return r.sumDay})},yAxis:{type:"value",interval:(e==null?void 0:e.totalTimeLong)/20,axisLabel:{formatter:function(i){return Math.floor(i/3600)+"\u65F6"}}},series:[{data:n.map(function(r){return r.timeLong}),type:"line",smooth:!0}]}},L=function(){var e=[{title:"\u8D2D\u4E70\u603B\u65F6\u957F",value:"\u5DF2\u8D2D\u5957\u9910\u5305\uFF1A3\u4E2A",desc:"\u5DF2\u8D2D\u5957\u9910\u5305\uFF1A3\u4E2A"},{title:"\u6D88\u8D39\u603B\u65F6\u957F",value:"759\u5C0F\u65F648\u5206",desc:"\u65E5\u5E73\u5747\u91CF\uFF1A15\u5C0F\u65F630\u5206"},{title:"\u5269\u4F59\u65F6\u957F",value:"500\u5C0F\u65F613\u5206",desc:"\u5DF2\u8D2D\u5957\u9910\u5305\uFF1A3\u4E2A"}],n=(0,m.useRequest)(j),r=n.data,i=n.loading,R=[{title:"\u65E5\u671F",dataIndex:"sumDay"},{title:"\u4E0A\u8BFE\u6559\u5BA4\u603B\u6570",dataIndex:"roomNum"},{title:"\u5B66\u751F\u603B\u4EBA\u6570",dataIndex:"studentNum"},{title:"\u6559\u5E08\u603B\u4EBA\u6570",dataIndex:"teacherNum"},{title:"\u6D88\u8017\u603B\u65F6\u957F",dataIndex:"timeLong"}].map(function(o){return c()(c()({},o),{},{align:"center"})});return(0,a.jsxs)("div",{className:"dashboard",children:[(0,a.jsx)(h._z,{children:(0,a.jsx)(s.Z,{direction:"row",ghost:!0,gutter:[8,8],children:e.map(function(o){return(0,a.jsx)(s.Z,{colSpan:4,title:(0,a.jsx)(Z.Z,{title:o.title,value:o.value}),children:(0,a.jsxs)(D.Z,{style:{color:"#409eff"},justify:"space-between",children:[(0,a.jsx)(f.Z,{children:o.desc}),(0,a.jsx)(f.Z,{style:{cursor:"pointer"},children:"\u67E5\u770B\u8BE6\u60C5"})]})},o.title)})})}),(0,a.jsx)(h._z,{title:"\u8FD115\u5929\u6D88\u8D39\u65F6\u957F: 208\u5C0F\u65F648\u5206",loading:i,children:(0,a.jsxs)(s.Z,{direction:"row",ghost:!0,gutter:[8,8],children:[(0,a.jsx)(s.Z,{colSpan:14,children:(0,a.jsx)(S.Z,{option:I(r),style:{height:"447px",width:"100%"}})}),(0,a.jsx)(s.Z,{colSpan:10,children:(0,a.jsx)(C.Z,{rowKey:"id",pagination:!1,toolBarRender:!1,dataSource:r==null?void 0:r.daySummaryList,search:!1,columns:R,scroll:{y:400}})})]})})]})},F=L}}]);
