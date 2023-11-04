import { useEffect, useState, useRef } from 'react'

export const Teachers = ()=>{

  const ENDPOINT = "http://localhost:4000/teachers";

  const [teachesr, setTeachers] = useState([])
  const dialogRef = useRef(null)
  const dialogDeleteRef = useRef(null)
  const [currentTeacher, setCurrentTeacher] = useState({
    teacher_id: 0,
    first_name: '',
    last_name: '',
    email: '',
    subject: '',
    hire_date: ''
  })

  const getAll =async ()=>{
    let fetchResp = await fetch(ENDPOINT)
    let dataJson = await fetchResp.json()
    setTeachers(dataJson)
  }
  useEffect(() => {
    //useEffect vacio, significa que lo va ejecutar cuando se cargue el componente en memoria.
    (async () => {
        await getAll()
    })()
  }, [])

  const newUserClick = (e) => {
    e.preventDefault()
    dialogRef.current.showModal()
  }

  const closeNewUserModal = (e) => {
    e.preventDefault()
    dialogRef.current.close()
  }

  const valueHasChanged = (e) => {
    setCurrentTeacher({
      ...currentTeacher,
      [e.target.name]: e.target.value,
    })
  }

  const formSubmit = async (e) =>{
    e.preventDefault()
    if (currentTeacher.id <= 0){
      //Create
      await postData(currentTeacher)
    }
    else{
      await updateData(currentTeacher)
    }
    setCurrentTeacher({
      teacher_id: 0,
      first_name: '',
      last_name: '',
      email: '',
      subject: '',
      hire_date: ''
    })
    dialogRef.current.close()
  }

  const postData = async (data)=>{
    let fetchResp = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
      })
      let json = await fetchResp.json()
      await getAll()
  }

  const updateData = async (data)=>{
    let fetchResp = await fetch(ENDPOINT + "/" + data.teacher_id, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
      })
      let json = await fetchResp.json()
      await getAll()
  }

  const deleteRow = async (row)=>{
    setCurrentTeacher(row)
    dialogDeleteRef.current.showModal()
  }

  const deleteData = async (row) =>{
    let fetchResp = await fetch(ENDPOINT + "/" + row.teacher_id, {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json"
      }
      })
      let json = await fetchResp.json()
      await getAll()
  }

  const confirmDelete = async(e)=>{
    e.preventDefault();
    await deleteData(currentTeacher)
    dialogDeleteRef.current.close()
  }

  const showEdit = (row)=>{
    setCurrentTeacher(row)
    dialogRef.current.showModal()
  }

    return(
        <>
          <dialog ref={dialogRef}>
        <h4>Nuevo Profesor</h4>
        <form onSubmit={formSubmit} className="w3-container">
          <label htmlFor="teacher_id">teacher_id</label>
          <input
            type="text"
            id="teacher_id"
            name="teacher_id"
            className="w3-input"
            value={currentTeacher.teacher_id}
            onChange={valueHasChanged}
          />
          <label htmlFor="first_name">first_name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            className="w3-input"
            value={currentTeacher.first_name}
            onChange={valueHasChanged}
          />
          <label htmlFor="last_name">last_name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            className="w3-input"
            value={currentTeacher.last_name}
            onChange={valueHasChanged}
          />
          <label htmlFor="email">email</label>
          <input
            type="text"
            id="email"
            name="email"
            className="w3-input"
            value={currentTeacher.email}
            onChange={valueHasChanged}
          />
          <label htmlFor="subject">subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="w3-input"
            value={currentTeacher.subject}
            onChange={valueHasChanged}
          />
          <label htmlFor="hire_date">hire_date</label>
          <input
            type="text"
            id="hire_date"
            name="hire_date"
            className="w3-input"
            value={currentTeacher.hire_date}
            onChange={valueHasChanged}
          />
          <div className="w3-row">
            <div className="w3-col m4">
              <button type="submit" className="w3-button w3-green">Guardar</button>         
            </div>
            <div className="w3-col m4">
              <button className="w3-button w3-red" onClick={closeNewUserModal}>Cerrar</button>
            </div>
          </div>
        </form>
      </dialog>
      <button onClick={newUserClick} >Nuevo usuario</button>

      <h1>Teachers</h1>
      <table className="w3-table w3-striped w3-bordered w3-border">
        <thead>
          <tr>
            <th>Id</th>
            <th>first_name</th>
            <th>last_name</th>
            <th>email</th>
            <th>subject</th>
            <th>hire_date</th>
          </tr>
        </thead>
        
        <tbody>
          {teachesr.map((row) => (
            <tr key={'teachers' + row.id} style={{backgroundColor: row.status === "I" ? "olive": ""}}>
              <td>{row.teacher_id}</td>
              <td>{row.first_name}</td>
              <td>{row.last_name}</td>
              <td>{row.email}</td>
              <td>{row.subject}</td>
              <td>{row.hire_date}</td>
              <td>
                <button className="w3-button w3-yellow" onClick={(e)=> { showEdit(row) }}>Editar</button>
                <button className="w3-button w3-red" onClick={(e)=> {deleteRow(row)}}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dialog ref={dialogDeleteRef}>
        <h4>Confirmación de borrado</h4>
        <form onSubmit={confirmDelete} className="w3-container">
           
            Esta seguro que desea eliminar a {currentTeacher.first_name}
            <div className='w3-row'>
              <div className='w3-col m6'>
                <button className="w3-button w3-red" type="submit">Confirmar</button>
              </div>
              <div className='w3-col m6'>
                  <button className="w3-button w3-blue" onClick={(e)=>{
                  e.preventDefault()
                  dialogDeleteRef.current.close()
                }} >Cancelar</button>
              </div>
            </div>
        </form>
      </dialog>
        </>
    )
}