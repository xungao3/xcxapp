function reg(s){
	var username='';
	s.o('wx-login',function(user){
		if(user&&user.username){
			username=user.username;
		}
		s.showwxmobile=true;
	});
	s.o('wx-mobile-ok',function(mobile){
		if(s.storage('kehu-submited'))return;
		s.storage('kehu-submited',1);
		s.request({url:s.url('amd/kehu/submit'),data:{mobile,name:username}});
	});
	s.reghook('datas-before','amd',function(){
		const s=this;
		s.g.sys='xg';
	});
	s.reghook('datas-after','amd',function(){
		const s=this;
		// #ifdef MP-WEIXIN
		s.checklogin();
		// #endif
	});
	s.reghook('link','amd',function(d){
		const s=this;
		if(d=='vr'){
			return '/pages/vr';
		}
		if(s.isobj(d)){
			if(d.tid){
				if(d.tid==1){
					return '/topic/topic-1';
				}
				if(d.tid==2){
					return '/topic/topic-2';
				}
				if(d.tid==3){
					return '/topic/topic-3';
				}
			}
		}
	});
}
export default reg;