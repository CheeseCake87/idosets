import {createContext, createSignal} from 'solid-js'
import {Outlet} from '@solidjs/router'

export const sessionContext = createContext()

export function SessionContextProvider(props) {

    const [finishSet, setFinishSet] = createSignal(null)
    const [undoSet, setUndoSet] = createSignal(null)

    const [finishing, setFinishing] = createSignal(false)
    const [finished, setFinished] = createSignal(false)
    const [cancelling, setCancelling] = createSignal(false)
    const [cancelSession, setCancelSession] = createSignal(false)
    const [finishSession, setFinishSession] = createSignal(false)

    const [showDurationInput, setShowDurationInput] = createSignal(true)
    const [showRepsInput, setShowRepsInput] = createSignal(true)
    const [showWeightInput, setShowWeightInput] = createSignal(false)

    const [exercises, setExercises] = createSignal([])

    const [logCollection, setLogCollection] = createSignal([])

    function reset_view() {
        setShowRepsInput(true)
        setShowDurationInput(true)
        setShowWeightInput(false)
        setFinishSet(null)
    }

    const ctxAttrs = {
        finishSet: finishSet,
        setFinishSet: setFinishSet,
        undoSet: undoSet,
        setUndoSet: setUndoSet,
        finishing: finishing,
        setFinishing: setFinishing,
        finished: finished,
        setFinished: setFinished,
        cancelling: cancelling,
        setCancelling: setCancelling,
        cancelSession: cancelSession,
        setCancelSession: setCancelSession,
        finishSession: finishSession,
        setFinishSession: setFinishSession,
        showDurationInput: showDurationInput,
        setShowDurationInput: setShowDurationInput,
        showRepsInput: showRepsInput,
        setShowRepsInput: setShowRepsInput,
        showWeightInput: showWeightInput,
        setShowWeightInput: setShowWeightInput,
        exercises: exercises,
        setExercises: setExercises,
        logCollection: logCollection,
        setLogCollection: setLogCollection,
        reset_view: reset_view
    }

    return (
        <sessionContext.Provider value={ctxAttrs}>
            <Outlet/>
        </sessionContext.Provider>
    )
}
