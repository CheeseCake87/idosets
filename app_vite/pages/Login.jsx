import {createSignal, Show, useContext} from "solid-js";
import {mainContext} from "../context/mainContext";
import {Navigate, useNavigate} from "@solidjs/router";
import Loading from "../components/Loading";


export default function Login() {

    const [ctx, setCtx] = useContext(mainContext);
    const navigate = useNavigate();

    const [email_address, set_email_address] = createSignal('');
    const [login_status, set_login_status] = createSignal('waiting');

    return (
        ctx.logged_in ? <Navigate href={"/workouts"}/> :
            <div className={"login py-6"}>
                <div className={"text-center pt-2 pb-8"}>
                    <h2 className={"my-0"}>💪 I Do Sets</h2>
                </div>
                <Show when={login_status() === 'waiting'}>

                    <form onSubmit={(e) => {
                        e.preventDefault()
                        set_login_status('processing')
                        ctx.tryLogin(email_address()).then(json => {
                            if (json.status === 'success') {
                                set_login_status('success')
                            } else {
                                set_login_status('error')
                            }
                        })
                    }}>
                        <input
                            type="email"
                            id="email_address"
                            name="email_address"
                            placeholder={"Email Address"}
                            onChange={(e) => set_email_address(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                set_login_status('processing')
                                ctx.tryLogin(email_address()).then(json => {
                                    if (json.status === 'success') {
                                        set_login_status('success')
                                    } else {
                                        set_login_status('error')
                                    }
                                })
                            }}>
                            Login / Signup
                        </button>
                    </form>

                </Show>

                <Show when={login_status() === 'processing'}>
                    <div className={"py-8"}><Loading/></div>
                </Show>

                <Show when={login_status() === 'success'}>
                    <div className={"pb-6 flex flex-col gap-4"}>
                        <p>
                            Your login link has been emailed to you.
                        </p>
                        <p>Remember to check your spam folder!</p>
                    </div>
                </Show>

                <Show when={login_status() === 'error'}>
                    <div className={"pb-6 flex flex-col gap-4"}>
                        <p>
                            Looks like there has been an error when attempting
                            to send your login link.
                        </p>
                        <p>Is your email address valid and correct?</p>
                    </div>
                    <button
                        type="button"
                        onClick={
                            () => set_login_status('waiting')
                        }>
                        Try Again
                    </button>
                </Show>

            </div>
    )
}
