import {createEffect, createResource, createSignal, useContext} from "solid-js";
import {useNavigate, useParams} from "@solidjs/router";
import {mainContext} from "../context/mainContext";
import TopMenu from "../components/TopMenu";
import Loading from "../components/Loading";

export default function Workout() {

    const [ctx, setCtx] = useContext(mainContext);
    const navigate = useNavigate();
    const params = useParams();

    const [workout] = createResource(params.workout_id, ctx.getWorkout)
    const [_workout, _setWorkout] = createSignal({})

    createEffect(() => {
        if (workout.loading === false) {
            if (workout().status === 'unauthorized') {
                navigate('/login')
            }
            if (workout()["Workouts"].length === 0) {
                navigate('/workouts')
            } else {
                _setWorkout(workout()["Workouts"][0])
            }
        }
    })

    function Page() {
        return (
            <div className={"container"}>
                <div className={"action-options gap-4 pb-4"}>
                    <div className={"action"} onClick={() => {
                        navigate('/workouts')
                    }}>
                        <span className="material-icons">arrow_back</span>
                    </div>
                    <div className={"action"}>
                        <span className="material-icons">edit</span>
                    </div>
                    <div className={"action-options-text"}><h1 className={"m-0"}>{_workout().name}</h1></div>
                </div>

            </div>
        )
    }

    return (
        <>
            <TopMenu/>
            {workout.loading ? <div className={"pt-10"}><Loading/></div> : <Page/>}
        </>
    );
};
