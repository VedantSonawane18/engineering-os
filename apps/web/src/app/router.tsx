import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { PlaceholderPage } from '../pages/PlaceholderPage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/webinar', element: <PlaceholderPage title="Webinar" /> },
  { path: '/login', element: <PlaceholderPage title="Login" /> },
  { path: '/signup', element: <PlaceholderPage title="Sign up" /> },
])
