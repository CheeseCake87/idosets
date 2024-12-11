import {createEffect, createSignal, useContext} from "solid-js";
import {mainContext} from "../../../contextManagers/mainContext";


export default function FinishSetDuration(props) {
    const ctxMain = useContext(mainContext)

    // Used to provide the interface to input duration done

    const {duration, setDuration} = props
    const [durationDisplay, setDurationDisplay] = createSignal(ctxMain.fancyTimeFormat(duration()))

    createEffect(() => {
        if (duration() < 0) {
            setDuration(0)
        } else {
            setDurationDisplay(
                ctxMain.fancyTimeFormat(duration())
            )
        }
    })

    return (
        <div className={'display-box flex-col gap-4 mt-2'}>
            <div className={'text-center p-4'}>
                <h1>{durationDisplay()}</h1>
            </div>
            <div className={'flex-reactive'}>
                <div
                    className={'action-box-clickable flex-1 items-center'}
                    onClick={() => {
                        setDuration(0)
                    }}>
                    Reset
                </div>
                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                    <div className={'action-box-clickable flex-1'}
                         onClick={() => {
                             if (duration() < 0) {
                                 setDuration(0)
                             } else {
                                 setDuration(duration() - 5)
                             }
                         }}>
                        -5 secs
                    </div>
                    <div className={'action-box-clickable flex-1'}
                         onClick={() => {
                             setDuration(duration() + 5)
                         }}>
                        +5 secs
                    </div>

                </div>
                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                    <div className={'action-box-clickable flex-1'}
                         onClick={() => {
                             if (duration() < 0) {
                                 setDuration(0)
                             } else {
                                 setDuration(duration() - 30)
                             }
                         }}>
                        -30 secs
                    </div>
                    <div className={'action-box-clickable flex-1'}
                         onClick={() => {
                             setDuration(duration() + 30)
                         }}>
                        +30 secs
                    </div>
                </div>
                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                    <div className={'action-box-clickable flex-1'}
                         onClick={() => {
                             if (duration() < 0) {
                                 setDuration(0)
                             } else {
                                 setDuration(duration() - 60)
                             }
                         }}>
                        -1 mins
                    </div>
                    <div className={'action-box-clickable flex-1'}
                         onClick={() => {
                             setDuration(duration() + 60)
                         }}>
                        +1 mins
                    </div>

                </div>
                <div className={'flex-reactive-reverse flex-1 gap-1'}>
                    <div className={'action-box-clickable flex-1'}
                         onClick={() => {
                             if (duration() < 0) {
                                 setDuration(0)
                             } else {
                                 setDuration(duration() - 600)
                             }
                         }}>
                        -10 mins
                    </div>
                    <div className={'action-box-clickable flex-1'}
                         onClick={() => {
                             setDuration(duration() + 600)
                         }}>
                        +10 mins
                    </div>

                </div>
            </div>
        </div>
    )
}