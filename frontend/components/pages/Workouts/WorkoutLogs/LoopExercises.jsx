import {For, Show, useContext} from "solid-js";
import GenerateCharts from "./GenerateCharts";
import {workoutsContext} from "../../../../contextManagers/workoutsContext";


export default function LoopExercises(props) {
    const ctxWorkouts = useContext(workoutsContext)

    return (
        <For each={ctxWorkouts.exercises()}>
            {(e, i) =>
                <div className={'display-box flex-col'}>

                    <div className={'flex-reactive justify-between'}>
                        <div className={'flex flex-col gap-4 pb-2'}>
                            <h1 className={'m-0'}>{e.name}</h1>
                            <Show when={
                                e.info_url !== null &&
                                e.info_url !== '' &&
                                e.info_url !== undefined
                            }>
                                <a href={e.info_url}
                                   target={'_blank'}
                                   referrerPolicy={'no-referrer'}
                                   className={'flex items-center gap-2 opacity-80 hover:opacity-100'}>
                                    <img src={e.info_url_favicon}
                                         className={'w-8 h-8 rounded-full inline-block border bg-black'}
                                         alt={'🚫ico'}/>
                                    <span className={'underline'}>Instructions</span>
                                </a>
                            </Show>
                        </div>
                    </div>
                    <div className={'flex flex-col gap-4'}>
                        <GenerateCharts exercise_id={e.exercise_id} logs={e.logs}/>
                    </div>
                </div>
            }
        </For>
    )
}