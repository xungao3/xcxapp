<template>
	<page-meta :root-font-size="fontsize+'px'"></page-meta>
	<view class="main" :style="mainstyles">
		<view class="top" v-if="topic.pic"><image class="image" mode="widthFix" :src="fileurl(topic.toppic)"></image></view>
		<view class="check-group">
			<view class="check-title">您的房屋类型</view>
			<view class="check-line"></view>
			<view class="check-box">
				<view class="check-item" @click="check" :class="checked==0?'check-active':''" :data-i="0" data-house="毛坯房">
					<image class="icon" :src="fileurl('/upload/topic-1/icon-01.png')"></image>
					<view class="title">毛坯房</view>
				</view>
				<view class="check-item" @click="check" :class="checked==1?'check-active':''" :data-i="1" data-house="精装房">
					<image class="icon" :src="fileurl('/upload/topic-1/icon-02.png')"></image>
					<view class="title">精装房</view>
				</view>
				<view class="check-item" @click="check" :class="checked==2?'check-active':''" :data-i="2" data-house="旧房改造">
					<image class="icon" :src="fileurl('/upload/topic-1/icon-03.png')"></image>
					<view class="title">旧房改造</view>
				</view>
				<view class="check-item" @click="check" :class="checked==3?'check-active':''" :data-i="3" data-house="其它">
					<image class="icon" :src="fileurl('/upload/topic-1/icon-04.png')"></image>
					<view class="title">其它</view>
				</view>
			</view>
		</view>
		<view class="inputs">
			<view class="input-label"><view class="xg-icon xg-icon-phone
"></view><view class="label">手机号</view></view>
			<view class="input-flex">
				<input v-if="mobile" class="input" type="text" v-model="mobile" disabled>
				<input v-else class="input" type="text" v-model="formdata.mobile" placeholder="请填写手机号">
				<button class='get-mobile' @getphonenumber="wxmobile" open-type="getPhoneNumber">授权获取</button>
			</view>
			<view class="input-label"><view class="xg-icon xg-icon-sitemap
"></view><view class="label">城市地区</view></view>
			<view class="city">
				<view class="city-1"><picker @change="regionchange" :range="regiondata[1]" :data-level="1"><view class="city-lable">{{formdata.province||'选择省份'}}</view></picker></view>
				<view class="city-2"><picker @change="regionchange" :range="regiondata[2]" :data-level="2"><view class="city-lable">{{formdata.city||'选择城市'}}</view></picker></view>
				<view class="city-3"><picker @change="regionchange" :range="regiondata[3]" :data-level="3"><view class="city-lable">{{formdata.county||'选择区县'}}</view></picker></view>
			</view>
			<view class="input-label"><view class="xg-icon xg-icon-building
"></view><view class="label">小区名称</view></view>
			<input class="input" type="text" v-model="formdata.estate" placeholder="请填写小区名称">
		</view>
		<view class="submit" @click="submit">立即测试</view>
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
					house:'毛坯房',
					estate:'',
					province:'',
					city:'',
					county:'',
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
				const data=s.formdata;
				data.title=s.topic.title+'-'+(s.mobile||s.formdata.mobile)+'-'+s.formdata.province+'-'+s.formdata.city+'-'+s.formdata.county+(s.formdata.estate?'-'+s.formdata.estate:'')+'-'+s.formdata.house;
				data.realmobile=s.mobile;
				s.request({url:s.url('amd/topic/formdata',{id:1}),data:data,success:function(res){
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
				const data={id:1};
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
.top{position:relative;z-index:1;}
.top .image{display:block;width:100%;}
.check-group{position:relative;z-index:2;margin:-2rem 0.5rem 0.5rem 0.5rem;padding-top:1rem;text-align:center;background:#fff;border-radius:1rem;}
.check-title{position:relative;z-index:3;display:block;width:40%;margin:0 auto -1rem auto;line-height:2rem;background:#fff;overflow:hidden;font-weight:bold;}
.check-line{display:block;width:60%;margin:0 auto 1rem auto;border-bottom:solid 0.1rem #000;}
.check-box{display:flex;padding:0.5rem;}
.check-box .check-item{width:25%;margin:0.25rem;padding:0.5rem;border-radius:0.5rem;text-align:center;overflow:hidden;}
.check-box .check-active{background:var(--theme-color);color:#fff;box-shadow:0 0 20rem rgba(255,255,255,0.3) inset;}
.check-box .icon{display:block;width:3rem;height:3rem;padding:0.4rem;margin:auto;background:var(--theme-color);box-sizing:border-box;border-radius:50%;}

.inputs{margin:1rem 0.5rem;padding:1rem;background:#fff;border-radius:1rem;}
.input-label:first-child{margin-top:0;}
.input-label{margin-top:0.5rem;margin-bottom:0.5rem;}
.input-label .xg-icon{display:inline-block;width:1rem;margin-right:0.1rem;color:var(--theme-color);text-align:center;font-size:1rem;}
.input-label .label{display:inline-block;}
.inputs .input{font-size:0.9rem;}
.input-flex{display:flex;}
.get-mobile{display:block;height:1.4rem;line-height:1rem;padding:0.2rem;margin:0 auto;font-size:0.9rem;background:#fff;border:solid 0 rgba(0,0,0,0);}

.city{display:flex;}
.city-1,.city-2,.city-3{width:33%;}
.city-lable{color:#888;}

.submit{margin:0.5rem 0.5rem 1rem 0.5rem;line-height:2.4rem;border-radius:0.5rem;background:var(--theme-color);text-align:center;color:#fff;}
</style>
