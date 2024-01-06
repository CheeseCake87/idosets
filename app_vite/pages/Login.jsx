import {createSignal, Show, useContext} from "solid-js";
import {mainContext} from "../context/mainContext";
import {useNavigate} from "@solidjs/router";

export default function Login() {

    const ctx = useContext(mainContext);
    const navigate = useNavigate();

    const [email_address, set_email_address] = createSignal('');

    return (
        <>
            <Show when={ctx.store.theme === 'dark'}>
                <button
                    className={"my-4 flex justify-center mx-auto rounded-full"}
                    onClick={() => {
                        ctx.store.setTheme('light').then(json => {
                            ctx.setStore('theme', json.theme)
                        })
                    }}
                >
                    <span className="material-icons-round">light_mode</span>
                </button>
            </Show>
            <Show when={ctx.store.theme === 'light'}>
                <button
                    className={"my-4 flex justify-center mx-auto rounded-full"}
                    onClick={() => {
                        ctx.store.setTheme('dark').then(json => {
                            ctx.setStore('theme', json.theme)
                        })
                    }}
                >
                    <span className="material-icons-round">dark_mode</span>
                </button>
            </Show>
            <div className={"login py-6"}>
                <h2 className={"pb-4"}>💪 I Do Sets</h2>
                <form>
                    <input
                        type="text"
                        name="email_address"
                        placeholder={"Email Address"}
                        onChange={(e) => set_email_address(e.target.value)}
                    />
                    <button type="button" onClick={
                        () => {
                            ctx.store.tryLogin(email_address()).then(json => {
                                if (json.status === 'authorized') {
                                    console.log('authorized')
                                    // ctx.setStore('show_nav', true)
                                    // navigate('/workouts')
                                }
                            })
                        }
                    }>
                        Login / Signup
                    </button>

                    <p>{email_address()}</p>
                </form>
            </div>
        </>
    );
};
