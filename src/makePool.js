$(document).ready(function()
{
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

      function addCom()
      {
        var path = "https://yabu44d9.qcloud.la/weapp/savecom" ;

        $.post(path,
        {
          "name" :name,
          "pos"  :pos,
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
          toastr.success('可以通过找工作来查看公司信息！', '组织信息发布成功啦！', {timeOut: 5000})
        });

      }

      function updateCom()
      {
        var path = "https://yabu44d9.qcloud.la/weapp/updatecom" ;
        console.log("update called~");
        $.post(path,
        {
          "name" :name,
          "pos"  :pos,
          "skill":skill,
          "wx"   :wx,
          "mail" :mail,
          "address": address
        },
        function(data,status)
        {
          console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
          toastr.success('可以通过找工作来查看更新信息！', '组织信息更新成功啦！', {timeOut: 5000})
        });
      }


      function saveData()
      {
        console.log("save called~");
        //使用本地存储确认
        if(localStorage.getItem(wAddress))
        {
          updateCom();
        }
        else
        {
          addCom() ;
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

        var value = 0.001 ;

        if(localStorage.getItem(wAddress))
        {
          console.log("address is in local!~");
        }
        else
        {
          console.log("address is not in local!~");
        }

        var callArgs = "[\"" + pos + "\"]";
        onClickCallDapp(value,"postCom",callArgs);
      }

      //
      // function testUp()
      // {
      //   name  = $("#name").val();
      //   pos   = $("#pos").val();
      //   wx    = $("#wx").val();
      //   mail  = $("#mail").val();
      //   address = $("#address").val();
      //   skill = $("#skill").val();
      //
      //   var path2 = "https://yabu44d9.qcloud.la/weapp/updatecom" ;
      //
      //   console.log("address:  "+wAddress);
      //   $.post(path2,
      //   {
      //     "name" :name,
      //     "pos"  :pos,
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
            }).catch(function(err)
            {
              console.log(err);
              clearInterval(intervalQuery)
          });
      }
});
