<script lang="ts">
	import { T } from '@threlte/core'
	import { interactivity } from '@threlte/extras'
	import type { Vector3Tuple } from 'three'

	let positions: Vector3Tuple[] = [[0, 0, -1]]

	const context = interactivity()
	context.raycaster.near = 1
	context.raycaster.far = 10

	const spawnCube = () => {
		positions = [...positions, [0, 0, positions.at(-1)?.[2] ?? 0 - 1]]
	}
</script>

{#each positions as position}
	<T.Mesh on:click={() => spawnCube()} scale={0.2} {position}>
		<T.BoxGeometry />
	</T.Mesh>
{/each}
