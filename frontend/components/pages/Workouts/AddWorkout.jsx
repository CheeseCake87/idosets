import {Show, useContext} from "solid-js";
import {workoutsContext} from "../../../contextManagers/workoutsContext";
import {mainContext} from "../../../contextManagers/mainContext";


export default function AddWorkout () {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)

    return (
            <Show when={ctxWorkouts.addingWorkout() === true} fallback={
                <div className={'action-box-clickable p-10'} onClick={() => {
                  ctxWorkouts.setAddingWorkout(true)
                }}>
                    <span className="material-icons px-2">add</span> Workout
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
                            id="new_workout_name"
                            name="new_workout_name"
                            placeholder={'Workout Name'}
                            onKeyUp={(e) => {
                              ctxWorkouts.setNewWorkoutName(e.target.value)
                            }}
                        />
                        <div className={'flex justify-between gap-4 pt-2'}>

                            <button
                                className={'button-bad flex-1'}
                                type="button"
                                onClick={() => {
                                  ctxWorkouts.setAddingWorkout(false)
                                  ctxWorkouts.setNewWorkoutName('')
                                }}>
                                Cancel
                            </button>

                            <button
                                className={'button-good flex-1'}
                                type="button"
                                onClick={() => {
                                  ctxMain.addWorkout({
                                    name: ctxWorkouts.newWorkoutName()
                                  }).then(json => {
                                    if (json.status === 'success') {
                                      ctxWorkouts.setAddingWorkout(false)
                                      ctxWorkouts.setNewWorkoutName('')
                                      ctxMain.navigate(`/workout/${json.workout_id}`)
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