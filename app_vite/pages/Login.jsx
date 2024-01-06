import {useContext} from "solid-js";
import {mainContext} from "../context/mainContext";
import {useNavigate} from "@solidjs/router";

export default function Login() {

    const ctx = useContext(mainContext);
    const navigate = useNavigate();

    return (
        <div className={"container"}>
            <p>test {ctx.store.theme}</p>
            <button onClick={
                () => {
                    ctx.store.tryLogin().then(json => {
                        if (json.status === 'authorized') {
                            ctx.setStore('show_nav', true)
                            navigate('/workouts')
                        }
                    })
                }
            }>
                login
            </button>
        </div>
    );
};
