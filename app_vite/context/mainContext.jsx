import {createContext, createEffect, onMount} from "solid-js";
import {Outlet, useNavigate} from "@solidjs/router";
import {createStore} from "solid-js/store";

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
            return await response.json()
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
                body: JSON.stringify(data)
            }
        )

        if (response.headers.get('content-type')?.includes('application/json')) {
            return await response.json()
        }

        navigate('/error')
    }

    const [store, setStore] = createStore({

        logged_in: false,
        theme: 'dark',
        account_id: 0,
        email_address: '',

        async getTheme() {
            return await getFetch(
                `${API_URL}/api/get/theme`,
            )
        },

        async setTheme(theme) {
            return await getFetch(
                `${API_URL}/api/set/theme/${theme}`,
            )
        },

        async tryAuth(params) {
            return await postFetch(
                `${API_URL}/api/auth`,
                {
                    account_id: params.account_id,
                    auth_code: params.auth_code,
                }
            )
        },

        async checkLogin() {
            return await getFetch(
                `${API_URL}/api/check/login`,
            )
        },

        async tryLogin(email_address) {
            return await postFetch(
                `${API_URL}/api/login`,
                {
                    email_address: email_address,
                }
            )
        },

        async tryLogout() {
            return await getFetch(
                `${API_URL}/api/logout`,
            )
        },

        async getWorkouts() {
            return await getFetch(
                `${API_URL}/api/workouts`,
            )
        },

    });

    let html

    onMount(() => {
        store.getTheme().then(json => {
            setStore('theme', json.theme)
        })
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
            <Outlet/>
        </mainContext.Provider>
    );
}
