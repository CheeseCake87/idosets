import {createContext, createEffect, onMount} from "solid-js";
import {Outlet, useLocation} from "@solidjs/router";

import {createStore} from "solid-js/store";

export const mainContext = createContext();

export function MainContextProvider(props) {

    let html

    onMount(() => {
        html = document.querySelector('html')
    })

    const location = useLocation();

    console.log(location.pathname, "mainContext.jsx")

    const [store, setStore] = createStore({

        theme: 'dark',

    });

    createEffect(() => {
        html.setAttribute('data-theme', store.theme)
    })

    return (
        <mainContext.Provider value={
            {
                store,
                setStore
            }
        }>
            <Outlet/>
        </mainContext.Provider>
    );
}
