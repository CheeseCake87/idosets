import {createEffect, createSignal, For, Show, useContext} from "solid-js";
import {useNavigate, useParams} from "@solidjs/router";
import {mainContext} from "../context/mainContext";
import TopMenu from "../components/TopMenu";
import Loading from "../components/Loading";
import Fetcher from "../utilities/fetcher";

export default function Workout() {

    const [ctx, setCtx] = useContext(mainContext);
    const navigate = useNavigate();
    const params = useParams();

    const workout = new Fetcher(params.workout_id, ctx.getWorkout)
    const exercises = new Fetcher(params.workout_id, ctx.getExercises)

    const [_workout, _setWorkout] = createSignal({})

    const [newWorkoutName, setNewWorkoutName] = createSignal('')
    const [editWorkout, setEditWorkout] = createSignal(false)

    const [addingExercise, setAddingExercise] = createSignal(false)
    const [newExerciseName, setNewExerciseName] = createSignal('')
    const [newExerciseInfoUrl, setNewExerciseInfoUrl] = createSignal('')

    createEffect(() => {
        if (workout.data.loading === false) {
            if (workout.data().status === 'unauthorized') {
                navigate('/login')
            }
            if (workout.get("Workouts").length === 0) {
                navigate('/workouts')
            } else {
                _setWorkout(workout.get("Workouts")[0])
                setNewWorkoutName(_workout().name)
            }
        }
    })

    function Page() {
        return (
            <div className={"container"}>

                {/* Workout Name*/}
                <div className={"action-options gap-4 pb-4"}>
                    <div className={"action"} onClick={() => {
                        navigate('/workouts')
                    }}>
                        <span className="material-icons">arrow_back</span>
                    </div>
                    <div className={"action"} onClick={() => {
                        setEditWorkout(true)
                    }}><span className="material-icons">edit</span>
                    </div>
                    <div className={"action-options-text"}>
                        <h1 className={editWorkout() ? 'm-0 opacity-50' : 'm-0'}>
                            {editWorkout() ? newWorkoutName() : _workout().name}
                        </h1>
                    </div>
                </div>

                {/* Edit Workout */}
                <Show when={editWorkout() === true}>
                    <div className={"action-box mb-4"}>
                        <form className={"form-reactive"}
                              onSubmit={(e) => {
                                  e.preventDefault()
                              }}>
                            <input
                                className={"flex-1"}
                                type="text"
                                id="new_workout_name"
                                name="new_workout_name"
                                placeholder={"Workout Name"}
                                value={newWorkoutName()}
                                onKeyUp={(e) => {
                                    setNewWorkoutName(e.target.value)
                                }}
                            />
                            <button
                                className={"button-good"}
                                type="button"
                                onClick={() => {
                                    ctx.editWorkout(
                                        params.workout_id,
                                        {
                                            name: newWorkoutName(),
                                        }
                                    ).then(json => {
                                        if (json.status === 'success') {
                                            setEditWorkout(false)
                                            workout.refetch()
                                        }
                                    })
                                }}>
                                Save
                            </button>
                            <button
                                className={"button-bad"}
                                type="button"
                                onClick={() => {
                                    setEditWorkout(false)
                                    setNewWorkoutName(_workout().name)
                                }}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </Show>

                {/* Add Exercise */}
                <Show when={addingExercise() === true} fallback={
                    <div className={"action-box-clickable"} onClick={() => {
                        setAddingExercise(true)
                    }}>
                        <span className="material-icons px-2">add</span> Exercise
                    </div>
                }>
                    <div className={"action-box"}>

                        <form className={"form-reactive"}
                              onSubmit={(e) => {
                                  e.preventDefault()
                              }}>
                            <input
                                className={"flex-1"}
                                type="text"
                                id="new_exercise_name"
                                name="new_exercise_name"
                                placeholder={"Exercise Name"}
                                onKeyUp={(e) => {
                                    setNewExerciseName(e.target.value)
                                }}
                            />
                            <input
                                className={"flex-1"}
                                type="text"
                                id="new_exercise_info_url"
                                name="new_exercise_info_url"
                                placeholder={"Exercise Info Url"}
                                onKeyUp={(e) => {
                                    setNewExerciseInfoUrl(e.target.value)
                                }}
                            />
                            <button
                                className={"button-good"}
                                type="button"
                                onClick={() => {
                                    ctx.addExercise(
                                        params.workout_id,
                                        {
                                            name: newExerciseName(),
                                            info_url: newExerciseInfoUrl(),
                                            order: exercises.get("Exercises").length + 1,
                                        }
                                    ).then(json => {
                                        if (json.status === 'success') {
                                            setAddingExercise(false)
                                            setNewWorkoutName('')
                                            setNewExerciseInfoUrl('')
                                        }
                                    })
                                }}>
                                Add
                            </button>
                            <button
                                className={"button-bad"}
                                type="button"
                                onClick={() => {
                                    setAddingExercise(false)
                                    setNewWorkoutName('')
                                    setNewExerciseInfoUrl('')
                                }}>
                                Cancel
                            </button>
                        </form>

                    </div>
                </Show>

                {/* Exercises */}
                <div className={"py-4 flex flex-col gap-2"}>
                    {exercises.data.loading ? <div className={"pt-10"}><Loading/></div> :
                        <For each={exercises.get("Exercises")} fallback={
                            <div className={"action-box"}>
                                <span className="material-icons px-2">sentiment_dissatisfied</span> No Exercises
                            </div>
                        }>
                            {(exercise, i) =>
                                <div className={"display-box-clickable flex-col"}
                                     onClick={() => {
                                         // navigate(`/workouts/${workout.workout_id}`)
                                     }}>
                                    <h1>{exercise.name}</h1>
                                    <p>{exercise.rel_sets.length} Sets</p>
                                </div>
                            }
                        </For>
                    }
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
