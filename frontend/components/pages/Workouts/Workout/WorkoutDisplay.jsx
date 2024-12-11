import {useContext} from "solid-js";
import {mainContext} from "../../../../contextManagers/mainContext";
import {workoutsContext} from "../../../../contextManagers/workoutsContext";

export default function WorkoutDisplay() {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)
    return (<div className={'action-options gap-5 pb-4'}>
            <div className={'action'} onClick={() => {
                ctxMain.navigate('/workouts')
            }}>
                <span className="material-icons">arrow_back</span>
            </div>

            <div className={'action-options-text'}>
                <h1 className={ctxWorkouts.editWorkout() ? 'm-0 opacity-50' : 'm-0'}>
                    {ctxWorkouts.editWorkout()
                        ? ctxMain.truncate(ctxWorkouts.newWorkoutName(), 45)
                        : ctxMain.truncate(ctxWorkouts.workout().name, 45)}
                </h1>
            </div>

            <div className={'action'} onClick={() => {
                ctxWorkouts.setEditWorkout(true)
            }}><span className="material-icons">edit</span>
            </div>
        </div>)
}