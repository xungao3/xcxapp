<template>
	<page-meta :root-font-size="fontsize+'px'"></page-meta>
	<view :style="mainstyles">
		<view class="cont">
			<view class="top xg-clear">
				<view class="avatar xg-fl"><image class="image" :src="user.avatar"></image></view>
				<view class="username xg-fl">{{user.username}}</view>
			</view>
			<view class="menus">
				<view class="items">
					<view class="item" v-if="user.dealer" @click="orders">
						<view class="xg-icon xg-icon-truck"></view>
						<view class="item-name">我的订单</view>
					</view>
					<view class="item">
						<view class="xg-icon xg-icon-time"></view>
						<view class="item-name">浏览记录</view>
					</view>
				</view>
			</view>
			<view @click="jxs" class="logout">我是经销商</view>
			<view @click="logout" class="logout">退出登录</view>
		</view>
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
				menu:null,
				showwxlogin:false
			}
		},
		methods: {
			logout:function(){
				const s=this;
				s.slogout();
			},
			orders:function(){
				const s=this;
				s.link('/user/orders');
			},
			jxs:function(){
				const s=this;
				s.link('/user/jxs');
			}
		},
		onLoad(){
			const s=this;
			s.checklogin();
			s.rem();
			s.inithooks(s);
			s.datas();
		}
	}
</script>

<style>
page{background:#f5f5f5;}
.top{margin:1rem;padding:1rem;height:3rem;background:#fff;border-radius:0.7rem;}
.avatar .image{width:3rem;height:3rem;background:#f5f5f5;border-radius:50%;}
.username{margin-left:1rem;height:3rem;line-height:3rem;}

.menus{padding:0.25rem;margin:1rem;background:#fff;border-radius:0.7rem;}
.menus .item{display:flex;height:1.5rem;margin:0 0.5rem;padding:0.75rem 0.5rem;line-height:1.5rem;font-size:1.5rem;border-bottom:solid 1px #f1f1f1;}
.menus .item:last-child{border-bottom:0;}
.menus .xg-icon{font-size:1.2rem;width:1.2rem;margin-right:1rem;color:var(--theme-color);text-align:center;}

.logout{margin:1rem;padding:0.5rem;line-height:1.7rem;text-align:center;background:var(--theme-color);color:#fff;border-radius:0.5rem;}
</style>
