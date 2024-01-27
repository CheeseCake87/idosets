import {createSignal, Show, useContext} from "solid-js";
import {mainContext} from "../context/mainContext";
import {Loading} from "../components/Loading";


export default function Login() {

    const [ctx, setCtx] = useContext(mainContext);

    const [email_address, set_email_address] = createSignal('');
    const [login_status, set_login_status] = createSignal('waiting');

    return (<div className={"login py-6"}>
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
                onClick={() => set_login_status('waiting')}>
                Try Again
            </button>
        </Show>
        <div className={"flex flex-col gap-2 pt-12 text-sm"}
             xmlns:cc="http://creativecommons.org/ns#"
             xmlns:dct="http://purl.org/dc/terms/">
            <p className={"opacity-70"}>
                <a property="dct:title" rel="cc:attributionURL" href="https://idosets.app">
                    idosets.app</a> is licensed under</p>

            <p>
                <a href="http://creativecommons.org/licenses/by-nc-nd/4.0/?ref=chooser-v1"
                   target="_blank"
                   rel="license noopener noreferrer"
                   className={"flex justify-center underline opacity-70 hover:opacity-90"}>
                    CC BY-NC-ND 4.0
                </a>
            </p>
            <div className={"flex flex-row justify-center pb-4"}>
                <img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
                     src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"/>
                <img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
                     src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"/>
                <img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
                     src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"/>
                <img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
                     src="https://mirrors.creativecommons.org/presskit/icons/nd.svg?ref=chooser-v1"/>
            </div>
            <p>
                <a rel="cc:attributionURL dct:creator"
                   property="cc:attributionName"
                   className={"underline opacity-70 hover:opacity-90"}
                   href="https://github.com/CheeseCake87"> Creator Profile
                </a> - <a className={"underline opacity-70 hover:opacity-90"}
                          href="https://github.com/CheeseCake87/idosets.app"> GitHub
            </a>
            </p>

        </div>

    </div>)
}
