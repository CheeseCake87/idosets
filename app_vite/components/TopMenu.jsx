import {useContext} from "solid-js";
import {mainContext} from "../context/mainContext";
import {useNavigate} from "@solidjs/router";

export default function TopMenu(props) {

    const [ctx, setCtx] = useContext(mainContext);
    const navigate = useNavigate();

    return (
        <nav>
            <h3 className={"my-0 opacity-0"}>💪 I Do Sets</h3>
            <div className={'flex gap-4'}>
                <button onClick={
                    () => {
                    }
                }>
                    <span className={"desktop-block"}>Your Account</span>
                    <span className={"mobile-flex"}>
                    <span className="material-icons-round">person</span>
                </span>
                </button>

                <button onClick={
                    () => {
                        ctx.tryLogout().then(json => {
                            if (json.status === 'success') {
                                setCtx("logged_in", false)
                                setCtx("account_id", 0)
                                setCtx("email_address", '')
                                setCtx("theme", 'dark')
                                navigate('/login')
                            }
                        })
                    }
                }>
                    <span className={"desktop-block"}>Logout</span>
                    <span className={"mobile-flex"}>
                    <span className="material-icons-round">logout</span>
                </span>
                </button>
            </div>
        </nav>
    )

}

// <Show when={ctx.theme === 'dark'}>
//     <button
//         className={"flex rounded-full"}
//         onClick={() => {
//             ctx.setTheme('light').then(json => {
//                 setCtx('theme', json.theme)
//             })
//         }}
//     >
//         <span className="material-icons-round">light_mode</span>
//     </button>
// </Show>
//
// <Show when={ctx.theme === 'light'}>
//     <button
//         className={"flex rounded-full"}
//         onClick={() => {
//             ctx.setTheme('dark').then(json => {
//                 setCtx('theme', json.theme)
//             })
//         }}
//     >
//         <span className="material-icons-round">dark_mode</span>
//     </button>
// </Show>
