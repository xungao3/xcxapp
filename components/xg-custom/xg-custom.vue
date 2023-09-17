<template name="xg-custom">
	<view :class="classnames">
		<view v-if="showself&&block.link" :style="[root,block.styles]" class="content" @click="linkclick">{{custom}}</view>
		<view v-if="showself&&!block.link" :style="[root,block.styles]" class="content" @click.stop="itemclick">{{custom}}</view>
	</view>
</template>

<script>
	import {mixin} from '../../js/mixin.js';
	export default{
		mixins:[mixin],
		data(){
			return{
				xgname: "xg-custom",
				custom:''
			}
		},
		props:{
			dataIndex:[Number,String]
		},
		methods:{
			render:function(){
				const s=this;
				//if(/\[[a-z0-9A-Z\.\_]+\]/.test(s.block.custom)){
					s.custom=s.blockinfo(s.block.custom,s.cont);
				//}else{
				//	s.custom=s.block.custom;
				//}
			},
			itemclick:function(){
				const s=this;
				s.$emit('click',s.dataIndex);
			},
			init:function(){
				const s=this;
				s.render();
			},
		},
		computed:{
			root:function(){
				const s=this;
				const style=s.mainstyles;
				if(s.block.align)style['--block-align']=s.block.align;
				return style;
			}
		},
		mounted:function(){
			const s=this;
			s.xginit();
			s.init();
		},
	}
</script>

<style scoped>
.content{color:var(--text-color);margin:var(--block-margin);padding:var(--block-padding);border-radius:var(--block-radius);text-align:var(--block-align);border:var(--block-border);background:var(--block-bg);font-size:var(--block-fontsize);font-weight:var(--block-weight);}
</style>