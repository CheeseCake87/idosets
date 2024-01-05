import {createMemo, onMount, useContext} from "solid-js";
import {useLocation, useNavigate, useParams} from "@solidjs/router";
import {mainContext} from "../context/mainContext";

export default function Home() {

    const ctx = useContext(mainContext);
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const pathname = createMemo(() => location.pathname);

    console.log(pathname(), "Home.jsx")

    onMount(() => {
    })

    return (
        <div>
            <p>test {ctx.store.theme}</p>
            <button onClick={() => {
                ctx.setStore('theme', 'light')
            }}>light
            </button>
            <button onClick={() => {
                ctx.setStore('theme', 'dark')
            }}>dark
            </button>
        </div>
    );
};
