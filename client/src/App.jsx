import { BrowserRouter } from 'react-router-dom'
import AppRouter from './components/AppRouter.jsx'
import Header from './components/Header/Header.jsx'
import Aside from './components/Aside/Aside.jsx'
import './assets/index.css'


function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Aside/>
      <AppRouter/>
    </BrowserRouter>
  )
}

export default App
