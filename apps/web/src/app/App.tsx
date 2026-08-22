import { RouterProvider } from 'react-router-dom'
import { Cursor } from '../components/interaction/Cursor'
import { AppProviders } from './providers/AppProviders'
import { router } from './router'
export function App() { return <AppProviders><RouterProvider router={router} /><Cursor /></AppProviders> }
