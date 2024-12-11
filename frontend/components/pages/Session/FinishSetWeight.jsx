import {Show} from "solid-js";


export default function FinishSetWeight(props) {
        // Used to provide the interface to input weight done

        const {exercise_id, set_id, weight, setWeight, manualInput, setManualInput} = props

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
                                           '_set_weight_' +
                                           set_id
                                       ).focus()
                                   }}>
                                  <h1 className={'m-0'}>{
                                      weight() === 1
                                          ? weight() + ' kg'
                                          : weight() + ' kgs'
                                  }</h1>
                              </div>
                          }>
                        <form className={'form-col'}
                              onSubmit={(e) => {
                                  e.preventDefault()
                              }}>
                            <input
                                className={'flex-1'}
                                type="number"
                                step=".01"
                                id={
                                    exercise_id +
                                    '_set_weight_' +
                                    set_id
                                }
                                name="set_weight"
                                placeholder={'0'}
                                value={weight() === 0 ? '' : weight()}
                                onKeyUp={(e) => {
                                    setWeight(parseFloat(e.target.value))
                                }}
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
                                 setWeight(weight() - 0.25)
                                 if (weight() < 0) {
                                     setWeight(0)
                                 }
                             }}>
                            -&nbsp;<small className={'pt-0.5'}>0.25</small>&nbsp;kg
                        </div>
                        <div className={'action-box-clickable flex-1'}
                             onClick={() => {
                                 setWeight(weight() + 0.25)
                             }}>
                            +&nbsp;<small className={'pt-0.5'}>0.25</small>&nbsp;kg
                        </div>
                    </div>

                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                        <div className={'action-box-clickable flex-1'}
                             onClick={() => {
                                 setWeight(weight() - 1)
                                 if (weight() < 0) {
                                     setWeight(0)
                                 }
                             }}>
                            -1 kg
                        </div>
                        <div className={'action-box-clickable flex-1'}
                             onClick={() => {
                                 setWeight(weight() + 1)
                             }}>
                            +1 kg
                        </div>
                    </div>

                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                        <div className={'action-box-clickable flex-1'}
                             onClick={() => {
                                 setWeight(weight() - 5)
                                 if (weight() < 0) {
                                     setWeight(0)
                                 }
                             }}>
                            -5 kgs
                        </div>
                        <div className={'action-box-clickable flex-1'}
                             onClick={() => {
                                 setWeight(weight() + 5)
                             }}>
                            +5 kgs
                        </div>
                    </div>

                    <div className={'flex-reactive-reverse flex-1 gap-1'}>
                        <div className={'action-box-clickable flex-1'}
                             onClick={() => {
                                 setWeight(weight() - 10)
                                 if (weight() < 0) {
                                     setWeight(0)
                                 }
                             }}>
                            -10 kgs
                        </div>
                        <div className={'action-box-clickable flex-1'}
                             onClick={() => {
                                 setWeight(weight() + 10)
                             }}>
                            +10 kgs
                        </div>
                    </div>

                </div>
                <div className={'flex-reverse-reactive gap-2'}>
                    <div
                        className={'action-box-clickable flex-1 items-center'}
                        onClick={() => {
                            setWeight(0.0)
                        }}>
                        Reset
                    </div>
                    <div
                        className={'action-box-clickable flex-1 items-center'}
                        onClick={() => {
                            setWeight(weight() * 2)
                        }}>
                        Double
                    </div>
                </div>
            </div>
        )
    }