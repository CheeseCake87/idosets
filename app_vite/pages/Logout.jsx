import {createEffect, createSignal, Show, useContext} from "solid-js";
import {mainContext} from "../context/mainContext";
import {useNavigate} from "@solidjs/router";
import Loading from "../components/Loading";
import Fetcher from "../utilities/fetcher";


export default function Logout() {

    const [ctx, setCtx] = useContext(mainContext);
    const navigate = useNavigate();

    const logout = new Fetcher(ctx.tryLogout);

    const [loggedOut, setLoggedOut] = createSignal(false);

    createEffect(() => {
        if (!logout.data.loading) {
            if (logout.data().status === 'success') {
                console.log('logout success')
                setCtx('logged_in', false);
                setCtx('theme', 'dark');
                setCtx('units', 'kgs');
                setCtx('account_id', 0);
                setCtx('email_address', '');
                setLoggedOut(true);
            } else {
                navigate('/error');
            }
        }
    })

    return (
        <div className={"login py-6"}>
            <Show when={loggedOut()} fallback={
                <Loading/>
            }>
                <div className={"logout py-6"}>
                    <div className={"text-center pt-2 pb-8"}>
                        <h2 className={"my-0"}>💪 I Do Sets</h2>
                    </div>
                    <div className={"pb-6 flex flex-col gap-4"}>
                        <p>You have been logged out.</p>
                    </div>
                    <button
                        type="button"
                        onClick={
                            () => navigate('/login')
                        }>
                        Back to login
                    </button>
                </div>
            </Show>
        </div>
    )
}
