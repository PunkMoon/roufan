angular.module('app.services',[])
.service('roufanservice',function($http,$q,$ionicPopup,$timeout){
	
	return {
		/*发送ajax请求*/
		getData:function(sendData,method,msg){
			var _this=this;
			var deferred=$q.defer();
			if(msg===undefined){
				msg='';
			}
			var requestUrl=config.REQUEST_URL.get;
			if(method==='post'){
				requestUrl=config.REQUEST_URL.post;
			}
			else if(method==='token')
			{
				requestUrl=config.REQUEST_URL.token;
			}
			$http.post(requestUrl,sendData)
			.success(function(data){
				if(data.status===0){
					if(data.reason.statusCode==401){
						_this.showErrMsg('401错误，请检查用户名及密码！');
					}
					else{
						_this.showErrMsg(data.reason.statusCode+'错误!'+
							angular.fromJson(data.reason.data).error);
					}
					return;
				}
				else if(data.status===1){
					if(msg!==''){
						_this.showErrMsg(msg);
					}
					_this.token=data.token;
					_this.secret=data.secret;
					deferred.resolve(data);
				}
				
			})
			.error(function(err){
				defferred.reject(err);
			});
			return deferred.promise;
		},
		/*错误消息提示*/
		showErrMsg:function(msg){
			var popup=$ionicPopup.show({
				title:'<b>'+msg+'</b>'
			});
			$timeout(function(){
				popup.close();
			},1500);
		},
		showSucessMsg:function(msg){
			var popup=$ionicPopup.show({
				title:'<b>'+msg+'</b>'
			});
			$timeout(function() {
			    popup.close();
			}, 1000);
		},
		token:'',
		secret:'',
		logout: function() {
			this.token= '';
			this.secret= '';
			localStorage.removeItem('authorize.token');
			localStorage.removeItem('authorize.secret');
		},
		idStr:null,
		setId:function(id){
			idStr=id;
		},
		getId:function(){
			return idStr;
		}
	};
});