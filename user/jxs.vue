<template>
	<page-meta :root-font-size="fontsize+'px'"></page-meta>
	<view class="main" :style="mainstyles">
		<xg-checkbox :blockdata="{padding:'0 0.5rem 0.5rem 0'}" :showicon="1" :datas="[{text:'已是经销商',value:'old'},{text:'新申请经销商',value:'new'}]" v-model="oldornew"></xg-checkbox>
		<view class="label">你的地区是？</view>
		<input class="input" placeholder="比如: 北京市-海淀区" type="text" data-name="area" v-model="area" @input="formchange" />
		<view v-if="oldornew=='old'">
			<view class="label">你的经销商名称是？</view>
		</view>
		<view v-if="oldornew!='old'">
			<view class="label">你的姓名是？</view>
		</view>
		<input class="input" type="text" data-name="name" @input="formchange" />
		<view v-if="oldornew!='old'">
			<view class="label">你的联系电话是？</view>
			<input class="input" type="text" data-name="mobile" @input="formchange" />
		</view>
		<button class="btn" @click="submit">{{oldornew!='old'?'申请经销商':'申请经销商权限'}}</button>
	</view>
	<xg-menu v-if="menu" :blockdata="menu"></xg-menu>
	<xg-wx-login :show="showwxlogin"></xg-wx-login>
</template>

<script>
	import {mixin} from '../js/mixin.js'
	export default {
		mixins:[mixin],
		data() {
			return {
				user:{},
				fontsize:16,
				menu:null,
				oldornew:'old',
				info:{
					apply_groupid:1,
				}
			}
		},
		methods: {
			init:function(){
				const s=this;
			},
			submit:function(){
				const s=this;
				console.log(s.info);
				s.request({url:s.url('app/user/form'),data:s.info,method:'POST',success:function(res){
					if(res.ok===true){
						s.goto('/user/index');
					}
					if(res.msg)s.msg(res.msg);
				}});
			},
			formchange:function(e){
				const s=this;
				s.info['apply_'+e.currentTarget.dataset.name]=e.detail.value;
			}
		},
		onLoad(o){
			const s=this;
			s.rem();
			s.init();
			//s.checklogin();
			s.inithooks(s);
			s.datas();
		}
	}
</script>

<style>
.main{margin:2rem auto;padding:2rem;}
.label{position:relative;height:1rem;z-index:2;text-align:left;font-size:0.9rem;color:var(--theme-color);font-weight:bold;}
.input{position:relative;height:2.5rem;margin:1rem 0;padding:0.4rem 0.6rem;border:solid 1px var(--theme-color);box-shadow:0 0 1px 1px rgba(255,255,255,0.2);border-radius:0.5rem;z-index:1;font-size:0.9rem;line-height:1.3rem;}
.btn{height:2.5rem;margin:1rem 0;padding:0;border:none;background:var(--theme-color);line-height:2.5rem;color:rgba(255,255,255,0.8);border-radius:0.5rem;font-size:0.95rem;}
</style>
