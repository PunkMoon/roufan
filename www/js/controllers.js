angular.module("app.controllers",[])
/*将页面中的用户链接替换*/
.filter('linkformat',function() {
	return function(content){
		if(content)
		{
			var userlink='<a href="#/tab/detail" class="former">';
			return content.replace(/<a[\s]+href=['"]([^"]*)['"][\s]+class="former">/g,userlink);
		}
		return '';
	};
})
/*格式化消息来源*/
.filter('formatsource',function(){
	return function(source){
		if(source)
		{
			if(source.indexOf('href')>0){
				return angular.element(source).contents()[0].data;
			}
			else{
				return source;
			}
		}
		return '';
		
	};
})
/*格式化消息发表时间*/
.filter('formattime',function($filter){
	return function(time){
		var now=new Date().getTime();
		var newtime=$filter('date')(new Date(time), 'short', '+0800');
		var newtimestring=new Date(newtime).getTime();
		var lastTime=(now-newtimestring)/1000;
		if(lastTime<=59){
			return parseInt(lastTime)+'秒前';
		}
		else if(lastTime<3600){
			return parseInt(lastTime/60)+'分前';
		}
		else if(lastTime<=3600*2){
			return parseInt(lastTime/3600)+'小时前';
		}
		else if(lastTime<=3600*24){
			return $filter('date')(newtimestring, 'HH:mm', '+0800');
		}
		else if(lastTime<3600*24*365){
			return $filter('date')(newtimestring, 'MM/dd', '+0800');
		}
		else{
			return $filter('date')(newtimestring, 'yy/MM/dd', '+0800');
		}
	};
})
/*登录页*/
.controller('loginCtrl', ['$scope','roufanservice','$state',
	function($scope,roufanservice,$state){
	$scope.user={
		name:'',
		pass:''
	};
	$scope.login=function(){
		var sendData={
			username:$scope.user.name,
			password:$scope.user.pass
		};
		var promise=roufanservice.getData(sendData,'token','登录成功!');
		promise.then(function(data){
			roufanservice.token=data.token;
			roufanservice.secret=data.secret;
			localStorage.setItem('authorize.token', roufanservice.token);
			localStorage.setItem('authorize.secret', roufanservice.secret);
			$state.go('tabs.home', {}, {reload: true});
		},
		function(err){
			roufanservice.showErrMsg(err);
		});	
	};
}])
/*首页timeline*/
.controller('homeCtrl', ['$scope','roufanservice','$state',
	function($scope,roufanservice,$state){
		if(!localStorage.getItem('authorize.token')||!localStorage.getItem('authorize.secret')){
			$state.go('login');
			return;
		}
		var path='statuses/home_timeline.json?format=html';
		var sendData={
			token:localStorage.getItem('authorize.token'),
			secret:localStorage.getItem('authorize.secret'),
			path:path,
			param:'{}'
		};
		var promise=roufanservice.getData(sendData,'get');
		promise.then(function(data){
			if(data.result===''){
				roufanservice.showErrMsg('加载失败!');
			}
			$scope.data=JSON.parse(data.result);
		},
		function(err){
			roufanservice.showErrMsg(err);
		});
	/*上拉加载*/
	$scope.loadMore=function(maxId){
		sendData.path=path+'&max_id='+maxId;
		var  moreData=[];
		var promise=roufanservice.getData(sendData,'get');
		promise.then(function(data){
			if(JSON.parse(data.result).length===0){
				roufanservice.showErrMsg('没有新消息');
			}
			else{
				JSON.parse(data.result).forEach(function(ele,index){
					$scope.data.push(ele);
				});
			}
			
		}).finally(function(){
			$scope.$broadcast('scroll.infiniteScrollComplete');
		},
		function(err){
			roufanservice.showErrMsg(err);
		});
	};
	/*下拉刷新*/
	$scope.dorefresh=function(sinceId){
		sendData.path=path+'&since_id='+sinceId;
		var promise=roufanservice.getData(sendData,'get');
		promise.then(function(data){
			if(JSON.parse(data.result).length===0){
				roufanservice.showErrMsg('没有新消息');
			}
			else{
				JSON.parse(data.result).forEach(function(ele,index){
					$scope.data.unshift(ele);
				});
			}
			
		}).finally(function(){
			$scope.$broadcast('scroll.refreshComplete');
		},
		function(err){
			roufanservice.showErrMsg(err);
		});
	};
	
}])
.controller('tabCtrl',['$scope','$ionicModal','$ionicPopover','$state','$ionicViewSwitcher',
	function($scope,$ionicModal,$ionicPopover,$state,$ionicViewSwitcher){
	/*发表消息页*/
	$ionicModal.fromTemplateUrl('templates/post.html', {
	  scope: $scope,
	  animation: 'slide-in-up'
	}).then(function(modal) {
	  $scope.post = modal;
	});
	$scope.doPost=function(){
		$scope.post.show();
	};
	$scope.viewImg=function(imageUrl,index){
		// $scope.imgSlide=true;
		$scope.imageUrl=imageUrl;
		$scope.showModal('templates/imgbox.html');
	};
	$scope.showModal = function(templateUrl) {
			$ionicModal.fromTemplateUrl(templateUrl, {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});
		};
	$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.modal.remove();
		};
	$scope.linkToDetail=function(msgId) {
		$ionicViewSwitcher.nextDirection('forward');
		$state.go('detail',{'msgId':msgId});	
	};
}])
/*发表消息页*/
.controller('postCtrl',['$scope','$ionicModal','$timeout','roufanservice','$cordovaCamera',
	function($scope,$ionicModal,$timeout,roufanservice,$cordovaCamera){
	$scope.close=function(){
		$scope.post.hide();
	};
	$scope.data={
		message:''
	};
	/*发表消息*/
	$scope.postByRF=function(){
		var sendData={
			token:localStorage.getItem('authorize.token'),
			secret:localStorage.getItem('authorize.secret'),
			path:'statuses/update.json',
			param:'{"status":"'+$scope.data.message+'"}'
		};
		var promise=roufanservice.getData(sendData,'post');
		promise.then(function(){
			$scope.post.hide();
			roufanservice.showErrMsg('发送成功');
		},
		function(err){
			roufanservice.showErrMsg(err);
		});
	};
	/*调用相机*/
	$scope.picUrl='https://placeholdit.imgix.net/~text?txtsize=28&txt=300%C3%97300&w=300&h=300';
	$scope.takePic=function(){
		document.addEventListener("deviceready", function (){
				var options = {
			      destinationType: Camera.DestinationType.FILE_URI,
			      sourceType: Camera.PictureSourceType.CAMERA,
			    };
				$cordovaCamera.getPicture(options)
				.then(function(data){
					$scope.picUrl="data:image/jpeg;base64," + data;
				},function(err){

				});
		});
		
	};
	/*调用图库*/
	$scope.getPic=function(){
		var options = {
		   maximumImagesCount: 10,
		   width: 800,
		   height: 800,
		   quality: 80
		  };
		  $cordovaImagePicker.getPictures(options)
		      .then(function (results) {
		        for (var i = 0; i < results.length; i++) {
		        	$scope.picUrl="data:image/jpeg;base64,"+results[i];
		          console.log('Image URI: ' + results[i]);
		        }
		      }, function(error) {
		        // error getting photos
		      });
	};
}])
/*随便看看*/
.controller('browseCtrl', ['$scope','roufanservice',
	function($scope,roufanservice){
	var sendData={
		token:localStorage.getItem('authorize.token'),
		secret:localStorage.getItem('authorize.secret'),
		path:'statuses/public_timeline.json?format=html',
		param:'{}'
	};
	var promise=roufanservice.getData(sendData,'get');
	promise.then(function(data){
		$scope.data=JSON.parse(data.result);
	},
	function(err){
		roufanservice.showErrMsg(err);
	});	
}])
/*消息页*/
.controller('mentionCtrl', ['$scope','roufanservice',
	function($scope,roufanservice){
}])
.controller('atCtrl', ['$scope','roufanservice',
	function($scope,roufanservice){
	var sendData={
		token:localStorage.getItem('authorize.token'),
		secret:localStorage.getItem('authorize.secret'),
		path:'statuses/mentions.json?format=html',
		param:'{}'
	};
	var promise=roufanservice.getData(sendData,'get');
	promise.then(function(data){
		$scope.data=JSON.parse(data.result);
	},
	function(err){
		roufanservice.showErrMsg(err);
	});	
}])
.controller('privateCtrl', ['$scope','roufanservice',
	function($scope,roufanservice){
	var sendData={
		token:localStorage.getItem('authorize.token'),
		secret:localStorage.getItem('authorize.secret'),
		path:'direct_messages/conversation_list.json?format=html',
		param:'{}'
	};
	var promise=roufanservice.getData(sendData,'get');
	promise.then(function(data){
		$scope.data=JSON.parse(data.result);
	},
	function(err){
		roufanservice.showErrMsg(err);
	});	
	$scope.insert={
	  message: ''
	};
}])
.controller('requestCtrl', ['$scope','roufanservice',
	function($scope,roufanservice){
	var sendData={
		token:localStorage.getItem('authorize.token'),
		secret:localStorage.getItem('authorize.secret'),
		path:'friendships/requests.json?format=html',
		param:'{}'
	};
	var promise=roufanservice.getData(sendData,'get');
	promise.then(function(data){
		$scope.data=JSON.parse(data.result);
	},
	function(err){
		roufanservice.showErrMsg(err);
	});
	$scope.accept=function(id){
		var sendDatas={
			token:localStorage.getItem('authorize.token'),
			secret:localStorage.getItem('authorize.secret'),
			path:'friendships/accept.json?id='+id,
			param:'{}'
		};
		var promise=roufanservice.getData(sendDatas,'post');
		promise.then(function(data){
			$scope.requested=true;
			$scope.following=true;
		},
		function(err){
			roufanservice.showErrMsg(err);
		});	
	};
	$scope.deny=function(id){
		$scope.requested=true;
		$scope.following=true;
		/*var sendDatas={
			token:localStorage.getItem('authorize.token'),
			secret:localStorage.getItem('authorize.secret'),
			path:'friendships/accept.json?id='+id,
			param:'{}'
		};
		var promise=roufanservice.getData(sendDatas,'post');
		promise.then(function(data){
			$scope.requested=true;
			$scope.following=true;
		},
		function(err){
			roufanservice.showErrMsg(err);
		});	*/
	};
	$scope.follow=function(id){
		var sendDatas={
			token:localStorage.getItem('authorize.token'),
			secret:localStorage.getItem('authorize.secret'),
			path:'friendships/create.json?id='+id,
			param:'{}'
		};
		var promise=roufanservice.getData(sendDatas,'post');
		promise.then(function(data){
			$scope.requested=true;
			$scope.following=true;
		},
		function(err){
			roufanservice.showErrMsg(err);
		});	
	};
}])
.controller('converCtrl', ['$scope','roufanservice','$stateParams','$timeout',
	function($scope,roufanservice,$stateParams,$timeout){
	var userId=$stateParams.userId;
	$scope.receiveUser=$stateParams.name;
	var sendData={
		token:localStorage.getItem('authorize.token'),
		secret:localStorage.getItem('authorize.secret'),
		path:'direct_messages/conversation.json?format=html&id='+userId,
		param:'{}'
	};
	var promise=roufanservice.getData(sendData,'get');
	promise.then(function(data){
		$scope.data=JSON.parse(data.result);
		$scope.user='ldafeng';
	},
	function(err){
		roufanservice.showErrMsg(err);
	});
	var footerBar; // gets set in $ionicView.enter
	var scroller;
	var txtInput; // ^^^
	$scope.$on('$ionicView.enter', function() {
	  console.log('UserMessages $ionicView.enter');
	  $timeout(function() {
	    footerBar = document.body.querySelector('.bar-footer');
	    scroller = document.body.querySelector('.scroll-content');
	    txtInput = angular.element(footerBar.querySelector('textarea'));
	  }, 0);
	});
	$scope.$on('taResize', function(e, ta) {
	  console.log('taResize');
	  if (!ta) return;
	  
	  var taHeight = ta[0].offsetHeight;
	  console.log('taHeight: ' + taHeight);
	  
	  if (!footerBar) return;
	  
	  var newFooterHeight = taHeight + 10;
	  newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;
	  
	  footerBar.style.height = newFooterHeight + 'px';
	  scroller.style.bottom = newFooterHeight + 'px'; 
	});
}])
/*消息详情*/
.controller('detailCtrl', ['$scope','roufanservice','$state','$stateParams','$ionicViewSwitcher',
	'$ionicHistory','fromStateServ',
	function($scope,roufanservice,$state,$stateParams,$ionicViewSwitcher, $ionicHistory,fromStateServ){
		$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		  viewData.enableBack = true;
		});
		var msgid=$stateParams.msgId;
		var sendData={
				token:localStorage.getItem('authorize.token'),
				secret:localStorage.getItem('authorize.secret'),
				path:'statuses/show.json?format=html&id='+msgid,
				param:'{}'
			};
		var promise=roufanservice.getData(sendData,'get');
		promise.then(function(data){
			$scope.msgdata=JSON.parse(data.result);
		},
		function(err){
			roufanservice.showErrMsg(err);
		});	
		$scope.goBack = function() {
		    $ionicHistory.goBack();
		  };
}])
.controller('userCtrl', ['$scope','roufanservice','$state','$stateParams',
	function($scope,roufanservice,$state,$stateParams){
		// var userId=$stateParams.userId?$stateParams.userId:'';
		var sendData={
				token:localStorage.getItem('authorize.token'),
				secret:localStorage.getItem('authorize.secret'),
				path:'users/show.json',
				param:'{}'
			};
		var promise=roufanservice.getData(sendData,'get');
		promise.then(function(data){
			$scope.data=JSON.parse(data.result);
		},
		function(err){
			roufanservice.showErrMsg(err);
		});	
}])
.controller('statusCtrl', ['$scope','roufanservice','$state','$stateParams',
	function($scope,roufanservice,$state,$stateParams){
		var userId=$stateParams.userId;
		var sendData={
				token:localStorage.getItem('authorize.token'),
				secret:localStorage.getItem('authorize.secret'),
				path:'statuses/user_timeline.json?id='+userId,
				param:'{}'
			};
		var promise=roufanservice.getData(sendData,'get');
		promise.then(function(data){
			$scope.data=JSON.parse(data.result);
		},
		function(err){
			roufanservice.showErrMsg(err);
		});	
}])
.controller('favCtrl', ['$scope','roufanservice','$state','$stateParams',
	function($scope,roufanservice,$state,$stateParams){
		var userId=$stateParams.userId;
		var sendData={
				token:localStorage.getItem('authorize.token'),
				secret:localStorage.getItem('authorize.secret'),
				path:'favorites/id.json?id='+userId,
				param:'{}'
			};
		var promise=roufanservice.getData(sendData,'get');
		promise.then(function(data){
			$scope.data=JSON.parse(data.result);
		},
		function(err){
			roufanservice.showErrMsg(err);
		});	
}])
.controller('friendsCtrl', ['$scope','roufanservice','$state','$stateParams',
	function($scope,roufanservice,$state,$stateParams){
		var userId=$stateParams.userId;
		var sendData={
				token:localStorage.getItem('authorize.token'),
				secret:localStorage.getItem('authorize.secret'),
				path:'users/friends.json?id='+userId,
				param:'{}'
			};
		var promise=roufanservice.getData(sendData,'get');
		promise.then(function(data){
			$scope.data=JSON.parse(data.result);
		},
		function(err){
			roufanservice.showErrMsg(err);
		});	
}])
.controller('followersCtrl', ['$scope','roufanservice','$state','$stateParams',
	function($scope,roufanservice,$state,$stateParams){
		var userId=$stateParams.userId;
		var sendData={
				token:localStorage.getItem('authorize.token'),
				secret:localStorage.getItem('authorize.secret'),
				path:'users/followers.json?id='+userId,
				param:'{}'
			};
		var promise=roufanservice.getData(sendData,'get');
		promise.then(function(data){
			$scope.data=JSON.parse(data.result);
		},
		function(err){
			roufanservice.showErrMsg(err);
		});	
}])
.controller('picCtrl', ['$scope','roufanservice','$state','$stateParams',
	function($scope,roufanservice,$state,$stateParams){
		var userId=$stateParams.userId;
		var sendData={
				token:localStorage.getItem('authorize.token'),
				secret:localStorage.getItem('authorize.secret'),
				path:'photos/user_timeline.json?id='+userId,
				param:'{}'
			};
		var promise=roufanservice.getData(sendData,'get');
		promise.then(function(data){
			$scope.data=JSON.parse(data.result);
		},
		function(err){
			roufanservice.showErrMsg(err);
		});	
}]);