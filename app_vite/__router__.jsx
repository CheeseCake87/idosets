/* @refresh reload */
import {ErrorBoundary, render} from 'solid-js/web';
import {Navigate, Route, Router, Routes} from "@solidjs/router";
import {MainContextProvider} from "./context/mainContext";
import Workouts from "./pages/Workouts";
import Login from "./pages/Login";


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
                <Route path="/login" component={Login}/>
                <Route path="/workouts" component={Workouts}/>
                <Route path="*" element={
                    <ErrorBoundary fallback={err => err}>
                        <Broken/>
                    </ErrorBoundary>
                }/>
            </Route>
        </Routes>
    </Router>
), root);
