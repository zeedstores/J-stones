import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProjects from './pages/admin/Projects'
import AdminProjectForm from './pages/admin/ProjectForm'
import AdminProjectPreview from './pages/admin/ProjectPreview'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/projects" element={<AdminProjects />} />
      <Route path="/admin/projects/new" element={<AdminProjectForm mode="new" />} />
      <Route path="/admin/projects/:id/edit" element={<AdminProjectForm mode="edit" />} />
      <Route path="/admin/projects/:id/preview" element={<AdminProjectPreview />} />
    </Routes>
  )
}
