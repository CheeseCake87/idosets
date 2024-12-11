import {createSignal, Show, useContext} from "solid-js";
import UndoSet from "./UndoSet";
import SetDisplay from "./SetDisplay";
import SetLog from "./SetLog";
import FinishSetSections from "./FinishSetSections";
import FinishSetDuration from "./FinishSetDuration";
import FinishSetReps from "./FinishSetReps";
import FinishSetWeight from "./FinishSetWeight";
import {sessionContext} from "../../../contextManagers/sessionContext";
import {mainContext} from "../../../contextManagers/mainContext";
import {useParams} from "@solidjs/router";


export default function SetRow(props) {

    const ctxMain = useContext(mainContext)
    const ctxSession = useContext(sessionContext)

    const params = useParams()

    const {
        exercise_id,
        set,
        set_i,
    } = props

    const [repsManualInput, setRepsManualInput] = createSignal(false)
    const [weightManualInput, setWeightManualInput] = createSignal(false)

    const [weight, setWeight] = createSignal(0.0)
    const [reps, setReps] = createSignal(0)
    const [duration, setDuration] = createSignal(0)

    const [log, setLog] = createSignal({})
    // log collection index
    const [lci, setLci] = createSignal(0)

    // set log from refresh
    if (Object.keys(set.set_log).length > 0) {
        // build the log data
        const log_data = {...set.set_log, lci: ctxSession.logCollection().length - 1}
        // store log from api call
        setLog(log_data)
        // build the log list during render
        ctxSession.setLogCollection([...ctxSession.logCollection(), log_data])
        // get the last log index value (this logs location)
        setLci(log_data.lci)
    }

    return (
        <div className={'display-box flex-col'}>

            <SetDisplay exercise_id={exercise_id} set={set} set_i={set_i} set_log={log}/>

            <Show when={ctxSession.undoSet() === `${exercise_id}_set_${set_i()}`}>
                <UndoSet log={log} setLog={setLog}/>
            </Show>

            <Show when={Object.keys(log()).length > 0}>
                <SetLog set_log={log}/>
            </Show>

            <Show when={ctxSession.finishSet() === `${exercise_id}_set_${set_i()}`}>

                <FinishSetSections set={set} set_i={set_i}/>

                <Show when={set.is_duration}>
                    <Show when={ctxSession.showDurationInput()}>
                        <FinishSetDuration
                            duration={duration}
                            setDuration={setDuration}
                        />
                    </Show>
                </Show>

                <Show when={set.is_reps}>
                    <Show when={ctxSession.showRepsInput()}>
                        <FinishSetReps
                            exercise_id={exercise_id}
                            set_id={set.set_id}
                            reps={reps}
                            setReps={setReps}
                            manualInput={repsManualInput}
                            setManualInput={setRepsManualInput}
                        />
                    </Show>
                </Show>

                <Show when={ctxSession.showWeightInput()}>
                    <FinishSetWeight
                        exercise_id={exercise_id}
                        set_id={set.set_id}
                        weight={weight}
                        setWeight={setWeight}
                        manualInput={weightManualInput}
                        setManualInput={setWeightManualInput}
                    />
                </Show>

                {/* Save the set log */}
                <div className={'flex justify-between gap-4 pt-2'}>

                    <button
                        className={'button-bad flex-1'}
                        type="button"
                        onClick={() => {
                            ctxSession.reset_view()
                            setRepsManualInput(false)
                            setWeightManualInput(false)
                        }}>
                        Cancel
                    </button>

                    <button
                        className={'button-good flex-1'}
                        type="button"
                        onClick={() => {
                            const log_data = {
                                account_id: ctxMain.accountId(),
                                workout_id: params.workout_id,
                                workout_session_id: params.workout_session_id,
                                exercise_id: exercise_id,
                                set_id: set.set_id,
                                weight: weight(),
                                reps: reps(),
                                duration: duration(),
                                lci: ctxSession.logCollection().length + 1
                            }
                            ctxSession.setLogCollection([...ctxSession.logCollection(), log_data])
                            setLog(log_data)
                            ctxSession.reset_view()
                            setRepsManualInput(false)
                            setWeightManualInput(false)
                            const scrollDiv = document.getElementById(
                                `${exercise_id}_set_${set_i()}`).offsetTop
                            window.scrollTo({top: scrollDiv - 30, behavior: 'smooth'})
                        }}>
                        Add
                    </button>

                </div>

            </Show>

        </div>
    )
}