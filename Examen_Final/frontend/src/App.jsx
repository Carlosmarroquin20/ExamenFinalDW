import { BrowserRouter, Routes, Route } from "react-router-dom"
import {Layout} from './Pages/Layout'
import {Users} from './Pages/Users'
import { Teachers  } from './Pages/Teachers'
import { Producto  } from './Pages/Producto'
import "./App.css"
function App() {
 
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index path="/Users" element={<Users />} />
            <Route index path="/Teachers" element={<Teachers />} />
            <Route index path="/Producto" element={<Producto />} />
            <Route path="*" 
              element={<>
                <h2>No encontramos la pagina</h2>
              </>} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
