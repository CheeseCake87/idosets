import {createEffect, createResource, createSignal, Show, useContext} from "solid-js";
import {mainContext} from "../context/mainContext";
import {useNavigate, useParams} from "@solidjs/router";
import Loading from "../components/Loading";

export default function Auth(props) {

    const ctx = useContext(mainContext);
    const navigate = useNavigate();

    const [auth, set_auth] = createSignal("processing");

    const params = useParams();

    const [try_auth] = createResource(
        {
            account_id: params.account_id,
            auth_code: params.auth_code
        },
        ctx.store.tryAuth
    )

    createEffect(() => {
        if (try_auth.loading === false) {
            if (try_auth().status === 'passed') {
                navigate('/workouts')
            } else {
                set_auth("error")
            }
        }
    })

    return (
        <>
            {try_auth.loading ? <Loading/> :
                <div className={"login py-6"}>
                    <h2 className={"pb-4"}>💪 I Do Sets</h2>

                    <Show when={auth() == "processing"}>
                        <p>Logging in, please wait...</p>
                    </Show>
                    <Show when={auth() == "error"}>
                        <p className={"pb-6"}>This login link has expired.</p>
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
