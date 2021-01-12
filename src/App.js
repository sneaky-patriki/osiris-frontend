import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import './axios'

import LoginPage from './pages/LoginPage'

import TeacherDashboardPage from './pages/TeacherDashboardPage'
import StudentDashboardPage from './pages/StudentDashboardPage'

import TopicsListPage from './pages/TopicsListPage'
import TopicsAddPage from './pages/TopicsAddPage'
import TopicsEditPage from './pages/TopicsEditPage'
import TopicsManagePage from './pages/TopicsManagePage'

import TaskgroupsAddPage from './pages/TaskgroupsAddPage'
import TaskgroupsEditPage from './pages/TaskgroupsEditPage'
import TaskgroupsMovePage from './pages/TaskgroupsMovePage'

import TasksAddPage from './pages/TasksAddPage'
import TasksViewPage from './pages/TasksViewPage'
import TasksEditPage from './pages/TasksEditPage'
import TasksMovePage from './pages/TasksMovePage'
import AttachmentsManagePage from './pages/AttachmentsManagePage'

import CoursesListPage from './pages/CoursesListPage'
import CoursesAddPage from './pages/CoursesAddPage'
import CoursesEditPage from './pages/CoursesEditPage'
import CoursesManagePage from './pages/CoursesManagePage'
import CoursesViewPageTeacher from './pages/CoursesViewPageTeacher'
import CoursesViewPageStudent from './pages/CoursesViewPageStudent'

import ModulesAddPage from './pages/ModulesAddPage'
import ModulesRenamePage from './pages/ModulesRenamePage'

import ClassesListPage from './pages/ClassesListPage'
import ClassesListPageStudent from './pages/ClassesListPageStudent'
import ClassesAddPage from './pages/ClassesAddPage'
import ClassesEditPage from './pages/ClassesEditPage'
import ClassesManagePage from './pages/ClassesManagePage'

import EnrolmentsAddPage from './pages/EnrolmentsAddPage'
import EnrolmentsImportPage from './pages/EnrolmentsImportPage'

import CourseProgressPage from './pages/CourseProgressPage'
import TopicProgressPage from './pages/TopicProgressPage'
import TaskgroupProgressPage from './pages/TaskgroupProgressPage'
import SubmissionsMarkPage from './pages/SubmissionsMarkPage'
import CourseProgressDifficultyPage from './pages/CourseProgressDifficultyPage'
import StudentProgressPage from './pages/StudentProgressPage'

import UsersManagePage from './pages/UsersManagePage'
import UsersImportPage from './pages/UsersImportPage'
import UserSettingsPage from './pages/UserSettingsPage'

import ProtectedRoute from './components/ProtectedRoute'

import { AuthProvider } from './AuthContext'

function App() {

  const [authDetails, setAuthDetails] = React.useState(
    localStorage.getItem('token')
  )

  function setAuth(token, username) {
    localStorage.setItem('token', token)
    localStorage.setItem('username', username)
    setAuthDetails(token)
  }

  return (
    <AuthProvider value={authDetails}>
      <Router>
        <Switch>
          <Route path='/login' render={(props) => {
            return <LoginPage {...props} setAuth={setAuth} />
          }}/>
          <ProtectedRoute exact path='/teacher' component={TeacherDashboardPage} />

          <ProtectedRoute exact path='/topics' component={TopicsListPage} />
          <ProtectedRoute exact path='/topics/add' component={TopicsAddPage} />
          <ProtectedRoute exact path='/topics/edit' component={TopicsEditPage} />
          <ProtectedRoute exact path='/topics/manage' component={TopicsManagePage} />

          <ProtectedRoute exact path='/taskgroups/add' component={TaskgroupsAddPage} />
          <ProtectedRoute exact path='/taskgroups/edit' component={TaskgroupsEditPage} />
          <ProtectedRoute exact path='/taskgroups/move' component={TaskgroupsMovePage} />
          <ProtectedRoute exact path='/tasks/add' component={TasksAddPage} />
          <ProtectedRoute exact path='/tasks/view' component={TasksViewPage} />
          <ProtectedRoute exact path='/tasks/edit' component={TasksEditPage} />
          <ProtectedRoute exact path='/tasks/attachments' component={AttachmentsManagePage} />
          <ProtectedRoute exact path='/tasks/move' component={TasksMovePage} />

          <ProtectedRoute exact path='/courses' component={CoursesListPage} />
          <ProtectedRoute exact path='/courses/add' component={CoursesAddPage} />
          <ProtectedRoute exact path='/courses/edit' component={CoursesEditPage} />
          <ProtectedRoute exact path='/courses/manage' component={CoursesManagePage} />
          <ProtectedRoute exact path='/courses/topics/add' component={ModulesAddPage}/>
          <ProtectedRoute exact path='/courses/topics/rename' component={ModulesRenamePage} />
          <ProtectedRoute exact path='/courses/view/teacher' component={CoursesViewPageTeacher} />

          <ProtectedRoute exact path='/classes' component={ClassesListPage} />
          <ProtectedRoute exact path='/classes/add' component={ClassesAddPage} />
          <ProtectedRoute exact path='/classes/edit' component={ClassesEditPage} />
          <ProtectedRoute exact path='/classes/manage' component={ClassesManagePage} />
          <ProtectedRoute exact path='/classes/enrolments/add' component={EnrolmentsAddPage}/>
          <ProtectedRoute exact path='/classes/enrolments/import' component={EnrolmentsImportPage}/>

          <ProtectedRoute exact path='/student' component={StudentDashboardPage} />
          <ProtectedRoute exact path='/courses/view/student' component={CoursesViewPageStudent} />
          <ProtectedRoute exact path='/classes/view/student' component={ClassesListPageStudent} />

          <ProtectedRoute exact path='/classes/progress' component={CourseProgressPage} />
          <ProtectedRoute exact path='/classes/topics/progress' component={TopicProgressPage} />
          <ProtectedRoute exact path='/classes/topics/taskgroups/progress' component={TaskgroupProgressPage} />
          <ProtectedRoute exact path='/submissions/mark' component={SubmissionsMarkPage}/>
          <ProtectedRoute exact path='/classes/progress/difficulty' component={CourseProgressDifficultyPage}/>
          <ProtectedRoute exact path='/students/progress' component={StudentProgressPage} />

          <ProtectedRoute exact path='/users' component={UsersManagePage} />
          <ProtectedRoute exact path='/users/import' component={UsersImportPage} />
          <ProtectedRoute exact path='/user/settings' component={UserSettingsPage} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
