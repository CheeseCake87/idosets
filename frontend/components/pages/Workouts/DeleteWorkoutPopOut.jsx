import {Show, useContext} from "solid-js";
import {mainContext} from "../../../contextManagers/mainContext";
import {workoutsContext} from "../../../contextManagers/workoutsContext";


export default function DeleteWorkoutPopOut (props) {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)

    const workout = props.workout
    const i = props.i
    return (
            <Show when={ctxWorkouts.deleteWorkout() === i()}>
                <div
                    className={'display-box flex-reactive items-center justify-between mt-4'}>
                    <p>Are you sure you want to delete this workout?</p>

                    <div className={'flex gap-2'}>
                        <button className={'button-bad'} onClick={() => {
                          ctxMain.deleteWorkout({
                            workout_id: workout.workout_id
                          }).then(json => {
                            if (json.status === 'success') {
                              ctxWorkouts.setDeleteWorkout(null)
                              ctxWorkouts.getWorkouts.refetch()
                            }
                          })
                        }}>
                            Delete
                        </button>
                        <button onClick={() => {
                          ctxWorkouts.setDeleteWorkout(null)
                        }}>
                            No
                        </button>
                    </div>

                </div>
            </Show>
    )
  }