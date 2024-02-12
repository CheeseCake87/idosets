import { createEffect, createSignal, For, Show, useContext } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'
import { mainContext } from '../context/mainContext'
import TopMenu from '../components/TopMenu'
import { Loading } from '../components/Loading'
import Fetcher from '../utilities/fetcher'

export default function WorkoutLogs () {
  const [ctx] = useContext(mainContext)
  const navigate = useNavigate()
  const params = useParams()

  const [_workout, _setWorkout] = createSignal({})
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
      if (workout_logs.get('Workouts').length === 0) {
        navigate('/workouts')
      } else {
        _setWorkout(workout_logs.get('Workouts')[0])
        setExercises(workout_logs.get('Exercises'))
      }
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
                        {ctx.truncate(_workout().name, 45)}
                    </h1>
                </div>
            </div>
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
                                <p>{exercise.rel_sets.length} Sets</p>
                            </div>
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
                <small className={'px-2'}>Exercises</small>
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
