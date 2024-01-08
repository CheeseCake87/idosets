import {createResource} from "solid-js";


export default class Fetcher {
    data;
    refetch;
    mutate;

    constructor(fetcher) {
        let [
            data, {refetch, mutate}
        ] = createResource(fetcher);
        this.data = data
        this.refetch = refetch
        this.mutate = mutate
    }
}
