import { createBrowserRouter } from 'react-router-dom'
import Layout from '../Layout/Layout'
import ErrorPage from '../components/ErrorPage'
import Home from '../pages/Home'
import AllBatch from '../pages/AllBatch'
import Question from '../pages/Question'
import Profile from '../pages/Profile'
import Tools from '../pages/Tools'
import Notice from '../pages/Notice'

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
        path: '/all-batch',
        Component: AllBatch,
      },
      {
        path: '/question',
        Component: Question,
      },
      {
        path: '/notice',
        Component: Notice,
      },
      {
        path: '/tools',
        Component: Tools,
      },
      {
        path: '/profile',
        Component: Profile,
      }
    ],
  },
])

export default router
