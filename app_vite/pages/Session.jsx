import {createEffect, createSignal, For, Show, useContext} from "solid-js";
import {useNavigate, useParams} from "@solidjs/router";
import {mainContext} from "../context/mainContext";
import TopMenu from "../components/TopMenu";
import Loading from "../components/Loading";
import Fetcher from "../utilities/fetcher";

export default function Session() {

    const [ctx, setCtx] = useContext(mainContext);
    const navigate = useNavigate();
    const params = useParams();

    const workout_id = params.workout_id
    const workout_session_id = params.workout_session_id

    const [finishSet, setFinishSet] = createSignal(null)

    // workout_session_id is generated by the start workout button on the Workouts page
    const workout_session = new Fetcher(
        {
            workout_id: workout_id,
            workout_session_id: workout_session_id
        },
        ctx.getSession
    )

    createEffect(() => {
        if (workout_session.data.loading === false) {

        }
    })

    function FinishSetKgs(props) {

        const workoutSessionId = props.workout_session_id
        const workoutId = props.workout_id
        const exerciseId = props.exercise_id
        const set = props.set

        const [newSetWeight, setNewSetWeight] = createSignal(0.0)
        const [showManualInput, setShowManualInput] = createSignal(false)

        return (
            <div className={"display-box flex-col gap-4 mt-2"}>

                <div className={'flex-reactive justify-center'}>
                    <Show when={showManualInput()}
                          fallback={
                              <div className={'action-box-clickable flex-1'} onClick={() => {
                                  setShowManualInput(true)
                              }}>
                                  <h1 className={"m-0"}>{newSetWeight() === 1 ? newSetWeight() + ' kg' : newSetWeight() + ' kgs'}</h1>
                              </div>
                          }>
                        <form className={"form-col"}
                              onSubmit={(e) => {
                                  e.preventDefault()
                              }}>
                            <input
                                className={"flex-1"}
                                type="number"
                                step=".01"
                                id={"set_weight" + set.set_id}
                                name="set_weight"
                                placeholder={"0"}
                                value={newSetWeight()}
                                onKeyUp={(e) => {
                                    setNewSetWeight(e.target.value)
                                }}
                            />
                            <button
                                className={"button-good flex-1"}
                                type="button"
                                onClick={() => {
                                    setShowManualInput(false)
                                }}>
                                Done
                            </button>
                        </form>
                    </Show>

                </div>

                <div className={'flex-reactive'}>

                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                        <div className={"action-box-clickable flex-1"}
                             onClick={() => {
                                 setNewSetWeight(newSetWeight() - 0.25)
                                 if (newSetWeight() < 0) {
                                     setNewSetWeight(0)
                                 }
                             }}>
                            -0.25 kg
                        </div>
                        <div className={"action-box-clickable flex-1"}
                             onClick={() => {
                                 setNewSetWeight(newSetWeight() + 0.25)
                             }}>
                            +0.25 kg
                        </div>
                    </div>

                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                        <div className={"action-box-clickable flex-1"}
                             onClick={() => {
                                 setNewSetWeight(newSetWeight() - 1)
                                 if (newSetWeight() < 0) {
                                     setNewSetWeight(0)
                                 }
                             }}>
                            -1 kg
                        </div>
                        <div className={"action-box-clickable flex-1"}
                             onClick={() => {
                                 setNewSetWeight(newSetWeight() + 1)
                             }}>
                            +1 kg
                        </div>
                    </div>

                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                        <div className={"action-box-clickable flex-1"}
                             onClick={() => {
                                 setNewSetWeight(newSetWeight() - 5)
                                 if (newSetWeight() < 0) {
                                     setNewSetWeight(0)
                                 }
                             }}>
                            -5 kgs
                        </div>
                        <div className={"action-box-clickable flex-1"}
                             onClick={() => {
                                 setNewSetWeight(newSetWeight() + 5)
                             }}>
                            +5 kgs
                        </div>
                    </div>

                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                        <div className={"action-box-clickable flex-1"}
                             onClick={() => {
                                 setNewSetWeight(newSetWeight() - 10)
                                 if (newSetWeight() < 0) {
                                     setNewSetWeight(0)
                                 }
                             }}>
                            -10 kgs
                        </div>
                        <div className={"action-box-clickable flex-1"}
                             onClick={() => {
                                 setNewSetWeight(newSetWeight() + 10)
                             }}>
                            +10 kgs
                        </div>
                    </div>

                </div>

                <div className={'flex-reverse-reactive gap-2'}>
                    <div className={"action-box-clickable flex-1 items-center"}
                         onClick={() => {
                             setNewSetWeight(0.0)
                         }}>
                        Reset
                    </div>
                    <div className={"action-box-clickable flex-1 items-center"}
                         onClick={() => {
                             setNewSetWeight(newSetWeight() * 2)
                         }}>
                        Double
                    </div>
                </div>

                <div className={'flex justify-between gap-4 pt-2'}>

                    <button
                        className={"button-bad flex-1"}
                        type="button"
                        onClick={() => {
                            setShowManualInput(false)
                            setFinishSet(null)
                        }}>
                        Cancel
                    </button>

                    <button
                        className={"button-good flex-1"}
                        type="button"
                        onClick={() => {
                            ctx.logSet(
                                {
                                    workout_id: workoutId,
                                    workout_session_id: workoutSessionId,
                                    data: {
                                        exercise_id: exerciseId,
                                        set_id: set.set_id,
                                        weight: newSetWeight(),
                                        reps: 0,
                                        duration: 0,
                                    }
                                }
                            ).then(json => {
                                if (json.status === 'success') {
                                    setFinishSet(null)
                                    workout_session.refetch()
                                }
                            })
                        }}>
                        Add
                    </button>

                </div>

            </div>
        )
    }

    function Page() {
        return (
            <div className={"container"}>
                <div className={"pb-4 flex flex-col gap-2"}>

                    {/* Loop through each exercise in the workout session */}
                    <For each={workout_session.get("exercises")}>
                        {(exercise, i) =>
                            <div className={"display-box flex-col gap-2"}>

                                <h1 className={'m-0 pb-3'}>{exercise.name}</h1>

                                {/* Loop through sets */}
                                <For each={exercise.sets}>
                                    {(set, i) =>
                                        <div className={"display-box flex-col"}>
                                            <div className={'flex-reactive justify-between'}>
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
                                                <div className={'action-options items-center justify-end gap-2'}>
                                                    <div className={"action"} onClick={() => {
                                                        setFinishSet(set.set_id)
                                                        // ctx.copySet({
                                                        //     workout_id: params.workout_id,
                                                        //     exercise_id: params.exercise_id,
                                                        //     set_id: set.set_id
                                                        // }).then(json => {
                                                        //     if (json.status === 'success') {
                                                        //         exercise.refetch()
                                                        //     }
                                                        // })
                                                    }}>
                                                        <span className="material-icons">sports_score</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Show when={finishSet() === set.set_id}>

                                                <Show when={ctx.units === 'kgs'}>
                                                    <FinishSetKgs
                                                        workout_session_id={workout_session.get("exercises")}
                                                        workout_id={workout_session.get("workout_id")}
                                                        exercise_id={exercise.exercise_id}
                                                        set={set}
                                                    />
                                                </Show>

                                            </Show>

                                        </div>
                                    }
                                </For>

                            </div>
                        }
                    </For>

                </div>
            </div>
        )
    }

    return (
        <>
            <TopMenu/>
            {workout_session.data.loading ? <div className={"pt-10"}><Loading/></div> : <Page/>}
        </>
    );
};
