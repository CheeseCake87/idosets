import {createContext, createEffect, onMount} from "solid-js";
import {Outlet, useNavigate} from "@solidjs/router";
import {createStore} from "solid-js/store";
import Loading from "../components/Loading";
import Fetcher from "../utilities/fetcher";

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

        async getSession() {
            return await getFetch(
                `${API_URL}/api/session`,
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

        async addWorkout(name) {
            return await postFetch(
                `${API_URL}/api/workouts/add`,
                {
                    name: name,
                }
            )
        },

    });


    const session = new Fetcher(store.getSession)

    let html

    onMount(() => {
        html = document.querySelector('html')
    })

    createEffect(() => {
        html.setAttribute('data-theme', store.theme)
    })

    createEffect(() => {
        if (!session.data.loading) {
            setStore("theme", session.data().theme)
            setStore("account_id", session.data().account_id)
            setStore("email_address", session.data().email_address)
        }
    })

    return (
        <mainContext.Provider value={
            {
                store,
                setStore,
                session
            }
        }>
            {session.data.loading ? <Loading/> : <Outlet/>}
        </mainContext.Provider>
    );
}
