import { createEffect, createSignal, For, Show, useContext } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'
import { mainContext } from '../context/mainContext'
import TopMenu from '../components/TopMenu'
import { Loading, LoadingSmall } from '../components/Loading'
import Fetcher from '../utilities/fetcher'

export default function Workout () {
  const [ctx] = useContext(mainContext)
  const navigate = useNavigate()
  const params = useParams()

  const workout = new Fetcher(
    { workout_id: params.workout_id },
    ctx.getWorkout
  )

  const [_workout, _setWorkout] = createSignal({})

  const [newWorkoutName, setNewWorkoutName] = createSignal('')
  const [editWorkout, setEditWorkout] = createSignal(false)

  const [exercises, setExercises] = createSignal({})
  const [addingExercise, setAddingExercise] = createSignal(false)
  const [newExerciseName, setNewExerciseName] = createSignal('')
  const [newExerciseInfoUrl, setNewExerciseInfoUrl] = createSignal('')
  const [savingExercise, setSavingExercise] = createSignal(false)

  const [deleteExercise, setDeleteExercise] = createSignal(null)

  createEffect(() => {
    if (workout.data.loading === false) {
      if (workout.data().status === 'unauthorized') {
        navigate('/login')
      }
      if (workout.get('Workouts').length === 0) {
        navigate('/workouts')
      } else {
        _setWorkout(workout.get('Workouts')[0])
        setNewWorkoutName(_workout().name)
        setExercises(workout.get('Exercises'))
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
                    <h1 className={editWorkout() ? 'm-0 opacity-50' : 'm-0'}>
                        {editWorkout() ? ctx.truncate(newWorkoutName(), 45) : ctx.truncate(_workout().name, 45)}
                    </h1>
                </div>

                <div className={'action'} onClick={() => {
                  setEditWorkout(true)
                }}><span className="material-icons">edit</span>
                </div>
            </div>
    )
  }

  function EditWorkout () {
    return (
            <Show when={editWorkout() === true}>
                <div className={'action-box mb-4'}>
                    <form className={'form-col'}
                          onSubmit={(e) => {
                            e.preventDefault()
                          }}>
                        <input
                            className={'flex-1'}
                            type="text"
                            id="new_workout_name"
                            name="new_workout_name"
                            placeholder={'Workout Name'}
                            value={newWorkoutName()}
                            onKeyUp={(e) => {
                              setNewWorkoutName(e.target.value)
                            }}
                        />
                        <div className={'flex justify-between gap-4 pt-2'}>
                            <button
                                className={'button-bad flex-1'}
                                type="button"
                                onClick={() => {
                                  setEditWorkout(false)
                                  setNewWorkoutName(_workout().name)
                                }}>
                                Cancel
                            </button>
                            <button
                                className={'button-good flex-1'}
                                type="button"
                                onClick={() => {
                                  ctx.editWorkout(
                                    {
                                      workout_id: params.workout_id,
                                      data: {
                                        name: newWorkoutName()
                                      }
                                    }
                                  ).then(json => {
                                    if (json.status === 'success') {
                                      setEditWorkout(false)
                                      workout.refetch()
                                    }
                                  })
                                }}>
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </Show>
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
                                             className={'w-8 h-8 rounded-full inline-block border bg-black'} alt={'🚫ico'}/>
                                        <span className={'underline'}>Instructions</span>
                                        <span className={'material-icons w-5 h-5'}>open_in_new</span>
                                    </a>
                                </Show>

                                <p>{exercise.rel_sets.length} Sets</p>
                            </div>
                            <div className={'action-options items-center justify-between gap-2'}>
                                <div className={'action'} onClick={() => {
                                  setDeleteExercise(i())
                                }}>
                                    <span className="material-icons">delete</span>
                                </div>

                                <div className={'action'} onClick={() => {
                                  navigate(`/workout/${params.workout_id}/exercise/${exercise.exercise_id}`)
                                }}>
                                    <span className="material-icons">remove_red_eye</span>
                                </div>
                            </div>
                        </div>

                        <Show when={deleteExercise() === i()}>

                            <div className={'display-box flex-reactive items-center justify-between mt-4'}>
                                <p>Are you sure you want to delete this exercise?</p>
                                <div className={'flex gap-2'}>
                                    <button className={'button-bad'} onClick={() => {
                                      ctx.deleteExercise({
                                        workout_id: params.workout_id,
                                        exercise_id: exercise.exercise_id
                                      }).then(json => {
                                        if (json.status === 'success') {
                                          setDeleteExercise(null)
                                          workout.refetch()
                                        }
                                      })
                                    }}>
                                        Yes
                                    </button>
                                    <button onClick={() => {
                                      setDeleteExercise(null)
                                    }}>
                                        No
                                    </button>
                                </div>
                            </div>

                        </Show>

                    </div>
                }
            </For>
    )
  }

  function AddExercise () {
    return (
            <Show when={addingExercise() === true} fallback={
                <div className={'action-box-clickable p-10'} onClick={() => {
                  setAddingExercise(true)
                }}>
                    <span className="material-icons px-2">add</span> Exercise
                </div>
            }>
                <div className={'action-box'}>

                    <form className={'form-col'}
                          onSubmit={(e) => {
                            e.preventDefault()
                          }}>
                        <input
                            className={'flex-1'}
                            type="text"
                            id="new_exercise_name"
                            name="new_exercise_name"
                            placeholder={'Exercise Name'}
                            onKeyUp={(e) => {
                              setNewExerciseName(e.target.value)
                            }}
                        />
                        <input
                            className={'flex-1'}
                            type="text"
                            id="new_exercise_info_url"
                            name="new_exercise_info_url"
                            placeholder={'Exercise Info Url'}
                            onKeyUp={(e) => {
                              setNewExerciseInfoUrl(e.target.value)
                            }}
                        />

                        <div className={'flex justify-between gap-4 pt-2'}>

                            <button
                                className={'button-bad flex-1'}
                                type="button"
                                onClick={() => {
                                  setAddingExercise(false)
                                  setNewWorkoutName('')
                                  setNewExerciseInfoUrl('')
                                }}>
                                Cancel
                            </button>

                            <button
                                className={'button-good flex-1'}
                                type="button"
                                onClick={() => {
                                  setSavingExercise(true)
                                  ctx.addExercise(
                                    {
                                      workout_id: params.workout_id,
                                      data: {
                                        name: newExerciseName(),
                                        info_url: newExerciseInfoUrl(),
                                        order: exercises().length + 1
                                      }
                                    }
                                  ).then(json => {
                                    if (json.status === 'success') {
                                      setAddingExercise(false)
                                      setNewWorkoutName('')
                                      setNewExerciseInfoUrl('')
                                      setSavingExercise(false)
                                      navigate(`/workout/${params.workout_id}/exercise/${json.exercise_id}`)
                                    }
                                  })
                                }}>
                                {savingExercise() ? <LoadingSmall/> : 'Add'}
                            </button>

                        </div>
                    </form>

                </div>
            </Show>
    )
  }

  function Page () {
    return (
            <div className={'container'}>

                <WorkoutDisplay/>
                <EditWorkout/>

                <div className={'py-4 flex flex-col gap-2'}>
                    <small className={'px-2'}>Exercises</small>
                    <LoopExercises/>
                </div>

                <AddExercise/>
            </div>
    )
  }

  return (
        <>
            <TopMenu/>
            {workout.data.loading ? <div className={'pt-10'}><Loading/></div> : <Page/>}
        </>
  )
};
