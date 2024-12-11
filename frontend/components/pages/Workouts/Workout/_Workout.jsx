import {createEffect, useContext} from 'solid-js'
import {useNavigate, useParams} from '@solidjs/router'
import {mainContext} from '../../../../contextManagers/mainContext'
import TopMenu from '../../../globals/TopMenu'
import {Loading} from '../../../globals/Loading'
import Fetcher from '../../../../utilities/fetcher'
import {workoutsContext} from "../../../../contextManagers/workoutsContext";
import WorkoutDisplay from "./WorkoutDisplay";
import EditWorkout from "./EditWorkout";
import LoopExercises from "./LoopExercises";
import AddExercise from "./AddExercise";

export default function _Workout() {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)
    const params = useParams()

    const workoutFetcher = new Fetcher(
        {workout_id: params.workout_id},
        ctxMain.getWorkout
    )

    createEffect(() => {
        if (workoutFetcher.data.loading === false) {
            if (workoutFetcher.data().status === 'unauthorized') {
                ctxMain.navigate('/login')
            }
            if (workoutFetcher.get('Workouts').length === 0) {
                ctxMain.navigate('/workouts')
            } else {
                ctxWorkouts.setWorkout(workoutFetcher.get('Workouts')[0])
                ctxWorkouts.setNewWorkoutName(ctxWorkouts.workout().name)
                ctxWorkouts.setExercises(workoutFetcher.get('Exercises'))
            }
        }
    })


    function Page() {
        return (
            <div className={'container'}>

                <WorkoutDisplay/>
                <EditWorkout workoutFetcher={workoutFetcher}/>

                <div className={'py-4 flex flex-col gap-2'}>
                    <small className={'px-2'}>Exercises</small>
                    <LoopExercises workoutFetcher={workoutFetcher}/>
                </div>

                <AddExercise/>
            </div>
        )
    }

    return (
        <>
            <TopMenu/>
            {workoutFetcher.data.loading ? <div className={'pt-10'}><Loading/></div> : <Page/>}
        </>
    )
};
