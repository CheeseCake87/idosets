import { createEffect, createSignal, For, Show, useContext } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'
import { mainContext } from '../context/mainContext'
import TopMenu from '../components/TopMenu'
import { Loading, LoadingSmall } from '../components/Loading'
import Fetcher from '../utilities/fetcher'

export default function Exercise () {
  const [ctx, setCtx] = useContext(mainContext)
  const navigate = useNavigate()
  const params = useParams()

  const exercise = new Fetcher(
    { workout_id: params.workout_id, exercise_id: params.exercise_id },
    ctx.getExercise
  )

  const [_exercise, _setExercise] = createSignal({})

  const [workoutName, setWorkoutName] = createSignal('')
  const [editExercise, setEditExercise] = createSignal(false)
  const [savingExercise, setSavingExercise] = createSignal(false)

  const [newExerciseName, setNewExerciseName] = createSignal('')
  const [newExerciseInfoUrl, setNewExerciseInfoUrl] = createSignal('')

  const [sets, setSets] = createSignal({})

  // Adding Set
  const [addingSet, setAddingSet] = createSignal(false)
  const [setType, setSetType] = createSignal('reps')

  // Duration
  const [durationMinMax, setDurationMinMax] = createSignal('min')
  const [newSetDurationMin, setNewSetDurationMin] = createSignal(0)
  const [newSetDurationMinDisplay, setNewSetDurationMinDisplay] = createSignal('')
  const [newSetDurationMax, setNewSetDurationMax] = createSignal(0)
  const [newSetDurationMaxDisplay, setNewSetDurationMaxDisplay] = createSignal('')

  // Reps
  const [repsMinMax, setRepsMinMax] = createSignal('min')
  const [newSetRepsMin, setNewSetRepsMin] = createSignal(0)
  const [newSetRepsMax, setNewSetRepsMax] = createSignal(0)

  const [deleteSet, setDeleteSet] = createSignal(null)

  createEffect(() => {
    if (exercise.data.loading === false) {
      if (exercise.data().status === 'unauthorized') {
        navigate('/login')
      }
      if (exercise.get('Exercises').length === 0) {
        navigate('/workouts')
      } else {
        _setExercise(exercise.get('Exercises')[0])
        setWorkoutName(exercise.get('Workouts')[0].name)
        setNewExerciseName(_exercise().name)
        setNewExerciseInfoUrl(_exercise().info_url)
        setSets(exercise.get('Sets'))
        setNewSetDurationMinDisplay(ctx.fancyTimeFormat(newSetDurationMin()))
        setNewSetDurationMaxDisplay(ctx.fancyTimeFormat(newSetDurationMax()))
      }
    }
  })

  createEffect(() => {
    if (newSetDurationMin() < 0) {
      setNewSetDurationMin(0)
    } else {
      setNewSetDurationMinDisplay(
        ctx.fancyTimeFormat(newSetDurationMin())
      )
    }
  })

  createEffect(() => {
    if (newSetDurationMax() > 0) {
      setNewSetDurationMaxDisplay(ctx.fancyTimeFormat(newSetDurationMax()))
    }
  })

  function WorkoutDisplay () {
    return (
            <div className={'action-options gap-5 pb-4'}>
                <div className={'action-no-click opacity-50'}>
                    <span className="material-icons">more_vert</span>
                </div>
                <div className={'action-options-text'}>
                    <h1 className={'m-0 opacity-50'}>
                        {ctx.truncate(workoutName(), 45)}
                    </h1>
                </div>
            </div>
    )
  }

  function ExerciseDisplay () {
    return (
            <div className={'action-options gap-5 pb-4'}>
                <div className={'action'} onClick={() => {
                  navigate(`/workout/${params.workout_id}`)
                }}>
                    <span className="material-icons">arrow_back</span>
                </div>

                <div className={editExercise() ? 'action-options-text m-0 opacity-50' : 'action-options-text m-0'}>
                    <h1>
                        {editExercise() ? newExerciseName() : _exercise().name}
                    </h1>
                    <Show when={
                        _exercise().info_url !== null &&
                        _exercise().info_url !== '' &&
                        _exercise().info_url !== undefined
                    }>
                        <a href={_exercise().info_url}
                           target={'_blank'}
                           referrerPolicy={'no-referrer'}
                           className={'flex items-center gap-2 opacity-80 hover:opacity-100'}>
                            <img src={_exercise().info_url_favicon}
                                 className={'w-8 h-8 rounded-full inline-block border bg-black'} alt={'🚫ico'}/>
                            <span className={'underline'}>Instructions</span>
                            <span className={'material-icons w-5 h-5'}>open_in_new</span>
                        </a>
                    </Show>
                </div>

                <div className={'action'} onClick={() => {
                  setEditExercise(true)
                }}><span className="material-icons">edit</span>
                </div>
            </div>
    )
  }

  function EditExercise () {
    return (
            <Show when={editExercise() === true}>
                <div className={'action-box mb-4'}>
                    <form className={'form-col'}
                          onSubmit={(e) => {
                            e.preventDefault()
                          }}>
                        <input
                            className={'flex-1'}
                            type="text"
                            id="new_exercise_name"
                            name="new_exercise_name"
                            placeholder={'Name'}
                            value={newExerciseName()}
                            onKeyUp={(e) => {
                              setNewExerciseName(e.target.value)
                            }}
                        />
                        <input
                            className={'flex-1'}
                            type="text"
                            id="new_exercise_info_url"
                            name="new_exercise_info_url"
                            placeholder={'Instructions URL (https://example.com/to/instructions)'}
                            value={newExerciseInfoUrl()}
                            onKeyUp={(e) => {
                              setNewExerciseInfoUrl(e.target.value)
                            }}
                        />
                        <div className={'flex justify-between gap-4 pt-2'}>
                            <button
                                className={'button-bad flex-1'}
                                type="button"
                                onClick={() => {
                                  setEditExercise(false)
                                  setNewExerciseName(_exercise().name)
                                  setNewExerciseInfoUrl(_exercise().info_url)
                                }}>
                                Cancel
                            </button>
                            <button
                                className={'button-good flex-1'}
                                type="button"
                                onClick={() => {
                                  setSavingExercise(true)
                                  ctx.editExercise(
                                    {
                                      workout_id: params.workout_id,
                                      exercise_id: params.exercise_id,
                                      data: {
                                        name: newExerciseName(),
                                        info_url: newExerciseInfoUrl()
                                      }
                                    }
                                  ).then(json => {
                                    if (json.status === 'success') {
                                      setEditExercise(false)
                                      setSavingExercise(false)
                                      exercise.refetch()
                                    }
                                  })
                                }}>
                                {savingExercise() ? <LoadingSmall/> : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </Show>
    )
  }

  function LoopSets () {
    return (
            <For each={sets()}>
                {(set, i) =>
                    <div className={'display-box flex-col'}>
                        <div className={'flex-reactive justify-between'}>
                            <div className={'flex gap-4 items-center'}>
                                <h1 className={'m-0 opacity-50'}>{i() + 1}</h1>
                                <Show when={set.is_duration}>
                                    <div className={'flex items-center gap-1'}>
                                        <span className="material-icons px-2">timer</span>
                                        <h2 className={'m-0'}>
                                            {set.duration_min > 0 ? ctx.fancyTimeFormat(set.duration_min) : ''}
                                            {(set.duration_max > 0 && set.duration_min > 0) ? ' - ' : ''}
                                            {set.duration_max > 0 ? ctx.fancyTimeFormat(set.duration_max) : ''}
                                        </h2>
                                    </div>
                                </Show>
                                <Show when={set.is_reps}>
                                    <div className={'flex items-center gap-1'}>
                                        <span className="material-icons px-2">fitness_center</span>
                                        <h2 className={'m-0'}>
                                            {ctx.fancyRepFormat(set.reps_min, set.reps_max)}
                                        </h2>
                                    </div>
                                </Show>
                            </div>
                            <div className={'action-options items-center justify-between gap-2'}>
                                <div className={'action'} onClick={() => {
                                  setDeleteSet(i())
                                }}>
                                    <span className="material-icons">delete</span>
                                </div>
                                <div className={'action'} onClick={() => {
                                  ctx.copySet({
                                    workout_id: params.workout_id,
                                    exercise_id: params.exercise_id,
                                    set_id: set.set_id
                                  }).then(json => {
                                    if (json.status === 'success') {
                                      exercise.refetch()
                                    }
                                  })
                                }}>
                                    <span className="material-icons">content_copy</span>
                                </div>
                            </div>
                        </div>
                        <Show when={deleteSet() === i()}>
                            <div className={'display-box flex-reactive items-center justify-between mt-4'}>
                                <p>Are you sure you want to delete this set?</p>
                                <div className={'flex gap-2'}>
                                    <button className={'button-bad'} onClick={() => {
                                      ctx.deleteSet({
                                        workout_id: params.workout_id,
                                        exercise_id: params.exercise_id,
                                        set_id: set.set_id
                                      }).then(json => {
                                        if (json.status === 'success') {
                                          setDeleteSet(null)
                                          exercise.refetch()
                                        }
                                      })
                                    }}>
                                        Yes
                                    </button>
                                    <button onClick={() => {
                                      setDeleteSet(null)
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

  function AddSet () {
    return (
            <Show when={addingSet() === true} fallback={
                <div className={'action-box-clickable p-10'} onClick={() => {
                  setAddingSet(true)
                }}>
                    <span className="material-icons px-2">add</span> Set
                </div>
            }>
                <div className={'action-box'}>

                    <form className={'form-col'}
                          onSubmit={(e) => {
                            e.preventDefault()
                          }}>

                        {/* Set type setting */}
                        <div className={'flex flex-row gap-4'}>

                            <div className={
                                setType() === 'reps'
                                  ? 'action-box action-box-reactive flex-1'
                                  : 'action-box-clickable action-box-reactive flex-1'}
                                 onClick={() => {
                                   setSetType('reps')
                                   setNewSetDurationMin(0)
                                 }}>
                                <span className="material-icons px-2">fitness_center</span> Reps
                            </div>

                            <div className={
                                setType() === 'duration'
                                  ? 'action-box action-box-reactive flex-1'
                                  : 'action-box-clickable action-box-reactive flex-1'}
                                 onClick={() => {
                                   setSetType('duration')
                                   setNewSetRepsMin(0)
                                 }}>
                                <span className="material-icons px-2">timer</span> Duration
                            </div>

                        </div>

                        {/* Set duration setting */}
                        <Show when={setType() === 'duration'}>
                            <div className={'flex flex-row gap-4'}>

                                <div className={
                                    durationMinMax() === 'min' ? 'action-box flex-1' : 'action-box-clickable flex-1'}
                                     onClick={() => {
                                       setDurationMinMax('min')
                                     }}>
                                    Min
                                </div>

                                <div className={
                                    durationMinMax() === 'max' ? 'action-box flex-1' : 'action-box-clickable flex-1'}
                                     onClick={() => {
                                       setDurationMinMax('max')
                                     }}>
                                    Max
                                </div>

                            </div>
                            <Show when={durationMinMax() === 'min'}>
                                <div className={'text-center p-4'}>
                                    <h1>{newSetDurationMinDisplay()}</h1>
                                </div>
                                <div className={'flex-reactive'}>
                                    <div className={'action-box-clickable flex-1 items-center'}
                                         onClick={() => {
                                           setNewSetDurationMin(0)
                                         }}>
                                        Reset
                                    </div>
                                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               if (newSetDurationMin() < 0) {
                                                 setNewSetDurationMin(0)
                                               } else {
                                                 setNewSetDurationMin(newSetDurationMin() - 5)
                                               }
                                             }}>
                                            -5 secs
                                        </div>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetDurationMin(newSetDurationMin() + 5)
                                             }}>
                                            +5 secs
                                        </div>

                                    </div>
                                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               if (newSetDurationMin() < 0) {
                                                 setNewSetDurationMin(0)
                                               } else {
                                                 setNewSetDurationMin(newSetDurationMin() - 30)
                                               }
                                             }}>
                                            -30 secs
                                        </div>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetDurationMin(newSetDurationMin() + 30)
                                             }}>
                                            +30 secs
                                        </div>
                                    </div>
                                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               if (newSetDurationMin() < 0) {
                                                 setNewSetDurationMin(0)
                                               } else {
                                                 setNewSetDurationMin(newSetDurationMin() - 60)
                                               }
                                             }}>
                                            -1 mins
                                        </div>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetDurationMin(newSetDurationMin() + 60)
                                             }}>
                                            +1 mins
                                        </div>

                                    </div>
                                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               if (newSetDurationMin() < 0) {
                                                 setNewSetDurationMin(0)
                                               } else {
                                                 setNewSetDurationMin(newSetDurationMin() - 600)
                                               }
                                             }}>
                                            -10 mins
                                        </div>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetDurationMin(newSetDurationMin() + 600)
                                             }}>
                                            +10 mins
                                        </div>

                                    </div>
                                </div>
                            </Show>
                            <Show when={durationMinMax() === 'max'}>
                                <div className={'text-center p-4'}>
                                    <h1>{newSetDurationMaxDisplay()}</h1>
                                </div>
                                <div className={'flex-reactive'}>
                                    <div className={'action-box-clickable flex-1 items-center'}
                                         onClick={() => {
                                           setNewSetDurationMax(0)
                                         }}>
                                        Reset
                                    </div>
                                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               if (newSetDurationMax() < 0) {
                                                 setNewSetDurationMin(0)
                                               } else {
                                                 setNewSetDurationMax(newSetDurationMax() - 5)
                                               }
                                             }}>
                                            -5 secs
                                        </div>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetDurationMax(newSetDurationMax() + 5)
                                             }}>
                                            +5 secs
                                        </div>

                                    </div>
                                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               if (newSetDurationMax() < 0) {
                                                 setNewSetDurationMax(0)
                                               } else {
                                                 setNewSetDurationMax(newSetDurationMax() - 30)
                                               }
                                             }}>
                                            -30 secs
                                        </div>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetDurationMax(newSetDurationMax() + 30)
                                             }}>
                                            +30 secs
                                        </div>
                                    </div>
                                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               if (newSetDurationMax() < 0) {
                                                 setNewSetDurationMax(0)
                                               } else {
                                                 setNewSetDurationMax(newSetDurationMax() - 60)
                                               }
                                             }}>
                                            -1 mins
                                        </div>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetDurationMax(newSetDurationMax() + 60)
                                             }}>
                                            +1 mins
                                        </div>

                                    </div>
                                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               if (newSetDurationMax() < 0) {
                                                 setNewSetDurationMax(0)
                                               } else {
                                                 setNewSetDurationMax(newSetDurationMax() - 600)
                                               }
                                             }}>
                                            -10 mins
                                        </div>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetDurationMax(newSetDurationMax() + 600)
                                             }}>
                                            +10 mins
                                        </div>

                                    </div>
                                </div>
                            </Show>
                        </Show>

                        {/* Set reps setting */}
                        <Show when={setType() === 'reps'}>
                            <div className={'flex flex-row gap-4'}>

                                <div className={
                                    repsMinMax() === 'min' ? 'action-box flex-1' : 'action-box-clickable flex-1'}
                                     onClick={() => {
                                       setRepsMinMax('min')
                                     }}>
                                    Min
                                </div>

                                <div className={
                                    repsMinMax() === 'max' ? 'action-box flex-1' : 'action-box-clickable flex-1'}
                                     onClick={() => {
                                       setRepsMinMax('max')
                                     }}>
                                    Max
                                </div>

                            </div>
                            <Show when={repsMinMax() === 'min'}>
                                <div className={'text-center p-4'}>
                                    <h1>{newSetRepsMin() === 1 ? newSetRepsMin() + ' rep' : newSetRepsMin() + ' reps'}</h1>
                                </div>

                                <div className={'flex-reactive'}>

                                    <div className={'action-box-clickable flex-1 items-center'}
                                         onClick={() => {
                                           setNewSetRepsMin(0)
                                         }}>
                                        Reset
                                    </div>

                                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetRepsMin(newSetRepsMin() - 1)
                                               if (newSetRepsMin() < 0) {
                                                 setNewSetRepsMin(0)
                                               }
                                             }}>
                                            -1 rep
                                        </div>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetRepsMin(newSetRepsMin() + 1)
                                             }}>
                                            +1 rep
                                        </div>
                                    </div>

                                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetRepsMin(newSetRepsMin() - 5)
                                               if (newSetRepsMin() < 0) {
                                                 setNewSetRepsMin(0)
                                               }
                                             }}>
                                            -5 reps
                                        </div>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetRepsMin(newSetRepsMin() + 5)
                                             }}>
                                            +5 reps
                                        </div>
                                    </div>

                                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetRepsMin(newSetRepsMin() - 10)
                                               if (newSetRepsMin() < 0) {
                                                 setNewSetRepsMin(0)
                                               }
                                             }}>
                                            -10 reps
                                        </div>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetRepsMin(newSetRepsMin() + 10)
                                             }}>
                                            +10 reps
                                        </div>
                                    </div>

                                </div>
                            </Show>
                            <Show when={repsMinMax() === 'max'}>
                                <div className={'text-center p-4'}>
                                    <h1>{newSetRepsMax() === 1 ? newSetRepsMax() + ' rep' : newSetRepsMax() + ' reps'}</h1>
                                </div>

                                <div className={'flex-reactive'}>

                                    <div className={'action-box-clickable flex-1 items-center'}
                                         onClick={() => {
                                           setNewSetRepsMax(0)
                                         }}>
                                        Reset
                                    </div>

                                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetRepsMax(newSetRepsMax() - 1)
                                               if (newSetRepsMax() < 0) {
                                                 setNewSetRepsMax(0)
                                               }
                                             }}>
                                            -1 rep
                                        </div>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetRepsMax(newSetRepsMax() + 1)
                                             }}>
                                            +1 rep
                                        </div>
                                    </div>

                                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetRepsMax(newSetRepsMax() - 5)
                                               if (newSetRepsMax() < 0) {
                                                 setNewSetRepsMax(0)
                                               }
                                             }}>
                                            -5 reps
                                        </div>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetRepsMax(newSetRepsMax() + 5)
                                             }}>
                                            +5 reps
                                        </div>
                                    </div>

                                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetRepsMax(newSetRepsMax() - 10)
                                               if (newSetRepsMax() < 0) {
                                                 setNewSetRepsMax(0)
                                               }
                                             }}>
                                            -10 reps
                                        </div>
                                        <div className={'action-box-clickable flex-1'}
                                             onClick={() => {
                                               setNewSetRepsMax(newSetRepsMax() + 10)
                                             }}>
                                            +10 reps
                                        </div>
                                    </div>

                                </div>
                            </Show>
                        </Show>

                        <div className={'flex justify-between gap-4 pt-2'}>

                            <button
                                className={'button-bad flex-1'}
                                type="button"
                                onClick={() => {
                                  setAddingSet(false)
                                  setDurationMinMax('min')
                                  setNewSetDurationMin(0)
                                  setNewSetDurationMax(0)
                                  setRepsMinMax('min')
                                  setNewSetRepsMin(0)
                                  setNewSetRepsMax(0)
                                }}>
                                Cancel
                            </button>

                            <button
                                className={'button-good flex-1'}
                                type="button"
                                onClick={() => {
                                  ctx.addSet(
                                    {
                                      workout_id: params.workout_id,
                                      exercise_id: params.exercise_id,
                                      data: {
                                        type: setType(),
                                        duration_min: newSetDurationMin(),
                                        duration_max: newSetDurationMax(),
                                        reps_min: newSetRepsMin(),
                                        reps_max: newSetRepsMax(),
                                        order: sets().length + 1
                                      }
                                    }
                                  ).then(json => {
                                    if (json.status === 'success') {
                                      setAddingSet(false)
                                      setDurationMinMax('min')
                                      setNewSetDurationMin(0)
                                      setNewSetDurationMax(0)
                                      setRepsMinMax('min')
                                      setNewSetRepsMin(0)
                                      setNewSetRepsMax(0)
                                      exercise.refetch()
                                    }
                                  })
                                }}>
                                Add
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
                <ExerciseDisplay/>
                <EditExercise/>
                <div className={'py-4 flex flex-col gap-2'}>
                    <small className={'px-2'}>Sets</small>
                    <LoopSets/>
                </div>
                <AddSet/>
            </div>
    )
  }

  return (
        <>
            <TopMenu/>
            {exercise.data.loading ? <div className={'pt-10'}><Loading/></div> : <Page/>}
        </>
  )
};
