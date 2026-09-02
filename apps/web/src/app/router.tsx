import { createBrowserRouter } from 'react-router-dom'
import { DashboardPage } from '../pages/DashboardPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { SignupPage } from '../pages/SignupPage'
import { AdminPage } from '../pages/AdminPage'
import { AdminStudentsPage } from '../pages/admin/AdminStudentsPage'
import { AdminStudentDetailPage } from '../pages/admin/AdminStudentDetailPage'
import { VerifyPage } from '../pages/VerifyPage'
import { PaymentPage } from '../pages/PaymentPage'
import { AdminPaymentsPage } from '../pages/admin/AdminPaymentsPage'
import { QueryPage } from '../pages/QueryPage'
import { TicketsPage } from '../pages/TicketsPage'
import { TicketDetailPage } from '../pages/TicketDetailPage'
import { AdminTicketsPage } from '../pages/admin/AdminTicketsPage'
import { AdminTicketDetailPage } from '../pages/admin/AdminTicketDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/verify',
    element: <VerifyPage />,
  },
  {
    path: '/webinar',
    element: <PlaceholderPage title="Webinar" />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/payment',
    element: <PaymentPage />,
  },
  {
    path: '/queries',
    element: <QueryPage />,
  },
  {
    path: '/tickets',
    element: <TicketsPage />,
  },
  {
    path: '/tickets/:id',
    element: <TicketDetailPage />,
  },
  {
    path: '/admin',
    element: <AdminPage />,
  },
  {
    path: '/admin/students',
    element: <AdminStudentsPage />,
  },
  {
    path: '/admin/payments',
    element: <AdminPaymentsPage />,
  },
  {
    path: '/admin/students/:id',
    element: <AdminStudentDetailPage />,
  },
  {
    path: '/admin/tickets',
    element: <AdminTicketsPage />,
  },
  {
    path: '/admin/tickets/:id',
    element: <AdminTicketDetailPage />,
  },
])