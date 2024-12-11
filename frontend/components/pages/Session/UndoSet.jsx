import {useContext} from "solid-js";
import {sessionContext} from "../../../contextManagers/sessionContext";


export default function UndoSet(props) {
    const ctxSession = useContext(sessionContext)
    const {_, setLog} = props

    return (
        <div className={'display-box flex-reactive items-center justify-between mt-4'}>
            <p>Are you sure you want to undo this log?</p>
            <div className={'flex gap-2'}>
                <button className={'button-bad'} onClick={() => {
                    setLog({})
                    ctxSession.setUndoSet(null)
                }}>
                    Yes
                </button>
                <button onClick={() => {
                    ctxSession.setUndoSet(null)
                }}>
                    No
                </button>
            </div>
        </div>
    )
}