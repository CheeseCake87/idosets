import {createEffect, createMemo, createResource, onMount, useContext} from "solid-js";
import {useLocation, useNavigate} from "@solidjs/router";
import {mainContext} from "../context/mainContext";
import TopMenu from "../components/TopMenu";
import Loading from "../components/Loading";

export default function Workouts() {

    const ctx = useContext(mainContext);
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = createMemo(() => location.pathname);

    class Workouts {
        data;
        refetch;
        mutate;

        constructor(getWorkouts) {
            let [
                data, {refetch, mutate}
            ] = createResource(getWorkouts);
            this.data = data
            this.refetch = refetch
            this.mutate = mutate
        }
    }

    const workouts = new Workouts(ctx.store.getWorkouts)

    createEffect(() => {
        if (workouts.data.loading === false) {
            if (workouts.data().status === 'unauthorized') {
                navigate('/login')
            }
        }
    })

    onMount(() => {
        if (workouts.data.loading === false) {
            console.log(workouts.data().status)
        }
    })

    return (
        <>
            {
                workouts.loading ? <Loading/> :
                    <>
                        <TopMenu/>
                        <div className={"container"}>
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
                                workouts.refetch()
                                console.log(workouts.data())
                            }}>dark
                            </button>
                        </div>
                    </>
            }
        </>
    );
};
