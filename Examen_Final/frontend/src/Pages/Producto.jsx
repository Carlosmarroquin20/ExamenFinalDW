import React, { useEffect, useState, useRef } from 'react';

export const Producto = () => {
  const ENDPOINT = "http://localhost:4000/producto";

  const [productos, setProductos] = useState([]);
  const dialogRef = useRef(null);
  const dialogDeleteRef = useRef(null);
  const [currentProducto, setCurrentProducto] = useState({
    id: 0,
    Nombre: '',
    Precio: 0,
    Codigo: '',
    Existencia: 0,
  });

  const getAll = async () => {
    let fetchResp = await fetch(ENDPOINT);
    let dataJson = await fetchResp.json();
    setProductos(dataJson);
  }

  useEffect(() => {
    (async () => {
      await getAll();
    })();
  }, []);

  const newProductoClick = (e) => {
    e.preventDefault();
    dialogRef.current.showModal();
  }

  const closeNewProductoModal = (e) => {
    e.preventDefault();
    dialogRef.current.close();
  }

  const valueHasChanged = (e) => {
    setCurrentProducto({
      ...currentProducto,
      [e.target.name]: e.target.value,
    });
  }

  const formSubmit = async (e) => {
    e.preventDefault();
    if (currentProducto.id <= 0) {
      await postData(currentProducto);
    } else {
      await updateData(currentProducto);
    }
    setCurrentProducto({
      id: 0,
      Nombre: '',
      Precio: 0,
      Codigo: '',
      Existencia: 0,
    });
    dialogRef.current.close();
  }

  const postData = async (data) => {
    let fetchResp = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    await getAll();
  }

  const updateData = async (data) => {
    let fetchResp = await fetch(ENDPOINT + "/" + data.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    await getAll();
  }

  const deleteRow = async (row) => {
    setCurrentProducto(row);
    dialogDeleteRef.current.showModal();
  }
  const deleteData = async (row) => {
    try {
      await fetch(ENDPOINT + "/" + row.id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      await getAll();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  }
  

  const confirmDelete = async (e) => {
    e.preventDefault();
    dialogDeleteRef.current.close();
    await deleteData(currentProducto);
  }

  const showEdit = (row) => {
    setCurrentProducto(row);
    dialogRef.current.showModal();
  }

  return (
    <>
      <dialog ref={dialogRef}>
        <h4>Nuevo producto</h4>
        <form onSubmit={formSubmit} className="w3-container">
          <label htmlFor="Nombre">Nombre</label>
          <input
            type="text"
            id="Nombre"
            name="Nombre"
            className="w3-input"
            value={currentProducto.Nombre}
            onChange={valueHasChanged}
          />
          <label htmlFor="Precio">Precio</label>
          <input
            type="number"
            id="Precio"
            name="Precio"
            className="w3-input"
            value={currentProducto.Precio}
            onChange={valueHasChanged}
          />
          <label htmlFor="Codigo">Código</label>
          <input
            type="text"
            id="Codigo"
            name="Codigo"
            className="w3-input"
            value={currentProducto.Codigo}
            onChange={valueHasChanged}
          />
          <label htmlFor="Existencia">Existencia</label>
          <input
            type="number"
            id="Existencia"
            name="Existencia"
            className="w3-input"
            value={currentProducto.Existencia}
            onChange={valueHasChanged}
          />
          <div className="w3-row">
            <div className="w3-col m4">
              <button type="submit" className="w3-button w3-green">Guardar</button>
            </div>
            <div className="w3-col m4">
              <button className="w3-button w3-red" onClick={closeNewProductoModal}>Cerrar</button>
            </div>
          </div>
        </form>
      </dialog>
      <button onClick={newProductoClick}>Nuevo producto</button>
      <h1>Productos</h1>
      <table className="w3-table w3-striped w3-bordered w3-border">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Código</th>
            <th>Existencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((row) => (
            <tr key={'producto' + row.id}>
              <td>{row.id}</td>
              <td>{row.Nombre}</td>
              <td>{row.Precio}</td>
              <td>{row.Codigo}</td>
              <td>{row.Existencia}</td>
              <td>
                <button className="w3-button w3-yellow" onClick={(e) => { showEdit(row) }}>Editar</button>
                <button className="w3-button w3-red" onClick={(e) => { deleteRow(row) }}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dialog ref={dialogDeleteRef}>
        <h4>Confirmación de borrado</h4>
        <form onSubmit={confirmDelete} className="w3-container">
          ¿Está seguro de que desea eliminar el producto "{currentProducto.Nombre}"?
          <div className='w3-row'>
            <div className='w3-col m6'>
              <button className="w3-button w3-red" type="submit">Confirmar</button>
            </div>
            <div className='w3-col m6'>
              <button className="w3-button w3-blue" onClick={(e) => {
                e.preventDefault();
                dialogDeleteRef.current.close();
              }}>Cancelar</button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  )
}
