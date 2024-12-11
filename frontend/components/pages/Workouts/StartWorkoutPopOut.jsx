import {Show, useContext} from "solid-js";
import {workoutsContext} from "../../../contextManagers/workoutsContext";
import {mainContext} from "../../../contextManagers/mainContext";


export default function StartWorkoutPopOut(props) {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)

    const workout = props.workout
    const i = props.i
    return (
        <Show
            when={ctxWorkouts.startWorkout() === i()
                && ctxWorkouts.activeSessions()[workout.workout_id] === undefined}>
            <div className={'display-box flex-reactive items-center justify-between mt-4'}>
                <p>Are you sure you want to start this workout?</p>
                <div className={'flex gap-2'}>

                    <button onClick={() => {
                        ctxWorkouts.setStartWorkout(null)
                    }}>
                        Not ready
                    </button>
                    <button className={'button-good'} onClick={() => {
                        ctxMain.startSession(
                            {workout_id: workout.workout_id}
                        ).then(json => {
                            if (json.status === 'success') {
                                ctxMain.navigate(
                                    `/workout/${workout.workout_id}` +
                                    `/session/${json.workout_session_id}`
                                )
                            }
                        })
                    }}>
                        Start
                    </button>
                </div>
            </div>
        </Show>
    )
}