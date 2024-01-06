import {useContext} from "solid-js";
import {mainContext} from "../context/mainContext";
import {useNavigate} from "@solidjs/router";

export default function TopMenu(props) {

    const ctx = useContext(mainContext);
    const navigate = useNavigate();

    return (
        <nav>
            <p>test.email@...</p>
            <button onClick={
                () => {
                    ctx.store.tryLogout().then(json => {
                        if (json.status === 'success') {
                            navigate('/login')
                        }
                    })
                }
            }>
                Logout
            </button>
        </nav>
    )

}
