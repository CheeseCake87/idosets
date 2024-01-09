import {createEffect, createSignal, For, Show, useContext} from "solid-js";
import {useNavigate} from "@solidjs/router";
import {mainContext} from "../context/mainContext";
import TopMenu from "../components/TopMenu";
import Loading from "../components/Loading";
import Fetcher from "../utilities/fetcher";

export default function Workouts() {

    const [ctx, setCtx] = useContext(mainContext);
    const navigate = useNavigate();

    const workouts = new Fetcher(ctx.getWorkouts)

    const [addingWorkout, setAddingWorkout] = createSignal(false)
    const [newWorkoutName, setNewWorkoutName] = createSignal('')

    createEffect(() => {
        if (workouts.data.loading === false) {
            if (workouts.data().status === 'unauthorized') {
                navigate('/login')
            }
        }
    })

    return (
        <>
            {
                workouts.data.loading ? <Loading/> :
                    <>
                        <TopMenu/>
                        <div className={"container"}>
                            <Show when={addingWorkout() === true} fallback={
                                <div className={"action-box-clickable"} onClick={() => {
                                    setAddingWorkout(true)
                                }}>
                                    <span className="material-icons px-2">add</span> Workout
                                </div>
                            }>
                                <div className={"action-box"}>
                                    <form className={"form-reactive"}>
                                        <input
                                            className={"flex-1"}
                                            type="text"
                                            id="new_workout_name"
                                            name="new_workout_name"
                                            placeholder={"Workout Name"}
                                            onKeyUp={(e) => {
                                                setNewWorkoutName(e.target.value)
                                            }}
                                        />
                                        <button
                                            className={"button-good"}
                                            type="button"
                                            onClick={() => {
                                                ctx.addWorkout(newWorkoutName()).then(json => {
                                                    if (json.status === 'success') {
                                                        workouts.refetch()
                                                        setAddingWorkout(false)
                                                        setNewWorkoutName('')
                                                    }
                                                })
                                            }}>
                                            Add
                                        </button>
                                        <button
                                            className={"button-bad"}
                                            type="button"
                                            onClick={() => {
                                                setAddingWorkout(false)
                                                setNewWorkoutName('')
                                            }}>
                                            Cancel
                                        </button>
                                    </form>
                                    <p>{newWorkoutName()}</p>
                                </div>
                            </Show>
                            <div className={"py-4 flex flex-col gap-2"}>
                                <For each={workouts.get("Workouts")} fallback={
                                    <div className={"action-box"} onClick={() => setAddingWorkout(true)}>
                                        <span className="material-icons px-2">sentiment_dissatisfied</span> No Workouts
                                    </div>
                                }>
                                    {(workout, i) =>
                                        <div className={"display-box-clickable"}>
                                            <h1>{workout.name}</h1>
                                        </div>
                                    }
                                </For>
                            </div>
                        </div>
                    </>
            }
        </>
    );
};
