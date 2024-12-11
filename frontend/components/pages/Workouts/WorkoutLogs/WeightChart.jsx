import {onMount} from "solid-js";
import {Chart} from "chart.js/auto";


export default function WeightChart (props) {
    onMount(() => {
      const el_id = document.getElementById(`${props.exercise_id}_weight_chart`)
      const labels = Array.from({ length: props.weight_logs.length }, (_, i) => i + 1)
      const max = Math.max(...props.weight_logs)
      const min = Math.min(...props.weight_logs)
      const _ = new Chart(el_id, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Weight (Kg)',
            data: props.weight_logs,
            fill: false,
            borderColor: 'rgba(75,192,192,0.8)',
            backgroundColor: 'rgba(75,192,192,0.8)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              ticks: {
                callback: function (value, index, ticks) {
                  return value + ' Kg'
                },
                stepSize: 1
              },
              min: min >= 1 ? min - 1 : 0,
              max: max + 1
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
      })
    })

    return (
            <div className={'flex-reactive'}>
                <canvas id={`${props.exercise_id}_weight_chart`}></canvas>
            </div>
    )
  }