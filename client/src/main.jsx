import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import UserStore from './store/UserStore.jsx'
import TaskStore from './store/TaskStore.jsx'
import { createContext } from 'react'


export const Context = createContext(null)


createRoot(document.getElementById('root')).render(
    <Context.Provider value={{
      user: new UserStore(),
      task: new TaskStore(),
    }}>
      <App />
    </Context.Provider>


)
