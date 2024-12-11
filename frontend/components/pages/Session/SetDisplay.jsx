import {Show, useContext} from "solid-js";
import {mainContext} from "../../../contextManagers/mainContext";
import {sessionContext} from "../../../contextManagers/sessionContext";


export default function SetDisplay(props) {
        const ctxMain = useContext(mainContext)
        const ctxSession = useContext(sessionContext)
        const {exercise_id, set, set_i, set_log} = props

        return (
            <div className={'flex-reactive justify-between'} id={`${exercise_id}_set_${set_i()}`}>

                <div className={'flex gap-4 items-center'}>
                    <h1 className={'m-0 opacity-50'}>{set_i() + 1}</h1>
                    <Show when={set.is_duration}>
                        <div className={'flex items-center gap-1'}>
                            <span className="material-icons px-2">timer</span>
                            <h3 className={'m-0'}>
                                {set.duration_min > 0 ? ctxMain.fancyTimeFormat(set.duration_min) : ''}
                                {(set.duration_max > 0 && set.duration_min > 0) ? ' - ' : ''}
                                {set.duration_max > 0 ? ctxMain.fancyTimeFormat(set.duration_max) : ''}
                            </h3>
                        </div>
                    </Show>
                    <Show when={set.is_reps}>
                        <div className={'flex items-center gap-1'}>
                            <span className="material-icons px-2">fitness_center</span>
                            <h3 className={'m-0'}>
                                {ctxMain.fancyRepFormat(set.reps_min, set.reps_max)}
                            </h3>
                        </div>
                    </Show>
                </div>

                {/* disable done button if set_log is not empty, done is enabled in fallback */}
                <Show
                    when={Object.keys(set_log()).length > 0}
                    fallback={
                        <div className={'flex justify-between gap-2'}>
                            <div className={'opacity-50 action-options items-center justify-end gap-2'}>
                                <div className={'action'}>
                                    <span className="material-icons">undo</span>
                                </div>
                            </div>
                            <div className={'action-options items-center justify-end gap-2'}>
                                <div className={'action'} onClick={() => {
                                    ctxSession.setFinishSet(`${exercise_id}_set_${set_i()}`)
                                    const scrollDiv = document.getElementById(
                                        `${exercise_id}_set_${set_i()}`).offsetTop
                                    window.scrollTo({top: scrollDiv - 30, behavior: 'smooth'})
                                }}>
                                    <span className="material-icons">done</span>
                                </div>
                            </div>
                        </div>
                    }
                >
                    <div className={'flex justify-between gap-2'}>
                        <div className={'action-options items-center justify-end gap-2'}>
                            <div className={'action'} onClick={() => {
                                ctxSession.setUndoSet(`${exercise_id}_set_${set_i()}`)
                            }}>
                                <span className="material-icons">undo</span>
                            </div>
                        </div>
                        <div className={'action-options items-center justify-end gap-2 opacity-50'}>
                            <div className={'action'}>
                                <span className="material-icons">done</span>
                            </div>
                        </div>
                    </div>
                </Show>

            </div>
        )
    }