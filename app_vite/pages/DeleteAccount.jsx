import {createEffect, createResource, createSignal, Show, useContext} from "solid-js";
import {mainContext} from "../context/mainContext";
import {useNavigate, useParams} from "@solidjs/router";
import Loading from "../components/Loading";

export default function DeleteAccount(props) {
    const navigate = useNavigate();
    const params = useParams();

    const [ctx, setCtx] = useContext(mainContext);
    const [auth, set_auth] = createSignal("processing");

    const [try_delete] = createResource(
        {
            account_id: params.account_id,
            auth_code: params.auth_code
        },
        ctx.tryDeleteAccount
    );

    createEffect(() => {
        if (try_delete.loading === false) {
            if (try_delete().status === 'success') {
                setCtx("logged_in", false)
                setCtx("account_id", 0)
                setCtx("email_address", null)
                setCtx("theme", "dark")
                set_auth("success")
            } else {
                set_auth("error")
            }
        } else {
            set_auth("processing")
        }
    });

    return (
        <>
            {try_delete.loading ? <div className={"pt-20"}><Loading/></div> :
                <div className={"login py-6"}>
                    <h2 className={"pb-4"}>💪 I Do Sets</h2>
                    <Show when={auth() === "processing"}>
                        <p>Deleting account, please wait...</p>
                    </Show>
                    <Show when={auth() === "error"}>
                        <p className={"pb-6"}>This auth link has expired.</p>
                        <button type="button" onClick={
                            () => {
                                navigate('/login')
                            }
                        }>
                            Back to Login / Signup
                        </button>
                    </Show>
                    <Show when={auth() === "success"}>
                        <p className={"pb-6"}>Your account has been deleted.</p>
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
    );
};
