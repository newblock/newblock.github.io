
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

      //var const pathNewBox = "https://886494025.vcblock.club/savejob";
      //var const pathUpdateBox = "https://886494025.vcblock.club/upjob";

      var pathNewBox = "https://yabu44d9.qcloud.la/weapp/savejob";
      var pathUpdateBox = "https://yabu44d9.qcloud.la/weapp/upjob";
      var pathHasBlock = "https://yabu44d9.qcloud.la/weapp/isHasBlock?aid=";

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
      },  "*");

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
              //var to = "n1trRzBMP5epWqB1pDe5APcDVCpLQtfeEfu"; //测试合约
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
                      name: "ccjob"
                      },
                      listener: cbCallDapp
              });
      }

      var txCheckHash ;
      function cbCallDapp(resp)
      {
            console.log("callback resp: " + JSON.stringify(resp));
            txCheckHash = resp.txhash;
            console.log("txhash --: "+txCheckHash);

            intervalQuery = setInterval(function ()
            {
              query2();
            }, 5000);
      }

      function query2()
      {
        neb.api.getTransactionReceipt(txCheckHash)
                    .then(doneGetTransactionReceipt)
                    .catch(function (o)
                    {
                      console.log(o.message);
                    });
      }

      function doneGetTransactionReceipt(o)
      {
        var logText = o.status == 1 ? "success" : (o.status == 0 ? "fail" : "pending");

        console.log(logText);

        if (o.status == 1)
        {
          saveData();

          clearInterval(intervalQuery);
        }
        if (o.status == 0)
        {
            clearInterval(intervalQuery);
            toastr.warning('提交信息上链失败,请确认账号中费用充足!', {timeOut: 5000});
        }
      }

            function saveData()
            {
              console.log("save called~");
              var fullPath = pathHasBlock + address;
              var blocks ;

              $.get(fullPath,function(data,status)
              {
                blocks = data ;
                var r = JSON.stringify(data);
                 console.log(status + ":::"+ r);
                 if(blocks.length != 0)
                 {
                   console.log("update box");
                   updateEmp();
                 }
                 else
                 {
                   console.log("added box");
                   addEmp() ;
                 }
              });

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

              if (name==""||
                  pos==""||
                  mail==""||
                  address==""||
                  skill=="")
              {
                toastr.warning('请完善你的信息', {timeOut: 5000});
                return ;
              }

              console.log("address: " + address);
              console.log(name);
              console.log(pos);
              console.log(wx);
              console.log(mail);
              console.log(address);
              console.log(skill);

              var value = 0 ;

              var fullPath = pathHasBlock + address;
              var blocks ;

              $.get(fullPath,function(data,status)
              {
                blocks = data ;
                var r = JSON.stringify(data);
                 console.log(status + ":::"+ fullPath);
                 if(blocks.length != 0)
                 {
                   console.log("blokc is Ex!");
                   value = 0.001 ;
                 }
                 var callArgs = "[\"" + pos+ "\"]";
                 onClickCallDapp(value,"postEmployee",callArgs);
              });

            }

      function addEmp()
      {
        $.post(pathNewBox,
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
          toastr.success('可以通过找人才来查看更新信息！', '工作数据提交成功啦！', {timeOut: 5000})
        });

      }

      function updateEmp()
      {
        $.post(pathUpdateBox,
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
