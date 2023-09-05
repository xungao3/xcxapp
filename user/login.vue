<template>
	<page-meta :root-font-size="fontsize+'px'"></page-meta>
	<view class="bg" :style="mainstyles">
		<view class="logo">
			<image class="logo-img" mode="heightFix" src="../static/images/logo-1.png"></image>
		</view>
		<form @submit="submit" class="form">
			<view class="label">手机号</view>
			<input class="input" type="text" name="mobile" v-model="mobile" />
			<view class="label">验证码</view>
			<input class="input" type="number" name="vcode" v-model="vcode" />
			<view class="btns">
				<button class="btn" @click="getvcode">获取验证码</button>
				<button class="btn" form-type="submit">立即登录</button>
			</view>
		</form>
		<xg-menu active="ucenter"></xg-menu>
	</view>
</template>

<script>
	import {mixin} from '../js/mixin.js'
	export default {
		mixins:[mixin],
		data() {
			return {
				mobile: '',
				fontsize:16,
				vcode: ''
			}
		},
		methods: {
			submit: function(e) {
				const s = this;
				var formdata = e.detail.value;
				if (!formdata.mobile) {
					s.msg('请输入手机号');
					return false;
				}
				if (!formdata.vcode) {
					s.msg('请输入验证码');
					return false;
				}
				s.request({
					url:s.url('user/login',{mobile:s.mobile,vcode:s.vcode}),
					success:function(data){
						if(data.ok){
							s.msg(data.msg,function(){
								uni.redirectTo({url:'/user/index'});
							});
						}else if(data.msg){
							s.msg(data.msg);
						}
					}
				});
			},
			getvcode: function() {
				const s = this;
				if(!s.ismobile(s.mobile)){
					s.msg('请填写正确的手机号');
					return;
				}
				s.request({
					url:s.url('ecms@user.getvcode',{mobile:s.mobile}),
					success:function(data){
						if(data.ok){
							s.msg(data.msg);
						}else if(data.msg){
							s.msg(data.msg);
						}
					}
				});
			},
		},
		onLoad(options) {
			const s = this;
			s.rem();
		},
	}
</script>

<style>
.logo{overflow:hidden;}
.logo-img{display:block;height:3rem;margin:2rem auto 0 auto;}
.form{display:block;margin:2rem 1.5rem 2rem 1.5rem;padding:1.7rem 2rem 1.3rem 2rem;background:rgba(255,255,255,0.2);border-radius:0.6rem;box-shadow-bak:0 0 0.2rem 0.2rem rgba(255,255,255,0.1);}
.label{position:relative;width:3rem;height:1rem;z-index:2;text-align:center;font-size:0.9rem;color:var(--theme-color);font-weight:bold;}
.input{position:relative;height:2.5rem;margin:1rem 0;padding:0.4rem 0.6rem;border:solid 1px var(--theme-color);box-shadow:0 0 1px 1px rgba(255,255,255,0.2);border-radius:0.5rem;z-index:1;}
.btn{height:2.5rem;margin:1rem 0;padding:0;border:none;background:var(--theme-color);line-height:2.5rem;color:rgba(255,255,255,0.8);border-radius:0.5rem;font-size:0.95rem;}
</style>