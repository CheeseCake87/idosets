import {useContext} from "solid-js";
import {mainContext} from "../../../../contextManagers/mainContext";
import {workoutsContext} from "../../../../contextManagers/workoutsContext";

export default function WorkoutDisplay(props) {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)

    return (
        <div className={'action-options gap-5 pb-4'}>
            <div className={'action'} onClick={() => {
                ctxMain.navigate('/workouts')
            }}>
                <span className="material-icons">arrow_back</span>
            </div>

            <div className={'action-options-text'}>
                <h1 className={'m-0'}>
                    {ctxMain.truncate(ctxWorkouts.workoutName(), 45)}
                </h1>
            </div>
        </div>
    )
}