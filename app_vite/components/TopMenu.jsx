import {useContext} from "solid-js";
import {useLocation} from "@solidjs/router";
import {mainContext} from "../context/mainContext";

export default function TopMenu(props) {

    const ctx = useContext(mainContext);
    const location = useLocation();

    console.log(location.pathname)

    if (location.pathname === '/login') {
        ctx.store
    }

    return (
        <nav style={}>
            <p>test</p>
        </nav>
    )
}
