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
    const el_id = document.getElementById(`${props.exercise_id}_rep_chart`)
    const data = {
      datasets: [{
        label: 'Reps',
        data: props.rep_logs,
        fill: false,
        backgroundColor: 'rgba(192,75,192,0.8)',
        tension: 0.25
      }]
    }
    const config = {
      type: 'bar',
      data,
      options: {
        scales: {
          x: {
            display: false
          },
          y: {
            beginAtZero: true
          }
        }
      }
    }
    const _ = new Chart(el_id, config)
    return (
            <canvas id={`${props.exercise_id}_rep_chart`}></canvas>
    )
  }

  function WeightChart (props) {
    onMount(() => {
      const el_id = document.getElementById(`${props.exercise_id}_weight_chart`)
      const data = {
        datasets: [{
          label: 'Weight (Kg)',
          data: props.weight_logs,
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.8)',
          tension: 0.25
        }]
      }
      const config = {
        type: 'bar',
        data,
        options: {
          scales: {
            x: {
              display: false
            },
            y: {
              beginAtZero: true
            }
          }
        }
      }
      const _ = new Chart(el_id, config)
    })

    return (
            <canvas id={`${props.exercise_id}_weight_chart`}></canvas>
    )
  }

  function GenerateCharts (props) {
    const [weightLogs, setWeightLogs] = createSignal([])
    const [repLogs, setRepLogs] = createSignal([])
    const [durationLogs, setDurationLogs] = createSignal([])

    const [weightTotal, setWeightTotal] = createSignal(0)
    const [repTotal, setRepTotal] = createSignal(0)
    const [durationTotal, setDurationTotal] = createSignal(0)

    const [indexes, setIndexes] = createSignal([])
    props.logs.forEach((log, i) => {
      setWeightLogs([...weightLogs(), ctx.gramsToKgs(log.weight)])
      setRepLogs([...repLogs(), log.reps])
      setDurationLogs([...durationLogs(), log.duration])
      setWeightTotal(weightTotal() + parseInt(log.weight))
      setRepTotal(repTotal() + parseInt(log.reps))
      setDurationTotal(durationTotal() + parseInt(log.duration))
    })

    console.log(weightTotal())

    return (
            <>
                {
                    weightTotal() > 0
                      ? <WeightChart exercise_id={props.exercise_id} weight_logs={weightLogs()}/>
                      : ''
                }
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
                                <p>{exercise.logs.length} Logs</p>
                            </div>

                        </div>
                        <div className={'flex-reactive'}>
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
