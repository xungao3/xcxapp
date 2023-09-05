<template>
	<page-meta :root-font-size="fontsize+'px'"></page-meta>
	<view :style="mainstyles">
		<view class="top xg-clear">
			<view class="avatar xg-fl"><image class="image" :src="user.avatar"></image></view>
			<view class="username xg-fl">{{user.username}}</view>
		</view>
		<view class="cont">
			<view class="list" v-if="list.length">
				<view class="item" v-for="(item,index) in list" @click="link">
					<view class="xg-flex">
						<view class="title xg-flex-1">{{item.no}}</view>
						<view class="time xg-flex-1">{{item.date}}</view>
					</view>
					<view class="xg-flex">
						<view class="title xg-flex-1">{{item.caizhi||'--'}}</view>
						<view class="time xg-flex-1">{{item.color||'--'}}</view>
					</view>
					<view class="xg-flex">
						<view class="title xg-flex-1">{{item.taocaizhi||'--'}}</view>
						<view class="time xg-flex-1">{{item.taojiao||'--'}}</view>
					</view>
				</view>
			</view>
			<view class="nors" v-else>无记录</view>
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
				fontsize:16,
				menu:null,
				list:[]
			}
		},
		methods: {
			init:function(){
				const s=this;
				s.request({
					url:s.url('amd/lezhan/orders'),success:function(res){
						s.list=res.data;
					}
				});
			}
		},
		onLoad(o){
			const s=this;
			s.init();
			s.checklogin();
			s.rem();
			s.inithooks(s);
			s.datas();
		}
	}
</script>

<style>
page{background:#f1f1f1;}
.top{margin:1rem;padding:1rem;height:3rem;background:#fff;border-radius:0.7rem;}
.avatar .image{width:3rem;height:3rem;background:#f5f5f5;border-radius:50%;}
.username{margin-left:1rem;height:3rem;line-height:3rem;}
.cont{position:relative;z-index:1;background:#fff;margin:1rem;padding:0.001rem 0;border-radius:1rem;}
.list .item{margin:0.5rem;padding:0.5rem;background:rgba(0,0,0,0.05);font-size:0.8rem;border-radius:0.5rem;}
.nors{padding:2rem;text-align:center;}
</style>
