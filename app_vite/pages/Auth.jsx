import {createEffect, createResource, createSignal, Show, useContext} from "solid-js";
import {mainContext} from "../context/mainContext";
import {useNavigate, useParams} from "@solidjs/router";
import Loading from "../components/Loading";

export default function Auth(props) {
    const navigate = useNavigate();

    const [ctx, setCtx] = useContext(mainContext);
    const [auth, set_auth] = createSignal("processing");

    const params = useParams();

    const [try_auth] = createResource(
        {
            account_id: params.account_id,
            auth_code: params.auth_code
        },
        ctx.tryAuth
    );

    createEffect(() => {
        if (try_auth.loading === false) {
            if (try_auth().status === 'passed') {
                setCtx("logged_in", true)
                setCtx("account_id", try_auth().account_id)
                setCtx("email_address", try_auth().email_address)
                setCtx("theme", try_auth().theme)
                navigate('/')
            } else {
                set_auth("error")
            }
        } else {
            set_auth("processing")
        }
    });

    return (
        <>
            {try_auth.loading ? <div className={"pt-20"}><Loading/></div> :
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
