$(document).ready(function()
{
      //localStorage.clear();
      toastr.options.positionClass = 'toast-center-center';
      //to check if the extension is installed
      //if the extension is installed, var "webExtensionWallet" will be injected in to web page

      if (typeof (webExtensionWallet) === "undefined")
      {
            toastr.warning('安装方法请点击安装钱包教程', '请先安装星云钱包插件！', {timeOut: 5000})
      }

      $("#address").attr("disabled",true);

      var nebulas = require("nebulas"),
      neb = new nebulas.Neb();
      neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));

      var NebPay = require("nebpay");
      var nebPay = new NebPay();

      var name ;
      var pos ;
      var wx ;
      var mail;
      var address ;
      var skill ;

      var wAddress ;
      var serialNumber;
      var isExsistEmp = false;
      var isExsistCom = false;
      var intervalQuery;

      window.postMessage(
      {
          "target": "contentscript",
          "data": {},
          "method": "getAccount",
      }, "*");

      window.addEventListener('message', function (e)
      {
          if (e.data && e.data.data)
          {
              if (e.data.data.account)
              {
                  //这就是当前钱包中的地址
                  var addr = e.data.data.account;

                  wAddress = addr;

                  console.log("address:  "+wAddress);

                  //app.updateUserInfo() //获取钱包地址后，就可以调用对应的方法查询用户信息
              }
          }
          if (wAddress)
          {
            //alert("null:  "+add);
            $("#address").val(wAddress)
          }
      });

      function onClickCallDapp(value,callFunction,args)
      {
              var to = "n1yy8h2kRe96faSkbwy6Wi1dXnJxeMQDUav"; //合约地址
              var callArgs = args;

              serialNumber =
              nebPay.call(to,
              value,
              callFunction,
              callArgs,
              {
                      qrcode: {
                      showQRCode: false
                      },
                      goods: {
                      name: "ccjob",
                      desc: "0.001 nas from ccjob"
                      },
                      listener: cbCallDapp
              });
      }

      function cbCallDapp(resp)
      {
              console.log("callback resp: " + JSON.stringify(resp));

              intervalQuery = setInterval(function ()
              {
                funcIntervalQuery();
              }, 10000);
      }

      function funcIntervalQuery()
      {
            console.log("tx Query Called: ")
            nebPay.queryPayInfo(serialNumber).then(function(resp)
            {
              console.log("tx result: " + resp) //resp is a JSON string
              var respObject = JSON.parse(resp)

              if (respObject.code === 0)
              {
                console.log("tx Query OK: ")
                if (respObject.data.status === 1)
                {
                  console.log("交易成功！写入成功！")

                  saveData();

                  clearInterval(intervalQuery);
                }
                else if (respObject.data.status === 2)
                {
                  console.log("正在永久写入!");
                }
              }
              else if(respObject.code === 1)
              {
                console.log("正在查询中..."+JSON.stringify(respObject));
              }
            }).catch(function(err)
            {
              console.log(err);
              //clearInterval(intervalQuery)
          });
        }

      function addEmp()
      {
        var path = "https://yabu44d9.qcloud.la/weapp/savejob" ;

        $.post(path,
        {
          "name" :name,
          "job"  :pos,
          "skill":skill,
          "wx"   :wx,
          "mail" :mail,
          "address": address
        },
        function(data,status)
        {
          console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
          console.log(address);
          console.log(pos);
          localStorage.setItem(address,pos);
          console.log("getItem: " ,localStorage.getItem(address));
          toastr.success('可以通过找人才来查看更新信息！', '工作数据提交成功啦！', {timeOut: 5000})
        });

      }

      function updateEmp()
      {
        var path = "https://yabu44d9.qcloud.la/weapp/upjob" ;

        $.post(path,
        {
          "name" :name,
          "job"  :pos,
          "skill":skill,
          "wx"   :wx,
          "mail" :mail,
          "address": address
        },
        function(data,status)
        {
          console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
          toastr.success('可以通过找人才来查看更新信息！', '工作数据更新成功啦！', {timeOut: 5000})
        });
      }


      function saveData()
      {
        return;
        console.log("save called~");
        //使用本地存储确认
        if(localStorage.getItem(wAddress))
        {
          console.log("update called~");
          updateEmp();
        }
        else
        {
          addEmp() ;
        }

        //$("#submit").attr("disabled",false);
        //$("#address").attr("disabled",false);
      }

      function sendPost()
      {
        name  = $("#name").val();
        pos   = $("#pos").val();
        wx    = $("#wx").val();
        mail  = $("#mail").val();
        address = $("#address").val();
        skill = $("#skill").val();
        //$("#submit").attr("disabled",true);

        console.log("address: " + address);
        console.log(name);
        console.log(pos);
        console.log(wx);
        console.log(mail);
        console.log(address);
        console.log(skill);

        var value = 0 ;

        if(localStorage.getItem(wAddress))
        {
          console.log("address is in local!~");
          value = 0.001 ;
        }
        else
        {
          console.log("address is not in local!~");
        }

        var callArgs = "[\"" + pos+ "\"]";
        onClickCallDapp(value,"postEmployee",callArgs);

      }


      // function testUp()
      // {
      //   var path2 = "https://yabu44d9.qcloud.la/weapp/savejob" ;
      //
      //   name  = $("#name").val();
      //   pos   = $("#pos").val();
      //   wx    = $("#wx").val();
      //   mail  = $("#mail").val();
      //   address = $("#address").val();
      //   skill = $("#skill").val();
      //
      //   console.log("address111:  "+wAddress);
      //   $.post(path2,
      //   {
      //     "name" :name,
      //     "job"  :pos,
      //     "skill":skill,
      //     "wx"   :wx,
      //     "mail" :mail,
      //     "address": wAddress
      //   },
      //   function(data,status)
      //   {
      //     console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
      //     if (data.data.resp == 1)
      //     {
      //       toastr.success('工作职位发布成功啦！', 'Turtle Bay Resort', {timeOut: 5000})
      //     }
      //   });
      // }
});
