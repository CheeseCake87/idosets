import {createEffect, createSignal, For, Show, useContext} from "solid-js";
import {useNavigate, useParams} from "@solidjs/router";
import {mainContext} from "../context/mainContext";
import TopMenu from "../components/TopMenu";
import Loading from "../components/Loading";
import Fetcher from "../utilities/fetcher";

export default function StartWorkout() {

    const [ctx, setCtx] = useContext(mainContext);
    const navigate = useNavigate();
    const params = useParams();

    const workout = new Fetcher(
        {workout_id: params.workout_id},
        ctx.getWorkout
    )

    const [_workout, _setWorkout] = createSignal({})

    const [newWorkoutName, setNewWorkoutName] = createSignal('')
    const [editWorkout, setEditWorkout] = createSignal(false)

    const [exercises, setExercises] = createSignal({})
    const [addingExercise, setAddingExercise] = createSignal(false)
    const [newExerciseName, setNewExerciseName] = createSignal('')
    const [newExerciseInfoUrl, setNewExerciseInfoUrl] = createSignal('')

    const [deleteExercise, setDeleteExercise] = createSignal(null)

    createEffect(() => {
        if (workout.data.loading === false) {
            if (workout.data().status === 'unauthorized') {
                navigate('/login')
            }
            if (workout.get("Workouts").length === 0) {
                navigate('/')
            } else {
                _setWorkout(workout.get("Workouts")[0])
                setNewWorkoutName(_workout().name)
                setExercises(workout.get("Exercises"))
            }
        }
    })

    function Page() {
        return (
            <div className={"container"}>
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
