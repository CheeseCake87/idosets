import {createEffect, createSignal, useContext} from "solid-js";
import {useNavigate} from "@solidjs/router";
import {mainContext} from "../context/mainContext";
import TopMenu from "../components/TopMenu";
import Loading from "../components/Loading";
import Fetcher from "../utilities/fetcher";

export default function Sessions() {

    const [ctx, setCtx] = useContext(mainContext);
    const navigate = useNavigate();

    const sessions = new Fetcher(ctx.getSessions)

    const [_workout, _setWorkout] = createSignal({})

    createEffect(() => {
        if (sessions.data.loading === false) {

        }
    })

    function Page() {
        return (
            <div className={"container"}>
            </div>
        )
    }

    return (
        <>
            <TopMenu/>
            {sessions.data.loading ? <div className={"pt-10"}><Loading/></div> : <Page/>}
        </>
    );
};
