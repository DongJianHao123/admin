"use strict";(self.webpackChunkant_design_pro=self.webpackChunkant_design_pro||[]).push([[480],{64317:function(se,O,e){var m=e(1413),P=e(91),K=e(22270),F=e(67294),R=e(66758),p=e(98536),T=e(85893),s=["fieldProps","children","params","proFieldProps","mode","valueEnum","request","showSearch","options"],t=["fieldProps","children","params","proFieldProps","mode","valueEnum","request","options"],A=function(a,V){var D=a.fieldProps,L=a.children,z=a.params,l=a.proFieldProps,Q=a.mode,X=a.valueEnum,N=a.request,k=a.showSearch,G=a.options,b=(0,P.Z)(a,s),j=(0,F.useContext)(R.Z);return(0,T.jsx)(p.Z,(0,m.Z)((0,m.Z)({valueEnum:(0,K.h)(X),request:N,params:z,valueType:"select",filedConfig:{customLightMode:!0},fieldProps:(0,m.Z)({options:G,mode:Q,showSearch:k,getPopupContainer:j.getPopupContainer},D),ref:V,proFieldProps:l},b),{},{children:L}))},v=F.forwardRef(function(i,a){var V=i.fieldProps,D=i.children,L=i.params,z=i.proFieldProps,l=i.mode,Q=i.valueEnum,X=i.request,N=i.options,k=(0,P.Z)(i,t),G=(0,m.Z)({options:N,mode:l||"multiple",labelInValue:!0,showSearch:!0,showArrow:!1,autoClearSearchValue:!0,optionLabelProp:"label"},V),b=(0,F.useContext)(R.Z);return(0,T.jsx)(p.Z,(0,m.Z)((0,m.Z)({valueEnum:(0,K.h)(Q),request:X,params:L,valueType:"select",filedConfig:{customLightMode:!0},fieldProps:(0,m.Z)({getPopupContainer:b.getPopupContainer},G),ref:a,proFieldProps:z},k),{},{children:D}))}),$=F.forwardRef(A),E=v,M=$;M.SearchSelect=E,M.displayName="ProFormComponent",O.Z=M},5966:function(se,O,e){var m=e(1413),P=e(91),K=e(67294),F=e(98536),R=e(85893),p=["fieldProps","proFieldProps"],T=["fieldProps","proFieldProps"],s="text",t=function(E){var M=E.fieldProps,i=E.proFieldProps,a=(0,P.Z)(E,p);return(0,R.jsx)(F.Z,(0,m.Z)({valueType:s,fieldProps:M,filedConfig:{valueType:s},proFieldProps:i},a))},A=function(E){var M=E.fieldProps,i=E.proFieldProps,a=(0,P.Z)(E,T);return(0,R.jsx)(F.Z,(0,m.Z)({valueType:"password",fieldProps:M,proFieldProps:i,filedConfig:{valueType:s}},a))},v=t;v.Password=A,v.displayName="ProFormComponent",O.Z=v},97731:function(se,O,e){e.d(O,{L:function(){return F}});var m=e(12461),P=e(53667),K=e.n(P),F=function(p,T){try{var s={};s.fileName=p,s.datas=T;var t=new(K())(s);t.saveExcel(),m.ZP.success("\u6570\u636E\u5BFC\u51FA\u6210\u529F")}catch(A){m.ZP.error("\u5BFC\u51FA\u51FA\u9519,\u8BF7\u5237\u65B0\u91CD\u8BD5"),console.log(A)}}},90784:function(se,O,e){e.r(O),e.d(O,{default:function(){return Oe}});var m=e(97983),P=e.n(m),K=e(40794),F=e.n(K),R=e(12741),p=e.n(R),T=e(11281),s=e.n(T),t=e(4638),A=e(14971),v=e(13714),$=e(58638),E=e(51042),M=e(8601),i=e(93056),a=e(36275),V=e(94594),D=e(12461),L=e(71577),z=e(65360),l=e(67294),Q=e(97548),X=e.n(Q),N=e(63154),k=e(184),G=e(5966),b=e(64317),j=e(1413),ce=e(91),fe=e(22270),me=e(55742),Pe=e(90789),pe=e(98536),r=e(85893),Ce=["fieldProps","options","radioType","layout","proFieldProps","valueEnum"],Fe=l.forwardRef(function(o,h){var c=o.fieldProps,u=o.options,n=o.radioType,f=o.layout,y=o.proFieldProps,g=o.valueEnum,w=(0,ce.Z)(o,Ce);return(0,r.jsx)(pe.Z,(0,j.Z)((0,j.Z)({valueType:n==="button"?"radioButton":"radio",ref:h,valueEnum:(0,fe.h)(g,void 0)},w),{},{fieldProps:(0,j.Z)({options:u,layout:f},c),proFieldProps:y,filedConfig:{customLightMode:!0}}))}),xe=l.forwardRef(function(o,h){var c=o.fieldProps,u=o.children;return(0,r.jsx)(me.ZP,(0,j.Z)((0,j.Z)({},c),{},{ref:h,children:u}))}),Ee=(0,Pe.G)(xe,{valuePropName:"checked",ignoreWidth:!0}),ee=Ee;ee.Group=Fe,ee.Button=me.ZP.Button,ee.displayName="ProFormComponent";var ye=ee,ge=["fieldProps","unCheckedChildren","checkedChildren","proFieldProps"],Ze=l.forwardRef(function(o,h){var c=o.fieldProps,u=o.unCheckedChildren,n=o.checkedChildren,f=o.proFieldProps,y=(0,ce.Z)(o,ge);return(0,r.jsx)(pe.Z,(0,j.Z)({valueType:"switch",fieldProps:(0,j.Z)({unCheckedChildren:u,checkedChildren:n},c),ref:h,valuePropName:"checked",proFieldProps:f,filedConfig:{valuePropName:"checked",ignoreWidth:!0,customLightMode:!0}},y))}),ve=Ze,Y=e(95239),le=e(96486),Be=["id","handleClose","tableReload"],Se=function(o){var h=o.id,c=o.handleClose,u=o.tableReload,n=X()(o,Be),f=(0,a.useParams)(),y=f.courseId,g=(0,a.useSearchParams)(),w=p()(g,1),re=w[0],q=Y.Z.useForm(),ue=p()(q,1),W=ue[0],te=(0,a.useRequest)(v.Gr,{manual:!0}),_=te.run,de=(0,l.useState)(""),oe=p()(de,2),Z=oe[0],ae=oe[1],ie=function(){var d=F()(P()().mark(function x(B){return P()().wrap(function(C){for(;;)switch(C.prev=C.next){case 0:return C.abrupt("return",((0,le.isUndefined)(h)?v.fZ:v.hS)(s()(s()({},B),{},{verify:Z})).then(function(){D.ZP.success("\u4FDD\u5B58\u6210\u529F"),u(),c()}));case 1:case"end":return C.stop()}},x)}));return function(B){return d.apply(this,arguments)}}(),ne=function(){var x=W.getFieldValue("verify_room"),B=W.getFieldValue("verify_playback");console.log("room",x),console.log("playback",B);var U="0";x&&!B&&(U=t.mJ.ONLY_ROOM),!x&&B&&(U=t.mJ.ONLY_PLAYBACK),B&&x&&(U=t.mJ.ALL_RIGNHT),ae(U),console.log(U)};(0,l.useEffect)(function(){(0,le.isUndefined)(h)||!n.visible||_(h).then(function(d){W.setFieldsValue(d),ae(d.verify)})},[h,n.visible]),(0,l.useEffect)(function(){if(Z){var d=!0;console.log("verify",Z),Z===t.mJ.NONE?J(!d,!d):Z===t.mJ.ONLY_ROOM?J(d,!d):Z===t.mJ.ONLY_PLAYBACK?J(!d,d):Z===t.mJ.ALL_RIGNHT&&J(d,d)}},[n.visible,Z]);var J=function(x,B){W.setFieldValue("verify_playback",B),W.setFieldValue("verify_room",x)};return(0,r.jsxs)(k.a,s()(s()({},n),{},{form:W,drawerProps:{maskClosable:!1,onClose:c,destroyOnClose:!0},title:(0,le.isUndefined)(h)?"\u6DFB\u52A0\u6210\u5458":"\u7F16\u8F91\u6210\u5458",grid:!0,onFinish:ie,initialValues:{courseId:y,uniCourseId:re.get("uniCourseId"),clientId:"385"},children:[(0,r.jsx)(G.Z,{name:"name",label:"\u6635\u79F0",colProps:{md:24,xl:12},required:!0,placeholder:"\u8BF7\u8F93\u5165",rules:N.n0}),(0,r.jsx)(G.Z,{name:"phone",label:"\u624B\u673A\u53F7",colProps:{md:24,xl:12},required:!0,placeholder:"\u8BF7\u8F93\u5165",rules:N.n0}),(0,r.jsx)(b.Z,{name:"status",label:"\u89D2\u8272",colProps:{md:24,xl:12},required:!0,placeholder:"\u8BF7\u8F93\u5165",rules:N.n0,options:t.uJ}),(0,r.jsx)(ye.Group,{name:"gender",label:"\u6027\u522B",colProps:{md:24,xl:12},options:["\u7537","\u5973"]}),(0,r.jsx)(b.Z,{label:"\u5E74\u7EA7",name:"age",colProps:{md:24,xl:12},placeholder:"\u8BF7\u9009\u62E9",options:t.YK}),(0,r.jsx)(ve,{name:"verify_room",label:"\u662F\u5426\u5141\u8BB8\u8FDB\u5165\u8BFE\u5802",checkedChildren:"\u5141\u8BB8",unCheckedChildren:"\u4E0D\u5141\u8BB8",fieldProps:{onChange:ne},colProps:{md:24,xl:12}}),(0,r.jsx)(b.Z,{label:"\u5907\u6CE8",name:"tag",colProps:{md:24,xl:12},placeholder:"\u8BF7\u9009\u62E9",options:t.pJ}),(0,r.jsx)(ve,{name:"verify_playback",label:"\u662F\u5426\u5141\u8BB8\u89C2\u770B\u56DE\u653E",checkedChildren:"\u5141\u8BB8",unCheckedChildren:"\u4E0D\u5141\u8BB8",fieldProps:{onChange:ne},colProps:{md:24,xl:12}}),(0,r.jsx)(Y.Z.Item,{name:"uniCourseId",noStyle:!0}),(0,r.jsx)(Y.Z.Item,{name:"verify",noStyle:!0}),(0,r.jsx)(Y.Z.Item,{name:"courseId",noStyle:!0}),(0,r.jsx)(Y.Z.Item,{name:"clientId",noStyle:!0}),(0,r.jsx)(Y.Z.Item,{name:"id",noStyle:!0})]}))},Me=e(97731),je=function(h,c){return[{title:"\u5E8F\u53F7",dataIndex:"index",width:80,align:"center"},{title:"\u59D3\u540D",dataIndex:"name",search:!0},{title:"\u624B\u673A\u53F7",dataIndex:"phone",search:!0},{title:"\u62A5\u540D\u65F6\u95F4",dataIndex:"createdAt",align:"center",search:!1,width:80,render:function(n){return n==="-"?"\u6682\u65E0":A.Z.date.format(new Date(n),"yyyy-MM-dd HH:mm:ss")}},{title:"\u6027\u522B",dataIndex:"gender",align:"center",valueType:"select",fieldProps:{options:[{label:"\u7537",value:"male"},{label:"\u5973",value:"female"}]}},{title:"\u5E74\u7EA7",dataIndex:"age"},{title:"\u89D2\u8272",dataIndex:"status",valueType:"select",fieldProps:{options:t.uJ}},{title:"\u8FDB\u5165\u8BFE\u5802",dataIndex:"verify",render:function(n,f){return(0,r.jsx)(V.Z,{checkedChildren:"\u5141\u8BB8",unCheckedChildren:"\u4E0D\u5141\u8BB8",checked:[t.mJ.ALL_RIGNHT,t.mJ.ONLY_ROOM].includes(n),onChange:function(g){(0,v.hS)({id:f.id,verify:(0,t.fx)(n,t.A9.ROOM.value,g)}).then(function(){c.current.reload(),D.ZP.success("\u64CD\u4F5C\u6210\u529F")})}})}},{title:"\u89C2\u770B\u56DE\u653E",dataIndex:"verify",render:function(n,f){return(0,r.jsx)(V.Z,{checkedChildren:"\u5141\u8BB8",unCheckedChildren:"\u4E0D\u5141\u8BB8",checked:[t.mJ.ALL_RIGNHT,t.mJ.ONLY_PLAYBACK].includes(n),onChange:function(g){(0,v.hS)({id:f.id,verify:(0,t.fx)(n,t.A9.PLAYBACK.value,g)}).then(function(){c.current.reload(),D.ZP.success("\u64CD\u4F5C\u6210\u529F")})}})}},{title:"\u5907\u6CE8",dataIndex:"tag",width:60},{title:"\u64CD\u4F5C",dataIndex:"action",align:"center",width:200,fixed:"right",render:function(n,f){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(L.Z,{onClick:function(){return h({visible:!0,id:f.id})},size:"small",type:"link",children:"\u7F16\u8F91"}),(0,r.jsx)(z.Z,{title:"\u786E\u5B9A\u5220\u9664?",onConfirm:function(){return(0,v.EP)(f.id).then(function(){c.current.reload(),D.ZP.success("\u64CD\u4F5C\u6210\u529F")})},children:(0,r.jsx)(L.Z,{size:"small",type:"link",danger:!0,children:"\u5220\u9664"})})]})}}].map(function(u){return s()({search:!1,width:120},u)})},Ie=function(){var h=(0,a.useParams)(),c=h.courseId,u=(0,l.useRef)(),n=(0,l.useState)({visible:!1}),f=p()(n,2),y=f[0],g=f[1],w=(0,l.useState)(),re=p()(w,2),q=re[0],ue=re[1],W=(0,l.useState)(0),te=p()(W,2),_=te[0],de=te[1],oe=(0,l.useState)([]),Z=p()(oe,2),ae=Z[0],ie=Z[1],ne=(0,l.useState)(!1),J=p()(ne,2),d=J[0],x=J[1],B=function(){(0,v.wA)({courseId:c}).then(function(I){ue(I.data[0])})},U=function(){x(!0),(0,Me.L)("\u300A".concat(q.title,"\u300B\u5B66\u751F\u4FE1\u606F\u8868-").concat(A.Z.date.format(new Date,"yyyy-MM-dd")),[{sheetData:ae,sheetName:"\u88681",sheetFilter:["index","name","gender","phone","createdAt","age","verify"],sheetHeader:["\u5E8F\u53F7","\u59D3\u540D","\u6027\u522B","\u8054\u7CFB\u65B9\u5F0F","\u62A5\u540D\u65F6\u95F4","\u5E74\u7EA7","\u6743\u9650"],columnWidths:[4,5,5,5,10,10,15,10]}]),x(!1)};return(0,l.useEffect)(B,[]),(0,l.useEffect)(F()(P()().mark(function C(){var I;return P()().wrap(function(S){for(;;)switch(S.prev=S.next){case 0:if(!(_>0)){S.next=5;break}return S.next=3,(0,v.Zy)({size:_,courseId:c});case 3:I=S.sent.data,ie(I);case 5:case"end":return S.stop()}},C)})),[_]),(0,r.jsxs)(M._z,{header:{title:"\u6210\u5458\u7BA1\u7406",onBack:function(){return history.back()}},children:[(0,r.jsx)(i.Z,{headerTitle:q&&q.title,actionRef:u,rowKey:"id",columns:je(g,u),request:function(){var C=F()(P()().mark(function I(he){var S;return P()().wrap(function(H){for(;;)switch(H.prev=H.next){case 0:return H.next=2,(0,v.Zy)(s()(s()({},he),{},{courseId:c}));case 2:return S=H.sent,de(S.total),H.abrupt("return",S);case 5:case"end":return H.stop()}},I)}));return function(I){return C.apply(this,arguments)}}(),scroll:{y:458},toolBarRender:function(){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(L.Z,{type:"primary",loading:d,icon:(0,r.jsx)($.Z,{}),onClick:function(){U()},children:"\u5BFC\u51FA"}),(0,r.jsx)(L.Z,{onClick:function(){return g({visible:!0})},icon:(0,r.jsx)(E.Z,{}),type:"primary",children:"\u65B0\u5EFA"})]})}}),(0,r.jsx)(Se,s()(s()({},y),{},{tableReload:function(){return u.current.reload()},handleClose:function(){return g({visible:!1})}}))]})},Oe=Ie}}]);
