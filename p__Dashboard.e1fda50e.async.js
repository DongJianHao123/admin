"use strict";(self.webpackChunkant_design_pro=self.webpackChunkant_design_pro||[]).push([[906],{14971:function(F,x,r){var I=r(79742),S=r(48764),p={str:{rn2br:function(t){return t.replace(/(\r\n)|(\n)/g,"<br>")},isNull:function(t){return t===null||typeof t=="undefined"},isEmpty:function(t){return p.str.isNull(t)?!0:typeof t!="string"?!1:t.length===0},isNotEmpty:function(t){return!p.str.isEmpty(t)},trim:function(t){return t.replace(/^\s+|\s+$/gm,"")},isChinaMobile:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"";return t.length===11},passwordLengthValid:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"";return t.length<=18&&t.length>=6},randomString:function(t){for(var n="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",e=n.length,i="",o=0;o<t;o++)i+=n.charAt(Math.floor(Math.random()*e));return i}},obj:{isEmptyObj:function(t){return Object.keys(t).length===0},RemoveNulls:function(t){for(var n in t)if(Object.hasOwnProperty.call(t,n)){var e=t[n];(e===null||e==="")&&delete t[n]}return t}},date:{remainingTime:function(t){var n=parseInt((t/864e5).toString()),e=parseInt((t%(24*3600*1e3)/36e5).toString()),i=parseInt((t%36e5/6e4).toString()),o=parseInt((t%6e4/1e3).toString()),s="";return n>0&&(s=n+"\u5929"),e>0&&(s=s+(e+"\u65F6")),i>0&&(s=s+(i+"\u5206")),s=s+(o+"\u79D2"),s},remainingHour:function(t){var n=t>=0?"":"-",e=t>=0?t:t*-1,i=parseInt((e/3600).toString()),o=parseInt((e%3600/60).toString());return i>=0&&(n=n+(i+"\u65F6")),o>=0&&(n=n+(o+"\u5206")),n},format:function(t,n){if(!t||!n)return null;var e=n,i={"M+":t.getMonth()+1,"d+":t.getDate(),"h+":t.getHours()%12===0?12:t.getHours()%12,"H+":t.getHours(),"m+":t.getMinutes(),"s+":t.getSeconds(),"q+":Math.floor((t.getMonth()+3)/3),S:t.getMilliseconds()},o={0:"\u65E5",1:"\u4E00",2:"\u4E8C",3:"\u4E09",4:"\u56DB",5:"\u4E94",6:"\u516D"};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(t.getFullYear()+"").substr(4-RegExp.$1.length))),/(E+)/.test(e)&&(e=e.replace(RegExp.$1,(RegExp.$1.length>1?RegExp.$1.length>2?"\u661F\u671F":"\u5468":"")+o[t.getDay()+""]));for(var s in i)new RegExp("("+s+")").test(e)&&(e=e.replace(RegExp.$1,RegExp.$1.length===1?i[s]:("00"+i[s]).substr((""+i[s]).length)));return e}},htmlstr:{html2dom:function(t){var n=document.createElement("div");return n.innerHTML=t,n}},url:{getDomainFromUrl:function(t){var n=t.indexOf("//"),e=t.indexOf("/",n+2);return e===-1?t.substring(n+2):t.substring(n+2,e)}},base64:{getBlobBydataURI:function(t,n){for(var e=atob((t||"").split(",")[1]),i=[],o=0;o<e.length;o++)i.push(e.charCodeAt(o));return new Blob([new Uint8Array(i)],{type:n})},encode:function(t){return I.fromByteArray(S.lW.from(t))}},array:{swap:function(t,n,e){return t[n]=t.splice(e,1,t[n])[0],t},remove:function(t,n){return isNaN(n)||n>t.length?[]:(t.splice(n,1),t)},insert:function(t,n,e){return t.splice(n,0,e),t},insertLast:function(t,n){return t.splice(t.length,0,n),t}}};x.Z=p},83451:function(F,x,r){r.r(x),r.d(x,{default:function(){return K}});var I=r(11281),S=r.n(I),p=r(64129),a=r.n(p),t=r(12741),n=r.n(t),e=r(67294),i=r(97983),o=r.n(i),s=r(40794),j=r.n(s),C=r(36275);function b(){return L.apply(this,arguments)}function L(){return L=j()(o()().mark(function h(){return o()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.abrupt("return",(0,C.request)("/analysis/api/room-timesget/getTotalSummaryDetailsByClientId?clientId=385"));case 1:case"end":return u.stop()}},h)})),L.apply(this,arguments)}function B(){return M.apply(this,arguments)}function M(){return M=j()(o()().mark(function h(){return o()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.abrupt("return",(0,C.request)("/order/api/order-agencies/getOrderAgenciesByConditions?clientId=385&size=200&sort=id,desc"));case 1:case"end":return u.stop()}},h)})),M.apply(this,arguments)}function O(){return R.apply(this,arguments)}function R(){return R=j()(o()().mark(function h(){return o()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.abrupt("return",(0,C.request)("/analysis/api/day-summaries/getTotalSummaryCount?clientId=483"));case 1:case"end":return u.stop()}},h)})),R.apply(this,arguments)}var A=r(95855),y=r(21448),N=r(44784),H=r(74763),$=r(71230),T=r(15746),U=r(84031),E=r(14971),l=r(85893),P=function(c){var u=((c==null?void 0:c.daySummaryList)||[]).reverse();return{title:{text:"\u8FD115\u5929\u6D88\u8D39\u65F6\u957F: ".concat(E.Z.date.remainingHour(c==null?void 0:c.totalTimeLong))},tooltip:{formatter:""},xAxis:{type:"category",data:u.map(function(d){return d.sumDay})},yAxis:{type:"value",interval:(c==null?void 0:c.totalTimeLong)/20,axisLabel:{formatter:function(g){return Math.floor(g/3600)+"\u65F6"}}},series:[{data:u.map(function(d){return d.timeLong}),type:"bar",smooth:!0,label:{show:!0,position:"top",formatter:function(g){return(Math.floor(g.data/3600)>0?Math.floor(g.data/3600):(g.data/3600).toFixed(1))+"\u65F6"}},tooltip:{valueFormatter:function(g){return Math.floor(g/3600)+"\u5C0F\u65F6"}}}]}},z=function(){var c=(0,e.useState)([]),u=n()(c,2),d=u[0],g=u[1],Z=(0,C.useRequest)(b),D=Z.data,W=Z.loading;(0,e.useEffect)(function(){B().then(function(m){var v=0;m.forEach(function(f){v+=f.minutes*60}),d[0]={title:"\u8D2D\u4E70\u603B\u65F6\u957F",value:E.Z.date.remainingHour(v),desc:"\u5DF2\u8D2D\u5957\u9910\u5305\uFF1A".concat(m.length,"\u4E2A")},O().then(function(f){d[1]={title:"\u6D88\u8D39\u603B\u65F6\u957F",value:E.Z.date.remainingHour(f.totalTimeLong),desc:"\u65E5\u5E73\u5747\u91CF:".concat(E.Z.date.remainingHour(f.totalTimeLong/f.days))},d[2]={title:"\u5269\u4F59\u65F6\u957F",value:E.Z.date.remainingHour(v-f.totalTimeLong),desc:"\u9884\u8BA1\u53EF\u7528:".concat(v-f.totalTimeLong>0?parseInt(((v-f.totalTimeLong)/(f.totalTimeLong/f.days)).toString()):0,"\u5929")},g(a()(d))})})},[]);var G=[{title:"\u65E5\u671F",dataIndex:"sumDay"},{title:"\u4E0A\u8BFE\u6559\u5BA4\u603B\u6570",dataIndex:"roomNum"},{title:"\u5B66\u751F\u603B\u4EBA\u6570",dataIndex:"studentNum"},{title:"\u6559\u5E08\u603B\u4EBA\u6570",dataIndex:"teacherNum"},{title:"\u6D88\u8017\u603B\u65F6\u957F",dataIndex:"timeLong"}].map(function(m){return S()(S()({},m),{},{align:"center"})});return(0,l.jsxs)("div",{className:"dashboard",children:[(0,l.jsx)(A._z,{children:(0,l.jsx)(y.Z,{direction:"row",ghost:!0,gutter:[8,8],children:d.map(function(m,v){return(0,l.jsx)(y.Z,{colSpan:6,title:(0,l.jsx)(H.Z,{title:m.title,value:m.value}),children:(0,l.jsxs)($.Z,{style:{color:"#409eff"},justify:"space-between",children:[(0,l.jsx)(T.Z,{children:m.desc}),(0,l.jsx)(T.Z,{style:{cursor:"pointer"},children:v===2?"\u53BB\u5145\u503C":"\u67E5\u770B\u8BE6\u60C5"})]})},m.title)})})}),(0,l.jsx)(A._z,{loading:W,children:(0,l.jsxs)(y.Z,{direction:"row",ghost:!0,gutter:[8,8],children:[(0,l.jsx)(y.Z,{colSpan:14,children:(0,l.jsx)(U.Z,{option:P(D),style:{height:"447px",width:"100%"}})}),(0,l.jsx)(y.Z,{colSpan:10,children:(0,l.jsx)(N.Z,{rowKey:"id",style:{height:"447px",width:"100%"},pagination:!1,toolBarRender:!1,dataSource:D==null?void 0:D.daySummaryList,search:!1,columns:G,scroll:{y:360}})})]})})]})},K=z}}]);