import {createEffect, createSignal, For, onMount, Show, useContext} from 'solid-js'
import {useNavigate, useParams} from '@solidjs/router'
import {mainContext} from '../../../contextManagers/mainContext'
import {Loading, LoadingSmall} from '../../globals/Loading'
import Fetcher from '../../../utilities/fetcher'
import SetRow from "./SetRow";
import {sessionContext} from "../../../contextManagers/sessionContext";

export default function _Session() {
    const navigate = useNavigate()
    const params = useParams()

    const ctxMain = useContext(mainContext)
    const ctxSession = useContext(sessionContext)

    const workout_id = params.workout_id
    const workout_session_id = params.workout_session_id


    // workout_session_id is generated by the start workout button on the Workouts page
    const workoutSessionFetcher = new Fetcher({
        workout_id, workout_session_id
    }, ctxMain.getSession)

    createEffect(() => {
        if (workoutSessionFetcher.data.loading === false) {
            ctxSession.setExercises(workoutSessionFetcher.get('exercises').items)
            ctxSession.setFinished(workoutSessionFetcher.get('workout_session').is_finished)
        }
    })

    onMount(() => {
        setTimeout(() => {
            window.scrollTo({top: 130, behavior: 'smooth'})
        }, 200)
    })

    function ShowFinishStats() {
        return (
            <>
                <div className={'action-options gap-5 pb-4'}>
                    <div className={'action'} onClick={() => {
                        navigate('/workouts')
                    }}>
                        <span className="material-icons">arrow_back</span>
                    </div>

                    <div className={'action-options-text'}>
                        <h1 className={'m-0'}>
                            {workoutSessionFetcher.get('workout').name}
                        </h1>
                    </div>
                </div>

                <div className={'display-box no-bg flex-col gap-4'}>

                    <h4 className={'m-0'}>
                        Time:&nbsp;
                        <span className={'opacity-80'}>
                                {ctxMain.fancyTimeFormat(workoutSessionFetcher.get('workout_session').duration)}
                            </span>
                    </h4>

                    <Show when={workoutSessionFetcher.get('workout_session').total_weight > 0}>
                        <h4 className={'m-0'}>
                            Total Weight:&nbsp;
                            <span className={'opacity-80'}>
                                {workoutSessionFetcher.get('workout_session').total_weight} {ctxMain.units}
                                </span>
                        </h4>
                    </Show>

                </div>
            </>
        )
    }

    function FinishAction() {
        return (
            <div
                className={'display-box-slim flex-col gap-2 my-12 border-0'} id={'finish-workout'}>
                <Show when={ctxSession.finishSession()}
                      children={
                          <div
                              className={ctxMain.connection()
                                  ? 'display-box no-bg flex-col text-center gap-6'
                                  : 'display-box flex-col text-center gap-6'}>

                              <Show when={!ctxMain.connection()}
                                    fallback={
                                        <p className={'opacity-90'}>
                                            Are you sure you want to finish this workout?
                                        </p>
                                    }>
                                  <div>
                                      <p className={'m-0'}>Oh no! It looks like you might be offline.</p>
                                      <p>Don't refresh this page, and try again when you're back online.</p>
                                  </div>
                              </Show>

                              <div className={'flex gap-2'}>
                                  <Show
                                      when={ctxMain.connection()}
                                      fallback={
                                          <button className={'button-good flex-1'}
                                                  onClick={() => {
                                                      ctxSession.setFinishing(true)
                                                      ctxMain.stopSession({
                                                          workout_id,
                                                          workout_session_id,
                                                          data: {
                                                              log_collection: ctxSession.logCollection()
                                                          }
                                                      }).then((_) => {
                                                          workoutSessionFetcher.refetch()
                                                          ctxSession.setFinishing(false)
                                                      }).catch(
                                                          (_) => {
                                                              ctxSession.setFinishing(false)
                                                          }
                                                      )
                                                  }}>
                                              {ctxSession.finishing() ? <LoadingSmall/> : 'Try Again'}
                                          </button>
                                      }
                                  >
                                      <button className={'button-good flex-1'}
                                              onClick={() => {
                                                  ctxSession.setFinishing(true)
                                                  ctxMain.stopSession({
                                                      workout_id,
                                                      workout_session_id,
                                                      data: {
                                                          log_collection: ctxSession.logCollection()
                                                      }
                                                  }).then((_) => {
                                                      workoutSessionFetcher.refetch()
                                                      ctxSession.setFinishing(false)
                                                  }).catch(
                                                      (_) => {
                                                          ctxSession.setFinishing(false)
                                                      }
                                                  )
                                              }}>
                                          {ctxSession.finishing() ? <LoadingSmall/> : 'Finish Workout'}
                                      </button>
                                  </Show>
                                  <Show when={ctxMain.connection()}>
                                      <button className={'flex-1'}
                                              onClick={() => {
                                                  ctxSession.setFinishSession(false)
                                              }}>
                                          No
                                      </button>
                                  </Show>
                              </div>
                          </div>
                      }
                      fallback={
                          <button
                              className={'button-good button-large flex-1'}
                              type="button"
                              onClick={() => {
                                  ctxSession.setFinishSession(true)
                                  const scrollDiv = document.getElementById(
                                      'finish-workout').offsetTop
                                  window.scrollTo({top: scrollDiv - 30, behavior: 'smooth'})
                              }}>
                              Finish Workout
                          </button>
                      }/>

            </div>
        )
    }

    function LoopExercises() {
        return (
            <div className={'pb-4 flex flex-col gap-4'}>

                <For each={ctxSession.exercises()}>
                    {
                        (e, exercise_i) =>
                            <div className={'display-box-thin flex-col gap-3'}>
                                <div className={'flex flex-col gap-4 p-4'}>
                                    <h2 className={'m-0'}>{e.name}</h2>
                                    <Show when={
                                        e.info_url !== null &&
                                        e.info_url !== '' &&
                                        e.info_url !== undefined
                                    }>
                                        <a href={e.info_url}
                                           target={'_blank'}
                                           referrerPolicy={'no-referrer'}
                                           className={'flex items-center gap-2 opacity-80 hover:opacity-100'}>
                                            <img src={e.info_url_favicon}
                                                 className={'w-8 h-8 rounded-full inline-block border bg-black'}
                                                 alt={'🚫ico'}/>
                                            <span className={'underline'}>Instructions</span>
                                            <span className={'material-icons w-5 h-5'}>open_in_new</span>
                                        </a>
                                    </Show>
                                </div>
                                {/* Loop through sets */}
                                <For each={e.sets}>
                                    {
                                        (set, set_i) =>
                                            <SetRow
                                                exercise_id={e.exercise_id}
                                                set={set}
                                                set_i={set_i}
                                            />
                                    }
                                </For>

                            </div>
                    }
                </For>

            </div>
        )
    }

    function CancelAction() {
        return (
            <div className={'display-box-slim flex-col no-bg gap-2 mb-20 border-0'}
                 id={'cancel-workout'}>

                <Show when={ctxSession.cancelSession()}
                      children={
                          <div className={ctxMain.connection()
                              ? 'display-box flex-col text-center gap-6'
                              : 'display-box flex-col text-center gap-6'}>

                              <Show when={!ctxMain.connection()}
                                    fallback={
                                        <p className={'opacity-90'}>
                                            Are you sure you want to cancel this workout?
                                        </p>
                                    }>
                                  <div>
                                      <p className={'m-0'}>Oh no! It looks like you might be offline.</p>
                                      <p>Don't refresh this page, and try again when you're back online.</p>
                                  </div>
                              </Show>

                              <div className={'flex gap-2'}>
                                  <Show
                                      when={ctxMain.connection()}
                                      fallback={
                                          <button className={'button-good flex-1'}
                                                  onClick={() => {
                                                      ctxSession.setCancelling(true)
                                                      ctxMain.cancelSession({
                                                          workout_id,
                                                          workout_session_id
                                                      }).then((_) => {
                                                          navigate('/workouts')
                                                      }).catch(
                                                          (_) => {
                                                              ctxSession.setCancelling(false)
                                                          }
                                                      )
                                                  }}>
                                              {ctxSession.cancelling() ? <LoadingSmall/> : 'Try Again'}
                                          </button>
                                      }
                                  >
                                      <button className={'button-bad flex-1'}
                                              onClick={() => {
                                                  ctxSession.setCancelling(true)
                                                  ctxMain.cancelSession({
                                                      workout_id,
                                                      workout_session_id
                                                  }).then((_) => {
                                                      navigate('/workouts')
                                                  }).catch(
                                                      (_) => {
                                                          ctxSession.setCancelling(false)
                                                      }
                                                  )
                                              }}>
                                          {ctxSession.cancelling() ? <LoadingSmall/> : 'Cancel Workout'}
                                      </button>
                                  </Show>
                                  <Show when={ctxMain.connection()}>
                                      <button className={'flex-1'}
                                              onClick={() => {
                                                  ctxSession.setCancelSession(false)
                                              }}>
                                          No
                                      </button>
                                  </Show>
                              </div>
                          </div>
                      }
                      fallback={
                          <button
                              className={'button-bad button-large flex-1'}
                              type="button"
                              onClick={() => {
                                  ctxSession.setCancelSession(true)
                                  const scrollDiv = document.getElementById(
                                      'cancel-workout').offsetTop
                                  window.scrollTo({top: scrollDiv - 30, behavior: 'smooth'})
                              }}>
                              Cancel Workout
                          </button>
                      }/>

            </div>
        )
    }

    function Page() {
        return (<div className={'container'}>
            {/* Show when not finished */}
            <Show
                when={!ctxSession.finished()}
                fallback={ShowFinishStats()}
            >

                <CancelAction/>

                {/* Workout name */}
                <div className={'action-options gap-5 pb-4'} id={'workout-name'}>
                    <div className={'action-options-text'}>
                        <h1 className={'m-0 text-5xl px-4 pb-4'}>
                            {workoutSessionFetcher.get('workout').name}
                        </h1>
                    </div>
                </div>

                <LoopExercises/>

                <FinishAction/>

            </Show>
        </div>)
    }

    return (<>
        {/* <TopMenu/> */}
        {
            workoutSessionFetcher.data.loading
                ? <div className={'pt-10'}><Loading/></div>
                : <Page/>
        }
    </>)
};