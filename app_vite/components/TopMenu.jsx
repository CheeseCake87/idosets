import {Show, useContext} from "solid-js";
import {mainContext} from "../context/mainContext";
import {A, useLocation, useNavigate} from "@solidjs/router";

export default function TopMenu(props) {

    const [ctx, setCtx, connection] = useContext(mainContext);
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <nav>
                <A href={'/workouts'}>
                    <h3 className={"my-0"}>💪 I Do Sets</h3>
                </A>
                <div className={'flex gap-4'}>

                    <Show when={location.pathname.includes("/account")}
                          children={
                              <button onClick={
                                  () => {
                                      navigate('/workouts')
                                  }
                              }>
                                  <span className={"desktop-block"}>Workouts</span>
                                  <span className={"mobile-flex"}>
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
                                  <span className={"desktop-block"}>Account</span>
                                  <span className={"mobile-flex"}>
                            <span className="material-icons-round">person</span>
                            </span>
                              </button>
                          }
                    />

                    <button onClick={
                        () => {
                            ctx.tryLogout().then(json => {
                                if (json.status === 'success') {
                                    setCtx('logged_in', false);
                                    setCtx('theme', 'dark');
                                    setCtx('units', 'kgs');
                                    setCtx('account_id', 0);
                                    setCtx('email_address', '');
                                    window.location.href = '/login'
                                }
                            })
                        }
                    }>
                        <span className={"desktop-block"}>Logout</span>
                        <span className={"mobile-flex"}>
                    <span className="material-icons-round">logout</span>
                </span>
                    </button>
                </div>
            </nav>
            <Show when={!connection()}>
                <p>Not connected</p>
            </Show>
        </>
    )

}

