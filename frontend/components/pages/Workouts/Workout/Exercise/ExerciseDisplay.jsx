import {Show, useContext} from "solid-js";
import {workoutsContext} from "../../../../../contextManagers/workoutsContext";
import {mainContext} from "../../../../../contextManagers/mainContext";
import {useParams} from "@solidjs/router";

export default function ExerciseDisplay() {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)
    const params = useParams()

    return (
        <div className={'action-options gap-5 pb-4'}>
            <div className={'action'} onClick={() => {
                ctxMain.navigate(`/workout/${params.workout_id}`)
            }}>
                <span className="material-icons">arrow_back</span>
            </div>

            <div className={ctxWorkouts.editExercise()
                ? 'action-options-text m-0 opacity-50'
                : 'action-options-text m-0'}>
                <h1>
                    {ctxWorkouts.editExercise()
                        ? ctxWorkouts.newExerciseName()
                        : ctxWorkouts.exercise().name}
                </h1>
                <Show when={
                    ctxWorkouts.exercise().info_url !== null &&
                    ctxWorkouts.exercise().info_url !== '' &&
                    ctxWorkouts.exercise().info_url !== undefined
                }>
                    <a href={ctxWorkouts.exercise().info_url}
                       target={'_blank'}
                       referrerPolicy={'no-referrer'}
                       className={'flex items-center gap-2 opacity-80 hover:opacity-100'}>
                        <img src={ctxWorkouts.exercise().info_url_favicon}
                             className={'w-8 h-8 rounded-full inline-block border bg-black'} alt={'🚫ico'}/>
                        <span className={'underline'}>Instructions</span>
                        <span className={'material-icons w-5 h-5'}>open_in_new</span>
                    </a>
                </Show>
            </div>

            <div className={'action'} onClick={() => {
                ctxWorkouts.setEditExercise(true)
            }}><span className="material-icons">edit</span>
            </div>
        </div>
    )
}