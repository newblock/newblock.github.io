'use strict'

var Employee = function(jsonStr)
{
      if(jsonStr)
      {
        var obj = JSON.parse(jsonStr);
        this.address = obj.address ;
        this.job = obj.job;
      }
      else
      {
        this.address = "";
        this.job     = "";
      }
};

Employee.prototype =
{
      toString: function()
      {
        return JSON.stringify(this);
      }
};

var Company = function(jsonStr)
{
      if (jsonStr)
      {
        var obj = JSON.parse(jsonStr);
        this.address = obj.address;
        this.pos = obj.pos;
      }
      else
      {
        this.address = "";
        this.pos = "";
      }
};

Company.prototype =
{
      toString: function()
      {
        return JSON.stringify(this);
      }
};

var CCJobContract = function()
{
      LocalContractStorage.defineProperty(this, "empNumber");
      LocalContractStorage.defineProperty(this, "comNumber");
      LocalContractStorage.defineProperty(this, "aAddress");
      LocalContractStorage.defineMapProperty(this, "empList",
      {
        parse: function(jsonData)
        {
          return new Employee(jsonData);
        },
        stringify: function(obj)
        {
          return obj.toString();
        }
      });

      LocalContractStorage.defineMapProperty(this, "comList",
      {
        parse: function(jsonData)
        {
          return new Company(jsonData);
        },
        stringify: function(obj)
        {
          return obj.toString();
        }
      });
};

CCJobContract.prototype =
{
      init: function()
      {
        this.empNumber = 0 ;
        this.comNumber = 0 ;
        this.aAddress  = "n1SEgV23gcj51qyxdUaqT24PfAwW1VWXPiY";
      },

      getEmpNumber: function()
      {
        return this.empNumber;
      },

      getComNumber: function()
      {
        return this.comNumber;
      },

      isEmployeeAddrExists: function(address)
      {
        var emp = this.empList.get(address);
        if (!emp)
        {
            return false ;
        }
        else
        {
            return true ;
        }
      },

      isCompanyAddrExists: function(address)
      {
        var com = this.comList.get(address);
        if (!com)
        {
            return false ;
        }
        else
        {
            return true ;
        }
      },

      postEmployee: function(job)
      {
          var from = Blockchain.transaction.from ;
          var value  = Blockchain.transaction.value;

          if (this.isEmployeeAddrExists(from))
          {

              var res = Blockchain.transfer(this.aAddress, 0.001 * 1000000000000000000);

              if( !res )
              {
                  throw new Error("nas transfer failed.");
              }

              var emp = this.empList.get(from);
              emp.job = job ;
              this.empList.set(from, emp);
          }
          else
          {

              if( value != 0)
              {
                  throw new Error("post Emp first time dont pay!");
              }

              var emp = new Employee();
              emp.address = from ;
              emp.job = job ;
              this.empList.put(from, emp);
              this.empNumber = this.empNumber + 1 ;

              var res = Blockchain.transfer(emp.address, 0.001 * 1000000000000000000);

              if( !res )
              {
                  throw new Error("nas transfer failed.");
              }
          }
      },

      postCom: function(pos)
      {
          var from = Blockchain.transaction.from ;
          var value  = Blockchain.transaction.value;

          if (this.isCompanyAddrExists(from))
          {
              var res = Blockchain.transfer(this.aAddress, 0.001 * 1000000000000000000);

              if( !res )
              {
                  throw new Error("nas transfer failed.");
              }

              var com = this.comList.get(from);
              com.pos = pos ;
              this.comList.set(from,com);
          }
          else
          {
              var com = new Company();
              com.address = from ;
              com.pos = pos ;
              this.comList.put(from, com);
              this.comNumber = this.comNumber + 1 ;

              var res = Blockchain.transfer(this.aAddress, 0.001 * 1000000000000000000);

              if( !res )
              {
                  throw new Error("nas transfer failed.");
              }
          }
      }
}

module.exports = CCJobContract;
