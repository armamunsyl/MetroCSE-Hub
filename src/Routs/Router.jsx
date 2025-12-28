import { createBrowserRouter } from 'react-router-dom'
import Layout from '../Layout/Layout'
import ErrorPage from '../components/ErrorPage'
import LandingGate from '../pages/LandingGate.jsx'
import AllBatch from '../pages/AllBatch'
import Question from '../pages/Question'
import QuestionDetails from '../pages/QuestionDetails.jsx'
import Profile from '../pages/Profile'
import Tools from '../pages/Tools'
import Notice from '../pages/Notice'
import Login from '../components/Login'
import Registration from '../components/Registration'
import PrivateRoute from './PrivateRoute.jsx'
import RoleRoute from './RoleRoute.jsx'
import DashboardLayout from '../pages/dashboard/DashboardLayout.jsx'
import DashboardOverview from '../pages/dashboard/DashboardOverview.jsx'
import MyProfile from '../pages/dashboard/MyProfile.jsx'
import MyContribution from '../pages/dashboard/MyContribution.jsx'
import PendingContribution from '../pages/dashboard/PendingContribution.jsx'
import MyNotice from '../pages/dashboard/MyNotice.jsx'
import MyComment from '../pages/dashboard/MyComment.jsx'
import AdminFeedback from '../pages/dashboard/AdminFeedback.jsx'
import ContributeRequest from '../pages/dashboard/ContributeRequest.jsx'
import AccountApproval from '../pages/dashboard/AccountApproval.jsx'
import ManageUser from '../pages/dashboard/ManageUser.jsx'
import UserFeedback from '../pages/dashboard/UserFeedback.jsx'
import ReportedObject from '../pages/dashboard/ReportedObject.jsx'
import AddBanner from '../pages/dashboard/AddBanner.jsx'
import Analytics from '../pages/dashboard/Analytics.jsx'
import PendingApproval from '../pages/PendingApproval.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: LandingGate,
      },
      {
        path: '/all-batch',
        element: (
          <PrivateRoute>
            <AllBatch />
          </PrivateRoute>
        ),
      },
      {
        path: '/question',
        element: (
          <PrivateRoute>
            <Question />
          </PrivateRoute>
        ),
      },
      {
        path: '/question/:id',
        element: (
          <PrivateRoute>
            <QuestionDetails />
          </PrivateRoute>
        ),
      },
      {
        path: '/notice',
        element: (
          <PrivateRoute>
            <Notice />
          </PrivateRoute>
        ),
      },
      {
        path: '/tools',
        element: (
          <PrivateRoute>
            <Tools />
          </PrivateRoute>
        ),
      },
      {
        path: '/login',
        Component: Login,
      },
      {
        path: '/register',
        Component: Registration,
      },
      {
        path: '/pending',
        element: (
          <PrivateRoute allowPending>
            <PendingApproval />
          </PrivateRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardOverview />,
          },
          {
            path: 'profile',
            element: <MyProfile />,
          },
          {
            path: 'my-contribution',
            element: <MyContribution />,
          },
          {
            path: 'pending-contribution',
            element: (
              <RoleRoute allow={['student']}>
                <PendingContribution />
              </RoleRoute>
            ),
          },
          {
            path: 'my-notice',
            element: <MyNotice />,
          },
          {
            path: 'my-comment',
            element: <MyComment />,
          },
          {
            path: 'admin-feedback',
            element: <AdminFeedback />,
          },
          {
            path: 'contribute-request',
            element: (
              <RoleRoute allow={['admin', 'moderator', 'cr']}>
                <ContributeRequest />
              </RoleRoute>
            ),
          },
          {
            path: 'account-approval',
            element: (
              <RoleRoute allow={['admin', 'moderator', 'cr']}>
                <AccountApproval />
              </RoleRoute>
            ),
          },
          {
            path: 'manage-user',
            element: (
              <RoleRoute allow={['admin']}>
                <ManageUser />
              </RoleRoute>
            ),
          },
          {
            path: 'user-feedback',
            element: (
              <RoleRoute allow={['admin']}>
                <UserFeedback />
              </RoleRoute>
            ),
          },
          {
            path: 'reported-object',
            element: (
              <RoleRoute allow={['admin']}>
                <ReportedObject />
              </RoleRoute>
            ),
          },
          {
            path: 'add-banner',
            element: (
              <RoleRoute allow={['admin']}>
                <AddBanner />
              </RoleRoute>
            ),
          },
          {
            path: 'analytics',
            element: (
              <RoleRoute allow={['admin']}>
                <Analytics />
              </RoleRoute>
            ),
          },
        ],
      },
    ],
  },
])

export default router
