const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { config } = require("../config/sql_server");

router.get('/', async (req, res, next) => {
  let data = [];

  try {
    await sql.connect(config);
    const resultado = await sql.query("SELECT IdProducto, Nombre, Precio, Codigo, Existencia FROM Producto");
    data = resultado.recordset;
  } catch (err) {
    console.error(err);
    data = err;
    res.statusCode = 500; // Internal server error
  }
  res.send(data);
});

router.get('/:id', async (req, res, next) => {
  let data = {};

  try {
    const connection = await sql.connect(config);
    const resultado = await connection.request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT IdProducto, Nombre, Precio, Codigo, Existencia FROM Producto WHERE IdProducto = @id");
    data = resultado.recordset[0];
  } catch (err) {
    console.error(err);
    data = err;
    res.statusCode = 500; // Internal server error
  }
  res.send(data);
});

router.post("/", async (req, res, next) => {
  const producto = req.body;
  let resultado = {};
  try {
    let connection = await sql.connect(config);
    const result = await connection
      .request()
      .input("nombre", sql.VarChar, producto.Nombre)
      .input("precio", sql.Int, producto.Precio)
      .input("codigo", sql.VarChar, producto.Codigo)
      .input("existencia", sql.Int, producto.Existencia)
      .query("INSERT INTO Producto(Nombre, Precio, Codigo, Existencia) VALUES (@nombre, @precio, @codigo, @existencia)");
    resultado = result.rowsAffected;
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    resultado = err;
  }
  res.send(resultado);
});

router.put('/:id', async (req, res, next) => {
  let data = {};
  let { Nombre, Precio, Codigo, Existencia } = req.body;

  try {
    const connection = await sql.connect(config);
    const resultado = await connection.request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT IdProducto, Nombre, Precio, Codigo, Existencia FROM Producto WHERE IdProducto = @id");
    if (resultado.recordset.length > 0) {
      const result = await connection
        .request()
        .input("nombre", sql.VarChar, Nombre)
        .input("precio", sql.Int, Precio)
        .input("codigo", sql.VarChar, Codigo)
        .input("existencia", sql.Int, Existencia)
        .input("id", sql.Int, req.params.id)
        .query("UPDATE Producto SET Nombre = @nombre, Precio = @precio, Codigo = @codigo, Existencia = @existencia WHERE IdProducto = @id");
      data = result.rowsAffected;
    }
  } catch (err) {
    console.error(err);
    data = err;
    res.statusCode = 500; // Internal server error
  }
  res.send(data);
});

router.delete('/:id', async (req, res, next) => {
  let data = {};

  try {
    const connection = await sql.connect(config);
    const resultado = await connection.request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT IdProducto FROM Producto WHERE IdProducto = @id");
    if (resultado.recordset.length > 0) {
      const result = await connection
        .request()
        .input("id", sql.Int, req.params.id)
        .query("DELETE FROM Producto WHERE IdProducto = @id");
      data = result.rowsAffected;
    }
  } catch (err) {
    console.error(err);
    data = err;
    res.statusCode = 500; // Internal server error
  }
  res.send(data);
});

module.exports = router;
