import {createResource, createSignal, Show, useContext, createEffect} from "solid-js";
import {mainContext} from "../context/mainContext";
import {useNavigate} from "@solidjs/router";
import Loading from "../components/Loading";


export default function Login() {

    const ctx = useContext(mainContext);
    const navigate = useNavigate();

    const [email_address, set_email_address] = createSignal('');
    const [login_status, set_login_status] = createSignal('waiting');

    const [check_login] = createResource(ctx.store.checkLogin)

    createEffect(() => {
        if (check_login.loading === false) {
            if (check_login().status === 'passed') {
                navigate('/workouts')
            }
        }
    })

    return (
        <>
            {
                check_login.loading ? <Loading/> :
                    <div className={"login py-6"}>

                        <div className={"text-center pt-2 pb-8"}>

                            <h2 className={"my-0"}>💪 I Do Sets</h2>

                        </div>

                        <Show when={login_status() === 'waiting'}>

                            <div className={"form"}>

                                <input
                                    type="text"
                                    id="email_address"
                                    name="email_address"
                                    placeholder={"Email Address"}
                                    onChange={(e) => set_email_address(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={
                                        () => {
                                            ctx.store.tryLogin(email_address()).then(json => {
                                                if (json.status === 'success') {
                                                    set_login_status('success')
                                                } else {
                                                    set_login_status('error')
                                                }
                                            })
                                        }
                                    }>
                                    Login / Signup
                                </button>
                            </div>

                        </Show>

                        <Show when={login_status() === 'success'}>
                            <p className={"pb-6"}>
                                Your login link has been sent to your email address.
                                Remember to check your spam folder!
                            </p>
                        </Show>

                        <Show when={login_status() === 'error'}>
                            <p className={"pb-6"}>
                                Looks like there has been an error when attempting
                                to send your login link. Is your email address valid and correct?
                            </p>
                        </Show>

                    </div>
            }
        </>
    )
}
