

$.takApp.pageTmp('None',{baseV:{type:'takView',loadingOn:'1',scene:'con'}});
$.takApp.pageTmp('Main',{baseV:{type:'takView',loadingOn:'1',scene:'page'}});
			
$.takApp.pageTmp('Win',{state:'new',pro:{name:"窗口",vName:"page"},
				baseV:{type:'takView',scene:'win',
					subs:{
						tv:{type:'TitleV',scene:'page',subDef:{type:'Button',jEven:{en:'click',on:"page",pn:"vName"},scene:'default'},
							subs:{
								closeBtn:{pro:{icon:'fa fa-close'},jEven:{func:"clsBtnClick"},exts:{tip:'关闭'}}
							},
							jEven:[
								{en:'mousedown',func:'tMousedown',on:"page",pn:"vName"},
								{en:'mousemove',func:'tMousemove',on:"page",pn:"vName"},
								{en:'mouseup',func:'tMouseup',on:"page",pn:"vName"},
								{en:'mouseup',func:'tMouseleave',on:"page",pn:"vName"}
							]
						}
					},
					oMap:{def:'this',btn:'this.tv'}
				},
				conView:{type:'takView',loadingOn:'1',scene:['con','main-con']},
				func:{
					clsBtnClick:"this.close();",
					showCtrled:function(s,c){
						this.baseV.$tv.val(c.title);
					},
					beginLoadCtrl:function(s,c){
						c.view.loading('正在加载控制器。。。');
					},
					loadCtrlMsg:function(s,e){
						e.ctrl.view.showMsg(e.msg);
					},
					ctrlLoadComplate:function(s,c){
						c.view.hideLoading();
					},
					tMousedown:function(s,e){
						this.bringToFront();
						this.myVar('moveOpen',true);
						this.myVar('lastPointX',e.je.pageX);
						this.myVar('lastPointY',e.je.pageY);
					},
					tMousemove:function(s,e){
						if(this.myVar('moveOpen')){
							var lpX=this.myVar('lastPointX');
							var lpY=this.myVar('lastPointY');
							if(e.je.pageX!=lpX||e.je.pageY!=lpY){
								var op=this.baseV.baseJqo.position();
								op.top+=(e.je.pageY-lpY);
								op.left+=(e.je.pageX-lpX);
								this.baseV.baseJqo.css({top:op.top,left:op.left});
								this.myVar('lastPointX',e.je.pageX);
								this.myVar('lastPointY',e.je.pageY);
							}
						}
					},
					tMouseup:function(s,e){
						this.myVar('moveOpen',false);
					},
					tMouseleave:function(e){
						this.myVar('moveOpen',false);
					}
				},
				exts:{
					eves:[
						{en:'loaded',func:'loaded'},
						{en:'beginLoadCtrl',func:'beginLoadCtrl'},
						{en:'loadCtrlMsg',func:'loadCtrlMsg'},
						{en:'ctrlLoadComplate',func:'ctrlLoadComplate'},
						{en:'showCtrled',func:'showCtrled'}
					]
				}
			});




$.takApp.regVAtts('takView',"win",{'class':'tak-content portlet box blue-hoki tak-window'});
$.takApp.regVAtts('takView','page',{'class':'tak-page'});
$.takApp.regVAtts('takView','main',{'class':'tak-main'});
$.takApp.regVAtts('takView','main-con',{'class':'tak-main-con'});
$.takApp.regVAtts('takView','siderbar',{'class':'tak-siderbar'});
$.takApp.regVAtts('takView','logo',{'class':'tak-logo'});
$.takApp.regVAtts('takView','title',{'class':'tak-title'});
$.takApp.regVAtts('takView','con',{'class':'tak-content'});
$.takApp.regVAtts('takView','port',{'class':'portlet light'});
$.takApp.regVAtts('takView','btnCon',{'class':'btnCon'});
$.takApp.regVAtts('takView','topTool',{'class':'tak-topTool'});
$.takApp.regVAtts('takView','topUser',{'class':'tak-topUser'});
$.takApp.regVAtts('takView','listCtrl',{'class':'tak-listContent'});


$.takApp.regVAtts('ModelV',{'class':'tak-content'});

$.takApp.regVAtts('btsPanel',{base:{'class':'container page-content tak-fContent'},row:{'class':'tak-row row'}});

$.takApp.regVAtts('RangeV',{base:{'class':'input-group input-group-sm'},addon:{'class':'input-group-addon'}});

$.takApp.regVAtts('ListV',{'class':'tak-list'});

$.takApp.regVAtts('HtmlV','spanContent',{'class':'tak-sp-content'});


$.takApp.regVAtts('TitleV',{base:{'class':"portlet-title"},
							caption:{'class':"caption"},
							rBtns:{"class":"actions"},
							subject:{"class":"caption-subject"}});

$.takApp.regVAtts('Button',{'class':'btn'});

$.takApp.regVAtts('Button','default',{'class':'btn-default'});
$.takApp.regVAtts('Button','primary',{'class':'btn-primary'});
$.takApp.regVAtts('Button','info',{'class':'btn-info'});
$.takApp.regVAtts('Button','success',{'class':'btn-success'});
$.takApp.regVAtts('Button','warning',{'class':'btn-warning'});
$.takApp.regVAtts('Button','danger',{'class':'btn-danger'});
$.takApp.regVAtts('Button','link',{'class':'btn-link'});
$.takApp.regVAtts('Button','small',{'class':'btn-sm'});
$.takApp.regVAtts('Button','xsmall',{'class':'btn-xs'});
$.takApp.regVAtts('Button','out',{'class':'btn-outline'});
$.takApp.regVAtts('Button','menuBtn',{'class':'tak-menu-btn'});

$.takApp.regVAtts('BtnListV',{base:{'class':'btn-group'},
							btn:{"class":"btn","data-toggle":"dropdown","data-hover":"dropdown","data-close-other":"true"},
							dropUl:{"class":"dropdown-menu"},
							arrow:{"class":"fa fa-angle-down"}});

$.takApp.regVAtts('BtnListV','primary',{base:{},btn:{'class':'btn-primary'}});
$.takApp.regVAtts('BtnListV','info',{base:{},btn:{'class':'btn-info'}});
$.takApp.regVAtts('BtnListV','success',{base:{},btn:{'class':'btn-success'}});
$.takApp.regVAtts('BtnListV','warning',{base:{},btn:{'class':'btn-warning'}});
$.takApp.regVAtts('BtnListV','danger',{base:{},btn:{'class':'btn-danger'}});
$.takApp.regVAtts('BtnListV','small',{base:{},btn:{'class':'btn-sm'}});
$.takApp.regVAtts('BtnListV','xsmall',{base:{},btn:{'class':'btn-xs'}});							
$.takApp.regVAtts('BtnListV','out',{base:{},btn:{'class':'btn-outline'}});
$.takApp.regVAtts('BtnListV','topBtn',{'class':'tak-top-btn'});

$.takApp.regVAtts('TabBtnV',{base:{'class':'tak-tab-btn'},
							 btn:{'class':'btn'},
							 close:{'class':'cBtn'},
							 cIcon:{'class':'fa fa-close'}});



$.takApp.regVAtts('FieldV',{base:{'class':'form-group tak-fd-panel'},name:{'class':'control-label'},ePanel:{'class':'tak-fd-epanel'},unit:{'class':'tak-fd-unit'}});

$.takApp.regVAtts('PwdV',{'class':'form-control input-sm'});
$.takApp.regVAtts('TextV',{'class':'form-control input-sm'});
$.takApp.regVAtts('TextArea',{'class':'form-control input-sm'});
$.takApp.regVAtts('SelectV',{'class':'form-control input-sm'});

$.takApp.regVAtts('TableV',{base:{'class':'table-scrollable tak-tableDiv'},table:{'class':'table'}});
$.takApp.regVAtts('TableV','data',{base:{},table:{'class':'table-bordered table-hover tak-datatable'}});

$.takApp.regVAtts('CallV',{'class':'td-data'});

$.takApp.regVAtts('GroupV',{base:{'class':'portlet light'},title:{'class':"portlet-title"},caption:{'class':"caption"},subject:{"class":"caption-subject"},con:{"class":"container page-content tak-fContent"}});

$.takApp.regVAtts('ImgV','dImg',{'class':'tak-dImg'});
$.takApp.regVAtts('ImgV','logo',{'class':'tak-logo-Img'});


$.takApp.regVAtts('MenuV',{
							base:{'class':'menu-li'},
							divCon:{'class':'menu-con'},
							subCon:{'class':'menu-ul'},
							item:{'class':'menu-item'},
							title:{'class':'menu-title'},
							arrow:{'class':'menu-arrow'}
						});

$.takApp.regVAtts('FrameV',{'class':'tak-FrameV'});

$.takApp.regVAtts('CheckBoxV',{base:{'class':'tak-CheckBox'},icon:{'class':'tak-CheckBox-icon'},txt:{'class':'tak-CheckBox-txt'}});

$.takApp.regVAtts('chkListBox',{'class':'tak-panelBox'});

$.takApp.regVAtts('multLvV',{'class':'tak-multLvV'});
