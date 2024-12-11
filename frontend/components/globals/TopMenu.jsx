import { Show, useContext } from 'solid-js'
import { mainContext } from '../../contextManagers/mainContext'
import { A, useLocation, useNavigate } from '@solidjs/router'

export default function TopMenu (props) {
  const ctxMain = useContext(mainContext)
  const navigate = useNavigate()
  const location = useLocation()

  return (
        <nav className={'sticky top-0 z-40'}>
            <A href={'/workouts'}>
                <h3 className={'my-0'}>💪 I Do Sets
                    <Show when={!ctxMain.connection()}>
                        &nbsp;
                        <span style={'font-size: 18px'} className={'material-icons-round px-1 flashing-warning-color'}>
                                signal_wifi_off
                            </span>
                    </Show>
                </h3>
            </A>
            <div className={'flex gap-4'}>
                <Show when={location.pathname.includes('/account')}
                      children={
                          <button onClick={
                              () => {
                                navigate('/workouts')
                              }
                          }>
                              <span className={'desktop-block'}>Workouts</span>
                              <span className={'mobile-flex'}>
                            <span className="material-icons-round">fitness_center</span>
                            </span>
                          </button>
                      }
                      fallback={
                          <button onClick={
                              () => {
                                navigate('/account')
                              }
                          }>
                              <span className={'desktop-block'}>Account</span>
                              <span className={'mobile-flex'}>
                            <span className="material-icons-round">person</span>
                            </span>
                          </button>
                      }
                />
                <button onClick={
                    () => {
                      ctxMain.tryLogout().then(json => {
                        if (json.status === 'success') {
                          ctxMain.setLoggedIn(false)
                          ctxMain.setTheme('dark')
                          ctxMain.setUnits('kgs')
                          ctxMain.setAccountId(0)
                          ctxMain.setEmailAddress('')
                          window.location.href = '/login'
                        }
                      })
                    }
                }>
                    <span className={'desktop-block'}>Logout</span>
                    <span className={'mobile-flex'}>
                    <span className="material-icons-round">logout</span>
                </span>
                </button>
            </div>
        </nav>
  )
}
