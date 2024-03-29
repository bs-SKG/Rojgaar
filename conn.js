var mysql = require('mysql');
const express = require('express')
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

const port = 9000;
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "rojgaar"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.post("/register", (req, res) => {
  con.query(`SELECT email FROM user where email='${req.body.email}'`, (err, result) => {
    if (err) {
      console.log(err);
    } else if (result.length > 0) {
      res.send("Email Already Exist!")
    }
    else {
      con.query(`SELECT phone FROM user where phone= '${req.body.phone}'`, (err, result) => {
        if (err) {
          console.log(err);
        } else if (result.length > 0) {
          res.send("Phone number already exist!")
        }
        else {
          con.query('insert into user (`name`,`phone`,`email`,`password`,`cpassword`,`dob`,`pincode`,`address`,`user_type`,`profile_pic`) values (?,?,?,?,?,?,?,?,?,?)', [req.body.name, req.body.phone, req.body.email, req.body.password, req.body.cpassword, req.body.dob, req.body.pincode, req.body.address, req.body.userType, req.body.profile_pic],
            (err, result) => {
              if (err) {
                console.log(err);
              }
              else {
                res.send("Registration Completed Successfully.");
              }
            })
        }
      })
    }
  });
});
app.post("/forgot_pass", (req, res) => {
  const email = req.body.email;
  const dob = req.body.dob;
  con.query(`SELECT * FROM user where email = '${email}' && dob = '${dob}' `,
    (err, result) => {
      if (err) {
        console.log(err)
      }
      else if (result.length > 0) {
        res.send(result);
        console.log(result);
      }
      else {
        res.status(400).send("Data not Matched!")
      }
    })
});
app.post("/update_pass", (req, res) => {
  console.log(req.body.password);
  const password = req.body.password;
  console.log(req.body.cpassword);
  const cpassword = req.body.cpassword;
  const email = req.body.email;
  console.log(email);
  con.query(`update user set password = '${password}' , cpassword ='${cpassword}' where email = '${email}'`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(result);
      }
    })

})
app.post("/login", (req, res) => {
  console.log(req.body.email)
  const email = req.body.email;
  con.query(`SELECT * FROM  user where email = '${email}'`,
    (err, result) => {

      if (err) {
        console.log(err);
      }
      else if (result.length > 0) {
        res.send(result);
        console.log(result);
      }
      else {
        res.status(400).send("Email does not exist")
        console.log("register yourself")
      }
    })

});

app.get('/getProfiles', (req, res) => {
  let email = req.query.email;
  console.log(email);
  con.query(`select * from user where email = '${email}'`, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      console.log(result);
      res.send(result)
    }
  })

})
app.post("/update_profile", (req, res) => {
  let name = req.body.name;
  let email = req.query.email;
  let address = req.body.address;
  con.query(`update user set name = '${name}', address='${address}', profile_pic='${req.body.profilePhoto}' where email='${email}' `,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(result);
      }
    })
});

app.post("/update_business_profile", (req, res) => {
  let email = req.query.email;
  con.query(`update user set business_profile='${req.body.business_profile_image}' where email='${email}' `,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(result);
      }
    })
});
// app.get("/get_id",(req,res)=>{
//   let email = req.query.email;
//   con.query(`SELECT id FROM user where email='${email}'`,(err,result) =>{
//     if(err){
//       console.log(err)
//     }
//     else{
//       // let id = result;
//       res.send(result);
//     }
//   })
// });
app.post("/UpdatePost", (req, res) => {

  console.log(req.body,"shubham");
  con.query(`UPDATE job_details INNER JOIN user ON user.id = job_details.businessman_id SET job_details.no_ofWorkers='${req.body.state.no_ofWorkers}' , job_details.salary='${req.body.state.salary}' , job_details.business_title='${req.body.state.title}' , job_details.desc='${req.body.state.desc}' , job_details.business_location='${req.body.state.location}' , job_details.business_phone_no='${req.body.state.phone_no}' where job_details.businessman_id = '${req.body.businessman_id}' AND job_details.SNO = '${req.body.sno}'`, (err, result) => {
    if (err) {
      res.send(err)
      console.log(err);
    }
    else {
      res.send("Post Updated Successfully.");
      console.log(result);
    }
  })
});




app.post("/post_job", (req, res) => {
  con.query(`SELECT * FROM job_details where business_location='${req.body.state.location}' AND business_title='${req.body.state.title}' AND businessman_id='${req.body.businessman_id}' AND status='1'`, (err, result) => {
    if (err) {
      console.log(err);
    } else if (result.length > 0) {
      res.send("Already Exist!")
    }
    else {
      // con.query('insert into job_details (`businessman_id`,`email`,`business_title`,`business_location`,`no_ofWorkers`,`salary`,`desc`,`status`, business_phone_no) values (?,?,?,?,?,?,?,?,?)',[req.body.businessman_id,req.body.email,req.body.title,req.body.location,req.body.no_ofWorkers,req.body.salary,req.body.desc,'1',req.body.phone_no],(err,result)=>{
      con.query('insert into job_details (`businessman_id`,`business_title`,`business_location`,`no_ofWorkers`,`salary`,`desc`,`status`, business_phone_no) values (?,?,?,?,?,?,?,?)', [req.body.businessman_id, req.body.state.title, req.body.state.location, req.body.state.no_ofWorkers, req.body.state.salary, req.body.state.desc, '1', req.body.state.phone_no], (err, result) => {
        if (err) {
          console.log(err);
        }
        else {
          res.send("Job Post Successfully.");
        }
      })
    }
  });
});

app.get('/get_job_data', (req, res) => {
  con.query(`SELECT * FROM user INNER JOIN job_details ON user.id = job_details.businessman_id WHERE job_details.status = '1' `, (err, result) => {
    if (err) {
      res.send(err)
    }
    else {
      res.send(result)
    }
  })
})
app.delete("/delete_post", (req, res) => {
  console.log(req.query, req.query.id, "shubham");

  con.query(`UPDATE job_details SET status = '0' where businessman_id = '${req.query.id}' AND SNO = '${req.query.SNO}'`, (err, result) => {
    if (err) {
      res.send(err)
      console.log(err);
    }
    else {
      res.send(result)
      console.log(result);
    }
  })
});
app.get("/getApplierData", (req, res) => {
  // console.log(req.query,"getApplierData");
  con.query(`SELECT * FROM appliers`, (err, result) => {
    if (err) {
      res.send(err)
    }
    else {
      console.log(result, 'result');
      res.send(result);
    }
  })
});
app.post("/applyForJob", (req, res) => {
  con.query('insert into appliers (`appliers_id`,`posts_id`,`comfortable_with_location`,`immediate_joiner`) values (?,?,?,?)', [req.body.id, req.body.sno, req.body.state.comfortableLocation, req.body.state.joinImmediately], (err, result) => {
    if (err) {
      console.log(err);
      res.send(err)
    }
    else {
      console.log(result);
      res.send(result)
    }
  })
});

app.post("/submitContactForm", (req, res) => {
  console.log(req.body);
  con.query('insert into contact_us_data (`user_id`,`name`,`email`,`desc`) values (?,?,?,?)', [req.body.id, req.body.data.name, req.body.data.email, req.body.data.desc], (err, result) => {
    if (err) {
      console.log(err);
      res.send(err)
    }
    else {
      console.log(result);
      res.send(result)
    }
  })
});
app.get("/EditPost", (req, res) => {
  console.log(req.body);
  con.query(`SELECT * FROM job_details where 	businessman_id='${req.query.id}' AND SNO='${req.query.sno}' AND status='1'`, (err, result) => {
    if (err) {
      console.log(err);
      res.send(err)
    }
    else {
      console.log(result);
      res.send(result)
    }
  })
});



app.listen(port, () => {
  console.log("listen on " + port)
})


