import {For, Show, useContext} from "solid-js";
import {mainContext} from "../../../../../contextManagers/mainContext";
import {workoutsContext} from "../../../../../contextManagers/workoutsContext";
import {useParams} from "@solidjs/router";

export default function LoopSets(props) {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)

    const params = useParams()

    const exerciseFetcher = props.exerciseFetcher

    return (
        <For each={ctxWorkouts.sets()}>
            {(s, i) =>
                <div className={'display-box flex-col'}>
                    <div className={'flex-reactive justify-between'}>
                        <div className={'flex gap-4 items-center'}>
                            <h1 className={'m-0 opacity-50'}>{i() + 1}</h1>
                            <Show when={s.is_duration}>
                                <div className={'flex items-center gap-1'}>
                                    <span className="material-icons px-2">timer</span>
                                    <h2 className={'m-0'}>
                                        {s.duration_min > 0 ? ctxMain.fancyTimeFormat(s.duration_min) : ''}
                                        {(s.duration_max > 0 && s.duration_min > 0) ? ' - ' : ''}
                                        {s.duration_max > 0 ? ctxMain.fancyTimeFormat(s.duration_max) : ''}
                                    </h2>
                                </div>
                            </Show>
                            <Show when={s.is_reps}>
                                <div className={'flex items-center gap-1'}>
                                    <span className="material-icons px-2">fitness_center</span>
                                    <h2 className={'m-0'}>
                                        {ctxMain.fancyRepFormat(s.reps_min, s.reps_max)}
                                    </h2>
                                </div>
                            </Show>
                        </div>
                        <div className={'action-options items-center justify-between gap-2'}>
                            <div className={'action'} onClick={() => {
                                ctxWorkouts.setDeleteSet(i())
                            }}>
                                <span className="material-icons">delete</span>
                            </div>
                            <div className={'action'} onClick={() => {
                                ctxMain.copySet({
                                    workout_id: params.workout_id,
                                    exercise_id: params.exercise_id,
                                    set_id: s.set_id
                                }).then(json => {
                                    if (json.status === 'success') {
                                        exerciseFetcher.refetch()
                                    }
                                })
                            }}>
                                <span className="material-icons">content_copy</span>
                            </div>
                        </div>
                    </div>
                    <Show when={ctxWorkouts.deleteSet() === i()}>
                        <div className={'display-box flex-reactive items-center justify-between mt-4'}>
                            <p>Are you sure you want to delete this set?</p>
                            <div className={'flex gap-2'}>
                                <button className={'button-bad'} onClick={() => {
                                    ctxMain.deleteSet({
                                        workout_id: params.workout_id,
                                        exercise_id: params.exercise_id,
                                        set_id: s.set_id
                                    }).then(json => {
                                        if (json.status === 'success') {
                                            ctxWorkouts.setDeleteSet(null)
                                            exerciseFetcher.refetch()
                                        }
                                    })
                                }}>
                                    Yes
                                </button>
                                <button onClick={() => {
                                    ctxWorkouts.setDeleteSet(null)
                                }}>
                                    No
                                </button>
                            </div>
                        </div>
                    </Show>
                </div>
            }
        </For>
    )
}