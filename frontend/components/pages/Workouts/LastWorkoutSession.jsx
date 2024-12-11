import {Show, useContext} from "solid-js";
import {workoutsContext} from "../../../contextManagers/workoutsContext";


export default function LastWorkoutSession () {
    const ctxWorkouts = useContext(workoutsContext)

    return (
            <Show when={ctxWorkouts.lastWorkoutSession()}>
                <small className={'px-2'}>Last Workout</small>
                <div className={'display-box success-border flex-col'}>
                    <div className={'flex-reactive justify-between'}>
                        <div className={'flex flex-col gap-1'}>
                            <h1 className={'m-0'}>
                                {ctxWorkouts.lastWorkoutSession().name}
                            </h1>
                            <small>Done: {ctxWorkouts.lastWorkoutSession().finished}</small>
                        </div>
                    </div>
                </div>
            </Show>
    )
  }