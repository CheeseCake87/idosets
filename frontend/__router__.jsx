/* @refresh reload */
import {render} from 'solid-js/web'
import {Route, Router, Routes} from '@solidjs/router'
import {MainContextProvider} from './contextManagers/mainContext'
import _Workouts from './components/pages/Workouts/_Workouts'
import Login from './components/pages/Login'
import Auth from './components/pages/Auth'
import _Workout from './components/pages/Workouts/Workout/_Workout'
import _Exercise from './components/pages/Workouts/Workout/Exercise/_Exercise'
import Account from './components/pages/Account'
import DeleteAccount from './components/pages/DeleteAccount'
import _Session from './components/pages/Session/_Session'
import _WorkoutLogs from './components/pages/Workouts/WorkoutLogs/_WorkoutLogs'
import Index from './components/pages'
import {SessionContextProvider} from "./contextManagers/sessionContext";
import {WorkoutsContextProvider} from "./contextManagers/workoutsContext";

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error('Root element not found. Did you forget ' +
        'to add it to your index.html? Or maybe the id attribute got misspelled?')
}

render(() => (
    <Router>
        <Routes>
            <Route path="/" component={Index}/>
            <Route path="" component={MainContextProvider}>
                <Route path="/auth/:account_id/:auth_code" component={Auth}/>
                <Route path="/login" component={Login}/>

                <Route path="/account" component={Account}/>
                <Route path="/account/delete/:account_id/:auth_code" component={DeleteAccount}/>

                <Route path="" component={WorkoutsContextProvider}>
                    <Route path="/workouts" component={_Workouts}/>
                    <Route path="/workout/:workout_id" component={_Workout}/>
                    <Route path="/workout/:workout_id/exercise/:exercise_id" component={_Exercise}/>
                    <Route path="/workout/:workout_id/logs" component={_WorkoutLogs}/>
                </Route>

                <Route path="" component={SessionContextProvider}>
                    <Route path="/workout/:workout_id/session/:workout_session_id" component={_Session}/>
                </Route>

            </Route>
        </Routes>
    </Router>
), root)
