import {Show} from "solid-js";


export default function FinishSetReps(props) {
        // Used to provide the interface to input reps done

        const {exercise_id, set_id, reps, setReps, manualInput, setManualInput} = props

        return (
            <div className={'display-box flex-col gap-4 mt-2'}>

                <div className={'flex-reactive justify-center'}>

                    <Show when={manualInput()}
                          fallback={
                              <div className={'action-box-clickable flex-1'}
                                   onClick={() => {
                                       setManualInput(true)
                                       document.getElementById(
                                           exercise_id +
                                           '_set_reps_' +
                                           set_id
                                       ).focus()
                                   }}>
                                  <h1 className={'m-0'}>{
                                      reps() === 1
                                          ? reps() + ' rep'
                                          : reps() + ' reps'
                                  }</h1>
                              </div>
                          }>
                        <form className={'form-col'}
                              onSubmit={(e) =>
                                  e.preventDefault()
                              }>
                            <input
                                className={'flex-1'}
                                type="number"
                                step=".01"
                                id={
                                    exercise_id +
                                    '_set_reps_' +
                                    set_id
                                }
                                name="set_reps"
                                placeholder={'0'}
                                value={reps() === 0 ? '' : reps()}
                                onKeyUp={(e) =>
                                    setReps(parseInt(e.target.value))
                                }
                            />
                            <button
                                className={'button-good flex-1'}
                                type="button"
                                onClick={() => {
                                    setManualInput(false)
                                }}>
                                Done
                            </button>
                        </form>
                    </Show>

                </div>

                <div className={'flex-reactive'}>

                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                        <div className={'action-box-clickable flex-1'}
                             onClick={() => {
                                 setReps(reps() - 1)
                                 if (reps() < 0) {
                                     setReps(0)
                                 }
                             }}>
                            -1
                        </div>
                        <div className={'action-box-clickable flex-1'}
                             onClick={() => {
                                 setReps(reps() + 1)
                             }}>
                            +1
                        </div>
                    </div>

                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                        <div className={'action-box-clickable flex-1'}
                             onClick={() => {
                                 setReps(reps() - 5)
                                 if (reps() < 0) {
                                     setReps(0)
                                 }
                             }}>
                            -5
                        </div>
                        <div className={'action-box-clickable flex-1'}
                             onClick={() => {
                                 setReps(reps() + 5)
                             }}>
                            +5
                        </div>
                    </div>

                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                        <div className={'action-box-clickable flex-1'}
                             onClick={() => {
                                 setReps(reps() - 10)
                                 if (reps() < 0) {
                                     setReps(0)
                                 }
                             }}>
                            -10
                        </div>
                        <div className={'action-box-clickable flex-1'}
                             onClick={() => {
                                 setReps(reps() + 10)
                             }}>
                            +10
                        </div>
                    </div>

                </div>
                <div className={'flex-reverse-reactive gap-2'}>
                    <div
                        className={'action-box-clickable flex-1 items-center'}
                        onClick={() => {
                            setReps(0)
                        }}>
                        Reset
                    </div>
                </div>

            </div>
        )
    }