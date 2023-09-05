
const basemixin={
	data(){
		return {
			showwxlogin:false,
			fontsize:16,
			page:1,
		}
	},
	props:{
	},
	methods: {
		// watch:function(str,fun,immediate){
		// 	const s=this;
		// 	const keys=str.split('.');
		// 	if(keys[0]=='data'){
		// 		str=keys.shift().join('.');
		// 	}
		// 	s.$watch(str,fun);
		// 	if(immediate){
		// 		let value=s.data;
		// 		if(keys){
		// 			for(let key of keys){
		// 				if(s.isobj(value)||s.isarr(value)){
		// 					value=value[key];
		// 				}else{
		// 					value=undefined;
		// 				}
		// 			}
		// 		}
		// 		fun(value);
		// 	}
		// }
	},
	computed:{
		options:{
			get(){
				const s=this;
				return s.g.options||{};
			},
			set(n){
				const s=this;
				if(n.page)s.page=n.page;
				s.g.options=n;
			}
		},
		getinfo:function(){
			const s=this;
			let info={};
			for(let name in s.systems){
				let sysi=s.systems[name];
				if((s.block&&s.block.sys&&s.block.sys==name)||s.options[sysi.cateid]||(s.g.sys&&s.g.sys==name)){
					info={sys:name,idname:sysi.contid,cidname:sysi.cateid};
				}
			}
			return info;
		},
		sys:function(){
			const s=this;
			return s.getinfo.sys||'xg';
		},
		cidname:function(){
			const s=this;
			return s.getinfo.cidname||'cid';
		},
		idname:function(){
			const s=this;
			return s.getinfo.idname||'id';
		},
		cidnames:function(){
			const s=this;
			const names={};
			if(s.g.datas){
				const systems=s.systems;
				for(let sys in systems){
					if(!systems[sys]||!systems[sys].cateid)continue;
					names[sys]=systems[sys].cateid;
				}
			}
			return names;
		},
		idnames:function(){
			const s=this;
			const names={};
			if(s.g.datas){
				const systems=s.systems;
				for(let sys in systems){
					if(!systems[sys]||!systems[sys].contid)continue;
					names[sys]=systems[sys].contid;
				}
			}
			return names;
		},
		cid:function(){
			const s=this;
			return s.options[s.cidname]||(s.block&&s.block.cateid)||s.cateid;
		},
		id:function(){
			const s=this;
			return s.options[s.idname];
		},
		cates:function(){
			const s=this;
			if(s.g.datas&&s.g.datas.cates&&s.sys){
				return s.g.datas.cates[s.sys];
			}
			return {};
		},
		model:function(){
			const s=this;
			if(s.cates&&s.cid){
				return s.cates[s.cid].model;
			}
		},
		count:function(){
			const s=this;
			if(s.cates&&s.cid){
				let c=count(s.cid);
				return c;
			}
			function count(pid) {
				let sum = 0;
				if(s.cates[pid]){
					sum += parseInt(s.cates[pid].count);
				}
				for (let id in s.cates) {
					const cate = s.cates[id];
					if (cate.pid===pid) {
						sum += count(s.cates, id);
					}
				}
				return sum;
			}
			return 0;
		},
		contlinks:function(){
			const s=this;
			const links=(s.g.datas||{}).links||{};
			return links.cont;
		},
		catelinks:function(){
			const s=this;
			const links=(s.g.datas||{}).links||{};
			return links.cate;
		},
		topiclinks:function(){
			const s=this;
			const links=(s.g.datas||{}).links||{};
			return links.topic;
		},
		pages:function(){
			const s=this;
			return (s.g.datas||{}).pages||{};
		},
		systems:function(){
			const s=this;
			return (s.g.datas||{}).systems||{};
		},
		pagename:function(){
			const s=this;
			return s.options.pagename||'index';
		}
	}
};
const mixin={
	data(){
		return {
			block:{},
			conts:[],
			cont:{},
			classnames:[],
			on:{}
		}
	},
	mixins:[basemixin],
	props:{
		contsdata:Array,
		blockdata:Object,
		contdata:Object,
		cateid:[String,Number],
		theme_color:String,
		class:[Array,Object,String]
	},
	computed:{
	},
	methods: {
		xginit:function(){
			const s=this;
			s.page=s.options.page||s.page;
			s.o('xg-emit',function(d){
				let key,val,data;
				if(s.isobj(d)&&s.isstr(d.key)){
					key=d.key.split('.');
					val=d.value;
				}else if(s.isarr(d)&&s.isstr(d[0])){
					key=d[0].split('.');
					val=d[1];
				}
				const vname=key[0];
				const kname=key[1];
				if(vname=='on'&&s.on){
					data=s.on;
				}else if(vname=='cont'&&s.cont){
					data=s.cont;
				}else if(vname=='conts'&&s.conts){
					data=s.conts;
				}else if(vname=='block'&&s.block){
					data=s.block;
				}
				if(data){
					if(s.isunde(val)){
						if(data[kname]){
							val=false;
						}else{
							val=true;
						}
					}
					data[kname]=val;
					if(s.block.show){
						s.block.show='1&&'+s.block.show;
					}
				}
			});
		},
		linkclick:function(e){
			const s=this;
			if(s.block&&s.block.emit){
				const arr=s.block.emit.split(';');
				for(let i of arr){
					const data=i.split('=');
					s.o('xg-emit',data);
				}
				return;
			}
			if(s.block&&s.cont&&s.block.link_data){
				e={};
				let data=s.block.link_data.split(',');
				for(let i in data){
					e[data[i]]=s.cont[data[i]];
				}
				e=s.linkdata(e);
			}
			s.link(e);
		}
	},
	directives: {
		'dom-update': {
			mounted(el,binding){
				const s=binding.instance;
				s.hooks('dom-updated',el,s);
			}
		}
	},
	watch:{
		class:{
			handler(n,o){
				const s=this;
				for(let i in s.classnames){
					if(o===s.classname[i])delete s.classname[i];
				}
				s.classnames.push(n);
			},
			immediate:true,
			deep:true
		},
		blockdata:{
			handler(n,o){
				const s=this;
				if(n){
					if(n.cateid&&n.cateid.cid)n.cateid=n.cateid.cid;
					s.block=n;
					if(s.isfun(s.render))s.render();
					s.hooks('block-mutated',s,n.bid);
				}
			},
			immediate:true,
			deep:true,
		},
		contsdata:{
			handler(n,o){
				const s=this;
				if(s.block.info_left||s.block.info_right){
					for(let i in n){
						n[i].left=s.blockinfo(s.block.info_left,n[i]);
						n[i].right=s.blockinfo(s.block.info_right,n[i]);
					}
				}
				s.conts=n;
			},
		},
		contdata:{
			handler(n,o){
				const s=this;
				if(n&&s.isobj(n)&&!s.iseobj(n)){
					s.cont=n;
					if(s.isfun(s.render))s.render();
				}
			},
			immediate:true,
			deep:true,
		}
	},
	computed:{
		showself:function(){
			const s=this;
			var show=true;
			if(s.block&&s.block.show){
				var logicalOperators = ["&", "|"];
				var tokens = s.block.show.replace(/[\&]+/g,'&').replace(/[\|]+/g,'|').split(/([&|])/);
				var stack = [];
				for (let i = 0; i < tokens.length; i++) {
					let token = tokens[i];
					if (logicalOperators.includes(token)) {
						stack.push(token);
					} else {
						if(token=='true'||token=='1'){
							stack.push(1);
						}else if(token=='false'||token=='0'){
							stack.push(0);
						}else{
							let value=s;
							const keys=token.split('.');
							for(let key of keys){
								if(value)value=value[key];
							}
							stack.push(value);
						}
					}
					if (stack.length === 3) {
						var op2 = stack.pop();
						var operator = stack.pop();
						var op1 = stack.pop();
						var operationResult = performOperation(op1, operator, op2);
						stack.push(operationResult);
					}
				}
				if (stack.length !== 1) {
					return false;//throw new Error("无效的条件表达式: " + condition);
				}
				return stack[0];
				function performOperation(op1, operator, op2) {
					switch (operator) {
						case "&":
							return op1 && op2;
						case "|":
							return op1 || op2;
						default:
							return false;//throw new Error("无效的运算符: " + operator);
					}
				}
			}
			return show;
		},
		mainstyles:function(){
			const s=this;
			const block=s.block;
			const style={}
			style['--theme-color']=s.theme_color||s.c.theme_color;
			if(!block)return style;
			if(block.margin){
				const margin=s.style4in1(block.margin);
				style['--block-margin-left']=margin.left;
				style['--block-margin-right']=margin.right;
			}else{
				style['--block-margin-left']='0px';
				style['--block-margin-right']='0px';
			}
			if(block.theme_color)style['--theme-color']=block.theme_color;
			if(block.z_index)style['--block-z-index']=block.z_index;
			if(block.border)style['--block-border']=block.border;
			if(block.weight)style['--block-weight']=block.weight;
			if(block.margin)style['--block-margin']=block.margin;
			if(block.padding)style['--block-padding']=block.padding;
			if(block.width)style['--block-width']=block.width;
			if(block.height)style['--block-height']=block.height;
			if(block.align)style['--block-align']=block.align;
			if(block.line_height)style['--block-line-height']=block.line_height;
			if(block.radius)style['--block-radius']=block.radius;
			if(block.bg_color)style['--block-bg']=block.bg_color;
			if(block.text_color)style['--text-color']=block.text_color;
			if(block.fontsize)style['--block-fontsize']=block.fontsize;
			if(block.styles)style['block-style']=[block.styles];
			return style;
		},
	}
};
export {mixin,basemixin};