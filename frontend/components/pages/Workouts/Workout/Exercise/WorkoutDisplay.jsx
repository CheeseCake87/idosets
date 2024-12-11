import {useContext} from "solid-js";
import {mainContext} from "../../../../../contextManagers/mainContext";
import {workoutsContext} from "../../../../../contextManagers/workoutsContext";

export default function WorkoutDisplay() {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)
    return (
        <div className={'action-options gap-5 pb-4'}>
            <div className={'action-no-click opacity-50'}>
                <span className="material-icons">more_vert</span>
            </div>
            <div className={'action-options-text'}>
                <h1 className={'m-0 opacity-50'}>
                    {ctxMain.truncate(ctxWorkouts.workoutName(), 45)}
                </h1>
            </div>
        </div>
    )
}