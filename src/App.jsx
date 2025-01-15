import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignInPage from './pages/SignInPage';
import PwFindPage from './pages/PwFindPage';
import SignUpPage from './pages/SignUpPage';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/passwordfind' element={<PwFindPage />} />
          <Route path='/signup' element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
