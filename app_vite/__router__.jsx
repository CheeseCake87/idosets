/* @refresh reload */
import {ErrorBoundary, render} from 'solid-js/web';
import {Navigate, Route, Router, Routes} from "@solidjs/router";
import {MainContextProvider} from "./context/mainContext";
import Workouts from "./pages/Workouts";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import PageNotFound from "./pages/PageNotFound";


const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error('Root element not found. Did you forget ' +
        'to add it to your index.html? Or maybe the id attribute got misspelled?',);
}

function Broken() {
    return null;
}

render(() => (
    <Router>
        <Routes>
            <Route path="" component={MainContextProvider}>
                <Route path="/" element={<Navigate href={'/workouts'}/>}/>
                <Route path="/auth/:auth_code" component={Auth}/>
                <Route path="/login" component={Login}/>
                <Route path="/workouts" component={Workouts}/>
                <Route path="*" component={PageNotFound}/>
            </Route>
        </Routes>
    </Router>
), root);
