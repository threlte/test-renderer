import * as Svelte from 'svelte'

import { cleanup } from './cleanup.js'
import Container from './Container.svelte'
import { mount } from './mount.js'
import { setup } from './setup.js'

/**
 * @TODO export this from @threlte/extras
 * @typedef {'click' | 'contextmenu' | 'dblclick' | 'wheel' | 'pointerup' | 'pointerdown' | 'pointerover' | 'pointerout' | 'pointerenter' | 'pointerleave' | 'pointermove' | 'pointermissed'} ThrelteEvents
 */

/**
 * The rendered component and bound testing functions.
 *
 * @template {import('./component-types.js').Component} C
 * @template {import('@testing-library/dom').Queries} [Q=typeof import('@testing-library/dom').queries]
 *
 * @typedef {{
 *   container: HTMLElement
 *   baseElement: HTMLElement
 *   camera: import('@threlte/core').CurrentWritable<import('three').Camera>
 *   scene: import('three').Scene
 *   context: import('@threlte/core').ThrelteContext<import('three').WebGLRenderer>
 *   component: import('./component-types.js').Exports<C>
 *   fireEvent(object3D: import('three').Object3D, event: ThrelteEvents, payload?: import('@threlte/extras').IntersectionEvent<ThrelteEvents>): Promise<void>
 *   advance: (options?: { count?: number; delta?: number }) => ({ frameInvalidated: boolean })
 *   rerender: (props?: Partial<import('./component-types.js').Props<C>>) => Promise<void>
 *   unmount: () => void
 * }} RenderResult
 */

/**
 * Render a component into the document.
 *
 * @template {import('./component-types.js').Component} C
 * @template {import('@testing-library/dom').Queries} [Q=typeof import('@testing-library/dom').queries]
 *
 * @param {import('./component-types.js').ComponentType<C>} Component - The component to render.
 * @param {import('./component-types.js').Props<C> | Partial<import('./component-types.js').MountOptions<C>>} options - Customize how Svelte renders the component.
 * @param {{
 *   baseElement?: HTMLElement
 *   canvas?: HTMLCanvasElement
 *   context?: Record<string, any>
 * }} renderOptions
 * @returns {RenderResult<C, Q>} The rendered component and bound testing functions.
 */
const render = (Component, options = {}, renderOptions = {}) => {
  const { baseElement, container, canvas, mountOptions } = setup(
    options,
    renderOptions
  )

  const { component, unmount, rerender } = mount(Container, {
    ...mountOptions,
    props: {
      canvas,
      container,
      component: 'default' in Component ? Component.default : Component,
      contextOptions: renderOptions.context,
      ...mountOptions.props,
    },
  })

  const handlers = component.interactivityContext.handlers

  return {
    baseElement,
    camera: component.context.camera,
    component: component.ref,
    container,
    context: component.context,
    scene: component.context.scene,
    advance: component.advance,

    fireEvent: async (object3D, event, payload) => {
      const eventDispatcher = handlers.get(object3D)

      if (typeof eventDispatcher === 'function') {
        eventDispatcher(event, payload)
      } else {
        eventDispatcher[`on${event}`](payload)
      }

      await Svelte.tick()
    },

    rerender: async (props = {}) => {
      rerender(props)
      await Svelte.tick()
    },

    unmount,
  }
}

/**
 * Call a function and wait for Svelte to flush pending changes.
 *
 * @param {((() => Promise<void>) | (() => void))=} fn
 * @returns {Promise<void>}
 */
const act = async (fn) => {
  if (fn) {
    await fn()
  }
  return Svelte.tick()
}

export { act, cleanup, render }
