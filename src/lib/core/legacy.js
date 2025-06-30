/**
 * Legacy rendering core for svelte-testing-library.
 *
 * Supports Svelte <= 4.
 */

/** Allowed options for the component constructor. */
const allowedOptions = [
  'target',
  'accessors',
  'anchor',
  'props',
  'hydrate',
  'intro',
  'context',
]

/**
 * Mount the component into the DOM.
 *
 * The `onDestroy` callback is included for strict backwards compatibility
 * with previous versions of this library. It's mostly unnecessary logic.
 *
 * @param {*} Component
 * @param {*} options
 * @param {*} onDestroy
 * @returns
 */
const mount = (Component, options, onDestroy) => {
  const component = new Component(options)

  if (typeof onDestroy === 'function') {
    component.$$.on_destroy.push(() => {
      onDestroy(component)
    })
  }

  return component
}

/**
 * Remove the component from the DOM.
 *
 * @param {*} component
 */
const unmount = (component) => {
  component.$destroy()
}

/**
 * Update the component's props.
 *
 * @param {*} component
 * @param {*} nextProps
 */
const updateProps = (component, nextProps) => {
  component.$set(nextProps)
}

export { allowedOptions, mount, unmount, updateProps }
