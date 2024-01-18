import {createEffect, createSignal, For, Show, useContext} from "solid-js";
import {useNavigate, useParams} from "@solidjs/router";
import {mainContext} from "../context/mainContext";
import TopMenu from "../components/TopMenu";
import Loading from "../components/Loading";
import Fetcher from "../utilities/fetcher";

export default function Exercise() {

    const [ctx, setCtx] = useContext(mainContext);
    const navigate = useNavigate();
    const params = useParams();

    const exercise = new Fetcher(
        {workout_id: params.workout_id, exercise_id: params.exercise_id},
        ctx.getExercise
    )

    const [_exercise, _setExercise] = createSignal({})

    const [workoutName, setWorkoutName] = createSignal('')
    const [editExercise, setEditExercise] = createSignal(false)

    const [newExerciseName, setNewExerciseName] = createSignal('')
    const [newExerciseInfoUrl, setNewExerciseInfoUrl] = createSignal('')

    const [sets, setSets] = createSignal({})

    // Adding Set
    const [addingSet, setAddingSet] = createSignal(false)
    const [setType, setSetType] = createSignal('reps')

    // Duration
    const [durationMinMax, setDurationMinMax] = createSignal('min')
    const [newSetDurationMin, setNewSetDurationMin] = createSignal(0)
    const [newSetDurationMinDisplay, setNewSetDurationMinDisplay] = createSignal('')
    const [newSetDurationMax, setNewSetDurationMax] = createSignal(0)
    const [newSetDurationMaxDisplay, setNewSetDurationMaxDisplay] = createSignal('')

    // Reps
    const [repsMinMax, setRepsMinMax] = createSignal('min')
    const [newSetRepsMin, setNewSetRepsMin] = createSignal(0)
    const [newSetRepsMax, setNewSetRepsMax] = createSignal(0)

    const [deleteSet, setDeleteSet] = createSignal(null)

    createEffect(() => {
        if (exercise.data.loading === false) {
            if (exercise.data().status === 'unauthorized') {
                navigate('/login')
            }
            if (exercise.get("Exercises").length === 0) {
                navigate('/workouts')
            } else {
                _setExercise(exercise.get("Exercises")[0])
                setWorkoutName(exercise.get("Workouts")[0].name)
                setNewExerciseName(_exercise().name)
                setNewExerciseInfoUrl(_exercise().info_url)
                setSets(exercise.get("Sets"))
                setNewSetDurationMinDisplay(ctx.fancyTimeFormat(newSetDurationMin()))
                setNewSetDurationMaxDisplay(ctx.fancyTimeFormat(newSetDurationMax()))
            }
        }
    })

    createEffect(() => {
        if (newSetDurationMin() > 0) {
            setNewSetDurationMinDisplay(ctx.fancyTimeFormat(newSetDurationMin()))
        }
    })

    createEffect(() => {
        if (newSetDurationMax() > 0) {
            setNewSetDurationMaxDisplay(ctx.fancyTimeFormat(newSetDurationMax()))
        }
    })

    function Page() {
        return (
            <div className={"container"}>

                {/* Workout Name*/}
                <div className={"action-options gap-5 pb-4"}>
                    <div className={"action-no-click opacity-50"}>
                        <span className="material-icons">more_vert</span>
                    </div>
                    <div className={"action-options-text"}>
                        <h1 className={'m-0 opacity-50'}>
                            {ctx.truncate(workoutName(), 45)}
                        </h1>
                    </div>
                </div>

                {/* Exercise Name*/}
                <div className={"action-options gap-5 pb-4"}>
                    <div className={"action"} onClick={() => {
                        navigate(`/workout/${params.workout_id}`)
                    }}>
                        <span className="material-icons">arrow_back</span>
                    </div>

                    <div className={"action-options-text"}>
                        <h1 className={editExercise() ? 'm-0 opacity-50' : 'm-0'}>
                            {editExercise() ? newExerciseName() : _exercise().name}
                        </h1>
                    </div>

                    <div className={"action"} onClick={() => {
                        setEditExercise(true)
                    }}><span className="material-icons">edit</span>
                    </div>
                </div>

                {/* Edit Exercise */}
                <Show when={editExercise() === true}>
                    <div className={"action-box mb-4"}>
                        <form className={"form-col"}
                              onSubmit={(e) => {
                                  e.preventDefault()
                              }}>
                            <input
                                className={"flex-1"}
                                type="text"
                                id="new_exercise_name"
                                name="new_exercise_name"
                                placeholder={"Exercise Name"}
                                value={newExerciseName()}
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
                                value={newExerciseInfoUrl()}
                                onKeyUp={(e) => {
                                    setNewExerciseInfoUrl(e.target.value)
                                }}
                            />
                            <div className={'flex justify-between gap-4 pt-2'}>
                                <button
                                    className={"button-bad flex-1"}
                                    type="button"
                                    onClick={() => {
                                        setEditExercise(false)
                                        setNewExerciseName(_exercise().name)
                                        setNewExerciseInfoUrl(_exercise().info_url)
                                    }}>
                                    Cancel
                                </button>
                                <button
                                    className={"button-good flex-1"}
                                    type="button"
                                    onClick={() => {
                                        ctx.editExercise(
                                            {
                                                workout_id: params.workout_id,
                                                exercise_id: params.exercise_id,
                                                data: {
                                                    name: newExerciseName(),
                                                    info_url: newExerciseInfoUrl(),
                                                }
                                            }
                                        ).then(json => {
                                            if (json.status === 'success') {
                                                setEditExercise(false)
                                                exercise.refetch()
                                            }
                                        })
                                    }}>
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </Show>

                {/* Sets */}
                <div className={"py-4 flex flex-col gap-2"}>
                    <For each={sets()}>
                        {(set, i) =>
                            <div className={"display-box flex-col"}>
                                <div className={'flex justify-between'}>
                                    <div className={'flex gap-4 items-center'}>
                                        <h1 className={'m-0 opacity-50'}>{i() + 1}</h1>
                                        <Show when={set.is_duration}>
                                            <div className={'flex items-center gap-1'}>
                                                <span className="material-icons px-2">timer</span>
                                                <h2 className={'m-0'}>
                                                    {set.duration_min > 0 ? ctx.fancyTimeFormat(set.duration_min) : ''}
                                                    {(set.duration_max > 0 && set.duration_min > 0) ? ' - ' : ''}
                                                    {set.duration_max > 0 ? ctx.fancyTimeFormat(set.duration_max) : ''}
                                                </h2>
                                            </div>
                                        </Show>
                                        <Show when={set.is_reps}>
                                            <div className={'flex items-center gap-1'}>
                                                <span className="material-icons px-2">fitness_center</span>
                                                <h2 className={'m-0'}>
                                                    {set.reps_min > 0 ? set.reps_min + ' reps' : ''}
                                                    {(set.reps_max > 0 && set.reps_min > 0) ? ' - ' : ''}
                                                    {set.reps_max > 0 ? set.reps_max + ' reps' : ''}
                                                </h2>
                                            </div>
                                        </Show>
                                    </div>
                                    <div className={'flex items-center gap-4'}>
                                        <div className={'action-options gap-2'}>
                                            <div className={"action"} onClick={() => {
                                                ctx.copySet({
                                                    workout_id: params.workout_id,
                                                    exercise_id: params.exercise_id,
                                                    set_id: set.set_id
                                                }).then(json => {
                                                    if (json.status === 'success') {
                                                        exercise.refetch()
                                                    }
                                                })
                                            }}>
                                                <span className="material-icons">content_copy</span>
                                            </div>
                                            <div className={"action"} onClick={() => {
                                                setDeleteSet(i())
                                            }}>
                                                <span className="material-icons">delete</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Show when={deleteSet() === i()}>
                                    <div className={"display-box flex-reactive items-center justify-between mt-4"}>
                                        <p>Are you sure you want to delete this set?</p>
                                        <div className={'flex gap-2'}>
                                            <button className={'button-bad'} onClick={() => {
                                                ctx.deleteSet({
                                                    workout_id: params.workout_id,
                                                    exercise_id: params.exercise_id,
                                                    set_id: set.set_id
                                                }).then(json => {
                                                    if (json.status === 'success') {
                                                        setDeleteSet(null)
                                                        exercise.refetch()
                                                    }
                                                })
                                            }}>
                                                Yes
                                            </button>
                                            <button onClick={() => {
                                                setDeleteSet(null)
                                            }}>
                                                No
                                            </button>
                                        </div>
                                    </div>
                                </Show>
                            </div>
                        }
                    </For>
                </div>

                {/* Add Set */}
                <Show when={addingSet() === true} fallback={
                    <div className={"action-box-clickable p-10"} onClick={() => {
                        setAddingSet(true)
                    }}>
                        <span className="material-icons px-2">add</span> Set
                    </div>
                }>
                    <div className={"action-box"}>

                        <form className={"form-col"}
                              onSubmit={(e) => {
                                  e.preventDefault()
                              }}>

                            {/* Set type setting */}
                            <div className={'flex flex-row gap-4'}>

                                <div className={
                                    setType() === 'reps' ? "action-box flex-1" : "action-box-clickable flex-1"}
                                     onClick={() => {
                                         setSetType('reps')
                                         setNewSetDurationMin(0)
                                     }}>
                                    <span className="material-icons px-2">fitness_center</span> Rep Set
                                </div>

                                <div className={
                                    setType() === 'duration' ? "action-box flex-1" : "action-box-clickable flex-1"}
                                     onClick={() => {
                                         setSetType('duration')
                                         setNewSetRepsMin(0)
                                     }}>
                                    <span className="material-icons px-2">timer</span> Duration Set
                                </div>

                            </div>

                            {/* Set duration setting */}
                            <Show when={setType() === 'duration'}>
                                <div className={'flex flex-row gap-4'}>

                                    <div className={
                                        durationMinMax() === 'min' ? "action-box flex-1" : "action-box-clickable flex-1"}
                                         onClick={() => {
                                             setDurationMinMax('min')
                                         }}>
                                        Min
                                    </div>

                                    <div className={
                                        durationMinMax() === 'max' ? "action-box flex-1" : "action-box-clickable flex-1"}
                                         onClick={() => {
                                             setDurationMinMax('max')
                                         }}>
                                        Max
                                    </div>

                                </div>
                                <Show when={durationMinMax() === 'min'}>
                                    <div className={'text-center p-4'}>
                                        <h1>{newSetDurationMinDisplay()}</h1>
                                    </div>
                                    <div className={'flex-reactive'}>
                                        <div className={"action-box-clickable flex-1 items-center"}
                                             onClick={() => {
                                                 setNewSetDurationMin(0)
                                             }}>
                                            Reset
                                        </div>
                                        <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     if (newSetDurationMin() < 0) {
                                                         setNewSetDurationMin(0)
                                                     } else {
                                                         setNewSetDurationMin(newSetDurationMin() - 5)
                                                     }
                                                 }}>
                                                -5 secs
                                            </div>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetDurationMin(newSetDurationMin() + 5)
                                                 }}>
                                                +5 secs
                                            </div>

                                        </div>
                                        <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     if (newSetDurationMin() < 0) {
                                                         setNewSetDurationMin(0)
                                                     } else {
                                                         setNewSetDurationMin(newSetDurationMin() - 30)
                                                     }
                                                 }}>
                                                -30 secs
                                            </div>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetDurationMin(newSetDurationMin() + 30)
                                                 }}>
                                                +30 secs
                                            </div>
                                        </div>
                                        <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     if (newSetDurationMin() < 0) {
                                                         setNewSetDurationMin(0)
                                                     } else {
                                                         setNewSetDurationMin(newSetDurationMin() - 60)
                                                     }
                                                 }}>
                                                -1 mins
                                            </div>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetDurationMin(newSetDurationMin() + 60)
                                                 }}>
                                                +1 mins
                                            </div>

                                        </div>
                                        <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     if (newSetDurationMin() < 0) {
                                                         setNewSetDurationMin(0)
                                                     } else {
                                                         setNewSetDurationMin(newSetDurationMin() - 600)
                                                     }
                                                 }}>
                                                -10 mins
                                            </div>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetDurationMin(newSetDurationMin() + 600)
                                                 }}>
                                                +10 mins
                                            </div>

                                        </div>
                                    </div>
                                </Show>
                                <Show when={durationMinMax() === 'max'}>
                                    <div className={'text-center p-4'}>
                                        <h1>{newSetDurationMaxDisplay()}</h1>
                                    </div>
                                    <div className={'flex-reactive'}>
                                        <div className={"action-box-clickable flex-1 items-center"}
                                             onClick={() => {
                                                 setNewSetDurationMax(0)
                                             }}>
                                            Reset
                                        </div>
                                        <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     if (newSetDurationMax() < 0) {
                                                         setNewSetDurationMin(0)
                                                     } else {
                                                         setNewSetDurationMax(newSetDurationMax() - 5)
                                                     }
                                                 }}>
                                                -5 secs
                                            </div>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetDurationMax(newSetDurationMax() + 5)
                                                 }}>
                                                +5 secs
                                            </div>

                                        </div>
                                        <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     if (newSetDurationMax() < 0) {
                                                         setNewSetDurationMax(0)
                                                     } else {
                                                         setNewSetDurationMax(newSetDurationMax() - 30)
                                                     }
                                                 }}>
                                                -30 secs
                                            </div>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetDurationMax(newSetDurationMax() + 30)
                                                 }}>
                                                +30 secs
                                            </div>
                                        </div>
                                        <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     if (newSetDurationMax() < 0) {
                                                         setNewSetDurationMax(0)
                                                     } else {
                                                         setNewSetDurationMax(newSetDurationMax() - 60)
                                                     }
                                                 }}>
                                                -1 mins
                                            </div>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetDurationMax(newSetDurationMax() + 60)
                                                 }}>
                                                +1 mins
                                            </div>

                                        </div>
                                        <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     if (newSetDurationMax() < 0) {
                                                         setNewSetDurationMax(0)
                                                     } else {
                                                         setNewSetDurationMax(newSetDurationMax() - 600)
                                                     }
                                                 }}>
                                                -10 mins
                                            </div>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetDurationMax(newSetDurationMax() + 600)
                                                 }}>
                                                +10 mins
                                            </div>

                                        </div>
                                    </div>
                                </Show>
                            </Show>

                            {/* Set reps setting */}
                            <Show when={setType() === 'reps'}>
                                <div className={'flex flex-row gap-4'}>

                                    <div className={
                                        repsMinMax() === 'min' ? "action-box flex-1" : "action-box-clickable flex-1"}
                                         onClick={() => {
                                             setRepsMinMax('min')
                                         }}>
                                        Min
                                    </div>

                                    <div className={
                                        repsMinMax() === 'max' ? "action-box flex-1" : "action-box-clickable flex-1"}
                                         onClick={() => {
                                             setRepsMinMax('max')
                                         }}>
                                        Max
                                    </div>

                                </div>
                                <Show when={repsMinMax() === 'min'}>
                                    <div className={'text-center p-4'}>
                                        <h1>{newSetRepsMin() === 1 ? newSetRepsMin() + ' rep' : newSetRepsMin() + ' reps'}</h1>
                                    </div>

                                    <div className={'flex-reactive'}>

                                        <div className={"action-box-clickable flex-1 items-center"}
                                             onClick={() => {
                                                 setNewSetRepsMin(0)
                                             }}>
                                            Reset
                                        </div>

                                        <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetRepsMin(newSetRepsMin() - 1)
                                                     if (newSetRepsMin() < 0) {
                                                         setNewSetRepsMin(0)
                                                     }
                                                 }}>
                                                -1 rep
                                            </div>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetRepsMin(newSetRepsMin() + 1)
                                                 }}>
                                                +1 rep
                                            </div>
                                        </div>

                                        <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetRepsMin(newSetRepsMin() - 5)
                                                     if (newSetRepsMin() < 0) {
                                                         setNewSetRepsMin(0)
                                                     }
                                                 }}>
                                                -5 reps
                                            </div>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetRepsMin(newSetRepsMin() + 5)
                                                 }}>
                                                +5 reps
                                            </div>
                                        </div>

                                        <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetRepsMin(newSetRepsMin() - 10)
                                                     if (newSetRepsMin() < 0) {
                                                         setNewSetRepsMin(0)
                                                     }
                                                 }}>
                                                -10 reps
                                            </div>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetRepsMin(newSetRepsMin() + 10)
                                                 }}>
                                                +10 reps
                                            </div>
                                        </div>

                                    </div>
                                </Show>
                                <Show when={repsMinMax() === 'max'}>
                                    <div className={'text-center p-4'}>
                                        <h1>{newSetRepsMax() === 1 ? newSetRepsMax() + ' rep' : newSetRepsMax() + ' reps'}</h1>
                                    </div>

                                    <div className={'flex-reactive'}>

                                        <div className={"action-box-clickable flex-1 items-center"}
                                             onClick={() => {
                                                 setNewSetRepsMax(0)
                                             }}>
                                            Reset
                                        </div>

                                        <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetRepsMax(newSetRepsMax() - 1)
                                                     if (newSetRepsMax() < 0) {
                                                         setNewSetRepsMax(0)
                                                     }
                                                 }}>
                                                -1 rep
                                            </div>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetRepsMax(newSetRepsMax() + 1)
                                                 }}>
                                                +1 rep
                                            </div>
                                        </div>

                                        <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetRepsMax(newSetRepsMax() - 5)
                                                     if (newSetRepsMax() < 0) {
                                                         setNewSetRepsMax(0)
                                                     }
                                                 }}>
                                                -5 reps
                                            </div>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetRepsMax(newSetRepsMax() + 5)
                                                 }}>
                                                +5 reps
                                            </div>
                                        </div>

                                        <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetRepsMax(newSetRepsMax() - 10)
                                                     if (newSetRepsMax() < 0) {
                                                         setNewSetRepsMax(0)
                                                     }
                                                 }}>
                                                -10 reps
                                            </div>
                                            <div className={"action-box-clickable flex-1"}
                                                 onClick={() => {
                                                     setNewSetRepsMax(newSetRepsMax() + 10)
                                                 }}>
                                                +10 reps
                                            </div>
                                        </div>

                                    </div>
                                </Show>
                            </Show>

                            <div className={'flex justify-between gap-4 pt-2'}>

                                <button
                                    className={"button-bad flex-1"}
                                    type="button"
                                    onClick={() => {
                                        setAddingSet(false)
                                        setDurationMinMax('min')
                                        setNewSetDurationMin(0)
                                        setNewSetDurationMax(0)
                                        setRepsMinMax('min')
                                        setNewSetRepsMin(0)
                                        setNewSetRepsMax(0)
                                    }}>
                                    Cancel
                                </button>

                                <button
                                    className={"button-good flex-1"}
                                    type="button"
                                    onClick={() => {
                                        ctx.addSet(
                                            {
                                                workout_id: params.workout_id,
                                                exercise_id: params.exercise_id,
                                                data: {
                                                    type: setType(),
                                                    duration_min: newSetDurationMin(),
                                                    duration_max: newSetDurationMax(),
                                                    reps_min: newSetRepsMin(),
                                                    reps_max: newSetRepsMax(),
                                                    order: sets().length + 1,
                                                }
                                            }
                                        ).then(json => {
                                            if (json.status === 'success') {
                                                setAddingSet(false)
                                                setDurationMinMax('min')
                                                setNewSetDurationMin(0)
                                                setNewSetDurationMax(0)
                                                setRepsMinMax('min')
                                                setNewSetRepsMin(0)
                                                setNewSetRepsMax(0)
                                                exercise.refetch()
                                            }
                                        })
                                    }}>
                                    Add
                                </button>

                            </div>

                        </form>

                    </div>
                </Show>

            </div>
        )
    }

    return (
        <>
            <TopMenu/>
            {exercise.loading ? <div className={"pt-10"}><Loading/></div> : <Page/>}
        </>
    );
};
