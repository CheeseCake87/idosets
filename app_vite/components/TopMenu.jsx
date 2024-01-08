import {Show, useContext} from "solid-js";
import {mainContext} from "../context/mainContext";
import {useNavigate} from "@solidjs/router";

export default function TopMenu(props) {

    const ctx = useContext(mainContext);
    const navigate = useNavigate();

    console.log(
        ctx.store
    )

    return (
        <nav>
            <p>{ctx.store.email_address}</p>

            <div className={"flex gap-4"}>
                <Show when={ctx.store.theme === 'dark'}>
                    <button
                        className={"flex rounded-full"}
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
                        className={"flex rounded-full"}
                        onClick={() => {
                            ctx.store.setTheme('dark').then(json => {
                                ctx.setStore('theme', json.theme)
                            })
                        }}
                    >
                        <span className="material-icons-round">dark_mode</span>
                    </button>
                </Show>

                <button onClick={
                    () => {
                        ctx.store.tryLogout().then(json => {
                            if (json.status === 'success') {
                                ctx.setStore("logged_in", false)
                                navigate('/login')
                            }
                        })
                    }
                }>
                    Logout
                </button>
            </div>
        </nav>
    )

}
