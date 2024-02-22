import { createEffect, createSignal, For, onMount, Show, useContext } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'
import { mainContext } from '../context/mainContext'
import TopMenu from '../components/TopMenu'
import { Loading } from '../components/Loading'
import Fetcher from '../utilities/fetcher'
import { Chart } from 'chart.js/auto'

export default function WorkoutLogs () {
  const [ctx] = useContext(mainContext)
  const navigate = useNavigate()
  const params = useParams()

  const [_workout, _setWorkout] = createSignal('')
  const [exercises, setExercises] = createSignal({})

  const workout_logs = new Fetcher(
    { workout_id: params.workout_id },
    ctx.getWorkoutLogs
  )

  createEffect(() => {
    if (workout_logs.data.loading === false) {
      if (workout_logs.data().status === 'unauthorized') {
        navigate('/login')
      }
      _setWorkout(workout_logs.get('name'))
      setExercises(workout_logs.get('Exercises'))
    }
  })

  function WorkoutDisplay () {
    return (
            <div className={'action-options gap-5 pb-4'}>
                <div className={'action'} onClick={() => {
                  navigate('/workouts')
                }}>
                    <span className="material-icons">arrow_back</span>
                </div>

                <div className={'action-options-text'}>
                    <h1 className={'m-0'}>
                        {ctx.truncate(_workout(), 45)}
                    </h1>
                </div>
            </div>
    )
  }

  function RepChart (props) {
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

  function WeightChart (props) {
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

  function DurationChart (props) {
    onMount(() => {
      const el_id = document.getElementById(`${props.exercise_id}_duration_chart`)
      const data = {}
      const config = {
        type: 'line',
        data: {
          labels: Array.from({ length: props.duration_logs.length }, (_, i) => i + 1),
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
                  return ctx.fancyTimeFormat(value)
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

  function GenerateCharts (props) {
    const [weightLogs, setWeightLogs] = createSignal([])
    const [repLogs, setRepLogs] = createSignal([])
    const [durationLogs, setDurationLogs] = createSignal([])

    const [weightTotal, setWeightTotal] = createSignal(0)
    const [repTotal, setRepTotal] = createSignal(0)
    const [durationTotal, setDurationTotal] = createSignal(0)

    for (const log of props.logs) {
      setWeightLogs([...weightLogs(), ctx.gramsToKgs(log.weight)])
      setRepLogs([...repLogs(), log.reps])
      setDurationLogs([...durationLogs(), log.duration])
      setWeightTotal(weightTotal() + parseInt(log.weight))
      setRepTotal(repTotal() + parseInt(log.reps))
      setDurationTotal(durationTotal() + parseInt(log.duration))
    }

    return (
            <>
                {repTotal() > 0
                  ? <RepChart exercise_id={props.exercise_id} rep_logs={repLogs()}/>
                  : ''}
                {durationTotal() > 0
                  ? <DurationChart exercise_id={props.exercise_id} duration_logs={durationLogs()}/>
                  : ''}
                {weightTotal() > 0
                  ? <WeightChart exercise_id={props.exercise_id} weight_logs={weightLogs()}/>
                  : ''}

            </>
    )
  }

  function LoopExercises () {
    return (
            <For each={exercises()}>
                {(exercise, i) =>
                    <div className={'display-box flex-col'}>

                        <div className={'flex-reactive justify-between'}>
                            <div className={'flex flex-col gap-4 pb-2'}>
                                <h1 className={'m-0'}>{exercise.name}</h1>
                                <Show when={
                                    exercise.info_url !== null &&
                                    exercise.info_url !== '' &&
                                    exercise.info_url !== undefined
                                }>
                                    <a href={exercise.info_url}
                                       target={'_blank'}
                                       referrerPolicy={'no-referrer'}
                                       className={'flex items-center gap-2 opacity-80 hover:opacity-100'}>
                                        <img src={exercise.info_url_favicon}
                                             className={'w-8 h-8 rounded-full inline-block border bg-black'}
                                             alt={'🚫ico'}/>
                                        <span className={'underline'}>Instructions</span>
                                    </a>
                                </Show>
                            </div>
                        </div>
                        <div className={'flex flex-col gap-4'}>
                            <GenerateCharts exercise_id={exercise.exercise_id} logs={exercise.logs}/>
                        </div>
                    </div>
                }
            </For>
    )
  }

  function Page () {
    return (
            <div className={'container'}>
                <WorkoutDisplay/>

                <div className={'py-4 flex flex-col gap-2'}>
                    <small className={'px-2'}>Exercise Progress</small>
                    <LoopExercises/>
                </div>

            </div>
    )
  }

  return (
        <>
            <TopMenu/>
            {workout_logs.data.loading ? <div className={'pt-10'}><Loading/></div> : <Page/>}
        </>
  )
};
