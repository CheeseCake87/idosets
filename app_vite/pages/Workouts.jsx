import {createMemo, createResource, onMount, useContext} from "solid-js";
import {useLocation, useNavigate, useParams} from "@solidjs/router";
import {mainContext} from "../context/mainContext";

export default function Workouts() {

    const ctx = useContext(mainContext);
    const location = useLocation();
    const pathname = createMemo(() => location.pathname);

    console.log(pathname(), "Home.jsx")

    const [workouts] = createResource(ctx.store.getWorkouts);

    onMount(() => {
    })

    return (
        <div>
            <p>test {ctx.store.theme}</p>
            <button onClick={() => {
                ctx.setStore('theme', 'light')
            }}>light
            </button>
            <button onClick={() => {
                ctx.setStore('theme', 'dark')
            }}>dark
            </button>
            <button onClick={() => {
                workouts()
                console.log(workouts())
            }}>dark
            </button>
        </div>
    );
};
