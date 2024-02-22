/* @refresh reload */
import { render } from 'solid-js/web'
import { Navigate, Route, Router, Routes } from '@solidjs/router'
import { MainContextProvider } from './context/mainContext'
import Workouts from './pages/Workouts'
import Login from './pages/Login'
import Auth from './pages/Auth'
import Workout from './pages/Workout'
import Exercise from './pages/Exercise'
import Account from './pages/Account'
import DeleteAccount from './pages/DeleteAccount'
import Session from './pages/Session'
import WorkoutLogs from './pages/WorkoutLogs'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error('Root element not found. Did you forget ' +
        'to add it to your index.html? Or maybe the id attribute got misspelled?')
}

render(() => (
    <Router>
        <Routes>
            <Route path="" component={MainContextProvider}>
                <Route path="/" element={<Navigate href={'/login'}/>}/>

                <Route path="/auth/:account_id/:auth_code" component={Auth}/>
                <Route path="/login" component={Login}/>

                <Route path="/account" component={Account}/>
                <Route path="/account/delete/:account_id/:auth_code" component={DeleteAccount}/>

                <Route path="/workouts" component={Workouts}/>
                <Route path="/workout/:workout_id" component={Workout}/>
                <Route path="/workout/:workout_id/exercise/:exercise_id" component={Exercise}/>

                <Route path="/workout/:workout_id/logs" component={WorkoutLogs}/>
                <Route path="/workout/:workout_id/session/:workout_session_id" component={Session}/>
            </Route>
        </Routes>
    </Router>
), root)
