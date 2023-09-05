<template name="xg-main">
	<view :class="classnames" :style="root">
		<xg-blocks v-if="blocks&&blocks.length" :blocksdata="blocks" :contsdata="conts" :contdata="cont" blocksfrom="main"></xg-blocks>
		<view v-if="showloading" class="xg-loading">
			<view class="xg-fix-bg"></view>
			<view class="xg-loading-dot xg-fix-center">
				<view class="div"></view>
				<view class="div"></view>
				<view class="div"></view>
			</view>
		</view>
	</view>
	<!-- #ifdef MP-WEIXIN -->
		<xg-wx-login :show="showwxlogin"></xg-wx-login>
	<!-- #endif -->
</template>

<script>
	import {basemixin} from '../../js/mixin.js'
	export default{
		mixins:[basemixin],
		data(){
			return {
				xgname:"xg-main",
				blocks:[],
				showloading:false,
				conts:null,
				cont:null,
				showwxlogin:false,
			}
		},
		props:{
		},
		methods:{
			init:function(){
				const s=this;
				s.inithooks(s);
				s.datas();
			}
		},
		mounted:function(){
			const s=this;
			s.init();
		},
		computed:{
			root:function(){
				const s=this;
				const style=s.mainstyles;
				return style;
			}
		},
	}
</script>

<style scoped>
.xg-loading .div{background:var(--theme-color)!important;border:solid 1px #fff;}
.code{position:fixed;width:100vw;height:100vh;left:0;top:0;padding:8rem 0;z-index:999999999;text-align:center;background:#fff;}
.code .input{margin:2rem auto;width:6rem;height:2rem;}
.code .input input{width:6rem;height:2rem;border:solid 1px #ccc;text-align:center;}
.code button{margin:0 auto;width:4rem;min-height:2rem;background:#ff8822;border:none;border-radius:0.3rem;color:#fff;}
</style>