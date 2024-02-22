import { createContext, createEffect, createSignal, onMount } from 'solid-js'
import { Navigate, Outlet, useLocation, useNavigate } from '@solidjs/router'
import { createStore } from 'solid-js/store'
import { Loading } from '../components/Loading'
import Fetcher from '../utilities/fetcher'

export const mainContext = createContext()

export function MainContextProvider (props) {
  const DEV = import.meta.env.DEV
  const API_URL = DEV ? import.meta.env.VITE_FLASK_URL : ''

  const timeout_fetch_after = 1000
  const [connection, setConnection] = createSignal(true)

  const navigate = useNavigate()
  const location = useLocation()

  async function getFetch (url) {
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
          setStore('logged_in', false)
          setStore('theme', 'dark')
          setStore('units', 'kgs')
          setStore('account_id', 0)
          setStore('email_address', null)
        }
        return json
      } else {
        return { status: 'not json' }
      }
    } else {
      return { status: 'error' }
    }
  }

  async function postFetch (url, data) {
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
          setStore('logged_in', false)
          setStore('theme', 'dark')
          setStore('units', 'kgs')
          setStore('account_id', 0)
          setStore('email_address', null)
        }
        return json
      } else {
        return { status: 'not json' }
      }
    } else {
      return { status: 'error' }
    }
  }

  async function deleteFetch (url) {
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
          setStore('logged_in', false)
          setStore('theme', 'dark')
          setStore('units', 'kgs')
          setStore('account_id', 0)
          setStore('email_address', null)
        }
        return json
      } else {
        return { status: 'not json' }
      }
    } else {
      return { status: 'error' }
    }
  }

  async function getAuthSession () {
    return await getFetch(`${API_URL}/api/auth/session`)
  }

  const [
    store,
    setStore
  ] = createStore({

    system_error: false,

    logged_in: false,
    theme: 'dark',
    units: 'kgs',
    account_id: 0,
    email_address: '',

    // Utilities
    truncate: (str, n) => {
      if (str === undefined) return ('')
      return (str.length > n) ? str.substring(0, n - 1) + '...' : str
    },
    fancyTimeFormat (duration) {
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
    },
    fancyRepFormat (min_reps, max_reps) {
      let ret = ''
      if (min_reps === max_reps) {
        ret += '' + min_reps + ' reps'
      }
      if (min_reps > 0 && max_reps > 0) {
        ret += '' + min_reps + ' - ' + max_reps + ' reps'
      }
      if (min_reps === 0 && max_reps > 0) {
        ret += '' + max_reps + ' reps'
      }
      if (min_reps > 0 && max_reps === 0) {
        ret += '' + min_reps + ' reps'
      }
      return ret
    },
    gramsToKgs (grams) {
      return (grams / 1000).toFixed(2)
    },
    async fold (container_id, content_id) {
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

      function open () {
        if (height >= content_height) {
          return true
        } else {
          height++
          container.style.maxHeight = height + 'px'
        }
        setTimeout(open, 0.005)
      }

      function close () {
        if (height <= 0) {
          return true
        } else {
          height--
          container.style.maxHeight = height + 'px'
        }
        setTimeout(close, 0.005)
      }

      return true
    },

    async getFakeError () {
      return await getFetch(`${API_URL}/api/fake-error`)
    },

    // Settings
    async setTheme (theme) {
      return await getFetch(`${API_URL}/api/set/theme/${theme}`)
    },
    async setUnits (unit) {
      return await getFetch(`${API_URL}/api/set/unit/${unit}`)
    },

    // Auth
    async tryAuth (params) {
      return await postFetch(`${API_URL}/api/auth`, {
        account_id: params.account_id, auth_code: params.auth_code
      })
    },

    // Login / Logout
    async tryLogin (email_address) {
      return await postFetch(`${API_URL}/api/login`, {
        email_address
      })
    },
    async tryLogout () {
      return await getFetch(`${API_URL}/api/logout`)
    },

    // Account
    async getAccount () {
      return await getFetch(`${API_URL}/api/account`)
    },
    async sendDeleteAccountAuth () {
      return await getFetch(`${API_URL}/api/account/send/delete`)
    },
    async tryDeleteAccount (params) {
      return await postFetch(`${API_URL}/api/account/delete`, {
        account_id: params.account_id, auth_code: params.auth_code
      })
    },

    // Workouts
    async getLastWorkoutSession () {
      return await getFetch(`${API_URL}/api/workouts/last`)
    },
    async getWorkoutLogs (params) {
      return await postFetch(
                `${API_URL}/api/` +
                `workouts/${params.workout_id}` +
                '/logs',
                { limit: params.limit ? params.limit : 10 }
      )
    },
    async getWorkouts () {
      return await getFetch(`${API_URL}/api/workouts`)
    },
    async addWorkout (params) {
      return await postFetch(`${API_URL}/api/workouts/add`, {
        name: params.name
      })
    },
    async getWorkout (params) {
      return await getFetch(`${API_URL}/api/` + `workouts/${params.workout_id}`)
    },
    async editWorkout (params) {
      return await postFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/edit`, params.data)
    },
    async deleteWorkout (params) {
      return await deleteFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/delete`)
    },

    // Sessions
    async getSessions (params) {
      return await getFetch(
                `${API_URL}/api/` +
                `workout/${params.workout_id}/sessions`)
    },
    async getActiveSessions (params) {
      return await getFetch(`${API_URL}/api/sessions/active`)
    },
    async startSession (params) {
      return await getFetch(`${API_URL}/api/` + `workout/${params.workout_id}/sessions/start`)
    },
    async stopSession (params) {
      return await postFetch(
                `${API_URL}/api/` +
                `workout/${params.workout_id}/` +
                `sessions/${params.workout_session_id}/stop`,
                params.data
      )
    },
    async cancelSession (params) {
      return await deleteFetch(
                `${API_URL}/api/` +
                `workout/${params.workout_id}/` +
                `sessions/${params.workout_session_id}/cancel`
      )
    },
    async getSession (params) {
      return await getFetch(
                `${API_URL}/api/` +
                `workout/${params.workout_id}/` +
                `sessions/${params.workout_session_id}`
      )
    },
    async deleteSession (params) {
      return await deleteFetch(`${API_URL}/api/` + `workout/${params.workout_id}/` + `sessions/${params.workout_session_id}/delete`)
    },
    async logSet (params) {
      return await postFetch(
                `${API_URL}/api/` +
                `workouts/${params.workout_id}/` +
                `sessions/${params.workout_session_id}/log-set`,
                params.data
      )
    },
    async deleteLogSet (params) {
      return await deleteFetch(
                `${API_URL}/api/` +
                `workouts/${params.workout_id}/` +
                `sessions/${params.workout_session_id}/` +
                `log-set/${params.set_log_id}/delete`
      )
    },

    // Exercises
    async addExercise (params) {
      return await postFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/` + 'exercises/add', params.data)
    },
    async getExercise (params) {
      return await getFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/` + `exercises/${params.exercise_id}`)
    },
    async editExercise (params) {
      return await postFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/` + `exercises/${params.exercise_id}/edit`, params.data)
    },
    async deleteExercise (params) {
      return await deleteFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/` + `exercises/${params.exercise_id}/delete`)
    },

    // Sets
    async addSet (params) {
      return await postFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/` + `exercises/${params.exercise_id}/sets/add`, params.data)
    },
    async copySet (params) {
      return await getFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/` + `exercises/${params.exercise_id}/` + `sets/${params.set_id}/copy`)
    },
    async deleteSet (params) {
      return await deleteFetch(`${API_URL}/api/` + `workouts/${params.workout_id}/` + `exercises/${params.exercise_id}/` + `sets/${params.set_id}/delete`)
    },

    session: new Fetcher(getAuthSession)

  })

  let html

  onMount(() => {
    html = document.querySelector('html')
  })
  createEffect(() => {
    html.setAttribute('data-theme', store.theme)
  })

  if (
    location.pathname.includes('/auth') ||
        location.pathname.includes('/logout')
  ) {
    return (
            <mainContext.Provider value={[store, setStore, connection]}>
                <Outlet/>
            </mainContext.Provider>
    )
  }

  createEffect(() => {
    if (!store.session.data.loading) {
      if (store.session.get('status') === 'failed') {
        setStore('logged_in', false)
        setStore('theme', 'dark')
        setStore('units', 'kgs')
        setStore('account_id', 0)
        setStore('email_address', null)
        navigate('/login')
      } else {
        setStore('logged_in', store.session.data().logged_in)
        setStore('theme', store.session.data().theme)
        setStore('units', store.session.data().units)
        setStore('account_id', store.session.data().account_id)
        setStore('email_address', store.session.data().email_address)
        if (location.pathname === '/login' && store.session.data().logged_in) {
          navigate('/workouts')
        }
      }
    }
  })

  return (
        <mainContext.Provider value={[store, setStore, connection]}>
            {
                store.session.data.loading
                  ? <div className={'pt-20'}><Loading/></div>
                  : !store.session.data().logged_in && location.pathname !== '/login'
                      ? <Navigate href={'/login'}/>
                      : <Outlet/>
            }
        </mainContext.Provider>
  )
}
