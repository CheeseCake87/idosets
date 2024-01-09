import {createEffect, onMount, useContext} from "solid-js";
import {useNavigate} from "@solidjs/router";
import {mainContext} from "../context/mainContext";
import TopMenu from "../components/TopMenu";
import Loading from "../components/Loading";
import Fetcher from "../utilities/fetcher";

export default function WorkoutsEdit() {

    const [ctx, setCtx] = useContext(mainContext);
    const navigate = useNavigate();

    const workouts = new Fetcher(ctx.getWorkouts)

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
                workouts.data.loading ? <Loading/> :
                    <>
                        <TopMenu/>
                        <div className={"container"}>
                            <div className={"action-box-clickable"}>
                                <span className="material-icons px-2">add</span> Workout
                            </div>
                        </div>
                    </>
            }
        </>
    );
};
