import {createEffect, createResource, createSignal, Show, useContext} from 'solid-js'
import {mainContext} from '../../contextManagers/mainContext'
import {useNavigate, useParams} from '@solidjs/router'
import {Loading} from '../globals/Loading'

export default function DeleteAccount(props) {
    const navigate = useNavigate()
    const params = useParams()
    const ctxMain = useContext(mainContext)

    const [auth, set_auth] = createSignal(0)
    // 0 = processing, 1 = success, 9 = error

    const [try_delete] = createResource(
        {
            account_id: params.account_id,
            auth_code: params.auth_code
        },
        ctxMain.tryDeleteAccount
    )

    createEffect(() => {
        if (try_delete.loading === false) {
            if (try_delete().status === 'success') {
                ctxMain.tryLogout().then(json => {
                    if (json.status === 'success') {
                        ctxMain.setLoggedIn(false)
                        ctxMain.setTheme('dark')
                        ctxMain.setUnits('kgs')
                        ctxMain.setAccountId(0)
                        ctxMain.setEmailAddress('')
                    }
                })
                set_auth(1)
            } else {
                set_auth(9)
            }
        } else {
            set_auth(0)
        }
    })

    return (
        <>
            {try_delete.loading
                ? <div className={'pt-20'}><Loading/></div>
                : <div className={'login py-6'}>
                    <h2 className={'pb-4'}>💪 I Do Sets</h2>
                    <Show when={auth() === 0}>
                        <p>Deleting account, please wait...</p>
                    </Show>
                    <Show when={auth() === 9}>
                        <p className={'pb-6'}>This auth link has expired.</p>
                        <button type="button" onClick={
                            () => {
                                navigate('/login')
                            }
                        }>
                            Back to Login / Signup
                        </button>
                    </Show>
                    <Show when={auth() === 1}>
                        <p className={'pb-6'}>Your account has been deleted.</p>
                        <button type="button" onClick={
                            () => {
                                navigate('/')
                            }
                        }>
                            Done
                        </button>
                    </Show>
                </div>
            }
        </>
    )
};
