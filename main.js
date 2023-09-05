import * as u from './js/utils.js';
import d from './js/data.js';
import * as wx from './js/weixin.js';
import c from './config.js';
import App from './App';
import {createSSRApp} from 'vue';
export function createApp(){
	const app = createSSRApp(App);
	app.globalData=app.globalData||{};
	app.config.globalProperties.g=app.globalData;
	init(app.config.globalProperties);
	return {app};
}
//import amd from './hooks/amd.js';
function inithooks(s){
	//这里初始化钩子
	//amd(s);
}
function init(s){
	s.xgurl=c.xgurl;
	u.xgset(s.xgurl);
	s.c=c;
	for(let i in u){
		s[i]=u[i];
	}
	for(let i in d){
		s[i]=d[i];
	}
	s.wx=wx;
	s.inithooks=inithooks;
}
