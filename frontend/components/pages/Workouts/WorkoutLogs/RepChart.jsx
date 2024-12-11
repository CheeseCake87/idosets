import {onMount} from "solid-js";
import {Chart} from "chart.js/auto";


export default function RepChart (props) {

    onMount(() => {
      const el_id = document.getElementById(`${props.exercise_id}_rep_chart`)
      const labels = Array.from({ length: props.rep_logs.length }, (_, i) => i + 1)
      const max = Math.max(...props.rep_logs)
      const min = Math.min(...props.rep_logs)
      const _ = new Chart(el_id, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Reps',
            data: props.rep_logs,
            fill: false,
            borderColor: 'rgba(192,75,192,0.8)',
            backgroundColor: 'rgba(192,75,192,0.8)',
            tension: 0.1
          }]
        },
        options: {
          legend: {
            display: false
          },
          tooltips: {
            enabled: false
          },
          scales: {
            y: {
              ticks: {
                callback: function (value, index, ticks) {
                  return value + ' Reps'
                },
                stepSize: 1
              },
              min: min - 1,
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
                <canvas id={`${props.exercise_id}_rep_chart`}></canvas>
            </div>
    )
  }