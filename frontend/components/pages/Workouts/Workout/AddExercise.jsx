import {Show, useContext} from "solid-js";
import {LoadingSmall} from "../../../globals/Loading";
import {mainContext} from "../../../../contextManagers/mainContext";
import {workoutsContext} from "../../../../contextManagers/workoutsContext";
import {useParams} from "@solidjs/router";

export default function AddExercise() {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)
    const params = useParams()
    return (
        <Show when={ctxWorkouts.addingExercise() === true} fallback={
            <div className={'action-box-clickable p-10'} onClick={() => {
                ctxWorkouts.setAddingExercise(true)
            }}>
                <span className="material-icons px-2">add</span> Exercise
            </div>
        }>
            <div className={'action-box'}>

                <form className={'form-col'}
                      onSubmit={(e) => {
                          e.preventDefault()
                      }}>
                    <input
                        className={'flex-1'}
                        type="text"
                        id="new_exercise_name"
                        name="new_exercise_name"
                        placeholder={'Exercise Name'}
                        onKeyUp={(e) => {
                            ctxWorkouts.setNewExerciseName(e.target.value)
                        }}
                    />
                    <input
                        className={'flex-1'}
                        type="text"
                        id="new_exercise_info_url"
                        name="new_exercise_info_url"
                        placeholder={'Exercise Info Url'}
                        onKeyUp={(e) => {
                            ctxWorkouts.setNewExerciseInfoUrl(e.target.value)
                        }}
                    />

                    <div className={'flex justify-between gap-4 pt-2'}>

                        <button
                            className={'button-bad flex-1'}
                            type="button"
                            onClick={() => {
                                ctxWorkouts.setAddingExercise(false)
                                ctxWorkouts.setNewWorkoutName('')
                                ctxWorkouts.setNewExerciseInfoUrl('')
                            }}>
                            Cancel
                        </button>

                        <button
                            className={'button-good flex-1'}
                            type="button"
                            onClick={() => {
                                ctxWorkouts.setSavingExercise(true)
                                ctxMain.addExercise(
                                    {
                                        workout_id: params.workout_id,
                                        data: {
                                            name: ctxWorkouts.newExerciseName(),
                                            info_url: ctxWorkouts.newExerciseInfoUrl(),
                                            order: ctxWorkouts.exercises().length + 1
                                        }
                                    }
                                ).then(json => {
                                    if (json.status === 'success') {
                                        ctxWorkouts.setAddingExercise(false)
                                        ctxWorkouts.setNewWorkoutName('')
                                        ctxWorkouts.setNewExerciseInfoUrl('')
                                        ctxWorkouts.setSavingExercise(false)
                                        ctxMain.navigate(`/workout/${params.workout_id}/exercise/${json.exercise_id}`)
                                    }
                                })
                            }}>
                            {ctxWorkouts.savingExercise() ? <LoadingSmall/> : 'Add'}
                        </button>

                    </div>
                </form>

            </div>
        </Show>
    )
}