<script lang="ts">
  import { useTask, useThrelte } from '@threlte/core'

  interface Props {
    autoStart: boolean
    autoInvalidate: boolean
    prop1?: number
    prop2?: number
  }

  let { autoStart, autoInvalidate, prop1 = 0, prop2 = 0 }: Props = $props()

  const { invalidate } = useThrelte()

  useTask(() => {}, { autoStart, autoInvalidate })

  $effect.pre(() => {
    prop1
  })

  $effect.pre(() => {
    prop2
    invalidate()
  })
</script>
