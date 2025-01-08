import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import PlantList from './components/PlantList/PlantList'
import NavBar from './components/NavBar/NavBar'
import Login from './components/Login/Login'
import SignUp from './components/SignUp/SignUp'
import PlantInfo from './components/PlantInfo/PlantInfo'
import MyGarden from './components/MyGarden/MyGarden'
import Cart from './components/Cart/Cart'
import Settings from './components/Settings/Settings'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path='/' element={<PlantList/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/plantinfo/:id' element={<PlantInfo/>}/>
          <Route path='/mygarden' element={<MyGarden/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/settings' element={<Settings/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
