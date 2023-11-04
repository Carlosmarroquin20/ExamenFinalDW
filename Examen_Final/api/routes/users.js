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
    const resultado = await sql.query("SELECT id, name, pass, email FROM Users")
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
                        .query("SELECT id, name, pass, email FROM Users WHERE id = @id")
    data = resultado.recordset[0]
  }
  catch(err){
    console.error(err)
    data = err
    res.statusCode = 500 //Internal server error
  }
  res.send(data)
});

router.put('/:id', async (req, res, next)=> {
  let data = {}
  let {name, pass, email, status} = req.body
  //user.name, user.pass, user.email
  try{
    //Abrimos la conexion
    const connection = await sql.connect(config)
    //ejecutamos la consulta
    const resultado = await connection.request()
                        .input("id", sql.Int, req.params.id)
                        .query("SELECT id, name, pass, email FROM Users WHERE id = @id")
    if (resultado.recordset.length > 0){
      const result = await connection
      .request()
      .input("name", sql.VarChar, name)
      .input("pass", sql.VarChar, pass)
      .input("email", sql.VarChar, email)
      .input("id", sql.Int, req.params.id)
      .input("status", sql.VarChar,status)
      .query("UPDATE Users SET name=@name, pass=@pass,email=@email WHERE id=@id")
       data = result.rowsAffected
    }
    //await sql.close()

  }
  catch(err){
    console.error(err)
    data = err
    res.statusCode = 500 //Internal server error
  }
  res.send(data)
});

router.post("/", async (req, res, next)=>{
  const user = req.body;
  let resultado = {}
  try{
    let connection = await sql.connect(config)
    const result = await connection
                              .request()
                              .input("name", sql.VarChar, user.name)
                              .input("pass", sql.VarChar, user.pass)
                              .input("email", sql.VarChar, user.email)
                              
                              .query("INSERT INTO Users(name,pass,email) VALUES (@name,@pass,@email)")
    resultado = result.rowsAffected                        
  }
  catch(err){
    console.error(err)
    res.statusCode = 500
    resultado = err
  }
  res.send(resultado)
})



router.delete('/:id', async (req, res, next)=> {
  let data = {}
  try{
    //Abrimos la conexion
    const connection = await sql.connect(config)
    //ejecutamos la consulta
    const resultado = await connection.request()
                        .input("id", sql.Int, req.params.id)
                        .query("SELECT id FROM Users WHERE id = @id")
    if (resultado.recordset.length > 0){
      const result = await connection
      .request()
      .input("id", sql.Int, req.params.id)
      .query("DELETE from Users where id=@id")
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
