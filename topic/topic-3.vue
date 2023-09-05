<template>
	<page-meta :root-font-size="fontsize+'px'"></page-meta>
	<view class="main" :style="mainstyles">
		<view class="top" v-if="topic.pic"><image class="image" mode="widthFix" :src="fileurl(topic.toppic)"></image></view>
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
			<view class="submit" @click="submit">立即申请</view>
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
				const data=s.formdata;
				data.title=s.topic.title+'-'+s.formdata.name+'-'+(s.mobile||s.formdata.mobile);
				data.realmobile=s.mobile;
				s.request({url:s.url('amd/topic/formdata',{id:3}),data:data,success:function(res){
					if(res.msg){
						s.msg(res.msg);
					}
				},method:'POST'})
			},
			getdata(){
				const s=this;
				const data={id:3};
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
page{background:#bf2f20;}
.header{position:relative;margin:auto;margin-top:-4.5rem;width:15rem;height:2.25rem;z-index:3;}
.header-text{position:absolute;left:0;top:0;width:100%;line-height:2.5rem;text-align:center;color:#fff;}
.header .image{width:15rem;height:2.5rem;fill:#f82;}
.top{position:relative;z-index:1;}
.top .image{display:block;width:100%;}

.inputs{position:relative;margin:0.5rem 0.5rem 1rem 0.5rem;padding:1rem;background:#fff;border-radius:1rem;z-index:2;}
.input-label:first-child{margin-top:0;}
.input-label{display:flex;margin-top:0.5rem;margin-bottom:0.5rem;padding:0.8rem;border-radius:0.5rem;background:#fff;box-shadow:0 0 100rem inset rgba(255,255,255,0.5);border:solid 1px #bf2f20}
.input-label .label{margin-right:0.5rem;width:4rem;}
.inputs .input{font-size:0.9rem;flex:1;}

.input-flex{display:flex;}
.get-mobile{display:block;height:1.4rem;line-height:1rem;padding:0.2rem;margin:0 auto;font-size:0.9rem;background:#fff;border:solid 0 rgba(0,0,0,0);}

.submit{margin:1rem 0 0.5rem 0;line-height:2.8rem;border-radius:0.5rem;background:#bf2f20;text-align:center;color:#fff;}

.private{margin-top:1rem;text-align:center;}
</style>
