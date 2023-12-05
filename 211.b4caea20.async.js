"use strict";(self.webpackChunkant_design_pro=self.webpackChunkant_design_pro||[]).push([[211],{94737:function(Q,x){var t={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"}}]},name:"upload",theme:"outlined"};x.Z=t},60014:function(Q,x,t){var h=t(1413),C=t(45987),D=t(67294),p=t(97072),F=t(85893),m=["fieldProps","min","proFieldProps","max"],y=function(f,E){var l=f.fieldProps,Z=f.min,$=f.proFieldProps,R=f.max,U=(0,C.Z)(f,m);return(0,F.jsx)(p.Z,(0,h.Z)({valueType:"digit",fieldProps:(0,h.Z)({min:Z,max:R},l),ref:E,filedConfig:{defaultProps:{width:"100%"}},proFieldProps:$},U))},d=D.forwardRef(y);x.Z=d},736:function(Q,x,t){t.d(x,{Z:function(){return st}});var h=t(1413),C=t(45987),D=t(87462),p=t(67294),F=t(94737),m=t(18546),y=function(r,J){return p.createElement(m.Z,(0,D.Z)({},r,{ref:J,icon:F.Z}))},d=p.forwardRef(y),B=t(81961),f=t(71577),E=t(46829),l=t(44190),Z=t(85893),$=["fieldProps","action","accept","listType","title","max","icon","buttonProps","onChange","disabled","proFieldProps"],R=function(r,J){var L,i=r.fieldProps,X=r.action,rt=r.accept,H=r.listType,V=r.title,T=V===void 0?"\u5355\u51FB\u4E0A\u4F20":V,k=r.max,q=r.icon,_=q===void 0?(0,Z.jsx)(d,{}):q,lt=r.buttonProps,e=r.onChange,P=r.disabled,j=r.proFieldProps,z=(0,C.Z)(r,$),N=(0,p.useMemo)(function(){var A;return(A=z.fileList)!==null&&A!==void 0?A:z.value},[z.fileList,z.value]),tt=(0,p.useContext)(l.A),O=(j==null?void 0:j.mode)||tt.mode||"edit",S=(k===void 0||!N||(N==null?void 0:N.length)<k)&&O!=="read",w=(H!=null?H:i==null?void 0:i.listType)==="picture-card";return(0,Z.jsx)(B.Z,(0,h.Z)((0,h.Z)({action:X,accept:rt,ref:J,listType:H||"picture",fileList:N},i),{},{name:(L=i==null?void 0:i.name)!==null&&L!==void 0?L:"file",onChange:function(et){var I;e==null||e(et),i==null||(I=i.onChange)===null||I===void 0||I.call(i,et)},children:S&&(w?(0,Z.jsxs)("span",{children:[_," ",T]}):(0,Z.jsxs)(f.Z,(0,h.Z)((0,h.Z)({disabled:P||(i==null?void 0:i.disabled)},lt),{},{children:[_,T]})))}))},U=(0,E.G)(p.forwardRef(R),{getValueFromEvent:function(r){return r.fileList}}),st=U},19240:function(Q,x,t){t.d(x,{L:function(){return p},r:function(){return D}});var h=t(9669),C=t.n(h),D=function(m,y,d){C()({method:"post",url:"https://api.os2edu.cn/api/chat-process",data:{prompt:m,options:{parentMessageId:y},systemMessage:"\u4F60\u73B0\u5728\u662F\u4E00\u4E2A\u6559\u80B2\u5DE5\u4F5C\u8005\uFF0C\u4F60\u9700\u8981\u8F85\u52A9\u6211\u7BA1\u7406\u597D\u4E00\u4E2A\u6559\u80B2\u673A\u6784\u7684\u540E\u53F0\uFF0C\u7B80\u5316\u6211\u4EEC\u7684\u5DE5\u4F5C",temperature:.8,top_p:1},onDownloadProgress:d}).then(function(){})},p=function(m,y){return C()({method:"post",url:"http://101.200.208.215:8055/hunyuan/chat",headers:{"Content-Type":"application/json"},data:{question:m},onDownloadProgress:y}).catch(function(d){throw d})}},64255:function(Q,x,t){t.d(x,{Z:function(){return N}});var h=t(97983),C=t.n(h),D=t(40794),p=t.n(D),F=t(64129),m=t.n(F),y=t(12741),d=t.n(y),B=t(14971),f=t(19240),E=t(1413),l=t(67294),Z={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M288 421a48 48 0 1096 0 48 48 0 10-96 0zm352 0a48 48 0 1096 0 48 48 0 10-96 0zM512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm263 711c-34.2 34.2-74 61-118.3 79.8C611 874.2 562.3 884 512 884c-50.3 0-99-9.8-144.8-29.2A370.4 370.4 0 01248.9 775c-34.2-34.2-61-74-79.8-118.3C149.8 611 140 562.3 140 512s9.8-99 29.2-144.8A370.4 370.4 0 01249 248.9c34.2-34.2 74-61 118.3-79.8C413 149.8 461.7 140 512 140c50.3 0 99 9.8 144.8 29.2A370.4 370.4 0 01775.1 249c34.2 34.2 61 74 79.8 118.3C874.2 413 884 461.7 884 512s-9.8 99-29.2 144.8A368.89 368.89 0 01775 775zM664 533h-48.1c-4.2 0-7.8 3.2-8.1 7.4C604 589.9 562.5 629 512 629s-92.1-39.1-95.8-88.6c-.3-4.2-3.9-7.4-8.1-7.4H360a8 8 0 00-8 8.4c4.4 84.3 74.5 151.6 160 151.6s155.6-67.3 160-151.6a8 8 0 00-8-8.4z"}}]},name:"smile",theme:"outlined"},$=Z,R=t(42135),U=function(O,S){return l.createElement(R.Z,(0,E.Z)((0,E.Z)({},O),{},{ref:S,icon:$}))};U.displayName="SmileOutlined";var st=l.forwardRef(U),Y=t(82061),r={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"defs",attrs:{},children:[{tag:"style",attrs:{}}]},{tag:"path",attrs:{d:"M931.4 498.9L94.9 79.5c-3.4-1.7-7.3-2.1-11-1.2a15.99 15.99 0 00-11.7 19.3l86.2 352.2c1.3 5.3 5.2 9.6 10.4 11.3l147.7 50.7-147.6 50.7c-5.2 1.8-9.1 6-10.3 11.3L72.2 926.5c-.9 3.7-.5 7.6 1.2 10.9 3.9 7.9 13.5 11.1 21.5 7.2l836.5-417c3.1-1.5 5.6-4.1 7.2-7.1 3.9-8 .7-17.6-7.2-21.6zM170.8 826.3l50.3-205.6 295.2-101.3c2.3-.8 4.2-2.6 5-5 1.4-4.2-.8-8.7-5-10.2L221.1 403 171 198.2l628 314.9-628.2 313.2z"}}]},name:"send",theme:"outlined"},J=r,L=function(O,S){return l.createElement(R.Z,(0,E.Z)((0,E.Z)({},O),{},{ref:S,icon:J}))};L.displayName="SendOutlined";var i=l.forwardRef(L),X=t(12461),rt=t(85402),H=t(23613),V=t(24093),T=t(71577),k=t(55241),q=t(30124),_=t(20640),lt=t.n(_),e=t(85893),P="chatgpt_history",j="hunyuan_history",z=function(O){var S,w,A=O.open,et=O.handleClose,I=O.prompt,b=(0,l.useRef)(null),Pt=(0,l.useState)([]),ct=d()(Pt,2),n=ct[0],K=ct[1],jt=(0,l.useState)(!1),ut=d()(jt,2),W=ut[0],nt=ut[1],Ot=(0,l.useState)(I),vt=d()(Ot,2),G=vt[0],at=vt[1],St=(0,l.useState)(P),ht=d()(St,2),u=ht[0],pt=ht[1],Et=X.ZP.useMessage(),mt=d()(Et,2),Zt=mt[0],At=mt[1],ft=function(){var a;n=(a=n)!==null&&a!==void 0?a:[];var s={index:n.length+1,createdAt:B.Z.date.format(new Date,"yyyy/MM/dd HH:mm:ss"),user:"admin",question:G,answer:"",isEnd:!1};n.push(s),K(m()(n))},ot=function(){b.current&&(console.log(b),b.current.scrollTop=b.current.scrollHeight)},gt=function(){localStorage.setItem(u,JSON.stringify(n))},xt=function(a){var s=JSON.parse(a);n[n.length-1].answer=s.text,s.detail.choices[0].finish_reason==="stop"&&(n[n.length-1].id=s.id,n[n.length-1].parentMessageId=s.parentMessageId,n[n.length-1].isEnd=!0,gt(),nt(!1)),K(m()(n)),ot()},Ct=function(a){var s="",v=a.split(`
`).map(function(g){try{var M=JSON.parse(g);return s+=M.Choices[0].Delta.Content,M}catch(it){return console.log("parse Error",g),{}}});n[n.length-1].answer=s;var c=v[v.length-1];c.Choices&&c.Choices[0].FinishReason==="stop"&&(n[n.length-1].id=c.id,n[n.length-1].parentMessageId=c.id,n[n.length-1].isEnd=!0,gt(),nt(!1)),K(m()(n)),ot()},Mt=function(){var a;if(!(B.Z.str.isEmpty(G)||W)){var s=n?(a=n[n.length-1])===null||a===void 0?void 0:a.id:"";nt(!0),ft();var v=G;at("");try{(0,f.r)(v,s,function(c){var g=c.target,M=g.responseText,it=M.lastIndexOf(`
`,M.length-2),dt=M;it!==-1&&(dt=M.substring(it));try{console.log(JSON.parse(dt)),xt(dt)}catch(Bt){console.log(Bt)}})}catch(c){xt(JSON.stringify({id:"",parentMessageId:"",text:"\u7F51\u7EDC\u597D\u50CF\u51FA\u9519\u4E86\uFF0C\u8BF7\u91CD\u8BD5\uFF01"}))}}},Dt=function(){if(!(B.Z.str.isEmpty(G)||W)){nt(!0),ft();var a=G;at(""),(0,f.L)(a,function(s){var v=s.target,c=v.responseText;Ct(c)}).catch(function(){var s={Choices:[{FinishReason:"stop",Delta:{Content:"\u7F51\u7EDC\u597D\u50CF\u51FA\u9519\u4E86\uFF0C\u8BF7\u91CD\u8BD5\uFF01"}}]};Ct(JSON.stringify(s))})}},yt=function(){u===P&&Mt(),u===j&&Dt()},Ft=function(a){a.code==="Enter"&&!W&&yt()},Tt=function(){rt.Z.confirm({style:{zIndex:"1002"},open:!0,title:"\u6E05\u7A7A\u8BB0\u5F55",content:"\u786E\u5B9A\u6E05\u7A7A\u548CChatGPT\u7684\u804A\u5929\u8BB0\u5F55\u5417",onOk:function(){var a=p()(C()().mark(function v(){return C()().wrap(function(g){for(;;)switch(g.prev=g.next){case 0:localStorage.removeItem(P),K([]),Zt.success("\u5DF2\u6E05\u7A7A\u8BB0\u5F55");case 3:case"end":return g.stop()}},v)}));function s(){return a.apply(this,arguments)}return s}()})},Nt=function(a){lt()(a),X.ZP.success("\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F")};(0,l.useEffect)(function(){at(I)},[I]),(0,l.useEffect)(function(){try{K(JSON.parse(localStorage.getItem(u)||""))}catch(o){localStorage.removeItem(u),K([])}},[u]),(0,l.useEffect)(function(){A&&ot()},[A,n,n.length]);var It=(0,e.jsxs)("ul",{className:"model-list",children:[(0,e.jsxs)("li",{onClick:function(){return pt(P)},children:[" ",(0,e.jsx)("span",{className:u===P?"action point":"point"}),"chatgpt3.5"]}),(0,e.jsxs)("li",{onClick:function(){return pt(j)},children:[(0,e.jsx)("span",{className:u===j?"action point":"point"}),"\u817E\u8BAF\u4E91\u6DF7\u5143\u5927\u6A21\u578B3.0"]})]});return(0,e.jsxs)(e.Fragment,{children:[At,(0,e.jsxs)(H.Z,{className:"chatgpt-container",title:(0,e.jsx)("div",{className:"title",children:(0,e.jsxs)("div",{children:[u===P&&"ChatGPT\u5C0F\u52A9\u624B",u===j&&"\u6DF7\u5143\u5C0F\u52A9\u624B"]})}),placement:"left",width:600,closeIcon:(0,e.jsx)(e.Fragment,{}),onClose:et,maskClosable:!0,destroyOnClose:!0,open:A,style:{zIndex:"1000"},children:[(0,e.jsx)("ul",{ref:b,children:((S=n)===null||S===void 0?void 0:S.length)>0?n.map(function(o){var a=o.index,s=o.question,v=o.answer,c=o.createdAt,g=o.isEnd;return(0,e.jsxs)("li",{children:[(0,e.jsxs)("div",{className:"question",children:[(0,e.jsx)(V.C,{size:40,style:{minWidth:"40px",backgroundColor:"#00A8C5",verticalAlign:"middle"},gap:1,children:"admin"}),(0,e.jsxs)("div",{className:"content",children:[(0,e.jsx)("div",{className:"time",children:c}),(0,e.jsx)("p",{children:s})]})]}),(0,e.jsxs)("div",{className:"answer",children:[u===P&&(0,e.jsx)("img",{className:"avatar",src:"/icons/chatgpt-logo.jpg"}),u===j&&(0,e.jsx)(V.C,{size:40,style:{fontSize:14,minWidth:"40px",backgroundColor:"#1890FF",verticalAlign:"middle"},gap:1,children:"\u6DF7\u5143"}),(0,e.jsxs)("div",{className:"content",children:[(0,e.jsx)("div",{className:"time",children:c}),(0,e.jsxs)("p",{children:[v,(0,e.jsx)("br",{}),g&&v&&(0,e.jsx)(T.Z,{style:{float:"right"},type:"link",onClick:function(){return Nt(v)},children:"\u590D\u5236"})]})]})]})]},a)}):(0,e.jsxs)("div",{className:"empty-chat",children:[(0,e.jsx)(st,{}),(0,e.jsx)("span",{children:"\u8BF7\u5411\u6211\u63D0\u95EE\u5427~"})]})}),(0,e.jsxs)("div",{className:"footer",children:[(0,e.jsx)(T.Z,{className:"btn",disabled:W||!n||((w=n)===null||w===void 0?void 0:w.length)<1,onClick:function(){return Tt()},children:(0,e.jsx)(Y.Z,{})}),(0,e.jsx)(k.Z,{placement:"top",title:"\u5207\u6362\u6A21\u578B",content:It,trigger:"click",children:(0,e.jsx)(T.Z,{className:"btn",disabled:W,children:"\u5207\u6362"})}),(0,e.jsx)(q.Z,{autoFocus:!0,onFocus:function(){return ot()},onKeyDown:function(a){return Ft(a)},value:G,onChange:function(a){return at(a.target.value)},className:"input",placeholder:"\u8BF7\u8F93\u5165\u60A8\u7684\u95EE\u9898"}),(0,e.jsx)(T.Z,{className:"send-btn",disabled:W,onClick:function(){return yt()},icon:(0,e.jsx)(i,{}),type:"primary",children:"\u53D1\u9001"})]})]},"left")]})},N=z}}]);
