import { Routes, Route } from 'react-router-dom'
import Home from '../Pages/Home'
import Register from '../Register'
import Admin from '../Admin'
import Private from './Private'

export default function RoutesApp() {
    return(
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/admin' element={<Private> <Admin/></Private>}/>
        </Routes>
    )
}