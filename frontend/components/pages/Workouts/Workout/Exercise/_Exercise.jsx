import {createEffect, useContext} from 'solid-js'
import {useNavigate, useParams} from '@solidjs/router'
import {mainContext} from '../../../../../contextManagers/mainContext'
import TopMenu from '../../../../globals/TopMenu'
import {Loading} from '../../../../globals/Loading'
import Fetcher from '../../../../../utilities/fetcher'
import {workoutsContext} from "../../../../../contextManagers/workoutsContext";
import WorkoutDisplay from "./WorkoutDisplay";
import ExerciseDisplay from "./ExerciseDisplay";
import EditExercise from "./EditExercise";
import LoopSets from "./LoopSets";
import AddSet from "./AddSet";

export default function _Exercise() {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)
    const params = useParams()

    const exerciseFetcher = new Fetcher(
        {workout_id: params.workout_id, exercise_id: params.exercise_id},
        ctxMain.getExercise
    )

    createEffect(() => {
        if (exerciseFetcher.data.loading === false) {
            if (exerciseFetcher.data().status === 'unauthorized') {
                ctxMain.navigate('/login')
            }
            if (exerciseFetcher.get('Exercises').length === 0) {
                ctxMain.navigate('/workouts')
            } else {
                ctxWorkouts.setExercise(exerciseFetcher.get('Exercises')[0])
                ctxWorkouts.setWorkoutName(exerciseFetcher.get('Workouts')[0].name)
                ctxWorkouts.setNewExerciseName(ctxWorkouts.exercise().name)
                ctxWorkouts.setNewExerciseInfoUrl(ctxWorkouts.exercise().info_url)
                ctxWorkouts.setSets(exerciseFetcher.get('Sets'))
                ctxWorkouts.setNewSetDurationMinDisplay(ctxMain.fancyTimeFormat(ctxWorkouts.newSetDurationMin()))
                ctxWorkouts.setNewSetDurationMaxDisplay(ctxMain.fancyTimeFormat(ctxWorkouts.newSetDurationMax()))
            }
        }
    })

    createEffect(() => {
        if (ctxWorkouts.newSetDurationMin() < 0) {
            ctxWorkouts.setNewSetDurationMin(0)
        } else {
            ctxWorkouts.setNewSetDurationMinDisplay(
                ctxMain.fancyTimeFormat(ctxWorkouts.newSetDurationMin())
            )
        }
    })

    createEffect(() => {
        if (ctxWorkouts.newSetDurationMax() > 0) {
            ctxWorkouts.setNewSetDurationMaxDisplay(ctxMain.fancyTimeFormat(ctxWorkouts.newSetDurationMax()))
        }
    })

    function Page() {
        return (
            <div className={'container'}>
                <WorkoutDisplay/>
                <ExerciseDisplay/>
                <EditExercise exerciseFetcher={exerciseFetcher}/>
                <div className={'py-4 flex flex-col gap-2'}>
                    <small className={'px-2'}>Sets</small>
                    <LoopSets exerciseFetcher={exerciseFetcher}/>
                </div>
                <AddSet exerciseFetcher={exerciseFetcher}/>
            </div>
        )
    }

    return (
        <>
            <TopMenu/>
            {exerciseFetcher.data.loading ? <div className={'pt-10'}><Loading/></div> : <Page/>}
        </>
    )
};
