import {createResource} from "solid-js";


export default class Fetcher {
    data;
    refetch;
    mutate;

    constructor(fetcher, args) {
        console.log("Fetcher", fetcher, args)
        let [
            data, {refetch, mutate}
        ] = createResource(fetcher);
        this.data = data
        this.refetch = refetch
        this.mutate = mutate
    }

    get(key) {
        if (typeof this.data() === "object") {
            return this.data()[key]
        }
        return null
    }
}
