<script>
	import { useTask, useThrelte } from '@threlte/core'

	export let autoStart = false
	export let autoInvalidate = true

	export let prop1 = 0
	export let prop2 = 0

	const { invalidate } = useThrelte()

	useTask(() => {}, { autoStart, autoInvalidate })

	$: {
		prop1
	}

	$: {
		prop2
		invalidate()
	}
</script>
