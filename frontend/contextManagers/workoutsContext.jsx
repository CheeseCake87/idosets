import {createContext, createSignal, useContext} from 'solid-js'
import {Outlet} from '@solidjs/router'
import Fetcher from "../utilities/fetcher";
import {mainContext} from "./mainContext";

export const workoutsContext = createContext()

export function WorkoutsContextProvider(props) {
    const ctxMain = useContext(mainContext)

    const getWorkouts = new Fetcher(ctxMain.getWorkouts)
    const getLastWorkoutSession = new Fetcher(ctxMain.getLastWorkoutSession)
    const getActiveSessions = new Fetcher(ctxMain.getActiveSessions)

    const [addingWorkout, setAddingWorkout] = createSignal(false)
    const [newWorkoutName, setNewWorkoutName] = createSignal('')
    const [editWorkout, setEditWorkout] = createSignal(false)
    const [deleteWorkout, setDeleteWorkout] = createSignal(null)
    const [startWorkout, setStartWorkout] = createSignal(null)

    const [lastWorkoutSession, setLastWorkSession] = createSignal({})
    const [activeSessions, setActiveSessions] = createSignal({})

    const [workout, setWorkout] = createSignal({})

    const [exercises, setExercises] = createSignal({})
    const [addingExercise, setAddingExercise] = createSignal(false)
    const [newExerciseName, setNewExerciseName] = createSignal('')
    const [newExerciseInfoUrl, setNewExerciseInfoUrl] = createSignal('')
    const [savingExercise, setSavingExercise] = createSignal(false)

    const [deleteExercise, setDeleteExercise] = createSignal(null)

    const [exercise, setExercise] = createSignal({})

    const [workoutName, setWorkoutName] = createSignal('')
    const [editExercise, setEditExercise] = createSignal(false)
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

    const ctxAttrs = {
        getWorkouts: getWorkouts,
        getLastWorkoutSession: getLastWorkoutSession,
        getActiveSessions: getActiveSessions,
        addingWorkout: addingWorkout,
        setAddingWorkout: setAddingWorkout,
        newWorkoutName: newWorkoutName,
        setNewWorkoutName: setNewWorkoutName,
        editWorkout: editWorkout,
        setEditWorkout: setEditWorkout,
        deleteWorkout: deleteWorkout,
        setDeleteWorkout: setDeleteWorkout,
        startWorkout: startWorkout,
        setStartWorkout: setStartWorkout,
        lastWorkoutSession: lastWorkoutSession,
        setLastWorkSession: setLastWorkSession,
        activeSessions: activeSessions,
        setActiveSessions: setActiveSessions,
        workout: workout,
        setWorkout: setWorkout,
        exercises: exercises,
        setExercises: setExercises,
        addingExercise: addingExercise,
        setAddingExercise: setAddingExercise,
        newExerciseName: newExerciseName,
        setNewExerciseName: setNewExerciseName,
        newExerciseInfoUrl: newExerciseInfoUrl,
        setNewExerciseInfoUrl: setNewExerciseInfoUrl,
        savingExercise: savingExercise,
        setSavingExercise: setSavingExercise,
        deleteExercise: deleteExercise,
        setDeleteExercise: setDeleteExercise,
        exercise: exercise,
        setExercise: setExercise,
        workoutName: workoutName,
        setWorkoutName: setWorkoutName,
        editExercise: editExercise,
        setEditExercise: setEditExercise,
        sets: sets,
        setSets: setSets,
        addingSet: addingSet,
        setAddingSet: setAddingSet,
        setType: setType,
        setSetType: setSetType,
        durationMinMax: durationMinMax,
        setDurationMinMax: setDurationMinMax,
        newSetDurationMin: newSetDurationMin,
        setNewSetDurationMin: setNewSetDurationMin,
        newSetDurationMinDisplay: newSetDurationMinDisplay,
        setNewSetDurationMinDisplay: setNewSetDurationMinDisplay,
        newSetDurationMax: newSetDurationMax,
        setNewSetDurationMax: setNewSetDurationMax,
        newSetDurationMaxDisplay: newSetDurationMaxDisplay,
        setNewSetDurationMaxDisplay: setNewSetDurationMaxDisplay,
        repsMinMax: repsMinMax,
        setRepsMinMax: setRepsMinMax,
        newSetRepsMin: newSetRepsMin,
        setNewSetRepsMin: setNewSetRepsMin,
        newSetRepsMax: newSetRepsMax,
        setNewSetRepsMax: setNewSetRepsMax,
        deleteSet: deleteSet,
        setDeleteSet: setDeleteSet
    }

    return (
        <workoutsContext.Provider value={ctxAttrs}>
            <Outlet/>
        </workoutsContext.Provider>
    )
}
