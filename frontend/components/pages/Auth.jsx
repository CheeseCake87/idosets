import { createEffect, createResource, createSignal, Show, useContext } from 'solid-js'
import { mainContext } from '../../contextManagers/mainContext'
import { useNavigate, useParams } from '@solidjs/router'
import { Loading } from '../globals/Loading'

export default function Auth (props) {
  const navigate = useNavigate()
  const params = useParams()
  const ctxMain = useContext(mainContext)

  const [auth, set_auth] = createSignal(0)
  // 0 = processing, 9 = error

  const [try_auth] = createResource(
    {
      account_id: params.account_id,
      auth_code: params.auth_code
    },
    ctxMain.tryAuth
  )

  createEffect(() => {
    if (try_auth.loading === false) {
      if (try_auth().status === 'passed') {
        ctxMain.setLoggedIn(true)
        ctxMain.setAccountId(try_auth().account_id)
        ctxMain.setEmailAddress(try_auth().email_address)
        ctxMain.setTheme(try_auth().theme)
        ctxMain.setUnits(try_auth().units)
        navigate('/workouts')
      } else {
        set_auth(9)
      }
    } else {
      set_auth(0)
    }
  })

  return (
        <>
            {try_auth.loading
              ? <div className={'pt-20'}><Loading/></div>
              : <div className={'login py-6'}>
                    <h2 className={'pb-4'}>💪 I Do Sets</h2>
                    <Show when={auth() === 0}>
                        <p>Logging in, please wait...</p>
                    </Show>
                    <Show when={auth() === 9}>
                        <p className={'pb-2'}>Looks like there was an error. </p>
                        <p className={'pb-6'}>Your login link might have expired, or be incorrect.</p>
                        <button type="button" onClick={
                            () => {
                              navigate('/login')
                            }
                        }>
                            Back to Login / Signup
                        </button>
                    </Show>
                </div>
            }
        </>
  )
};
