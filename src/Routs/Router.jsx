import { createBrowserRouter } from 'react-router-dom'
import Layout from '../Layout/Layout'
import ErrorPage from '../components/ErrorPage'
import Home from '../pages/Home'
import AllBatch from '../pages/AllBatch'

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
      {
        path: 'all-batch',
        Component: AllBatch,
      },
    ],
  },
])

export default router
