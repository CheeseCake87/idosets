import {Show, useContext} from "solid-js";
import {sessionContext} from "../../../contextManagers/sessionContext";


export default function FinishSetSections(props) {
    const ctxSession = useContext(sessionContext)
    // Provides the section buttons to switch between (duration / reps) and weight

    const {set} = props

    return (
        <div className={'flex flex-row gap-4 mt-4'}>

            <Show when={set.is_duration}>

                <div className={
                    ctxSession.showDurationInput()
                        ? 'action-box flex-1'
                        : 'action-box-clickable flex-1'
                }
                     onClick={() => {
                         ctxSession.setShowWeightInput(false)
                         ctxSession.setShowRepsInput(false)
                         ctxSession.setShowDurationInput(true)
                     }}>
                    Duration
                </div>

            </Show>

            <Show when={set.is_reps}>

                <div className={
                    ctxSession.showRepsInput()
                        ? 'action-box flex-1'
                        : 'action-box-clickable flex-1'
                }
                     onClick={() => {
                         ctxSession.setShowWeightInput(false)
                         ctxSession.setShowRepsInput(true)
                         ctxSession.setShowDurationInput(false)
                     }}>
                    Reps
                </div>

            </Show>

            <div className={
                ctxSession.showWeightInput()
                    ? 'action-box flex-1'
                    : 'action-box-clickable flex-1'
            }
                 onClick={() => {
                     ctxSession.setShowWeightInput(true)
                     ctxSession.setShowRepsInput(false)
                     ctxSession.setShowDurationInput(false)
                 }}>
                Weight
            </div>

        </div>
    )
}