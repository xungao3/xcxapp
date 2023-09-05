const s={};

s.linkthis=function(d){
	const s=this;
	var data=s.hook('linkthis',d);
	if(data===true)return data;
	if(s.isstr(d)){
		if(d=='index'){
			if(s.linkdata(s.options)['pagename']=='index'){
				return true;
			}
		}else if(d.indexOf('?')===-1){
			return s.pagename==d;
		}else{
			d=s.query2obj(d.substr(d.indexOf('?')+1));
		}
	}
	if(d){
		if(d[s.idname]){
			if(s.id==d[s.idname]&&s.cid==d[s.cidname]){
				return true;
			}
		}else if(d[s.cidname]&&!s[s.idname]){
			if(s.cid==d[s.cidname]&&s.page==d.page){
				return true;
			}else if(s.cid==d[s.cidname]){
				return true;
			}
		}
	}
	return false;
}
s.urldata=function(d){
	const s=this;
	return s.linkdata(d);
}
s.link=function(e){
	const s=this;
	if(e){
		if(e.currentTarget&&e.currentTarget.dataset){
			var d=e.currentTarget.dataset.link;
		}else if(s.isobj(e)){
			if(e.link){
				var d=e.link;
			}else{
				var d=e;
			}
		}else{
			var d=e;
		}
		var json;
		try{
			json=JSON.parse(d);
		}catch(e){}
		if(json){
			d=json;
		}
		var link=s.hook('link',d);
		if(link===false)return;
		if(link){
			uni.navigateTo({url:link,fail:function(){uni.redirectTo({url:link});}});
			return;
		}
		if(s.isstr(d)){
			if(d.indexOf('[cate]')===0){
				for(let sys in s.cidnames){
					let rt=new RegExp(`[\\?\\&]${s.cidnames[sys]}\\=([\\d]+)`).exec(d);
					if(rt&&rt[1]){
						let data={};
						data[s.cidnames[sys]]=rt[1];
						var d=s.linkdata(data);
					}
				}
			}else if(d.indexOf('[cont]')===0){
				for(let sys in s.cidnames){
					let rt=new RegExp(`[\\?\\&]${s.cidnames[sys]}\\=([\\d]+)\\&${s.idnames[sys]}\\=([\\d]+)`).exec(d);
					if(rt&&rt[1]&&rt[2]){
						let data={};
						data[s.cidnames[sys]]=rt[1];
						data[s.idnames[sys]]=rt[2];
						var d=s.linkdata(data);
					}
				}
			}else if(d=='index'){
				var d={pagename:'index'};
			}else{
				var link='/pages/page?pagename='+d.replace('?','&');
			}
		}
		if(s.isobj(d)){
			if(d.pagename=='index'){
				var link='/pages/index';
			}else{
				var link='/pages/page?'+s.obj2query(d);
			}
		}
		if(link)uni.navigateTo({url:link,fail:function(){uni.redirectTo({url:link});}});
	}
}

s.linkdata=function(d,json){
	const s=this;
	var data=s.hook('linkdata',d);
	if(s.isobj(data)&&!s.iseobj(data)){
		if(s.inxg()&&json)data=JSON.stringify(data);
		return data;
	}
	var data={};
	var pagename;
	let links=s.contlinks;
	for(let page in links){
		let linki=links[page];
		for(let sys in linki){
			let cidname=s.cidnames[sys];
			let idname=s.idnames[sys];
			let linkj=linki[sys];
			if(!d[idname])continue;
			if(s.isstr(linkj)&&linkj.split(',').indexOf(d[cidname]+'')>-1){
				pagename=page;
				data={pagename:pagename};
				data[cidname]=d[cidname];
				data[idname]=d[idname];
				break;
			}
		}
		if(pagename)break;
	}
	if(!pagename){
		let links=s.catelinks;
		for(let page in links){
			let linki=links[page];
			for(let sys in linki){
				let cidname=s.cidnames[sys];
				let idname=s.idnames[sys];
				let linkj=linki[sys];
				if(!d[cidname])continue;
				if(s.isstr(linkj)&&linkj.split(',').indexOf(d[cidname]+'')>-1){
					pagename=page;
					data={pagename:pagename};
					data[cidname]=d[cidname];
					break;
				}
			}
			if(pagename)break;
		}
	}
	if(!pagename){
		let links=s.topiclinks;
		for(let page in links){
			let linki=links[page];
			for(let sys in linki){
				let linkj=linki[sys];
				if(!d.tid)continue;
				if(s.isstr(linkj)&&linkj.split(',').indexOf(d.tid+'')>-1){
					pagename=page;
					data={pagename:pagename};
					data.tid=d.tid;
					break;
				}
			}
			if(pagename)break;
		}
	}
	if(s.iseobj(data)){
		let pagename=d.pagename||'index';
		data={pagename};
	}
	if(s.inxg()&&json)data=JSON.stringify(data);
	return data;
}
s.rem=function(){
	const s=this;
	// #ifdef H5
	try{uni.onWindowdataize((data)=>{rem(parseFloat(data.size.windowWidth));});}catch(e){}
	// #endif
	uni.getSystemInfo({
		success(data) {
			rem(data.screenWidth);
		}
	});
	function rem(size){
		if(size>480)size=480;
		s.fontsize=size/22.5;
	}
}
s.kefu=function(){
	
}
s.slogout=function(){
	const s=this;
	s.confirm('确定退出登录吗？',function(){
		s.request({
			url:s.url('user/logout'),
			success:function(data){
				if(data.ok){
					uni.redirectTo({url:'/pages/index'});
				}else if(data.msg){
					s.msg(data.msg);
				}
			}
		});
	});
}

s.history=function(cid,id,title){
	const s=this;
	var history=s.storage('browse-history');
	if(!s.isarr(history))history=[];
	if(cid){
		var data={cid,id,title};
		data.time=new Date().getTime();
		if(cid==1){
			data.tbname='case';
			data.cate='案例';
		}
		if(cid==2){
			data.tbname='designer';
			data.cate='设计师';
		}
		history.push(data);
		if(history.length>100)history.shift();
		s.storage('browse-history',history);
	}
	return history;
}

s.favorite=function(cid,id,title,iscase){
	const s=this;
	var favorite=s.storage('user-favorite');
	if(!s.isarr(favorite))favorite=[];
	if(cid){
		for(let i in favorite){
			if(favorite[i].id==id&&favorite[i].cid==cid){
				favorite.splice(i,1);
				s.storage('user-favorite',favorite);
				s.msg('成功取消收藏',function(){
					if(!iscase)uni.redirectTo({url:'/user/favorite?ecid='+cid})
				});
				return favorite;
			}
		}
		var data={cid,id,title};
		data.time=new Date().getTime();
		if(cid==1){
			data.tbname='case';
			data.cate='案例';
		}
		if(cid==2){
			data.tbname='designer';
			data.cate='设计师';
		}
		favorite.push(data);
		s.msg('收藏成功');
		if(favorite.length>20)favorite.shift();
		s.storage('user-favorite',favorite);
	}
	return favorite;
}
s.checklogin=function(){
	const s=this;
	s.o('show-wx-login',function(){
		s.showwxlogin=true;
	});
	s.o('userinfo',function(user){
		s.user=user;
	});
	s.logged().then((user)=>{
		if(user){
			s.o('userinfo',user);
		}else{
			// #ifdef MP-WEIXIN
			s.o('show-wx-login');
			// #endif
			// #ifdef MP-BAIDU
			
			// #endif
			// #ifdef H5
			uni.redirectTo({url:'/user/login'});
			// #endif
		}
	});
}
s.logged=function(){
	const s=this;
	return new Promise(function(a,b){
		s.request({
			url:s.url('user/checklogin'),
			success:function(data){
				if(data.ok){
					a(data.user);
				}else{
					a(false);
				}
			},fail:function(){
				b(false);
			}
		});
	});
}



import htmlstyle from './html.js';
s.rehtml=function(html){
	const s=this;
	if(!html)return '';
	const xgurl=(((s.systems||{})[s.sys]||{}).url||s.xgurl);
	html=html.replace(/　/g,'');
	html=html.replace(/src=([\"\'])?(\/upload\/)/g,"src=$1"+xgurl+"$2");
	html=html.replace(/src=([\"\'])?(\/d\/)/g,"src=$1"+xgurl+"$2");
	const styles=[];
	if(s.block&&s.block.indent)styles.push(`text-indent:${s.block.indent};`);
	if(s.block&&s.block.para_dis)styles.push(`margin-bottom:${s.block.para_dis};`);
	const pstyle=styles.join('');
	const imgstyle=`max-width:100%;max-height:none;width:auto;height:auto;`;
	html=htmlstyle(html,pstyle,imgstyle);
	return html ;
};
s.blockinfo=function(text,info){
	const s=this;
	if(text&&s.isstr(text)){
		text=text.replace(new RegExp('(\\\[[a-z0-9A-Z\.\_]+\\\])', 'gm'),function(match,a,b) {
			var tag=match.replace('[','').replace(']','');
			if(tag=='date')return s.format(info['timestamp']||info['news_time']||info['newstime'],0);
			if(tag=='time')return s.format(info['timestamp']||info['news_time']||info['newstime'],1);
			if(tag=='datetime')return s.format(info['timestamp']||info['news_time']||info['newstime'],2);
			if(tag.substr(0,5)=='time.')return s.format(info['timestamp']||info['news_time']||info['newstime'],tag.substr(5).split(''));
			return (info[tag]?info[tag]:'');
		});
		text=text.replace('&amp;','&').replace('&copy;','©');
	}
	return text;
};



s.cont=function(cont){
	const s=this;
	var cid=s.cid;
	var id=s.id;
	if(cid&&id){
		if(!id)return {};
		if(cont){
			s.g.contents=s.g.contents||{};
			s.g.contents[cid]=s.g.contents[cid]||{};
			s.g.contents[cid][id]=cont;
		}else{
			try{
				cont=s.g.contents[cid][id];
			}catch(e){
				
			}
		}
		return cont;
	}
}
s.getconts=function(data){
	const s=this;
	s.requested=true;
	const cid=s.cid;
	let param=s.urldata(s.options);
	data=data||{};
	let page=s.page||1;
	let pagesize;
	pagesize=(s.block&&s.block.pagesize)||10;
	let count=s.count||0;
	let name=cid+'-'+page+'-'+pagesize+'-'+count;
	let sys=s.sys||'xg';
	param['cid']=cid;
	param['page']=page;
	param['sys']=sys;
	param['pagesize']=pagesize;
	param['total']=count;
	let file=s.cachepath(name,'contents',sys);
	s.conts=s.conts||[];
	s.request({url:s.url(file,param),data:data,success:function(data){
		for(let i in data){
			s.conts.push(data[i]);
		}
	},dataType:'json'});
}
s.conts=function(conts){
	const s=this;
	var cid=s.cid;
	var page=s.page;
	if(cid){
		if(!cid)return [];
		if(conts){
			s.g.list=s.g.list||{};
			s.g.list[cid]=s.g.list[cid]||{};
			s.g.list[cid][page]=conts;
		}else{
			try{
				conts=s.g.list[cid][page];
			}catch(e){
				
			}
		}
		return conts;
	}
}
s.navcolor=function(o){
	const s=this;
	//if(!o)o=s.storage('xg-nav-color');
	if(o){
		s.storage('xg-nav-color',o);
		uni.setNavigationBarColor(o);
	}
}
let datas;
s.datas=function(){
	const s=this;
	s.hooks('datas-before',s);
	if(!s.g.datas){
		const thid=s.c.thid||'';
		s.request({url:s.url('index/sets',{thid}),success:function(data){
			s.g.datas=data;
			s.g.hooks=s.extend(s.g.hooks,data.hooks);
			for(let i in data.config){
				s.c[i]=data.config[i];
			}
			initdatas();
		}});
	}else{
		initdatas();
	}
	s.reload=function(){
		s.request({url:s.url('index/sets',{thid}),success:function(data){
			s.g.datas=data;
			initdatas();
		}});
	}
	function initdatas(){
		uni.setNavigationBarTitle({title:s.c.site_name});
		s.navcolor({frontColor:s.c.title_color,backgroundColor:s.c.theme_color});
		let hooks=s.g.hooks.datas;
		let pagename=s.options.pagename||'index';
		let pages=s.g.datas.pages;
		let page=pages[pagename];
		if(page&&page.data&&page.data.bg_color){
			s.o('pagebg',page.data.bg_color);
		}
		let blocks=s.obj2arr(s.g.datas.blocks[pagename]);
		s.blocks=blocks;
		if(s.id&&s.cid){
			let param=s.extend({thid:s.g.datas.thid,sys:s.sys},s.urldata(s.options));
			let name=s.id;
			let file=s.cachepath(name,'xg-'+s.model,s.sys);
			s.request({url:s.url(file,param),success:function(data){
				s.cont=data;
				if(data.title)uni.setNavigationBarTitle({title:data.title});
				// #ifdef MP-BAIDU
				s.setbdinfo();
				// #endif
				for(let i in blocks){
					let block=blocks[i];
					getblock(block,data.cid);
				}
			},dataType:'json'});
		}else if(s.cid){
			uni.setNavigationBarTitle({title:s.cates[s.cid].title});
			s.getconts();
		}
		for(let i in blocks){
			let block=blocks[i];
			getblock(block,s.cid);
		}
		s.hooks('datas-after',s);
	}
	function getblock(block,cid){
		if(!['cate-box','slide','img-nav'].includes(block.block))return;
		let cids=[];
		if(block.source=='allcate'){
			var name=block.bid+'-0';
		}else if(block.source=='recom'){
			var name=block.recom;
		}else if(block.source=='curcate'&&cid){
			var name=block.bid+'-'+cid;
		}else if(block.source=='custom'){
			let cidname=s.cidnames[block.sys];
			let idname=s.cidnames[block.sys];
			//const custom=[];
			for(let i in block.cateids){
				let datai=block.cateids[i];
				/* if(datai[idname]){
					custom.push(datai);
				}else */if(datai[cidname]){
					cids.push(datai[cidname]);
				}
			}
			//block.custom=custom;
			if(cids.length)name=block.bid+'-'+cids.join(',');
		}
		if(!name)return;
		let bid=block.bid,
			source=block.source,
			sys=block.sys||s.sys,
			file=s.cachepath(name,source,sys),
			param=s.extend({thid:s.g.datas.thid,bid:bid,sys:sys,type:block.source,recom:block.recom,count:block.show_count},s.urldata(s.options));
		s.request({url:s.url(file,param),success:function(data){
			for(let i in s.blocks){
				if(s.blocks[i].bid==bid){
					if(s.blocks[i].source=='recom'){
						s.blocks[i].list=data;
					}else{
						s.blocks[i]=data;
					}
				}
			}
		},dataType:'json'});
	}
}

s.cachefile=function(name,type,param,callback,sys){
	const s=this;
	sys=sys||s.sys;
	let file=s.cachepath(name,type,sys);
	s.request({url:s.url(file,param),success:function(data){
		if(s.isfun(callback))callback(data)
	},dataType:'json'});
}


s.dataurl=function(block){
	if(!block.data_url)return;
	const s=this;
	s.request({url:s.url(block.data_url),success:function(res){
		let datakey;
		if(block.block_data){
			datakey=block.block_data;
		}else if(res.tid){
			s.cont=res;
		}else if(res.cid && res.id){
			s.cont=res;
		}else if(res.cid){
			s.conts=res;
		}else{
			s.block=res;
		}
	},dataType:'json'});
}

s.wxmobile=function(e){
	const s=this;
	s.wx.mobile(e,s);
}
export default s;