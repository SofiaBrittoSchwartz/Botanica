import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import MyGarden from './pages/MyGarden/MyGarden';
import Cart from './pages/Cart/Cart';
import Settings from './pages/Settings/Settings';
import NavBar from './components/NavBar/NavBar';
import PlantList from './components/PlantList/PlantList';
import PlantInfo from './components/PlantInfo/PlantInfo';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<PlantList />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/plantinfo/:id' element={<PlantInfo />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/mygarden' element={<MyGarden />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/settings' element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
