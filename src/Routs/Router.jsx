import { createBrowserRouter } from 'react-router-dom'
import Layout from '../Layout/Layout'
import ErrorPage from '../components/ErrorPage'
import Home from '../pages/Home'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
])

export default router
