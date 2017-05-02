(function(window){
	'use strict';
	//初始函數: 把所有的程式碼都包在init裡面，方便在之後的DOMContentLoaded 函數裡一次呼叫
	function init() {
		//取得json檔案
		var request = new XMLHttpRequest(),data,fargment,li,a,img,content,h2,p,title,subTitle,i,max;
			request.open('GET', 'data.json', true);

			request.onload = function() {
				//如果http狀態碼小於400(沒有發生錯誤),則開始抓取json資料
			  if (request.status >= 200 && request.status < 400) {
			    	data = JSON.parse(request.responseText),
			    	fargment = document.createDocumentFragment();
					//使用document.createDocumentFragment()避免不斷更新html,增加效能
			        for (i = 0, max = data.length; i < max; i++) {
			        	
			        	li = document.createElement('li');
			        	a = document.createElement('a');
			        	img = document.createElement('img');
			        	content = document.createElement('div');
			        	h2 = document.createElement('h2');
			        	p = document.createElement('p');
			        	title = document.createTextNode(data[i][2]);
			        	subTitle = document.createTextNode(data[i][3]);

						//從json檔裡撈取資料,建構slider所需html
			        	img.setAttribute('src',data[i][0]);
			        	a.setAttribute('href',data[i][1]);
			        	content.setAttribute('class','content');
			        	h2.appendChild(title);
			        	p.appendChild(subTitle);
			        	content.appendChild(h2);
						content.appendChild(p);
						a.appendChild(content);
						a.appendChild(img);
						li.appendChild(a);
						fargment.appendChild(li);
			        }

			        document.querySelector('.slider-content').appendChild(fargment);

			        //html架構完成後,執行slider函數讓slider可以運作
			        slider();

			  } else {
			    alert('We reached our target server, but it returned an error');
			  }
			};

			request.onerror = function() {
			  alert('There was a connection error of some sort');
			};

			request.send();

		function slider() {
			var ad5wrap = document.querySelector('.slider-content'),
					control = document.querySelector('.control'),	
					allElem = document.querySelectorAll('.slider-content > li'),
					ad5Width = allElem[0].clientWidth,				
					dis = '-'+ad5Width,
					liIndex = 0,
					ad5Count = allElem.length,
					state = 'stop',	
					picClone = document.createDocumentFragment(),
					controlItem = document.createDocumentFragment(),allElemChild,item,time,TT;

					//複製第1、2張輪播圖片到最後面,來做出一直輪播的效果
					for(i = 0, max = 1; i <= max; i++){
						picClone.appendChild(allElem[i].cloneNode(true));
					}

					//製作導覽列,使用document.createDocumentFragment()避免不斷更新html,增加效能
					for(i = 0, max = ad5Count; i < max; i++){
						item = document.createElement('li');
						controlItem.appendChild(item);
					}

					ad5wrap.appendChild(picClone);
					control.appendChild(controlItem);

					//複製最後一張圖片到第一張之前
					ad5wrap.insertBefore(allElem[allElem.length-1].cloneNode(true),allElem[0]);

					//因querySelectorAll無動態更新功能,所以再更新一次allElem
					allElem = document.querySelectorAll('.slider-content > li');
					allElemChild = document.querySelectorAll('.wrap *');
					controlItem = document.querySelectorAll('.control > li');

					//算出ul的寬度並將第一張圖片移至中間
					ad5wrap.style.cssText = 'width:'+ ad5Width * (ad5Count+3) +'px;transform:translateX(-'+ ad5Width +'px)'; 
					allElem[1].classList.add('active');
					controlItem[0].classList.add('active');

					//給每個dom元素一個屬性,之後用來做mouseenter效果
		            for(i = 0, max = allElemChild.length; i < max; i++){
		                allElemChild[i].area = 'banner';
		            }  

					for(i = 0, max = controlItem.length; i < max; i++){

						//以下為導覽列點擊功能
						controlItem[i].onclick = function() {
							if(state === 'run'){
								return;
							}else{

								if(ad5wrap.className.indexOf('no-transition') !== -1){
									ad5wrap.classList.remove('no-transition');
								}							
								liIndex = getIndex(this);
								document.querySelector('.slider-content > li.active').classList.remove('active');
								//liIndex+1是因為現在第一張圖為原本的最後一張
								dis = (liIndex+1) * -ad5Width;
								controlItem[liIndex].classList.add('active');
								getSiblings(controlItem[liIndex]);
								ad5wrap.style.transform = 'translateX('+ dis +'px)';
							
				                setTimeout(function(){

				                	//動畫做完後,圖片的透明度變成1
				                	allElem[liIndex+1].classList.add('active');

				                	//將其他圖片移除active這個class
				                	getSiblings(allElem[liIndex+1]);		                	
				                 	state = 'stop';	                    	
				                },500);										
							}

						}
					}
					document.querySelector('.prev').onclick = function() {
						prev();	
					}
					document.querySelector('.next').onclick = function() {
						next();
					}
					//以下為prev鍵點擊功能
					function prev() {
						if(liIndex <= 0){
							//如果為最第一張,則跑到最後一張
			                if(state === 'run'){
			                	return;
			                }else{
			                	state = 'run';
				                dis = (ad5Count+1) * -ad5Width;

				                //移除transition,先讓圖片回到第一張原本的位置
				                ad5wrap.classList.add('no-transition');
				                ad5wrap.style.transform = 'translateX('+ dis +'px)';

				                //導覽列新增active這個class
								controlItem[ad5Count-1].classList.add('active');
								getSiblings(controlItem[ad5Count-1]);

								allElem[liIndex+1].classList.remove('active');

				                setTimeout(function(){
				                 	ad5wrap.classList.remove('no-transition');
				                 	dis += ad5Width;
				                 	ad5wrap.style.transform = 'translateX('+ dis +'px)';
				                },0); 
				                setTimeout(function(){
				                	liIndex = ad5Count-1;		                	
				                	allElem[liIndex+1].classList.add('active');
				                	getSiblings(allElem[liIndex+1]);
				                 state = 'stop';	                    	
				                },500); 	                                     		
			                }
						}else{
			                	if(state === 'run'){
			                		return;
			                	}else{
			                		state = 'run';
				                	dis += ad5Width;             	
				                    ad5wrap.style.transform = 'translateX('+ dis +'px)';

 									//導覽列新增active這個class
									controlItem[liIndex -1].classList.add('active');
									getSiblings(controlItem[liIndex -1]);		                    
									allElem[liIndex+1].classList.remove('active');
	                    
				                    setTimeout(function(){
										liIndex--;						
				                		allElem[liIndex+1].classList.add('active');
				                		getSiblings(allElem[liIndex+1]);					
										state = 'stop';
				                    },500);                		
			                	} 
						}			
					}				
	 				function next() {
			               if(state === 'run'){
			                		return;
			               }else{
			               		state = 'run';
								dis -= ad5Width;
								allElem[liIndex+1].classList.remove('active');

								 //導覽列用取餘數的方式計算目前的active元素
								controlItem[(liIndex + 1)  % ad5Count ].classList.add('active');
								getSiblings(controlItem[(liIndex + 1)  % ad5Count ]);	

								if(ad5wrap.className.indexOf('no-transition') !== -1){
									ad5wrap.classList.remove('no-transition');
								}
								
				                ad5wrap.style.transform = 'translateX('+ dis +'px)';

				                setTimeout(function(){
				                    if (liIndex >= ad5Count-1) {
				                    	//如果為最後一張,則跑到第一張
				                        liIndex = -1;
				                        dis = '-'+ad5Width;
				                        ad5wrap.classList.add('no-transition');
				                        ad5wrap.style.transform = 'translateX('+ dis +'px)';

				                    }
				                        
				                    liIndex++; 
				                    allElem[liIndex+1].classList.add('active');
				                    getSiblings(allElem[liIndex+1]);
				                    state = 'stop';

				                },500)	               	
			               }
					}				
			          TT = setInterval(next,3000);  
			          time = 'on';
			          document.body.onmouseover = function(e){
						//滑鼠滑入暫停輪播效果,並用變數time的'on'或'off'來避免重複觸發clearInterval事件
			            if(e.target.area !== 'banner' && time === 'on'){
			                return;
			            }else if(e.target.area === 'banner' && time === 'on'){

			                clearInterval(TT);
			                time='off';

			            }else if(e.target.area !== 'banner' && time === 'off'){

			                TT = setInterval(next,3000);  
			                time='on';
			            }

			          }  		
		            function getIndex(node){
		            	//取得dom元素的索引值
		                var children = node.parentNode.childNodes;
		                var num = 0;
		                for (i = 0, max = children.length; i < max; i++) {
		                      if(children[i] === node){
		                          return num;                                    
		                      }else if(children[i].nodeType === 1){
		                          num++;
		                      }
		                }
		                
		            };
	                function getChildren(n, skipMe,hide){
		                var r = [];
		                if(typeof hide !=='function'){
		                  hide = false;
		                }
		                for (i = 0, max=n.length; i<max; i++) {

		                    if ( n[i] !== skipMe )
		                    {
		                      if(hide){hide(n[i]);}  //使用callback的方式呼叫getSiblings裡的hide函數,可避免再多跑一次迴圈   
		                    }
		                }

	                };

	                function getSiblings(n1) {
	                	//取得dom元素的鄰居
	                    var hide = function(sib){                                   
	                        sib.classList.remove('active');
	                    } 
	                    getChildren(n1.parentNode.children,n1,hide);
	                }	


		}		
	}

	document.addEventListener('DOMContentLoaded',function() {
		init();
	})	
})(window)

