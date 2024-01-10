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

    // const [addingWorkout, setAddingWorkout] = createSignal(false)
    // const [newWorkoutName, setNewWorkoutName] = createSignal('')

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

    return (
        <>
            {
                workout.loading ? <Loading/> :
                    <>
                        <TopMenu/>
                        <div className={"container"}>
                            {_workout().name}
                        </div>
                    </>
            }
        </>
    );
};
