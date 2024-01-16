import {createEffect, createSignal, For, Show, useContext} from "solid-js";
import {useNavigate} from "@solidjs/router";
import {mainContext} from "../context/mainContext";
import TopMenu from "../components/TopMenu";
import Loading from "../components/Loading";
import Fetcher from "../utilities/fetcher";


export default function Account() {

    const [ctx, setCtx] = useContext(mainContext);
    const navigate = useNavigate();

    const account = new Fetcher({account_id: ctx.account_id}, ctx.getAccount)

    function Page() {
        return (
            <div className={"container"}>

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
