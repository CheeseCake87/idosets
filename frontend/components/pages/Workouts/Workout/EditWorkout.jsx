import {Show, useContext} from "solid-js";
import {mainContext} from "../../../../contextManagers/mainContext";
import {workoutsContext} from "../../../../contextManagers/workoutsContext";
import {useParams} from "@solidjs/router";

export default function EditWorkout(props) {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)
    const params = useParams()

    const workoutFetcher = props.workoutFetcher

    return (
        <Show when={ctxWorkouts.editWorkout() === true}>
            <div className={'action-box mb-4'}>
                <form className={'form-col'}
                      onSubmit={(e) => {
                          e.preventDefault()
                      }}>
                    <input
                        className={'flex-1'}
                        type="text"
                        id="new_workout_name"
                        name="new_workout_name"
                        placeholder={'Workout Name'}
                        value={ctxWorkouts.newWorkoutName()}
                        onKeyUp={(e) => {
                            ctxWorkouts.setNewWorkoutName(e.target.value)
                        }}
                    />
                    <div className={'flex justify-between gap-4 pt-2'}>
                        <button
                            className={'button-bad flex-1'}
                            type="button"
                            onClick={() => {
                                ctxWorkouts.setEditWorkout(false)
                                ctxWorkouts.setNewWorkoutName(ctxWorkouts.workout().name)
                            }}>
                            Cancel
                        </button>
                        <button
                            className={'button-good flex-1'}
                            type="button"
                            onClick={() => {
                                ctxMain.editWorkout(
                                    {
                                        workout_id: params.workout_id,
                                        data: {
                                            name: ctxWorkouts.newWorkoutName()
                                        }
                                    }
                                ).then(json => {
                                    if (json.status === 'success') {
                                        ctxWorkouts.setEditWorkout(false)
                                        workoutFetcher.refetch()
                                    }
                                })
                            }}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </Show>
    )
}