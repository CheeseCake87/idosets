import {createSignal, Show, useContext} from "solid-js";
import {mainContext} from "../context/mainContext";
import {useNavigate, useParams} from "@solidjs/router";

export default function Auth(props) {

    const ctx = useContext(mainContext);
    const navigate = useNavigate();

    const [auth, set_auth] = createSignal("processing");

    const params = useParams();

    ctx.store.tryAuth(params.auth_code).then(json => {
        console.log(json.status)
        if (json.status === 'passed') {
            navigate('/workouts')
        } else {
            set_auth("error")
        }
    })

    return (
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
    );
};
