import {createEffect, createSignal, For, Show, useContext} from "solid-js";
import {useNavigate} from "@solidjs/router";
import {mainContext} from "../context/mainContext";
import TopMenu from "../components/TopMenu";
import Loading from "../components/Loading";
import Fetcher from "../utilities/fetcher";


export default function Account() {

    const [ctx, setCtx] = useContext(mainContext);
    const navigate = useNavigate();

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

                <div className={"display-box flex-col gap-2"}>
                    <p className={'font-bold mb-2'}>Change Theme</p>
                    <div>
                        <Show when={ctx.theme === 'dark'}>
                            <button
                                className={"flex rounded-full"}
                                onClick={() => {
                                    ctx.setTheme('light').then(json => {
                                        setCtx('theme', json.theme)
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
                                        setCtx('theme', json.theme)
                                    })
                                }}
                            >
                                <span className="material-icons-round">dark_mode</span>
                            </button>
                        </Show>
                    </div>
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




