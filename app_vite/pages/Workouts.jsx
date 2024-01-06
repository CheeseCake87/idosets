import {createEffect, createMemo, createResource, useContext} from "solid-js";
import {useLocation, useNavigate} from "@solidjs/router";
import {mainContext} from "../context/mainContext";
import TopMenu from "../components/TopMenu";
import Loading from "../components/Loading";

export default function Workouts() {

    const ctx = useContext(mainContext);
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = createMemo(() => location.pathname);

    console.log(pathname(), "Home.jsx")

    const [workouts] = createResource(ctx.store.getWorkouts);

    createEffect(() => {
        if (workouts.loading === false) {
            if (workouts().status === 'unauthorized') {
                navigate('/login')
            }
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
                                workouts()
                                console.log(workouts())
                            }}>dark
                            </button>
                        </div>
                    </>
            }
        </>
    );
};
