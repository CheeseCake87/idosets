import {Show, useContext} from "solid-js";
import {mainContext} from "../../../contextManagers/mainContext";


export default function SetLog(props) {
    const ctxMain = useContext(mainContext)
    const set_log = props.set_log

    return (
        <div className={'set_log_display'}>

            <Show when={set_log().reps > 0}>
                <div className={'display-box p-4 flex-1 justify-center'}>
                    <h4 className={'m-0 opacity-90'}>{set_log().reps} reps</h4>
                </div>
            </Show>
            <Show when={set_log().duration > 0}>
                <div className={'display-box p-4 flex-1 justify-center'}>
                    <h4 className={'m-0 opacity-90'}>{ctxMain.fancyTimeFormat(set_log().duration)}</h4>
                </div>
            </Show>
            <Show when={set_log().weight > 0}>
                <div className={'display-box p-4 flex-1 justify-center'}>
                    <h4 className={'m-0 opacity-90'}>{set_log().weight} kgs</h4>
                </div>
            </Show>

        </div>
    )
}