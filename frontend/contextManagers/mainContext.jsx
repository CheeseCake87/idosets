import {createContext, createEffect, createSignal, onMount} from 'solid-js'
import {Navigate, Outlet, useLocation, useNavigate} from '@solidjs/router'
import {Loading} from '../components/globals/Loading'
import Fetcher from '../utilities/fetcher'

export const mainContext = createContext()

export function MainContextProvider(props) {
    const DEV = import.meta.env.DEV
    const API_URL = DEV ? import.meta.env.VITE_FLASK_URL : ''

    const timeout_fetch_after = 1000
    const [connection, setConnection] = createSignal(true)

    const navigate = useNavigate()
    const location = useLocation()

    async function getFetch(url) {
        const controller = new AbortController()
        const signal = controller.signal

        const fetch_timeout = setTimeout(
            () => {
                controller.abort('fetch timeout')
                setConnection(false)
            },
            timeout_fetch_after
        )

        const response = await fetch(url, {
            credentials: 'include', method: 'GET', signal
        })

        if (response.ok) {
            clearTimeout(fetch_timeout)
            if (!connection()) {
                setConnection(true)
            }

            if (response.headers.get('content-type')?.includes('application/json')) {
                const json = await response.json()
                if (DEV) {
                    console.log(url, json)
                }
                if (json.status === 'unauthorized') {
                    setLoggedIn(false)
                    setTheme('dark')
                    setUnits('kgs')
                    setAccountId(0)
                    setEmailAddress('')
                }
                return json
            } else {
                return {status: 'not json'}
            }
        } else {
            return {status: 'error'}
        }
    }

    async function postFetch(url, data) {
        const controller = new AbortController()
        const signal = controller.signal

        const fetch_timeout = setTimeout(
            () => {
                controller.abort('fetch timeout')
                setConnection(false)
            },
            timeout_fetch_after
        )

        const response = await fetch(url, {
            credentials: 'include',
            method: 'POST',
            signal,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (response.ok) {
            clearTimeout(fetch_timeout)
            if (!connection()) {
                setConnection(true)
            }

            if (response.headers.get('content-type')?.includes('application/json')) {
                const json = await response.json()
                if (DEV) {
                    console.log(url, json)
                }
                if (json.status === 'unauthorized') {
                    setLoggedIn(false)
                    setTheme('dark')
                    setUnits('kgs')
                    setAccountId(0)
                    setEmailAddress('')
                }
                return json
            } else {
                return {status: 'not json'}
            }
        } else {
            return {status: 'error'}
        }
    }

    async function deleteFetch(url) {
        const controller = new AbortController()
        const signal = controller.signal

        const fetch_timeout = setTimeout(
            () => {
                controller.abort('fetch timeout')
                setConnection(false)
            },
            timeout_fetch_after
        )

        const response = await fetch(url, {
            credentials: 'include', method: 'DELETE', signal
        })

        if (response.ok) {
            clearTimeout(fetch_timeout)
            if (!connection()) {
                setConnection(true)
            }

            if (response.headers.get('content-type')?.includes('application/json')) {
                const json = await response.json()
                if (DEV) {
                    console.log(url, json)
                }
                if (json.status === 'unauthorized') {
                    setLoggedIn(false)
                    setTheme('dark')
                    setUnits('kgs')
                    setAccountId(0)
                    setEmailAddress('')
                }
                return json
            } else {
                return {status: 'not json'}
            }
        } else {
            return {status: 'error'}
        }
    }

    async function getAuthSession() {
        return await getFetch(`${API_URL}/api/auth/session`)
    }

    const [systemError, setSystemError] = createSignal(false)
    const [loggedIn, setLoggedIn] = createSignal(false)
    const [theme, setTheme] = createSignal('dark')
    const [units, setUnits] = createSignal('kgs')
    const [accountId, setAccountId] = createSignal(0)
    const [emailAddress, setEmailAddress] = createSignal('')

    // Utilities
    function truncate(str, n) {
        if (str === undefined) return ('')
        return (str.length > n) ? str.substring(0, n - 1) + '...' : str
    }

    function fancyTimeFormat(duration) {
        // Hours, minutes and seconds

        if (duration === undefined || duration === 0) return ('0 secs')

        const hrs = ~~(duration / 3600)
        const mins = ~~((duration % 3600) / 60)
        const secs = ~~duration % 60

        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = ''

        if (hrs > 0) {
            ret += '' + hrs + (hrs > 1 ? ' hours ' : ' hour ') + (mins < 10 ? '' : '')
        }

        if (mins > 0) {
            ret += '' + mins + (mins > 1 ? ' mins ' : ' min ')
        }

        if (secs > 0) {
            ret += '' + secs + ' secs '
        }

        return ret
    }

    function fancyRepFormat(min_reps, max_reps) {
        if (min_reps === max_reps) {
            return min_reps + ' reps'
        }
        if (min_reps > 0 && max_reps > 0) {
            return min_reps + ' - ' + max_reps + ' reps'
        }
        if (min_reps === 0 && max_reps > 0) {
            return max_reps + ' reps'
        }
        if (min_reps > 0 && max_reps === 0) {
            return min_reps + ' reps'
        }
        return ''
    }

    function gramsToKgs(grams) {
        return (grams / 1000).toFixed(2)
    }

    async function fold(container_id, content_id) {
        const container = document.getElementById(container_id)
        const content = document.getElementById(content_id)

        const container_height = container.scrollHeight
        const content_height = content.scrollHeight

        let id
        let height = container.style.maxHeight.replace('px', '')

        if (container_height === content_height) {
            close()
        } else {
            open()
        }

        function open() {
            if (height >= content_height) {
                return true
            } else {
                height++
                container.style.maxHeight = height + 'px'
            }
            setTimeout(open, 0.005)
        }

        function close() {
            if (height <= 0) {
                return true
            } else {
                height--
                container.style.maxHeight = height + 'px'
            }
            setTimeout(close, 0.005)
        }

        return true
    }

    async function getFakeError() {
        return await getFetch(`${API_URL}/api/fake-error`)
    }

    // Settings
    async function getTheme() {
        return await getFetch(`${API_URL}/api/get/theme`)
    }

    async function saveTheme(theme) {
        return await getFetch(`${API_URL}/api/set/theme/${theme}`)
    }

    async function saveUnits(unit) {
        return await getFetch(`${API_URL}/api/set/unit/${unit}`)
    }

    // Auth
    async function tryAuth(params) {
        return await postFetch(`${API_URL}/api/auth`, {
            account_id: params.account_id, auth_code: params.auth_code
        })
    }

    // Login / Logout
    async function tryLogin(email_address) {
        return await postFetch(`${API_URL}/api/login`, {
            email_address
        })
    }

    async function tryLogout() {
        return await getFetch(`${API_URL}/api/logout`)
    }

    // Account
    async function getAccount() {
        return await getFetch(`${API_URL}/api/account`)
    }

    async function sendDeleteAccountAuth() {
        return await getFetch(`${API_URL}/api/account/send/delete`)
    }

    async function tryDeleteAccount(params) {
        return await postFetch(`${API_URL}/api/account/delete`, {
            account_id: params.account_id, auth_code: params.auth_code
        })
    }

    // Workouts
    async function getLastWorkoutSession() {
        return await getFetch(`${API_URL}/api/workouts/last`)
    }

    async function getWorkoutLogs(params) {
        return await postFetch(
            `${API_URL}/api/` +
            `workouts/${params.workout_id}` +
            '/logs',
            {limit: params.limit ? params.limit : 10}
        )
    }

    async function getWorkouts() {
        return await getFetch(`${API_URL}/api/workouts`)
    }

    async function addWorkout(params) {
        return await postFetch(`${API_URL}/api/workouts/add`, {
            name: params.name
        })
    }

    async function getWorkout(params) {
        return await getFetch(`${API_URL}/api/` + `workouts/${params.workout_id}`)
    }

    async function editWorkout(params) {
        return await postFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/edit`, params.data)
    }

    async function deleteWorkout(params) {
        return await deleteFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/delete`)
    }

    // Sessions
    async function getSessions(params) {
        return await getFetch(
            `${API_URL}/api/` +
            `workout/${params.workout_id}/sessions`)
    }

    async function getActiveSessions(params) {
        return await getFetch(`${API_URL}/api/sessions/active`)
    }

    async function startSession(params) {
        return await getFetch(`${API_URL}/api/` + `workout/${params.workout_id}/sessions/start`)
    }

    async function stopSession(params) {
        return await postFetch(
            `${API_URL}/api/` +
            `workout/${params.workout_id}/` +
            `sessions/${params.workout_session_id}/stop`,
            params.data
        )
    }

    async function cancelSession(params) {
        return await deleteFetch(
            `${API_URL}/api/` +
            `workout/${params.workout_id}/` +
            `sessions/${params.workout_session_id}/cancel`
        )
    }

    async function getSession(params) {
        return await getFetch(
            `${API_URL}/api/` +
            `workout/${params.workout_id}/` +
            `sessions/${params.workout_session_id}`
        )
    }

    async function deleteSession(params) {
        return await deleteFetch(`${API_URL}/api/` + `workout/${params.workout_id}/` + `sessions/${params.workout_session_id}/delete`)
    }

    async function logSet(params) {
        return await postFetch(
            `${API_URL}/api/` +
            `workouts/${params.workout_id}/` +
            `sessions/${params.workout_session_id}/log-set`,
            params.data
        )
    }

    async function deleteLogSet(params) {
        return await deleteFetch(
            `${API_URL}/api/` +
            `workouts/${params.workout_id}/` +
            `sessions/${params.workout_session_id}/` +
            `log-set/${params.set_log_id}/delete`
        )
    }

    // Exercises
    async function addExercise(params) {
        return await postFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/` + 'exercises/add', params.data)
    }

    async function getExercise(params) {
        return await getFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/` + `exercises/${params.exercise_id}`)
    }

    async function editExercise(params) {
        return await postFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/` + `exercises/${params.exercise_id}/edit`, params.data)
    }

    async function deleteExercise(params) {
        return await deleteFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/` + `exercises/${params.exercise_id}/delete`)
    }

    // Sets
    async function addSet(params) {
        return await postFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/` + `exercises/${params.exercise_id}/sets/add`, params.data)
    }

    async function copySet(params) {
        return await getFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/` + `exercises/${params.exercise_id}/` + `sets/${params.set_id}/copy`)
    }

    async function deleteSet(params) {
        return await deleteFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/` + `exercises/${params.exercise_id}/` + `sets/${params.set_id}/delete`)
    }

    const session = new Fetcher(getAuthSession)

    const ctxAttrs = {
        connection: connection,
        navigate: navigate,
        getFetch: getFetch,
        postFetch: postFetch,
        deleteFetch: deleteFetch,
        getAuthSession: getAuthSession,
        systemError: systemError,
        setSystemError: setSystemError,
        loggedIn: loggedIn,
        setLoggedIn: setLoggedIn,
        theme: theme,
        setTheme: setTheme,
        units: units,
        setUnits: setUnits,
        accountId: accountId,
        setAccountId: setAccountId,
        emailAddress: emailAddress,
        setEmailAddress: setEmailAddress,
        // Utilities
        truncate: truncate,
        fancyTimeFormat: fancyTimeFormat,
        fancyRepFormat: fancyRepFormat,
        gramsToKgs: gramsToKgs,
        fold: fold,
        getFakeError: getFakeError,
        getTheme: getTheme,
        saveTheme: saveTheme,
        saveUnits: saveUnits,
        // Auth
        tryAuth: tryAuth,
        // Login / Logout
        tryLogin: tryLogin,
        tryLogout: tryLogout,
        // Account
        getAccount: getAccount,
        sendDeleteAccountAuth: sendDeleteAccountAuth,
        tryDeleteAccount: tryDeleteAccount,
        // Workouts
        getLastWorkoutSession: getLastWorkoutSession,
        getWorkoutLogs: getWorkoutLogs,
        getWorkouts: getWorkouts,
        addWorkout: addWorkout,
        getWorkout: getWorkout,
        editWorkout: editWorkout,
        deleteWorkout: deleteWorkout,
        // Sessions
        getSessions: getSessions,
        getActiveSessions: getActiveSessions,
        startSession: startSession,
        stopSession: stopSession,
        cancelSession: cancelSession,
        getSession: getSession,
        deleteSession: deleteSession,
        logSet: logSet,
        deleteLogSet: deleteLogSet,
        // Exercises
        addExercise: addExercise,
        getExercise: getExercise,
        editExercise: editExercise,
        deleteExercise: deleteExercise,
        // Sets
        addSet: addSet,
        copySet: copySet,
        deleteSet: deleteSet
    }

    let html

    onMount(() => {
        html = document.querySelector('html')
    })
    createEffect(() => {
        html.setAttribute('data-theme', theme())
    })

    if (
        location.pathname.includes('/auth') ||
        location.pathname.includes('/logout')
    ) {
        return (
            <mainContext.Provider value={ctxAttrs}>
                <Outlet/>
            </mainContext.Provider>
        )
    }

    createEffect(() => {
        if (!session.data.loading) {
            if (session.get('status') === 'failed') {
                setLoggedIn(false)
                setTheme('dark')
                setUnits('kgs')
                setAccountId(0)
                setEmailAddress(null)
                navigate('/login')
            } else {
                setLoggedIn(session.data().logged_in)
                setTheme(session.data().theme)
                setUnits(session.data().units)
                setAccountId(session.data().account_id)
                setEmailAddress(session.data().email_address)
                if (location.pathname === '/login' && session.data().logged_in) {
                    navigate('/workouts')
                }
            }
        }
    })

    return (
        <mainContext.Provider value={ctxAttrs}>
            {
                session.data.loading
                    ? <div className={'pt-20'}><Loading/></div>
                    : !session.data().logged_in && location.pathname !== '/login'
                        ? <Navigate href={'/login'}/>
                        : <Outlet/>
            }
        </mainContext.Provider>
    )
}
