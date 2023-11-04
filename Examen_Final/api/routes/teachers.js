const express = require('express');
const router = express.Router();
const sql = require('mssql')
const {config} = require("../config/sql_server")

router.get('/', async (req, res, next)=> {
    let data = []
  
    try{
      //Abrimos la conexion
      await sql.connect(config)
      //ejecutamos la consulta
      const resultado = await sql.query("SELECT teacher_id, first_name, last_name, email, subject, hire_date FROM teachers")
      data = resultado.recordset
    }
    catch(err){
      console.error(err)
      data = err
      res.statusCode = 500 //Internal server error
    }
    res.send(data)
  });

router.get('/:id', async (req, res, next)=> {
    let data = {}
    
    try{
      //Abrimos la conexion
      const connection = await sql.connect(config)
      //ejecutamos la consulta
      const resultado = await connection.request()
                          .input("id", sql.Int, req.params.id)
                          .query("SELECT teacher_id, first_name, last_name, email, subject, hire_date FROM teachers WHERE teacher_id = @id")
      data = resultado.recordset[0]
    }
    catch(err){
      console.error(err)
      data = err
      res.statusCode = 500 //Internal server error
    }
    res.send(data)
  });

router.post("/", async (req, res, next)=>{
    const teacher = req.body;
    let resultado = {}
    try{
      let connection = await sql.connect(config)
      const result = await connection
                                .request()
                                .input("teacher_id", sql.Int, teacher.teacher_id)
                                .input("first_name", sql.VarChar, teacher.first_name)
                                .input("last_name", sql.VarChar, teacher.last_name)
                                .input("email", sql.VarChar, teacher.email)
                                .input("subject", sql.VarChar, teacher.subject)
                                .input("hire_date", sql.VarChar, teacher.hire_date)
                                
                                .query("INSERT INTO teachers(teacher_id,first_name,last_name,email,subject,hire_date) VALUES (@teacher_id,@first_name, @last_name, @email, @subject, @hire_date)")
      resultado = result.rowsAffected                        
    }
    catch(err){
      console.error(err)
      res.statusCode = 500
      resultado = err
    }
    res.send(resultado)
  })

  router.put('/:id', async (req, res, next)=> {
    let data = {}
    let {teacher_id, first_name, last_name, email, subject, hire_date} = req.body
    //user.name, user.pass, user.email
    try{
      //Abrimos la conexion
      const connection = await sql.connect(config)
      //ejecutamos la consulta
      const resultado = await connection.request()
                          .input("id", sql.Int, req.params.id)
                          .query("SELECT teacher_id, first_name, last_name, email, subject, hire_date FROM teachers WHERE teacher_id = @id")
      if (resultado.recordset.length > 0){
        const result = await connection
                                .request()
                                .input("teacher_id", sql.Int, teacher_id)
                                .input("first_name", sql.VarChar, first_name)
                                .input("last_name", sql.VarChar, last_name)
                                .input("email", sql.VarChar, email)
                                .input("subject", sql.VarChar, subject)
                                .input("hire_date", sql.VarChar, hire_date)

                                .query("UPDATE teachers SET teacher_id=@teacher_id, first_name=@first_name, last_name=@last_name,email=@email, subject=@subject, hire_date=@hire_date WHERE teacher_id=@teacher_id")
         data = result.rowsAffected
      }
    }
    catch(err){
      console.error(err)
      data = err
      res.statusCode = 500 //Internal server error
    }
    res.send(data)
  });

  router.delete('/:id', async (req, res, next)=> {
    let data = {}
    try{
      //Abrimos la conexion
      const connection = await sql.connect(config)
      //ejecutamos la consulta
      const resultado = await connection.request()
                          .input("teacher_id", sql.Int, req.params.id)
                          .query("SELECT teacher_id FROM teachers WHERE teacher_id = @teacher_id")
      if (resultado.recordset.length > 0){
        const result = await connection
        .request()
        .input("id", sql.Int, req.params.id)
        .query("DELETE from teachers where teacher_id=@id")
         data = result.rowsAffected
      }
    }
    catch(err){
      console.error(err)
      data = err
      res.statusCode = 500 //Internal server error
    }
    res.send(data)
  });

module.exports = router;