import { createResource } from 'solid-js'

export default class Fetcher {
  data
  refetch
  mutate

  constructor (source, fetcher) {
    if (typeof source === 'function') {
      const [
        data, { refetch, mutate }
      ] = createResource(source)
      this.data = data
      this.refetch = refetch
      this.mutate = mutate
    } else {
      const [
        data, { refetch, mutate }
      ] = createResource(source, fetcher)
      this.data = data
      this.refetch = refetch
      this.mutate = mutate
    }
  }

  get (key) {
    if (typeof this.data() === 'object') {
      return this.data()[key]
    }
    return null
  }
}
