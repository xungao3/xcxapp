<template name="blocks">
	<scroll-view :data-bid="block.bid" :data-block="block.block" :scroll-x="block.scroll=='x'" :scroll-y="block.scroll=='y'" :style="root">
	<view :class="['blocks root block',(block.bid?'blocks-'+block.bid:''),(block&&block.blocks_display?' block-item-'+block.blocks_display:''),classnames]">
		<block v-for="blocki,index in blocks" v-if="showself">
			<xg-blocks @click="linkclick" class="block block-blocks" v-if="blocki.block=='blocks'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki" :contdata="cont" :contsdata="conts" :blocksdata="blocki.blocks" :cateid="block.cateid||cateid" :theme_color="block.theme_color||theme_color"></xg-blocks>
			<xg-popup @click="linkclick" class="block block-popup" v-if="blocki.block=='popup'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki" :contdata="cont" :contsdata="conts" :blocksdata="blocki.blocks" :cateid="block.cateid||cateid" :theme_color="block.theme_color||theme_color"></xg-popup>
			<xg-nav class="block block-nav" v-if="blocki.block=='nav'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki"></xg-nav>
			<xg-icon-nav class="block block-icon-nav" v-if="blocki.block=='icon-nav'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki"></xg-icon-nav>
			<xg-search-bar class="block block-search-bar" v-if="blocki.block=='search-bar'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki"></xg-search-bar>
			<xg-slide class="block block-slide" v-if="blocki.block=='slide'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki"></xg-slide>
			<xg-sidebar class="block block-sidebar" v-if="blocki.block=='sidebar'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki"></xg-sidebar>
			<xg-cate-box class="block block-cate-box" v-if="blocki.block=='cate-box'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki"></xg-cate-box>
			<xg-cate-boxes class="block block-cate-boxes" v-if="blocki.block=='cate-boxes'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki"></xg-cate-boxes>
			<xg-info-list class="block block-info-list" v-if="blocki.block=='info-list'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki" :contsdata="conts" :cateid="block.cateid||cateid"></xg-info-list>
			<xg-html class="block block-html" v-if="blocki.block=='html'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki" :contdata="cont"></xg-html>
			<xg-custom class="block block-custom" v-if="blocki.block=='custom'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki" :contdata="cont"></xg-custom>
			<xg-icon class="block block-icon" v-if="blocki.block=='icon'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki" :contdata="cont"></xg-icon>
			<xg-comment class="block block-comment" v-if="blocki.block=='comment'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki"></xg-comment>
			<xg-cart class="block block-cart" v-if="blocki.block=='cart'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki"></xg-cart>
			<xg-btns class="block block-btns" v-if="blocki.block=='btns'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki" :contdata="cont"></xg-btns>
			<xg-btn class="block block-btn" v-if="blocki.block=='btn'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki" :contdata="cont"></xg-btn>
			<xg-cate-list class="block cate-list" v-if="blocki.block=='cate-list'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki"></xg-cate-list>
			<xg-img-nav class="block img-nav" v-if="blocki.block=='img-nav'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki"></xg-img-nav>
			<xg-options class="block options" v-if="blocki.block=='options'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki" :cateid="block.cateid||cateid" :theme_color="block.theme_color||theme_color"></xg-options>
			<xg-image class="block image" v-if="blocki.block=='image'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki" :contdata="cont"></xg-image>
			<xg-web class="block web" v-if="blocki.block=='web'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki" :contdata="cont"></xg-web>
			<xg-video class="block video" v-if="blocki.block=='video'" :data-bid="blocki.bid" :data-block="blocki.block" :blockdata="blocki" :contdata="cont"></xg-video>
		</block>
		<xg-menu class="block block-menu" v-if="menu" :data-bid="menu.bid" :data-block="menu.block" :blockdata="menu"></xg-menu>
		<block v-for="popup,index in popups">
			<xg-popup ref="popup" :blocks="popup.blocks"></xg-popup>
		</block>
	</view>
	</scroll-view>
	<view v-if="showloading" class="xg-loading">
		<view class="xg-fix-bg"></view>
		<view class="xg-loading-dot xg-fix-center">
			<view class="div"></view>
			<view class="div"></view>
			<view class="div"></view>
		</view>
	</view>
</template>

<script>
	import {mixin} from '../../js/mixin.js'
	export default{
		mixins:[mixin],
		data(){
			return{
				xgname:"xg-blocks",
				popups:[],
				blocks:[],
				menu:null,
				showloading:false,
			}
		},
		props:{
			isloop:Boolean,
			blocksfrom:String,
			blocksdata: Array
		},
		watch:{
			blocksdata:{
				handler(n,o){
					const s=this;
					for(let i in n){
						if(n[i].block=='menu'){
							s.menu=n[i];
							break;
						}
					}
					s.blocks=n;
					s.hooks('blocks-mutated',s);
				},
				immediate:true,
				deep:true
			},
		},
		methods:{
			init:function(){
				const s=this;
				if(s.blocksfrom=='main'){
					s.g.box=s.box;
					s.classnames.push('compiling-block');
				}
			},
			render:function(){
				const s=this;
				if(s.block)s.dataurl(s.block);
			},
			box:function(data){
				const s=this;
				const index=s.popups.length;
				s.popups.push(data);
				setTimeout(function(){
					s.$refs['popup'][index].open();
				},200);
				return function(){
					return s.$refs['popup'][index];
				};
			}
		},
		computed:{
			root:function(){
				const s=this;
				const style=s.mainstyles;
				for(let name in style){
					let name2=name.replace('--block-','--blocks-');
					if(name2!=name){
						style[name2]=style[name];
						delete style[name];
					}
				}
				if(!style['--blocks-margin'])style['--blocks-margin']='0px';
				if(!style['--blocks-padding'])style['--blocks-padding']='0px';
				if(s.block.blocks_display=='justify'){
					style['--blocks-display']='flex';
					style['--blocks-justify-content']='space-between';
				}
				if(s.block.blocks_display=='flex')style['--blocks-display']='flex';
				if(s.block.blocks_display=='flex-col'){
					style['--blocks-display']='flex';
					style['--blocks-direction']='column';
				}
				return style;
			}
		},
		mounted:function(){
			const s=this;
			s.xginit();
			s.init();
		},
		onShareAppMessage(){
			const s=this;
			return {title:s.cont.title,path:'/pages/article?id='+s.id}
		},
	}
</script>

<style scoped>
.root{}
.blocks{display:var(--blocks-display,block);flex:1;width:var(--blocks-width);height:var(--blocks-height);flex-direction:var(--blocks-direction);margin:var(--blocks-margin);padding:var(--blocks-padding);border:var(--blocks-border);border-radius:var(--blocks-radius);background:var(--blocks-bg);justify-content:var(--blocks-justify-content);}

.xg-loading-tips{max-width:8rem;}
.xg-loading-dot,.xg-loading-dot-2{display:flex;}
.xg-loading-dot .div,.xg-loading-dot-2 .div{width:1rem;height:1rem;margin:0.1rem;border-radius:50%;animation-name:xg-loading-dot;animation-duration:0.5s;animation-iteration-count:infinite;animation-timing-function:linear;}
.xg-loading-dot-2 .div{animation-name:xg-loading-dot-2;margin:0.1rem;animation-duration:1s;animation-timing-function:ease;}
.xg-loading-dot .div:nth-child(1){animation-delay:0s;}
.xg-loading-dot .div:nth-child(2){animation-delay:0.1s;}
.xg-loading-dot .div:nth-child(3){animation-delay:0.2s;}
@keyframes xg-loading-dot{0%{transform:translateY(0%);}25%{transform:translateY(70%);}75%{transform:translateY(-70%);}100%{transform:translateY(0%);}}
.xg-loading-dot-2 .div:nth-child(1){animation-delay:-0.6s;}
.xg-loading-dot-2 .div:nth-child(2){animation-delay:-0.45s;}
.xg-loading-dot-2 .div:nth-child(3){animation-delay:-0.3s;}
.xg-loading-dot-2 .div:nth-child(4){animation-delay:-0.15s;}
.xg-loading-dot-2 .div:nth-child(5){animation-delay:0s;}
@keyframes xg-loading-dot-2{0%{transform:scale(110%,110%);opacity:0.8;}40%{transform:scale(200%,200%);opacity:0.4;}80%{transform:scale(110%,110%);opacity:0.8;}100%{transform:scale(110%,110%);opacity:0.8;}}
</style>