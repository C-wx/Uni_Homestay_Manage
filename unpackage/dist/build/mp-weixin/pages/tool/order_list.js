(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/tool/order_list"],{"192a":function(t,e,n){"use strict";n.r(e);var a=n("adf0"),o=n.n(a);for(var s in a)"default"!==s&&function(t){n.d(e,t,function(){return a[t]})}(s);e["default"]=o.a},5791:function(t,e,n){},"685f":function(t,e,n){"use strict";n.r(e);var a=n("9ad1"),o=n("192a");for(var s in o)"default"!==s&&function(t){n.d(e,t,function(){return o[t]})}(s);n("7acf");var i,r=n("f0c5"),u=Object(r["a"])(o["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],i);e["default"]=u.exports},"7acf":function(t,e,n){"use strict";var a=n("5791"),o=n.n(a);o.a},"9ad1":function(t,e,n){"use strict";var a,o=function(){var t=this,e=t.$createElement;t._self._c},s=[];n.d(e,"b",function(){return o}),n.d(e,"c",function(){return s}),n.d(e,"a",function(){return a})},adf0:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n={data:function(){return{headerPosition:"fixed",headerTop:"0px",typeText:{WP:"等待付款",WR:"等待用户评价",YR:"交易已完成",WDD:"退款处理中",DD:"订单已取消",SDD:"已退款",FDD:"拒绝退款"},orderType:["全部","待付款","待评价","已完成","售后"],list:[],tabbarIndex:0,status:null}},onLoad:function(){var e=this.getMerchantInfo().id;e?this.loadOrder(0):(t.showToast({title:"您还未认证商家",icon:"none"}),setTimeout(function(){t.switchTab({url:"../tabbar/data"})},1e3))},onPageScroll:function(t){},methods:{loadOrder:function(e){var n=this;switch(e){case 0:this.status="ALL";break;case 1:this.status="WP";break;case 2:this.status="WR";break;case 3:this.status="YR";break;case 4:this.status="DD";break}setTimeout(function(){t.request({url:n.prefix+"/orderPage",data:{status:n.status,mid:n.getMerchantInfo().id,size:50},success:function(t){n.list=t.data.data,n.tabbarIndex=e}})},10)},toRoom:function(e){t.navigateTo({url:"../room/room?id="+e})},toComment:function(e,n){t.navigateTo({url:"./comment?oId="+e+"&rId="+n})},cancelOrder:function(e){var n=this;t.showModal({title:"",content:"确定删除此订单？",success:function(a){a.confirm&&t.request({url:n.prefix+"/doOpeOrder",data:{status:"D",id:e.id},success:function(t){n.list.splice(n.list.indexOf(e.id),1)}})}})},agree:function(e){var n=this;t.showModal({title:"",content:"是否同意退款？",success:function(a){a.confirm&&t.request({url:n.prefix+"/doOpeOrder",data:{status:"SDD",id:e.id},success:function(e){t.showToast({title:"退款成功",icon:"none"}),n.loadOrder(4)}})}})},refuse:function(e){var n=this;t.showModal({title:"",content:"是否拒绝退款？",success:function(a){a.confirm&&t.request({url:n.prefix+"/doOpeOrder",data:{status:"FDD",id:e.id},success:function(e){t.showToast({title:"已拒绝",icon:"none"}),n.loadOrder(4)}})}})}}};e.default=n}).call(this,n("543d")["default"])},e7ff:function(t,e,n){"use strict";(function(t){n("d957"),n("921b");a(n("66fd"));var e=a(n("685f"));function a(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])}},[["e7ff","common/runtime","common/vendor"]]]);