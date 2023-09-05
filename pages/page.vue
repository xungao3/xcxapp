<template>
	<page-meta :page-style="pagestyle" :root-font-size="fontsize+'px'"></page-meta>
	<view :style="root">
		<xg-main></xg-main>
	</view>
</template>

<script>
export default {
	data() {
		return {
			fontsize:16,
			bg:null,
		}
	},
	onLoad(o) {
		const s=this;
		s.rem();
		s.g.options=o||{};
		uni.$on('pagebg',function(bg){
			s.bg=bg;
		});
	},
	methods:{
	},
	computed:{
		pagestyle:function(){
			const s=this;
			let style='';
			if(s.bg)style+='--page-bg:'+s.bg+';';
			return style;
		}
	}
}
</script>

<style>
page{background:var(--page-bg);}
</style>
