<script lang="ts">
	import type { Mesh } from 'three'
	import { T, useTask } from '@threlte/core'

	export let onClick: () => void

	let ref: Mesh

	useTask((dt) => {
		ref.rotation.x += dt
		ref.rotation.y += dt
	})
</script>

<T.PerspectiveCamera
	makeDefault
	position={[1, 1, 1]}
	on:create={({ ref }) => ref.lookAt(0, 0, 0)}
/>

<T.DirectionalLight />
<T.AmbientLight />

<T.Mesh bind:ref on:click={onClick}>
	<T.MeshStandardMaterial />
	<T.BoxGeometry />
</T.Mesh>
