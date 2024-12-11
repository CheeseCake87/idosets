import {Show, useContext} from "solid-js";
import {workoutsContext} from "../../../../../contextManagers/workoutsContext";
import {mainContext} from "../../../../../contextManagers/mainContext";
import {useParams} from "@solidjs/router";


export default function AddSet(props) {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)
    const params = useParams()

    const exerciseFetcher = props.exerciseFetcher

    return (
        <Show when={ctxWorkouts.addingSet() === true} fallback={
            <div className={'action-box-clickable p-10'} onClick={() => {
                ctxWorkouts.setAddingSet(true)
            }}>
                <span className="material-icons px-2">add</span> Set
            </div>
        }>
            <div className={'action-box'}>

                <form className={'form-col'}
                      onSubmit={(e) => {
                          e.preventDefault()
                      }}>

                    {/* Set type setting */}
                    <div className={'flex flex-row gap-4'}>

                        <div className={
                            ctxWorkouts.setType() === 'reps'
                                ? 'action-box action-box-reactive flex-1'
                                : 'action-box-clickable action-box-reactive flex-1'}
                             onClick={() => {
                                 ctxWorkouts.setSetType('reps')
                                 ctxWorkouts.setNewSetDurationMin(0)
                             }}>
                            <span className="material-icons px-2">fitness_center</span> Reps
                        </div>

                        <div className={
                            ctxWorkouts.setType() === 'duration'
                                ? 'action-box action-box-reactive flex-1'
                                : 'action-box-clickable action-box-reactive flex-1'}
                             onClick={() => {
                                 ctxWorkouts.setSetType('duration')
                                 ctxWorkouts.setNewSetRepsMin(0)
                             }}>
                            <span className="material-icons px-2">timer</span> Duration
                        </div>

                    </div>

                    {/* Set duration setting */}
                    <Show when={ctxWorkouts.setType() === 'duration'}>
                        <div className={'flex flex-row gap-4'}>

                            <div className={
                                ctxWorkouts.durationMinMax() === 'min'
                                    ? 'action-box flex-1'
                                    : 'action-box-clickable flex-1'}
                                 onClick={() => {
                                     ctxWorkouts.setDurationMinMax('min')
                                 }}>
                                Min
                            </div>

                            <div className={
                                ctxWorkouts.durationMinMax() === 'max'
                                    ? 'action-box flex-1'
                                    : 'action-box-clickable flex-1'}
                                 onClick={() => {
                                     ctxWorkouts.setDurationMinMax('max')
                                 }}>
                                Max
                            </div>

                        </div>
                        <Show when={ctxWorkouts.durationMinMax() === 'min'}>
                            <div className={'text-center p-4'}>
                                <h1>{ctxWorkouts.newSetDurationMinDisplay()}</h1>
                            </div>
                            <div className={'flex-reactive'}>
                                <div className={'action-box-clickable flex-1 items-center'}
                                     onClick={() => {
                                         ctxWorkouts.setNewSetDurationMin(0)
                                     }}>
                                    Reset
                                </div>
                                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             if (ctxWorkouts.newSetDurationMin() < 0) {
                                                 ctxWorkouts.setNewSetDurationMin(0)
                                             } else {
                                                 ctxWorkouts.setNewSetDurationMin(ctxWorkouts.newSetDurationMin() - 5)
                                             }
                                         }}>
                                        -5 secs
                                    </div>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetDurationMin(ctxWorkouts.newSetDurationMin() + 5)
                                         }}>
                                        +5 secs
                                    </div>

                                </div>
                                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             if (ctxWorkouts.newSetDurationMin() < 0) {
                                                 ctxWorkouts.setNewSetDurationMin(0)
                                             } else {
                                                 ctxWorkouts.setNewSetDurationMin(ctxWorkouts.newSetDurationMin() - 30)
                                             }
                                         }}>
                                        -30 secs
                                    </div>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetDurationMin(ctxWorkouts.newSetDurationMin() + 30)
                                         }}>
                                        +30 secs
                                    </div>
                                </div>
                                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             if (ctxWorkouts.newSetDurationMin() < 0) {
                                                 ctxWorkouts.setNewSetDurationMin(0)
                                             } else {
                                                 ctxWorkouts.setNewSetDurationMin(ctxWorkouts.newSetDurationMin() - 60)
                                             }
                                         }}>
                                        -1 mins
                                    </div>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetDurationMin(ctxWorkouts.newSetDurationMin() + 60)
                                         }}>
                                        +1 mins
                                    </div>

                                </div>
                                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             if (ctxWorkouts.newSetDurationMin() < 0) {
                                                 ctxWorkouts.setNewSetDurationMin(0)
                                             } else {
                                                 ctxWorkouts.setNewSetDurationMin(ctxWorkouts.newSetDurationMin() - 600)
                                             }
                                         }}>
                                        -10 mins
                                    </div>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetDurationMin(ctxWorkouts.newSetDurationMin() + 600)
                                         }}>
                                        +10 mins
                                    </div>

                                </div>
                            </div>
                        </Show>
                        <Show when={ctxWorkouts.durationMinMax() === 'max'}>
                            <div className={'text-center p-4'}>
                                <h1>{ctxWorkouts.newSetDurationMaxDisplay()}</h1>
                            </div>
                            <div className={'flex-reactive'}>
                                <div className={'action-box-clickable flex-1 items-center'}
                                     onClick={() => {
                                         ctxWorkouts.setNewSetDurationMax(0)
                                     }}>
                                    Reset
                                </div>
                                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             if (ctxWorkouts.newSetDurationMax() < 0) {
                                                 ctxWorkouts.setNewSetDurationMin(0)
                                             } else {
                                                 ctxWorkouts.setNewSetDurationMax(ctxWorkouts.newSetDurationMax() - 5)
                                             }
                                         }}>
                                        -5 secs
                                    </div>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetDurationMax(ctxWorkouts.newSetDurationMax() + 5)
                                         }}>
                                        +5 secs
                                    </div>

                                </div>
                                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             if (ctxWorkouts.newSetDurationMax() < 0) {
                                                 ctxWorkouts.setNewSetDurationMax(0)
                                             } else {
                                                 ctxWorkouts.setNewSetDurationMax(ctxWorkouts.newSetDurationMax() - 30)
                                             }
                                         }}>
                                        -30 secs
                                    </div>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetDurationMax(ctxWorkouts.newSetDurationMax() + 30)
                                         }}>
                                        +30 secs
                                    </div>
                                </div>
                                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             if (ctxWorkouts.newSetDurationMax() < 0) {
                                                 ctxWorkouts.setNewSetDurationMax(0)
                                             } else {
                                                 ctxWorkouts.setNewSetDurationMax(ctxWorkouts.newSetDurationMax() - 60)
                                             }
                                         }}>
                                        -1 mins
                                    </div>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetDurationMax(ctxWorkouts.newSetDurationMax() + 60)
                                         }}>
                                        +1 mins
                                    </div>

                                </div>
                                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             if (ctxWorkouts.newSetDurationMax() < 0) {
                                                 ctxWorkouts.setNewSetDurationMax(0)
                                             } else {
                                                 ctxWorkouts.setNewSetDurationMax(ctxWorkouts.newSetDurationMax() - 600)
                                             }
                                         }}>
                                        -10 mins
                                    </div>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetDurationMax(ctxWorkouts.newSetDurationMax() + 600)
                                         }}>
                                        +10 mins
                                    </div>

                                </div>
                            </div>
                        </Show>
                    </Show>

                    {/* Set reps setting */}
                    <Show when={ctxWorkouts.setType() === 'reps'}>
                        <div className={'flex flex-row gap-4'}>

                            <div className={
                                ctxWorkouts.repsMinMax() === 'min'
                                    ? 'action-box flex-1'
                                    : 'action-box-clickable flex-1'}
                                 onClick={() => {
                                     ctxWorkouts.setRepsMinMax('min')
                                 }}>
                                Min
                            </div>

                            <div className={
                                ctxWorkouts.repsMinMax() === 'max'
                                    ? 'action-box flex-1'
                                    : 'action-box-clickable flex-1'}
                                 onClick={() => {
                                     ctxWorkouts.setRepsMinMax('max')
                                 }}>
                                Max
                            </div>

                        </div>
                        <Show when={ctxWorkouts.repsMinMax() === 'min'}>
                            <div className={'text-center p-4'}>
                                <h1>{ctxWorkouts.newSetRepsMin() === 1
                                    ? ctxWorkouts.newSetRepsMin() + ' rep'
                                    : ctxWorkouts.newSetRepsMin() + ' reps'}</h1>
                            </div>

                            <div className={'flex-reactive'}>

                                <div className={'action-box-clickable flex-1 items-center'}
                                     onClick={() => {
                                         ctxWorkouts.setNewSetRepsMin(0)
                                     }}>
                                    Reset
                                </div>

                                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetRepsMin(ctxWorkouts.newSetRepsMin() - 1)
                                             if (ctxWorkouts.newSetRepsMin() < 0) {
                                                 ctxWorkouts.setNewSetRepsMin(0)
                                             }
                                         }}>
                                        -1 rep
                                    </div>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetRepsMin(ctxWorkouts.newSetRepsMin() + 1)
                                         }}>
                                        +1 rep
                                    </div>
                                </div>

                                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetRepsMin(ctxWorkouts.newSetRepsMin() - 5)
                                             if (ctxWorkouts.newSetRepsMin() < 0) {
                                                 ctxWorkouts.setNewSetRepsMin(0)
                                             }
                                         }}>
                                        -5 reps
                                    </div>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetRepsMin(ctxWorkouts.newSetRepsMin() + 5)
                                         }}>
                                        +5 reps
                                    </div>
                                </div>

                                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetRepsMin(ctxWorkouts.newSetRepsMin() - 10)
                                             if (ctxWorkouts.newSetRepsMin() < 0) {
                                                 ctxWorkouts.setNewSetRepsMin(0)
                                             }
                                         }}>
                                        -10 reps
                                    </div>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetRepsMin(ctxWorkouts.newSetRepsMin() + 10)
                                         }}>
                                        +10 reps
                                    </div>
                                </div>

                            </div>
                        </Show>
                        <Show when={ctxWorkouts.repsMinMax() === 'max'}>
                            <div className={'text-center p-4'}>
                                <h1>{ctxWorkouts.newSetRepsMax() === 1
                                    ? ctxWorkouts.newSetRepsMax() + ' rep'
                                    : ctxWorkouts.newSetRepsMax() + ' reps'}</h1>
                            </div>

                            <div className={'flex-reactive'}>

                                <div className={'action-box-clickable flex-1 items-center'}
                                     onClick={() => {
                                         ctxWorkouts.setNewSetRepsMax(0)
                                     }}>
                                    Reset
                                </div>

                                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetRepsMax(ctxWorkouts.newSetRepsMax() - 1)
                                             if (ctxWorkouts.newSetRepsMax() < 0) {
                                                 ctxWorkouts.setNewSetRepsMax(0)
                                             }
                                         }}>
                                        -1 rep
                                    </div>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetRepsMax(ctxWorkouts.newSetRepsMax() + 1)
                                         }}>
                                        +1 rep
                                    </div>
                                </div>

                                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetRepsMax(ctxWorkouts.newSetRepsMax() - 5)
                                             if (ctxWorkouts.newSetRepsMax() < 0) {
                                                 ctxWorkouts.setNewSetRepsMax(0)
                                             }
                                         }}>
                                        -5 reps
                                    </div>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetRepsMax(ctxWorkouts.newSetRepsMax() + 5)
                                         }}>
                                        +5 reps
                                    </div>
                                </div>

                                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetRepsMax(ctxWorkouts.newSetRepsMax() - 10)
                                             if (ctxWorkouts.newSetRepsMax() < 0) {
                                                 ctxWorkouts.setNewSetRepsMax(0)
                                             }
                                         }}>
                                        -10 reps
                                    </div>
                                    <div className={'action-box-clickable flex-1'}
                                         onClick={() => {
                                             ctxWorkouts.setNewSetRepsMax(ctxWorkouts.newSetRepsMax() + 10)
                                         }}>
                                        +10 reps
                                    </div>
                                </div>

                            </div>
                        </Show>
                    </Show>

                    <div className={'flex justify-between gap-4 pt-2'}>

                        <button
                            className={'button-bad flex-1'}
                            type="button"
                            onClick={() => {
                                ctxWorkouts.setAddingSet(false)
                                ctxWorkouts.setDurationMinMax('min')
                                ctxWorkouts.setNewSetDurationMin(0)
                                ctxWorkouts.setNewSetDurationMax(0)
                                ctxWorkouts.setRepsMinMax('min')
                                ctxWorkouts.setNewSetRepsMin(0)
                                ctxWorkouts.setNewSetRepsMax(0)
                            }}>
                            Cancel
                        </button>

                        <button
                            className={'button-good flex-1'}
                            type="button"
                            onClick={() => {
                                ctxMain.addSet(
                                    {
                                        workout_id: params.workout_id,
                                        exercise_id: params.exercise_id,
                                        data: {
                                            type: ctxWorkouts.setType(),
                                            duration_min: ctxWorkouts.newSetDurationMin(),
                                            duration_max: ctxWorkouts.newSetDurationMax(),
                                            reps_min: ctxWorkouts.newSetRepsMin(),
                                            reps_max: ctxWorkouts.newSetRepsMax(),
                                            order: ctxWorkouts.sets().length + 1
                                        }
                                    }
                                ).then(json => {
                                    if (json.status === 'success') {
                                        ctxWorkouts.setAddingSet(false)
                                        ctxWorkouts.setDurationMinMax('min')
                                        ctxWorkouts.setNewSetDurationMin(0)
                                        ctxWorkouts.setNewSetDurationMax(0)
                                        ctxWorkouts.setRepsMinMax('min')
                                        ctxWorkouts.setNewSetRepsMin(0)
                                        ctxWorkouts.setNewSetRepsMax(0)
                                        exerciseFetcher.refetch()
                                    }
                                })
                            }}>
                            Add
                        </button>

                    </div>

                </form>

            </div>
        </Show>
    )
}