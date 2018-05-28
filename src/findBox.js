$(document).ready(function()
{
  getbData();

  function getbData()
  {
    var path = "https://886494025.vcblock.club/weapp/gblocks" ;

    var blocks ;
    $.get(path,function(data,status)
    {
      blocks = data.data.list ;
      var r = JSON.stringify(data);
       console.log(status + ":::"+ r);

       for(var i = 0 ; i < blocks.length; i++)
       {
         var job = blocks[i];
         var box = document.createElement('box');
         var bID = job.id ;
         box.setAttribute("id",bID);
         var inHtml;
         if( i % 2 == 0)
         {
           var inHtml = ' <div class="row featurette">'+'<div class="col-md-1">'+
           '</div><div class="col-md-7">'+
           '<h2 class="featurette-heading featurette-name text-muted">链名:阿甘</h2>'+
           '<h3 class="featurette-heading ">职位: 产品经理 前端工程师</h3>'+
           '<p class="lead">我是一个兵，来自老百姓，</p>'+
           '</div>'+
           '<div class="col-md-3">'+
           '<div class="featurette-colorblock_A center-block">'+
           '</div>'+
           '</div>'+
           '</div>'+
           '<hr class="featurette-divider">';
         }
         else
         {
           var inHtml = ' <div class="row featurette">'+'<div class="col-md-1">'+
           '</div><div class="col-md-7 col-md-push-3">'+
           '<h2 class="featurette-heading featurette-name text-muted">链名:阿甘</h2>'+
           '<h3 class="featurette-heading ">职位: 产品经理 前端工程师</h3>'+
           '<p class="lead">我是一个兵，来自老百姓，</p>'+
           '</div>'+
           '<div class="col-md-3 col-md-pull-7">'+
           '<div class="featurette-colorblock_B center-block">'+
           '</div>'+
           '</div>'+
           '</div>'+
           '<hr class="featurette-divider">';
         }

         box.innerHTML = inHtml ;

         $("#root").append(box);

         $("#"+bID).find("h2").eq(0).text("链名:"+job.name);
         $("#"+bID).find("h3").text("职位: "+job.job);
         $("#"+bID).find("p").text("经历: "+job.skill);
       }

    });
  }
});
