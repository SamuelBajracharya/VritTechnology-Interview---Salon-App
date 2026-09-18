import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Appointments from './pages/Appointments'
import Services from './pages/Services'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* path '/' redirected to '/appointments' */}
          <Route path='/' element={<Navigate to='/appointments' replace />} />

          {/* Required routes */}
          <Route path='/appointments' element={<Appointments />} />
          <Route path='/services' element={<Services />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
