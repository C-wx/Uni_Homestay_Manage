import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

/**本地地址*/
Vue.prototype.prefix = "http://localhost:8866" 	
/**服务地址*/
// Vue.prototype.prefix = "https://www.cbuc.xyz:8866"

//日期格式化
Vue.prototype.formatTime = function(time,showHour){
	var date = new Date(time),
	year = date.getFullYear(),
	month = date.getMonth() + 1,
	day = date.getDate(),
	hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
	minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
	second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
	month >= 1 && month <= 9 ? (month = "0" + month) : "";
	day >= 0 && day <= 9 ? (day = "0" + day) : "";
	var timer = year + '-' + month + '-' + day;
	if(showHour){
		timer += '  '+hour +':'+minute+':'+second;
	}
	return timer;
}

//获取用户openid
Vue.prototype.getLoginStatus = function() {
	try {
		var oid = uni.getStorageSync('oid');
	} catch (e) {}
	if (oid == '') {
		return false;
	} else {
		return oid;
	}
};

//获取商家信息
Vue.prototype.getMerchantInfo = function() {
	try {
		var info = uni.getStorageSync('LOGIN_MERCHANT');
	} catch (e) {}
	if (info == null || info == '') {
		return false;
	} else {
		return info;
	}
};

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
