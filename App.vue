<script>
	export default {
		onLaunch:function(){
		},
		onShow:function(){
		},
		onHide:function(){
		}
	}
</script>

<style>
@import url('./static/xg.css');
@import url('./static/font.css');
view{font-size:0.9rem;}
page{background:var(--page-bg);}
[data-page="pages/index"] uni-page-head{
	display: none;
}


.block-item-flex .uni-scroll-view-content{display:flex!important;}
.block-item-flex-col .uni-scroll-view-content{display:flex!important;flex-direction:column!important;}


.ul-1{margin:0.5rem;}
.ul-1 .li{line-height:1.5rem;overflow:hidden;}
.ul-1 .li::before{display:block;height:1.5rem;margin-top:-0.05rem;margin-right:0.4rem;float:left;content:'·';font-size:1.5rem;line-height:1em;}
.title-1{font-weight:bold;margin-top:1rem;padding:0.5rem 1rem;font-size:1rem;}
.title-2{font-weight:bold;margin:0.5rem;padding-left:0.3rem;font-size:1rem;border-left:solid 0.25rem var(--theme-color,#f82);line-height:1.5em;}
.tip-1{padding:0 1rem 0.5rem 1rem;color:#888;}
</style>