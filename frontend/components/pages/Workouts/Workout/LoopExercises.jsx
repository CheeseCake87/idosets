import {For, Show, useContext} from "solid-js";
import {mainContext} from "../../../../contextManagers/mainContext";
import {workoutsContext} from "../../../../contextManagers/workoutsContext";
import {useParams} from "@solidjs/router";

export default function LoopExercises(props) {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)
    const params = useParams()

    const workoutFetcher = props.workoutFetcher

    return (
        <For each={ctxWorkouts.exercises()}>
            {(e, i) =>
                <div className={'display-box flex-col'}>

                    <div className={'flex-reactive justify-between'}>
                        <div className={'flex flex-col gap-4 pb-2'}>
                            <h1 className={'m-0'}>{e.name}</h1>

                            <Show when={
                                e.info_url !== null &&
                                e.info_url !== '' &&
                                e.info_url !== undefined
                            }>
                                <a href={e.info_url}
                                   target={'_blank'}
                                   referrerPolicy={'no-referrer'}
                                   className={'flex items-center gap-2 opacity-80 hover:opacity-100'}>
                                    <img src={e.info_url_favicon}
                                         className={'w-8 h-8 rounded-full inline-block border bg-black'} alt={'🚫ico'}/>
                                    <span className={'underline'}>Instructions</span>
                                    <span className={'material-icons w-5 h-5'}>open_in_new</span>
                                </a>
                            </Show>

                            <p>{e.rel_sets.length} Sets</p>
                        </div>
                        <div className={'action-options items-center justify-between gap-2'}>
                            <div className={'action'} onClick={() => {
                                ctxWorkouts.setDeleteExercise(i())
                            }}>
                                <span className="material-icons">delete</span>
                            </div>

                            <div className={'action'} onClick={() => {
                                ctxMain.navigate(`/workout/${params.workout_id}/exercise/${e.exercise_id}`)
                            }}>
                                <span className="material-icons">remove_red_eye</span>
                            </div>
                        </div>
                    </div>

                    <Show when={ctxWorkouts.deleteExercise() === i()}>

                        <div className={'display-box flex-reactive items-center justify-between mt-4'}>
                            <p>Are you sure you want to delete this exercise?</p>
                            <div className={'flex gap-2'}>
                                <button className={'button-bad'} onClick={() => {
                                    ctxMain.deleteExercise({
                                        workout_id: params.workout_id,
                                        exercise_id: e.exercise_id
                                    }).then(json => {
                                        if (json.status === 'success') {
                                            ctxWorkouts.setDeleteExercise(null)
                                            workoutFetcher.refetch()
                                        }
                                    })
                                }}>
                                    Yes
                                </button>
                                <button onClick={() => {
                                    ctxWorkouts.setDeleteExercise(null)
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