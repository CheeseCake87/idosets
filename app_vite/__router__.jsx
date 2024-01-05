/* @refresh reload */
import {render} from 'solid-js/web';
import {Route, Router, Routes} from "@solidjs/router";
import {MainContextProvider} from "./context/mainContext";
import Home from "./pages/Home";


const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error('Root element not found. Did you forget ' +
        'to add it to your index.html? Or maybe the id attribute got misspelled?',);
}

render(() => (
    <Router>
        <Routes>
            <Route path="" component={MainContextProvider}>
                <Route path="/" component={Home}/>
                <Route path="*" element={<div>404</div>}/>
            </Route>
        </Routes>
    </Router>
), root);
