import {createContext, createEffect, onMount} from "solid-js";
import {Outlet, useLocation, useNavigate} from "@solidjs/router";
import {createStore} from "solid-js/store";
import Loading from "../components/Loading";
import Fetcher from "../utilities/fetcher";

export const mainContext = createContext();

export function MainContextProvider(props) {

    const API_URL = import.meta.env.DEV ? 'http://localhost:5000' : ''
    const DEBUG = import.meta.env.DEV

    const navigate = useNavigate();
    const location = useLocation();

    async function getFetch(url) {
        const response = await fetch(
            url, {
                credentials: "include",
                method: "GET"
            }
        )

        if (response.headers.get('content-type')?.includes('application/json')) {
            const json = await response.json()
            if (DEBUG) {
                console.log(url, json)
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
                body: JSON.stringify(data)
            }
        )

        if (response.headers.get('content-type')?.includes('application/json')) {
            const json = await response.json()
            if (DEBUG) {
                console.log(url, json)
            }
            return json
        }

        navigate('/error')
    }

    async function deleteFetch(url) {
        const response = await fetch(
            url, {
                credentials: "include",
                method: "DELETE",
            }
        )

        if (response.headers.get('content-type')?.includes('application/json')) {
            const json = await response.json()
            if (DEBUG) {
                console.log(url, json)
            }
            return json
        }

        navigate('/error')
    }

    const [store, setStore] = createStore({

        logged_in: false,
        theme: 'dark',
        units: 'kgs',
        account_id: 0,
        email_address: '',

        // Utilities
        truncate: (str, n) => {
            if (str === undefined) return ('')
            return (str.length > n) ? str.substring(0, n - 1) + '...' : str;
        },
        fancyTimeFormat(duration) {
            // Hours, minutes and seconds
            const hrs = ~~(duration / 3600);
            const mins = ~~((duration % 3600) / 60);
            const secs = ~~duration % 60;

            // Output like "1:01" or "4:03:59" or "123:03:59"
            let ret = "";

            if (hrs > 0) {
                ret += "" + hrs + (hrs > 1 ? " hours " : " hour ") + (mins < 10 ? "" : "");
            }

            if (mins > 0) {
                ret += "" + mins + (mins > 1 ? " mins " : " min ");
            }

            ret += "" + secs + " secs ";

            return ret;
        },

        // Settings
        async setTheme(theme) {
            return await getFetch(
                `${API_URL}/api/set/theme/${theme}`,
            )
        },
        async setUnits(unit) {
            return await getFetch(
                `${API_URL}/api/set/unit/${unit}`,
            )
        },

        // Auth
        async getAuthSession() {
            return await getFetch(
                `${API_URL}/api/auth/session`,
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

        // Login / Logout
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

        // Account
        async getAccount() {
            return await getFetch(
                `${API_URL}/api/account`,
            )
        },
        async sendDeleteAccountAuth() {
            return await getFetch(
                `${API_URL}/api/account/send/delete`,
            )
        },
        async tryDeleteAccount(params) {
            return await postFetch(
                `${API_URL}/api/account/delete`,
                {
                    account_id: params.account_id,
                    auth_code: params.auth_code,
                }
            )
        },

        // Workouts
        async getWorkouts() {
            return await getFetch(
                `${API_URL}/api/workouts`,
            )
        },
        async addWorkout(params) {
            return await postFetch(
                `${API_URL}/api/workouts/add`,
                {
                    name: params.name,
                }
            )
        },
        async getWorkout(params) {
            return await getFetch(
                `${API_URL}/api/workouts/${params.workout_id}`
            )
        },
        async editWorkout(params) {
            return await postFetch(
                `${API_URL}/api/workouts/${params.workout_id}/edit`, params.data
            )
        },
        async deleteWorkout(params) {
            return await deleteFetch(
                `${API_URL}/api/workouts/${params.workout_id}/delete`
            )
        },

        // Sessions
        async getSessions(params) {
            return await getFetch(
                `${API_URL}/api/sessions`
            )
        },
        async getActiveSessions(params) {
            return await getFetch(
                `${API_URL}/api/sessions/active`
            )
        },
        async startSession(params) {
            return await postFetch(
                `${API_URL}/api/sessions/start`,
                params.data
            )
        },
        async stopSession(params) {
            return await postFetch(
                `${API_URL}/api/sessions/start`,
                params.data
            )
        },
        async getSession(params) {
            return await getFetch(
                `${API_URL}/api/sessions/get/${params.workout_session_id}`
            )
        },
        async deleteSession(params) {
            return await deleteFetch(
                `${API_URL}/api/sessions/delete/${params.workout_session_id}`
            )
        },

        // Exercises
        async addExercise(params) {
            return await postFetch(
                `${API_URL}/api/workouts/${params.workout_id}/exercises/add`,
                params.data
            )
        },
        async getExercise(params) {
            return await getFetch(
                `${API_URL}/api/workouts/${params.workout_id}/exercises/${params.exercise_id}`
            )
        },
        async editExercise(params) {
            return await postFetch(
                `${API_URL}/api/workouts/${params.workout_id}/exercises/${params.exercise_id}/edit`,
                params.data
            )
        },
        async deleteExercise(params) {
            return await deleteFetch(
                `${API_URL}/api/workouts/${params.workout_id}/exercises/${params.exercise_id}/delete`
            )
        },

        // Sets
        async addSet(params) {
            return await postFetch(
                `${API_URL}/api/workouts/${params.workout_id}/exercises/${params.exercise_id}/sets/add`,
                params.data
            )
        },
        async copySet(params) {
            return await getFetch(
                `${API_URL}/api/workouts/${params.workout_id}/exercises/${params.exercise_id}/sets/${params.set_id}/copy`
            )
        },
        async deleteSet(params) {
            return await deleteFetch(
                `${API_URL}/api/workouts/${params.workout_id}/exercises/${params.exercise_id}/sets/${params.set_id}/delete`
            )
        },
        async logSet(params) {
            return await postFetch(
                `${API_URL}/api/workouts/${params.workout_id}/exercises/${params.exercise_id}/log-set`,
                params.data
            )
        }

    });

    let html

    onMount(() => {
        html = document.querySelector('html')
    })
    createEffect(() => {
        html.setAttribute('data-theme', store.theme)
    })

    if (location.pathname.includes('/auth/')) {

        return (
            <mainContext.Provider value={[store, setStore]}>
                <Outlet/>
            </mainContext.Provider>
        );

    } else {

        const session = new Fetcher(store.getAuthSession)

        createEffect(() => {
            if (!session.data.loading) {
                if (session.get("status") === 'failed') {
                    setStore("logged_in", false)
                    setStore("theme", "dark")
                    setStore("units", "kgs")
                    setStore("account_id", 0)
                    setStore("email_address", null)
                    navigate('/login')
                } else {
                    setStore("logged_in", session.data().logged_in)
                    setStore("theme", session.data().theme)
                    setStore("units", session.data().units)
                    setStore("account_id", session.data().account_id)
                    setStore("email_address", session.data().email_address)
                }
            }
        })

        return (
            <mainContext.Provider value={[store, setStore]}>
                {session.data.loading ? <div className={"pt-20"}><Loading/></div> : <Outlet/>}
            </mainContext.Provider>
        );
    }
}

