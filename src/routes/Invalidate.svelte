<script lang="ts">
  import { useTask, useThrelte } from '@threlte/core'

  interface Props {
    autoStart: boolean
    autoInvalidate: boolean
    prop1?: number
  }

  let { autoStart, autoInvalidate, prop1 }: Props = $props()

  const { invalidate } = useThrelte()

  useTask(() => {}, { autoStart, autoInvalidate })

  $effect.pre(() => {
    if (prop1) {
      invalidate()
    }
  })
</script>
