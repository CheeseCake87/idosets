import {onMount, useContext} from "solid-js";
import {Chart} from "chart.js/auto";
import {mainContext} from "../../../../contextManagers/mainContext";


export default function DurationChart(props) {

    const ctxMain = useContext(mainContext)

    onMount(() => {
        const el_id = document.getElementById(`${props.exercise_id}_duration_chart`)
        const data = {}
        const config = {
            type: 'line',
            data: {
                labels: Array.from({length: props.duration_logs.length}, (_, i) => i + 1),
                datasets: [{
                    label: 'Duration',
                    data: props.duration_logs,
                    fill: false,
                    borderColor: 'rgba(140,0,255,0.8)',
                    backgroundColor: 'rgba(140,0,255,0.8)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        ticks: {
                            callback: function (value, index, ticks) {
                                return ctxMain.fancyTimeFormat(value)
                            }
                        }
                    },
                    x: {
                        ticks: {
                            callback: function (value, index, ticks) {
                                return 'Set Log ' + (value + 1)
                            }
                        }
                    }
                }
            }
        }
        const _ = new Chart(el_id, config)
    })

    return (
        <div className={'flex-reactive'}>
            <canvas id={`${props.exercise_id}_duration_chart`}></canvas>
        </div>
    )
}