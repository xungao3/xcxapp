<template>
	<page-meta :root-font-size="fontsize+'px'"></page-meta>
	<view class="main" :style="mainstyles">
		<view class="top" v-if="topic.pic"><image class="image" mode="widthFix" :src="fileurl(topic.toppic)"></image></view>
		<view class="header"><image class="image" src="../static/images/txing.svg"></image><view class="header-text">还有15个免费报价的名额</view></view>
		<view class="inputs">
			<view class="input-label">
				<view class="label">您的称呼</view>
				<input class="input" type="text" v-model="formdata.name" placeholder="请填写您的称呼">
			</view>
			<view class="input-label">
				<view class="label">手机号</view>
				<view class="input-flex">
					<input v-if="mobile" class="input" type="text" v-model="mobile" disabled>
					<input v-else class="input" type="text" v-model="formdata.mobile" placeholder="请填写手机号">
					<button class='get-mobile' @getphonenumber="wxmobile" open-type="getPhoneNumber">授权获取</button>
				</view>
			</view>
			<view class="input-label">
				<view class="label">城市地区</view>
				<view class="city">
					<view class="city-1"><picker @change="regionchange" :range="regiondata[1]" :data-level="1"><view class="city-lable">{{formdata.province||'选择省份'}}</view></picker></view>
					<view class="city-2"><picker @change="regionchange" :range="regiondata[2]" :data-level="2"><view class="city-lable">{{formdata.city||'选择城市'}}</view></picker></view>
					<view class="city-3"><picker @change="regionchange" :range="regiondata[3]" :data-level="3"><view class="city-lable">{{formdata.county||'选择区县'}}</view></picker></view>
				</view>
			</view>
			
			<view class="input-label">
				<view class="label">小区名称</view>
				<input class="input" type="text" v-model="formdata.estate" placeholder="请填写小区名称">
			</view>
			<view class="input-label">
				<view class="label">房屋面积</view>
				<input class="input" type="number" v-model="formdata.area" placeholder="请填写房屋面积">
				<view>㎡</view>
			</view>
			<view class="private">我们将严格保护您的隐私</view>
			<view class="submit" @click="submit">立即测试</view>
		</view>
	</view>
	<xg-menu v-if="menu" :blockdata="menu"></xg-menu>
</template>

<script>
	import {mixin} from '../js/mixin.js'
	export default {
		mixins:[mixin],
		data() {
			return {
				menu:null,
				topic:{},
				checked:0,
				mobile:'',
				formdata:{
					mobile:'',
					name:'',
					estate:'',
					province:'',
					city:'',
					county:'',
					area:'',
				},
				regiondata:{},
				regionorig:{},
			}
		},
		onLoad(o) {
			const s=this;
			o.pagename='topic';
			s.g.options=o;
			s.rem();
			s.inithooks(s);
			s.reghook('datas-after','topic-1',function(){
				s.getdata();
				s.getregion(0,1);
			});
			s.datas();
		},
		methods: {
			check(e){
				const s=this;
				s.checked=e.currentTarget.dataset.i;
				s.formdata.house=e.currentTarget.dataset.house;
			},
			submit(){
				const s=this;
				if(!s.formdata.name){
					s.msg('请填写您的称呼');
					return;
				}
				if(!s.formdata.mobile&&!s.mobile){
					s.msg('请填写手机号');
					return;
				}
				if(!s.formdata.province){
					s.msg('请选择省份');
					return;
				}
				if(!s.formdata.city){
					s.msg('请选择城市');
					return;
				}
				if(!s.formdata.county){
					s.msg('请选择区县');
					return;
				}
				if(!s.formdata.area){
					s.msg('请填写房屋面积');
					return;
				}
				const data=s.formdata;
				data.title=s.topic.title+'-'+s.formdata.name+'-'+s.formdata.mobile+'-'+s.formdata.province+'-'+s.formdata.city+'-'+s.formdata.county+(s.formdata.estate?'-'+s.formdata.estate:'')+'-'+s.formdata.area+'平米';
				data.realmobile=s.mobile;
				s.request({url:s.url('amd/topic/formdata',{id:2}),data:data,success:function(res){
					if(res.ok===true){
						s.msg(res.msg);
					}else if(res.msg){
						s.msg(res.msg);
					}
				},method:'POST'})
			},
			regionchange(e){
				const s=this;
				if(e.currentTarget.dataset.level==1){
					const pid=s.regionorig[1][e.detail.value].id;
					s.regionorig[2]=s.regiondata[2]=[];
					s.regionorig[3]=s.regiondata[3]=[];
					s.formdata.city='';
					s.formdata.county='';
					s.formdata.province=s.regionorig[1][e.detail.value].name;
					s.getregion(pid,2);
				}else if(e.currentTarget.dataset.level==2){
					const pid=s.regionorig[2][e.detail.value].id;
					s.regionorig[3]=s.regiondata[3]=[];
					s.formdata.county='';
					s.formdata.city=s.regionorig[2][e.detail.value].name;
					s.getregion(pid,3);
				}else if(e.currentTarget.dataset.level==3){
					s.formdata.county=s.regionorig[3][e.detail.value].name;
				}
			},
			getregion(pid,level){
				const s=this;
				s.region(pid,function(data){
					s.regionorig[level]=data;
					s.regiondata[level]=data.map(function(v){return v.name});
				});
			},
			getdata(){
				const s=this;
				const data={id:2};
				s.request({url:s.url('amd/topic/topic'),data:data,success:function(res){
					if(res.ok==true){
						s.topic=res.data;
					}
				}});
			},
		}
	}
</script>

<style>
page{background:#f1f1f1;}
.header{position:relative;margin:auto;margin-top:-4.5rem;width:15rem;height:2.25rem;z-index:3;}
.header-text{position:absolute;left:0;top:0;width:100%;line-height:2.5rem;text-align:center;color:#fff;}
.header .image{width:15rem;height:2.5rem;fill:#f82;}
.top{position:relative;z-index:1;}
.top .image{display:block;width:100%;}

.inputs{position:relative;margin:0 0.5rem 1rem 0.5rem;padding:1rem;background:#fff;border-radius:1rem;z-index:2;}
.input-label:first-child{margin-top:0;}
.input-label{display:flex;margin-top:0.5rem;margin-bottom:0.5rem;padding:0.8rem;border-radius:0.5rem;background:var(--theme-color);box-shadow:0 0 100rem inset rgba(255,255,255,0.5);border:solid 1px var(--theme-color)}
.input-label .label{margin-right:0.5rem;width:4rem;}
.inputs .input{font-size:0.9rem;flex:1;}
.city{display:flex;flex:1;}
.city-1,.city-2,.city-3{width:33%;}
/* #ifdef H5 */
.city-lable{color:#888;}
/* #endif */
/* #ifdef MP-WEIXIN */
.city-lable{color:#888;}
/* #endif */
.input-flex{display:flex;}
.get-mobile{display:block;height:1.4rem;line-height:1rem;padding:0.2rem;margin:0 auto;font-size:0.9rem;background:#fff;border:solid 0 rgba(0,0,0,0);}

.submit{margin:1rem 0 0.5rem 0;line-height:2.8rem;border-radius:0.5rem;background:var(--theme-color);text-align:center;color:#fff;}

.private{margin-top:1rem;text-align:center;}
</style>
