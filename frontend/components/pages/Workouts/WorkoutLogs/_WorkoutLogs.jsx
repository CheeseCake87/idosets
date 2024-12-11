import {createEffect, createSignal, useContext} from 'solid-js'
import {useNavigate, useParams} from '@solidjs/router'
import {mainContext} from '../../../../contextManagers/mainContext'
import TopMenu from '../../../globals/TopMenu'
import {Loading} from '../../../globals/Loading'
import WorkoutDisplay from "./WorkoutDisplay";
import LoopExercises from "./LoopExercises";
import Fetcher from "../../../../utilities/fetcher";
import {workoutsContext} from "../../../../contextManagers/workoutsContext";

export default function _WorkoutLogs() {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)
    const params = useParams()

    const workoutLogsFetcher = new Fetcher(
        {workout_id: params.workout_id},
        ctxMain.getWorkoutLogs
    )

    createEffect(() => {
        if (workoutLogsFetcher.data.loading === false) {
            if (workoutLogsFetcher.data().status === 'unauthorized') {
                ctxMain.navigate('/login')
            }
            ctxWorkouts.setWorkoutName(workoutLogsFetcher.get('name'))
            ctxWorkouts.setExercises(workoutLogsFetcher.get('Exercises'))
        }
    })

    return (
        <>
            <TopMenu/>
            {
                workoutLogsFetcher.data.loading
                    ?
                    <div className={'pt-10'}><Loading/></div>
                    :
                    <div className={'container'}>
                        <WorkoutDisplay/>

                        <div className={'py-4 flex flex-col gap-2'}>
                            <small className={'px-2'}>Exercise Progress</small>
                            <LoopExercises/>
                        </div>

                    </div>
            }
        </>
    )
};
