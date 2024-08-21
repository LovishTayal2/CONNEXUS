var express = require("express");
var nodemailer=require('nodemailer');
var mysql2 = require("mysql2");
var cloudinary = require('cloudinary').v2;
var fileuploader = require("express-fileupload");
let app = express();




app.use(express.static("public"));
app.use(express.urlencoded("true"));
app.use(fileuploader());





app.listen(2002, function () {
    console.log("Server Started");
})


let config = {
    host: "127.0.0.1",
    user: "root",
    password: "Enter your database password",
    database: "project",
    dateStrings: true
}

/*
let config = {
    host: "beqve8lcaangcxzpce8u-mysql.services.clever-cloud.com",
    user: "uqro7o8d6pkpvnlz",
    password: "5YjQRi21CtPisulzRPod",
    database: "beqve8lcaangcxzpce8u",
    dateStrings: true,
    keepAliveInitialDelay : 10000,
    enableKeepAlive : true,
}*/

/*cloudinary.config({ 
    cloud_name: 'dpk2kqj0m', 
    api_key: '552976599239638', 
    api_secret:"I3KNVjwpwea-Gw3AV0p23j2vaYo" // Click 'View API Keys' above to copy your API secret
});


let config = "mysql://avnadmin:AVNS_8sFxz3YcqB4DDtnTZe_@mysql-1fc28b00-lovishtayal28-8a81.i.aivencloud.com:25136/defaultdb"

*/


var mysql = mysql2.createConnection(config);
mysql.connect(function (err) {
    if (err == null)
        console.log("Connected to database successfully");
    else
        console.log(err.message + " #####################");

})

/*app.get("/", function (req, res) {
    let path = __dirname + "/public/index.html";
    res.sendFile(path);

})*/
app.get("/", function (req, res) {
    let path = __dirname + "/public/index.html";
    res.sendFile(path);
})   
//----------------SignUp Process---------------------------
app.get("/users-signup-process", function (req, resp) {
    mysql.query("insert into users values(?,?,?,?)", [req.query.txtEmail, req.query.txtPwd, req.query.usertype, 1], function (err, result) {
        if (err == null) {
            console.log("Badhai Ho");
            resp.send("..............Signed Up Successfully................");
        }
        else
            resp.send(err.message);

    })
})
//-------------Login Process----------------------------------
app.get("/users-login-process", function (req, resp) {
    mysql.query("select * from users where email=? and pwd=?", [req.query.loginEmail, req.query.loginPwd], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        if (result.length == 0) {
            resp.send("Invalid Id or Password");
            return;
        }
        if (result[0].status == 1) {
            if(result[0].pwd=="Admin@123")
            {
                resp.send("Admin");
                return;
            }
            resp.send(result[0].utype);
        }
        else {
            resp.send("You are Blocked");
            return;
        }


    })
})
//---------Forgot-Password---------------------------
app.get("/forgot-pwd-process",function(req,resp)
{
    
    mail=req.query.loginEmail;

    mysql.query("select * from users where email=?",[mail],function(err,result)
    {
        
        if(err==null)
        {
            console.log(result);
            if(result.length==0)
            {
                resp.send("-------Invalid-Id--------");
                return;
            }
            let transporter = nodemailer.createTransport({
                service: 'outlook',
                auth: {
                   user: "Enter Your Email-id",
                   pass: 'ENTER PASSWORD'
                }
            });

           
            var mailOptions = {
                from: "e22cseu0745@bennett.edu.in",
                to: req.query.loginEmail,
                subject: 'Password Retrieved',
                html: "Password is: <br>" 
                    +result[0].pwd              

            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            

            resp.send("------Check your Email-id--------");
        }
        else
        resp.send(err.message);
       
    })
})
//---------Inf-Dash------------------
app.get("/Inf-Dash", function (req, resp) {
    let path = __dirname + "/public/Inf-Dash.html";
    resp.sendFile(path);
})
//----------Client-Dash---------------------
app.get("/client-dash", function (req, resp) {
    let path = __dirname + "/public/client-dash.html";
    resp.sendFile(path);
})
//------------Inf-Prof--------------------
app.get("/Inf-Prof", function (req, resp) {
    let path = __dirname + "/public/Inf-Prof.html";
    resp.sendFile(path);
})
//----------Client-Profile---------------
app.get("/client-prof", function (req, resp) {
    let path = __dirname + "/public/client-profile.html";
    resp.sendFile(path);
})
//--------Save-inf-profile-------------
app.post("/save-inf-profile",  function (req, resp) {
    let fileName = "";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        let path = __dirname + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
    
    }
    else {
        fileName = "nopic.jpeg";
    }
    let ary = req.body.fields;
    //console.log(ary);
    let str;
    if (Array.isArray(ary)) {
        str = "";
        let n = ary.length;
        for (i = 0; i < n; i++) {
            if (i < n - 1)
                str += ary[i] + ",";
            else
                str = str + ary[i];
        }

    }
    else
        str = ary;
    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.txtemailid, req.body.txtname, req.body.gender, req.body.db, req.body.txtadd, req.body.txtcity, req.body.cno, str, req.body.txtig, req.body.txtfb, req.body.txtyt, req.body.txtother, fileName], function (err) {
        if (err == null)
            resp.redirect("result_save.html");
        else
            resp.send(err.message);
    })

})
//-----------------Update Profile---------------------
app.post("/profile-update",  function (req, resp) {
    //console.log(req.body);
    let fileName = "";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        let path = __dirname + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);

    }
    else {
        fileName = req.body.hdn;
    }

    let ary = req.body.fields;
    // console.log(ary);
    let str;
    let n = ary.length;
    if (Array.isArray(ary)) {
        str = "";
        for (i = 0; i < n; i++) {
            if (i < n - 1)
                str += ary[i] + ",";
            else
                str = str + ary[i];

        }

    }
    else
        str = ary;



    // req.body.ppic = fileName;
    //  resp.send(req.body);
    // use table column name in sql query
    mysql.query("update iprofile set name=? , gender=? , dob=? , address=? , city=? , contact=?, ifields=?,insta=?,facebook=?,youtube=?,other=?,picpath=? where emailid=?", [req.body.txtname, req.body.gender, req.body.db, req.body.txtadd, req.body.txtcity, req.body.cno, str, req.body.txtig, req.body.txtfb, req.body.txtyt, req.body.txtother, fileName, req.body.txtemailid], function (err, result) {
        if (err == null) {
            if (result.affectedRows >= 1) {
               // resp.send("Record Updated");
               resp.redirect("result_save.html")
            }
            else {
                resp.send("Invalid-EmailId");
            }
        }

        else
            resp.send(err.message);

    })


})
//---------------------Search----------------------
app.get("/find-inf-details", function (req, resp) {
    let email = req.query.txtemailid;
    mysql.query("select * from iprofile where emailid=?", [email], function (err, resultJsonAry) {
        if (err != null)
            resp.send(err.message);

        resp.send(resultJsonAry);//sending array of JSON object 0-1
    })
})

//----------------Post-Event------------------
app.get("/post-event", function (req, resp) {
    mysql.query("insert into events values(null,?,?,?,?,?,?)", [req.query.txteid, req.query.txttitle, req.query.eventdate, req.query.txttime, req.query.txtcity, req.query.txtvenue], function (err, result) {
        if (err == null) {
            console.log("Badhai Ho");
            resp.send("..............Event Posted Successfully................");
        }
        else
            resp.send(err.message);

    })
})
//-------------------Settings Update--------------------

app.get("/settings-update", function (req, resp) {
    let mailid = req.query.eid;
    mysql.query("select * from users where email=?", [mailid], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;
        }


        else {
            //console.log(resultJsonAry);
            if (resultJsonAry.length != 0) {
                if (resultJsonAry[0].status == 1)
                     {
                    if (resultJsonAry[0].pwd == req.query.oldpwd) 
                        {
                            if(req.query.newpwd == req.query.rptpwd)
                            {
                                mysql.query("update users set pwd = ? where email = ?", [req.query.newpwd, mailid], function (err) 
                                {
                                    if (err == null)
                                        {
                                            resp.send("-----------Updated--------------");

                                        }
                                    else 
                                    {
                                     resp.send(err.message);
                                        return;
                                    }

                                })
                            }
                            else
                                {
                                    resp.send("---Confirm pwd and New Pwd is not matched---");
                                    return;
                                }

                    }
                    else
                    {
                        resp.send("----Invalid Password--------");
                        return;
                    }
                    

                }
                else
                {
                    resp.send("----You are Blocked------");
                    return;
                }
            }
            else
            {
                resp.send("---------------Invalid Id--------------------");
                return;
            }









            /*   if(resultJsonAry.length!=0 && resultJsonAry[0].pwd==req.query.oldpwd)
               {
                   if(req.query.newpwd == req.query.rptpwd)
                   {
                       mysql.query("update users set pwd = ? where email = ?",[req.query.newpwd,mailid],function(err)
                       {
                           if(err==null)
                               {
                                   resp.send("-----------Updated--------------");
                                   
                               }
                                   else
                                       {
                                       resp.send(err.message);
                                       return;
                                       }

                       })
                       
                   }
                   else
                   {
                       
                       resp.send("---Confirm pwd and New Pwd is not matched---");
                       
                   }
               }
               else
               {
                   resp.send("---------------Invalid Id or Password--------------------");
                   
               }*/
        }
    })
})

//------------Admin-Dash------------------

app.get("/Admin-Dash", function (req, resp) {
    let path = __dirname + "/public/Admin-Dash.html";
    resp.sendFile(path);
})

//-------------Admin-Users-----------------

app.get("/admin-users",function(req,resp)
{
    let path=__dirname+"/public/admin-users.html";
    resp.sendFile(path);
})
//--------------Fetch-all-users-------------
app.get("/fetch-all-users",function(req,resp)
{
    mysql.query("select * from users",function(err,resultJsonAry)
    {
        if(err!=null)
        {
        resp.send(err.message);
        return;
        }
        
        
        resp.send(resultJsonAry);//sending array of JSON object 0-1
    })
})
//----------Block Users-----------------
app.get("/block-users",function(req,resp)
{
    mysql.query("update users set status=? where email=?",[0,req.query.email],function(err,resultJsonAry)
    {
        if(err!=null)
        {
        resp.send(err.message);
        return;
        }
        
        
        resp.send("Blocked");//sending array of JSON object 0-1
    })
})

//------Resume-Users-----------------------
app.get("/resume-users",function(req,resp)
{
    mysql.query("update users set status=? where email=?",[1,req.query.email],function(err,resultJsonAry)
    {
        if(err!=null)
        {
        resp.send(err.message);
        return;
        }
        
        
        resp.send("Resume User");//sending array of JSON object 0-1
    })
})
//------------Delete-Users-----------------
app.get("/del-one",function(req,resp)
{
    mysql.query("delete from users where email=?",[req.query.email],function(err,resultJsonAry)
    {
        if(err!=null)
        {
        resp.send(err.message);
        return;
        }
        
        
        resp.send("Deleted");//sending array of JSON object 0-1
    })
})
//-------------Influ-Console-----------------

app.get("/admin-inf-console",function(req,resp)
{
    let path=__dirname+"/public/admin-all-infl.html";
    resp.sendFile(path);
})
//---------------Get-All-Influencers---------------

app.get("/get-all-inf",function(req,resp)
{
    mysql.query("select * from iprofile",function(err,resultJsonAry)
    {
        if(err!=null)
        {
        resp.send(err.message);
        return;
        }
        
        
        resp.send(resultJsonAry);//sending array of JSON object 0-1
    })
})

//---------Get inf-finder-page------------------
app.get("/influ-finder",function(req,resp)
{
    let path=__dirname+"/public/influ-finder.html";
    resp.sendFile(path);
})
//-fetch-corr-cities---------------
app.get("/fetch-corr-cities",function(req,resp)
{
    let ifield="%"+req.query.ifields+"%";
    mysql.query("select distinct city from iprofile where ifields like ?",[ifield],function(err,resultJsonAry)
    {
        if(err!=null)
        {
        resp.send(err.message);
        return;
        }
       // console.log(resultJsonAry);
        resp.send(resultJsonAry);//sending array of JSON object 0-1
    })
})

//------------Show in Card-----------------

app.get("/show-in-card",function(req,resp)
{
    let ifield="%"+req.query.ifields+"%";
    mysql.query("select * from iprofile where ifields like ? and city=?",[ifield,req.query.city],function(err,resultJsonAry)
    {
        if(err!=null)
        {
        resp.send(err.message);
        return;
        }
      //  console.log(resultJsonAry);
        resp.send(resultJsonAry);//sending array of JSON object 0-1
    })
})
//------------Show by Name in card-------------
app.get("/show-by-name-in-card",function(req,resp)
{
    let name="%"+req.query.name+"%";
    mysql.query("select * from iprofile where name like ?",[name],function(err,resultJsonAry)
    {
        if(err!=null)
        {
        resp.send(err.message);
        return;
        }
      //  console.log(resultJsonAry);
        resp.send(resultJsonAry);//sending array of JSON object 0-1
    })
})
//--------------Event-Manager-Page---------------------
app.get("/event-manager",function(req,resp)
{
    let path=__dirname+"/public/event-manager.html";
    resp.sendFile(path);
})
//-------------Get-all-upcoming-event----------------

app.get("/get-all-upcoming",function(req,resp)
{
    mysql.query("select * from events where doe>=current_date() && emailid=?",[req.query.email],function(err,resultJsonAry)
    {
        
        if(err!=null)
        {
        resp.send(err.message);
        return;
        }
        
        
        resp.send(resultJsonAry);//sending array of JSON object 0-1
    })
})
//---------------Delete -Events------------
app.get("/del-event",function(req,resp)
{
    mysql.query("delete from events where rid=?",[req.query.rid],function(err,resultJsonAry)
    {
        if(err!=null)
        {
        resp.send(err.message);
        return;
        }
        
        
        resp.send("Deleted");//sending array of JSON object 0-1
    })
})
//-------save-client-profile-----------
app.get("/save-client-profile", function (req, resp) {
    
    mysql.query("insert into cprofile values(?,?,?,?,?,?)", [req.query.cemail, req.query.cname, req.query.ccity, req.query.cstate, req.query.io, req.query.ccn], function (err) {
        if (err == null)
            resp.redirect("result_save.html");
        else
            resp.send(err.message);
    })

})
//----------Client-Update-------------------
app.get("/client-update", function (req, resp) {
    
      
  
    mysql.query("update cprofile set name=? , city=? , state=? , org=? , mobile=?  where email=?", [req.query.cname, req.query.ccity, req.query.cstate, req.query.io, req.query.cno,req.query.cemail], function (err, result) {
        if (err == null) {
            if (result.affectedRows >= 1) {
                resp.redirect("result_save.html");
            }
            else {
                resp.send("Invalid-EmailId");
            }
        }

        else
            resp.send(err.message);

    })


})
//--------Search Client Profile---------------------

app.get("/find-client-details", function (req, resp) {
    let email = req.query.cemail;
    mysql.query("select * from cprofile where email=?", [email], function (err, resultJsonAry) {
        if (err != null)
            resp.send(err.message);

        resp.send(resultJsonAry);//sending array of JSON object 0-1
    })
})
//--------------Enable-Disable---------------------------
app.get("/chk-if-present", function (req, resp) {
    mysql.query("select * from iprofile where emailid=?", [req.query.txtemailid], function (err, res) {
       if(err)
       {
        resp.send(err.message);
        return;
       }
       if(res.length==1)
       {
        resp.send("Found");
       }
    })
})