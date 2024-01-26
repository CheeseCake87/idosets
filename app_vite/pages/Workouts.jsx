import {createEffect, createSignal, For, Show, useContext} from "solid-js";
import {useNavigate} from "@solidjs/router";
import {mainContext} from "../context/mainContext";
import TopMenu from "../components/TopMenu";
import Loading from "../components/Loading";
import Fetcher from "../utilities/fetcher";


export default function Workouts() {

    const [ctx, setCtx] = useContext(mainContext);
    const navigate = useNavigate();

    const workouts = new Fetcher(ctx.getWorkouts)
    const getActiveSessions = new Fetcher(ctx.getActiveSessions)

    const [addingWorkout, setAddingWorkout] = createSignal(false)
    const [newWorkoutName, setNewWorkoutName] = createSignal('')

    const [deleteWorkout, setDeleteWorkout] = createSignal(null)
    const [startWorkout, setStartWorkout] = createSignal(null)

    const [activeSessions, setActiveSessions] = createSignal({})

    createEffect(() => {
        if (workouts.data.loading === false) {
            if (workouts.data().status === 'unauthorized') {
                navigate('/login')
            }
        }
    })

    createEffect(() => {
        if (!getActiveSessions.data.loading) {
            if (getActiveSessions.get("status") === 'success') {
                setActiveSessions(getActiveSessions.get("active_sessions"))
            }
        }
    })


    function LoopWorkouts() {
        return (
            <For each={workouts.get("Workouts")}>
                {(workout, i) =>
                    <div className={"display-box flex-col"}>

                        <div className={'flex-reactive justify-between'}>

                            <div className={'flex flex-col gap-4 pb-2'}>
                                <h1 className={'m-0'}>{workout.name}</h1>
                                <p>{workout.rel_exercises.length} Exercises</p>
                            </div>

                            <div className={'action-options items-center justify-between gap-2'}>
                                <div className={"action"} onClick={() => {
                                    setDeleteWorkout(i())
                                }}>
                                    <span className="material-icons">delete</span>
                                </div>
                                <div className={'flex gap-2'}>
                                    <div className={"action"} onClick={() => {
                                        navigate(`/workout/${workout.workout_id}`)
                                    }}>
                                        <span className="material-icons">edit</span>
                                    </div>
                                    <Show
                                        when={activeSessions()[workout.workout_id] !== undefined}
                                        fallback={
                                            <div className={"action"} onClick={() => {
                                                setStartWorkout(i())
                                            }}>
                                                <span className="material-icons">start</span>
                                            </div>
                                        }
                                    >
                                        <div className={"action flashing-good"} onClick={() => {
                                            navigate(
                                                `/workout/${workout.workout_id}/` +
                                                `session/` +
                                                `${activeSessions()[workout.workout_id].workout_session_id}`
                                            )
                                        }}>
                                            <span className="material-icons">start</span>
                                        </div>
                                    < /Show>
                                </div>
                            </div>
                        </div>
                        <DeleteWorkoutPopOut workout={workout} i={i}/>
                        <StartWorkoutPopOut workout={workout} i={i}/>
                    </div>
                }
            </For>
        )
    }

    function StartWorkoutPopOut(props) {
        let workout = props.workout
        let i = props.i
        return (
            <Show
                when={startWorkout() === i() && activeSessions()[workout.workout_id] === undefined}>
                <div className={"display-box flex-reactive items-center justify-between mt-4"}>
                    <p>Are you sure you want to start this workout?</p>
                    <div className={'flex gap-2'}>

                        <button onClick={() => {
                            setStartWorkout(null)
                        }}>
                            Not ready
                        </button>
                        <button className={'button-good'} onClick={() => {
                            ctx.startSession(
                                {workout_id: workout.workout_id}
                            ).then(json => {
                                if (json.status === 'success') {
                                    navigate(
                                        `/workout/${workout.workout_id}` +
                                        `/session/${json.workout_session_id}`
                                    )
                                }
                            })
                        }}>
                            Start
                        </button>
                    </div>
                </div>
            </Show>
        )
    }

    function AddWorkout() {
        return (
            <Show when={addingWorkout() === true} fallback={
                <div className={"action-box-clickable p-10"} onClick={() => {
                    setAddingWorkout(true)
                }}>
                    <span className="material-icons px-2">add</span> Workout
                </div>
            }>
                <div className={"action-box"}>

                    <form className={"form-col"}
                          onSubmit={(e) => {
                              e.preventDefault()
                          }}>
                        <input
                            className={"flex-1"}
                            type="text"
                            id="new_workout_name"
                            name="new_workout_name"
                            placeholder={"Workout Name"}
                            onKeyUp={(e) => {
                                setNewWorkoutName(e.target.value)
                            }}
                        />
                        <div className={'flex justify-between gap-4 pt-2'}>

                            <button
                                className={"button-bad flex-1"}
                                type="button"
                                onClick={() => {
                                    setAddingWorkout(false)
                                    setNewWorkoutName('')
                                }}>
                                Cancel
                            </button>

                            <button
                                className={"button-good flex-1"}
                                type="button"
                                onClick={() => {
                                    ctx.addWorkout({
                                        name: newWorkoutName(),
                                    }).then(json => {
                                        if (json.status === 'success') {
                                            setAddingWorkout(false)
                                            setNewWorkoutName('')
                                            navigate(`/workout/${json["workout_id"]}`)
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

    function DeleteWorkoutPopOut(props) {
        let workout = props.workout
        let i = props.i
        return (
            <Show when={deleteWorkout() === i()}>
                <div
                    className={"display-box flex-reactive items-center justify-between mt-4"}>
                    <p>Are you sure you want to delete this workout?</p>

                    <div className={'flex gap-2'}>
                        <button className={'button-bad'} onClick={() => {
                            ctx.deleteWorkout({
                                workout_id: workout.workout_id,
                            }).then(json => {
                                if (json.status === 'success') {
                                    setDeleteWorkout(null)
                                    workouts.refetch()
                                }
                            })
                        }}>
                            Delete
                        </button>
                        <button onClick={() => {
                            setDeleteWorkout(null)
                        }}>
                            No
                        </button>
                    </div>

                </div>
            </Show>
        )
    }

    function Page() {
        return (
            <div className={"container"}>
                <div className={"pb-4 flex flex-col gap-2"}>
                    <LoopWorkouts/>
                </div>
                <AddWorkout/>
            </div>
        )
    }

    return (
        <>
            <TopMenu/>
            {
                workouts.data.loading ?
                    <div className={"pt-10"}><Loading/></div> :
                    <Page/>
            }
        </>
    );
};
