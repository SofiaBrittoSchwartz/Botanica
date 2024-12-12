import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import PlantList from './components/PlantList/PlantList'
import NavBar from './components/NavBar/NavBar'
import Login from './components/Login/Login'
import SignUp from './components/SignUp/SignUp'
import PlantInfo from './components/PlantInfo/PlantInfo'

function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path='/' element={<PlantList/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/plantinfo' element={<PlantInfo/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
