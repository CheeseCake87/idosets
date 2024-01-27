import {createSignal, Show, useContext} from "solid-js";
import {mainContext} from "../context/mainContext";
import TopMenu from "../components/TopMenu";
import {Loading} from "../components/Loading";
import Fetcher from "../utilities/fetcher";


export default function Account() {

    const [ctx, setCtx] = useContext(mainContext);

    const [deleteAccount, setDeleteAccount] = createSignal(false)
    const [deleteEmailSent, setDeleteEmailSent] = createSignal(false)
    const [deleteEmailError, setDeleteErrorSent] = createSignal(false)

    const account = new Fetcher(
        {account_id: ctx.account_id},
        ctx.getAccount
    )

    function Page() {
        return (
            <div className={"container"}>
                <div className={"display-box flex-col gap-2 mb-2"}>
                    <p className={'font-bold mb-2'}>Account</p>
                    <p>
                        <span className={'opacity-80'}>Email Address: </span>
                        {account.get("email_address")}
                    </p>
                    <p>
                        <span className={'opacity-80'}>Total Workouts: </span>
                        {account.get("total_workouts")}
                    </p>
                    <p>
                        <span className={'opacity-80'}>Total Exercises: </span>
                        {account.get("total_exercises")}
                    </p>
                    <p>
                        <span className={'opacity-80'}>Total Sets: </span>
                        {account.get("total_sets")}
                    </p>
                </div>

                <div className={"display-box flex-col gap-2 mb-2"}>
                    <p className={'font-bold mb-2'}>Change Theme</p>
                    <div>
                        <Show when={ctx.theme === 'dark'}>
                            <button
                                className={"flex rounded-full"}
                                onClick={() => {
                                    ctx.setTheme('light').then(json => {
                                        location.reload()
                                    })
                                }}
                            >
                                <span className="material-icons-round">light_mode</span>
                            </button>
                        </Show>

                        <Show when={ctx.theme === 'light'}>
                            <button
                                className={"flex rounded-full"}
                                onClick={() => {
                                    ctx.setTheme('dark').then(json => {
                                        location.reload()
                                    })
                                }}>
                                <span className="material-icons-round">dark_mode</span>
                            </button>
                        </Show>
                    </div>
                </div>

                <div className={"display-box warning flex-col gap-2 mb-2"}>
                    <Show when={!deleteEmailError() && !deleteEmailSent()}>
                        <Show when={deleteAccount()}
                              children={
                                  <div className={"display-box no-bg flex-col text-center gap-6"}>

                                      <p className={"opacity-90"}>
                                          Are you sure you want to delete your account?
                                      </p>

                                      <div className={"flex gap-2"}>
                                          <button className={"button-bad flex-1"}
                                                  onClick={() => {
                                                      ctx.sendDeleteAccountAuth().then(json => {
                                                          if (json.status === 'success') {
                                                              setDeleteEmailSent(true)
                                                          } else {
                                                              setDeleteErrorSent(true)
                                                          }
                                                      })
                                                  }}>
                                              Delete Account
                                          </button>
                                          <button className={"flex-1"}
                                                  onClick={() => {
                                                      setDeleteAccount(false)
                                                  }}>
                                              Cancel
                                          </button>
                                      </div>
                                  </div>
                              }
                              fallback={
                                  <button className={"button-bad"} onClick={() => setDeleteAccount(true)}>
                                      Delete Account
                                  </button>
                              }/>
                    </Show>
                    <Show when={deleteEmailSent()}
                          children={
                              <div className={"display-box no-bg flex-col text-center gap-6"}>
                                  <p className={"opacity-90"}>
                                      An email has been sent to your email address with a link to delete your account.
                                  </p>
                              </div>
                          }/>
                    <Show when={deleteEmailError()}
                          children={
                              <div className={"display-box no-bg flex-col text-center gap-6"}>
                                  <p className={"opacity-90"}>
                                      There was an error sending your delete account email.
                                  </p>
                              </div>
                          }/>
                </div>
            </div>
        )
    }

    return (
        <>
            <TopMenu/>
            {account.data.loading ? <div className={"pt-10"}><Loading/></div> : <Page/>}
        </>
    );
};




