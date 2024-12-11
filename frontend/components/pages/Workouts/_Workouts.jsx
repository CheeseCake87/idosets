import {createEffect, useContext} from 'solid-js'
import {useNavigate} from '@solidjs/router'
import TopMenu from '../../globals/TopMenu'
import {Loading} from '../../globals/Loading'
import {workoutsContext} from "../../../contextManagers/workoutsContext";
import LastWorkoutSession from "./LastWorkoutSession";
import LoopWorkouts from "./LoopWorkouts";
import AddWorkout from "./AddWorkout";
import {mainContext} from "../../../contextManagers/mainContext";

export default function _Workouts() {
    const ctxMain = useContext(mainContext)
    const ctxWorkouts = useContext(workoutsContext)

    createEffect(() => {
        if (!ctxWorkouts.getWorkouts.data.loading) {
            if (ctxWorkouts.getWorkouts.data().status === 'unauthorized') {
                ctxMain.navigate('/login')
            }
        }
    })

    createEffect(() => {
        if (!ctxWorkouts.getLastWorkoutSession.data.loading) {
            if (ctxWorkouts.getLastWorkoutSession.get('status') === 'success') {
                ctxWorkouts.setLastWorkSession(ctxWorkouts.getLastWorkoutSession.get('last_workout_session'))
            }
        }
    })

    createEffect(() => {
        if (!ctxWorkouts.getActiveSessions.data.loading) {
            if (ctxWorkouts.getActiveSessions.get('status') === 'success') {
                ctxWorkouts.setActiveSessions(ctxWorkouts.getActiveSessions.get('active_sessions'))
            }
        }
    })

    function Page() {
        return (
            <div className={'container'}>
                <div className={'pb-4 flex flex-col gap-2'}>
                    <LastWorkoutSession/>
                </div>
                <div className={'pb-4 flex flex-col gap-2'}>
                    <small className={'px-2'}>Workouts</small>
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
                ctxWorkouts.getWorkouts.data.loading
                    ? <div className={'pt-10'}><Loading/></div>
                    : <Page/>
            }
        </>
    )
};
