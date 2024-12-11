import {createSignal, useContext} from "solid-js";
import {mainContext} from "../../../../contextManagers/mainContext";
import RepChart from "./RepChart";
import DurationChart from "./DurationChart";
import WeightChart from "./WeightChart";


export default function GenerateCharts(props) {
    const ctxMain = useContext(mainContext)

    const [weightLogs, setWeightLogs] = createSignal([])
    const [repLogs, setRepLogs] = createSignal([])
    const [durationLogs, setDurationLogs] = createSignal([])

    const [weightTotal, setWeightTotal] = createSignal(0)
    const [repTotal, setRepTotal] = createSignal(0)
    const [durationTotal, setDurationTotal] = createSignal(0)

    if (props.logs.length > 0) {
        for (const log of props.logs) {
            setWeightLogs([...weightLogs(), ctxMain.gramsToKgs(log.weight)])
            setRepLogs([...repLogs(), log.reps])
            setDurationLogs([...durationLogs(), log.duration])
            setWeightTotal(weightTotal() + parseInt(log.weight))
            setRepTotal(repTotal() + parseInt(log.reps))
            setDurationTotal(durationTotal() + parseInt(log.duration))
        }
    }

    return (
        <div className={
            weightTotal() === 0 ? 'grid grid-cols-1' : 'grid grid-cols-1 md:grid-cols-2 gap-4'
        }>
            {repTotal() > 0
                ? <RepChart exercise_id={props.exercise_id} rep_logs={repLogs()}/>
                : ''}
            {durationTotal() > 0
                ? <DurationChart exercise_id={props.exercise_id} duration_logs={durationLogs()}/>
                : ''}
            {weightTotal() > 0
                ? <WeightChart exercise_id={props.exercise_id} weight_logs={weightLogs()}/>
                : ''}
        </div>
    )
}