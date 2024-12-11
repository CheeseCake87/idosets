import {Show, useContext} from "solid-js";
import {LoadingSmall} from "../../../../globals/Loading";
import {mainContext} from "../../../../../contextManagers/mainContext";
import {workoutsContext} from "../../../../../contextManagers/workoutsContext";
import {useParams} from "@solidjs/router";

export default function EditExercise(props) {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)
    const params = useParams()

    const exerciseFetcher = props.exerciseFetcher

    return (
        <Show when={ctxWorkouts.editExercise() === true}>
            <div className={'action-box mb-4'}>
                <form className={'form-col'}
                      onSubmit={(e) => {
                          e.preventDefault()
                      }}>
                    <input
                        className={'flex-1'}
                        type="text"
                        id="new_exercise_name"
                        name="new_exercise_name"
                        placeholder={'Name'}
                        value={ctxWorkouts.newExerciseName()}
                        onKeyUp={(e) => {
                            ctxWorkouts.setNewExerciseName(e.target.value)
                        }}
                    />
                    <input
                        className={'flex-1'}
                        type="text"
                        id="new_exercise_info_url"
                        name="new_exercise_info_url"
                        placeholder={'Instructions URL (https://example.com/to/instructions)'}
                        value={ctxWorkouts.newExerciseInfoUrl()}
                        onKeyUp={(e) => {
                            ctxWorkouts.setNewExerciseInfoUrl(e.target.value)
                        }}
                    />
                    <div className={'flex justify-between gap-4 pt-2'}>
                        <button
                            className={'button-bad flex-1'}
                            type="button"
                            onClick={() => {
                                ctxWorkouts.setEditExercise(false)
                                ctxWorkouts.setNewExerciseName(ctxWorkouts.exercise().name)
                                ctxWorkouts.setNewExerciseInfoUrl(ctxWorkouts.exercise().info_url)
                            }}>
                            Cancel
                        </button>
                        <button
                            className={'button-good flex-1'}
                            type="button"
                            onClick={() => {
                                ctxWorkouts.setSavingExercise(true)
                                ctxMain.editExercise(
                                    {
                                        workout_id: params.workout_id,
                                        exercise_id: params.exercise_id,
                                        data: {
                                            name: ctxWorkouts.newExerciseName(),
                                            info_url: ctxWorkouts.newExerciseInfoUrl()
                                        }
                                    }
                                ).then(json => {
                                    if (json.status === 'success') {
                                        ctxWorkouts.setEditExercise(false)
                                        ctxWorkouts.setSavingExercise(false)
                                        exerciseFetcher.refetch()
                                    }
                                })
                            }}>
                            {ctxWorkouts.savingExercise() ? <LoadingSmall/> : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </Show>
    )
}