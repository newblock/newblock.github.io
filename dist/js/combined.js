$(document).ready(function(){var r;$.get("https://886494025.vcblock.club/weapp/gblocks",function(e,t){r=e.data.list;var a=JSON.stringify(e);console.log(t+":::"+a);for(var d=0;d<r.length;d++){var l=r[d],s=document.createElement("box"),c=l.id;if(s.setAttribute("id",c),d%2==0)var i=' <div class="row featurette"><div class="col-md-1"></div><div class="col-md-7"><h2 class="featurette-heading featurette-name text-muted">链名:阿甘</h2><h3 class="featurette-heading ">职位: 产品经理 前端工程师</h3><p class="lead">我是一个兵，来自老百姓，</p></div><div class="col-md-3"><div class="featurette-colorblock_A center-block"></div></div></div><hr class="featurette-divider">';else var i=' <div class="row featurette"><div class="col-md-1"></div><div class="col-md-7 col-md-push-3"><h2 class="featurette-heading featurette-name text-muted">链名:阿甘</h2><h3 class="featurette-heading ">职位: 产品经理 前端工程师</h3><p class="lead">我是一个兵，来自老百姓，</p></div><div class="col-md-3 col-md-pull-7"><div class="featurette-colorblock_B center-block"></div></div></div><hr class="featurette-divider">';s.innerHTML=i,$("#root").append(s),$("#"+c).find("h2").eq(0).text("链名:"+l.name),$("#"+c).find("h3").text("职位: "+l.job),$("#"+c).find("p").text("经历: "+l.skill)}})});