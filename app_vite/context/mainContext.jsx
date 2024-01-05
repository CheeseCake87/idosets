import {createContext, createEffect, onMount} from "solid-js";
import {Outlet, useNavigate} from "@solidjs/router";

import {createStore} from "solid-js/store";
import TopMenu from "../components/TopMenu";

export const mainContext = createContext();

export function MainContextProvider(props) {

    const API_URL = import.meta.env.DEV ? 'http://localhost:5000' : ''
    const navigate = useNavigate();

    async function getFetch(url) {
        const response = await fetch(
            url, {
                credentials: "include",
                method: "GET"
            }
        )

        if (response.headers.get('content-type')?.includes('application/json')) {
            const json = await response.json()
            if (json.status === 'unauthorized') {
                navigate('/login')
            }
            return json
        }

        navigate('/error')
    }

    async function postFetch(url, data) {
        const response = await fetch(
            url, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: 'admin',
                    password: 'admin'
                })
            }
        )

        if (response.headers.get('content-type')?.includes('application/json')) {
            const json = await response.json()
            if (json.status === 'unauthorized') {
                navigate('/login')
            }
            return json
        }

        navigate('/error')
    }

    const [store, setStore] = createStore({

        theme: 'dark',

        async tryLogin() {
            return await postFetch(
                `${API_URL}/api/login`,
                {
                    username: 'admin',
                    password: 'admin'
                }
            )
        },

        async getWorkouts() {
            console.log(`${API_URL}/api/workouts`)
            return await getFetch(
                `${API_URL}/api/workouts`,
            )
        },



    });

    let html

    onMount(() => {
        html = document.querySelector('html')
    })

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
            <TopMenu/>
            <div className={"container"}>
                <Outlet/>
            </div>
        </mainContext.Provider>
    );
}
