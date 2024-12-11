import {For, Show, useContext} from "solid-js";
import {workoutsContext} from "../../../contextManagers/workoutsContext";
import DeleteWorkoutPopOut from "./DeleteWorkoutPopOut";
import StartWorkoutPopOut from "./StartWorkoutPopOut";
import {mainContext} from "../../../contextManagers/mainContext";

export default function LoopWorkouts () {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)

    return (
            <For each={ctxWorkouts.getWorkouts.get('Workouts')}>
                {(w, i) =>
                    <div className={'display-box flex-col'}>

                        <div className={'flex-reactive justify-between'}>

                            <div className={'flex flex-col gap-4 pb-2'}>
                                <h1 className={'m-0'}>{w.name}</h1>
                                <p>{w.rel_exercises.length} Exercises</p>
                            </div>

                            <div className={'action-options items-center justify-between gap-2'}>
                                <div className={'action'} onClick={() => {
                                  ctxWorkouts.setDeleteWorkout(i())
                                }}>
                                    <span className="material-icons">delete</span>
                                </div>
                                <div className={'flex gap-2'}>
                                    <div className={'action'} onClick={() => {
                                      ctxMain.navigate(`/workout/${w.workout_id}/logs`)
                                    }}>
                                        <span className="material-icons">show_chart</span>
                                    </div>
                                    <div className={'action'} onClick={() => {
                                      ctxMain.navigate(`/workout/${w.workout_id}`)
                                    }}>
                                        <span className="material-icons">remove_red_eye</span>
                                    </div>
                                    <Show
                                        when={ctxWorkouts.activeSessions()[w.workout_id] !== undefined}
                                        fallback={
                                            <div className={'action'} onClick={() => {
                                              ctxWorkouts.setStartWorkout(i())
                                            }}>
                                                <span className="material-icons">start</span>
                                            </div>
                                        }
                                    >
                                        <div className={'action flashing-good'} onClick={() => {
                                          ctxMain.navigate(
                                                `/workout/${w.workout_id}/` +
                                                'session/' +
                                                `${ctxWorkouts.activeSessions()[w.workout_id].workout_session_id}`
                                          )
                                        }}>
                                            <span className="material-icons">start</span>
                                        </div>
                                    < /Show>
                                </div>
                            </div>
                        </div>
                        <DeleteWorkoutPopOut workout={w} i={i}/>
                        <StartWorkoutPopOut workout={w} i={i}/>
                    </div>
                }
            </For>
    )
  }