import * as Svelte from 'svelte'
import Container from './Container.svelte'
import { mount, unmount, updateProps, validateOptions } from './core/index.js'

const targetCache = new Set()
const componentCache = new Set()

/**
 * Customize how Svelte renders the component.
 *
 * @template {import('./component-types.js').Component} C
 * @typedef {import('./component-types.js').Props<C> | Partial<import('./component-types.js').MountOptions<C>>} SvelteComponentOptions
 */

/**
 * The rendered component and bound testing functions.
 *
 * @template {import('./component-types.js').Component} C
 */

/**
 * @TODO export this from @threlte/extras
 * @typedef {'click' | 'contextmenu' | 'dblclick' | 'wheel' | 'pointerup' | 'pointerdown' | 'pointerover' | 'pointerout' | 'pointerenter' | 'pointerleave' | 'pointermove' | 'pointermissed'} ThrelteEvents
 */

/**
 *
 * @param {import('./component-types.js').ComponentType<C>} component
 */
const cleanupComponent = (component) => {
  const inCache = componentCache.delete(component)

  if (inCache) {
    unmount(component)
  }
}

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
 *   frameInvalidated: boolean
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
 * @param {SvelteComponentOptions<C>} options - Customize how Svelte renders the component.
 * @param {{
 *   baseElement?: HTMLElement
 *   canvas?: HTMLCanvasElement
 * }} renderOptions
 * @returns {RenderResult<C, Q>} The rendered component and bound testing functions.
 */
export const render = (Component, options = {}, renderOptions = {}) => {
  const checkedOptions = validateOptions(options)

  /** @type {HTMLElement} */
  const baseElement =
    renderOptions.baseElement ??
    checkedOptions.target ??
    globalThis.document.body

  const defaultTarget = document.createElement('div')
  defaultTarget.style = 'width:200px;height:200px'

  /** @type {HTMLElement} */
  const target = checkedOptions.target ?? baseElement.appendChild(defaultTarget)

  targetCache.add(target)

  /** @type {HTMLCanvasElement} */
  const canvas = renderOptions.canvas ?? document.createElement('canvas')
  target.append(canvas)

  const component = mount(
    Container,
    {
      ...checkedOptions,
      props: {
        canvas,
        component: 'default' in Component ? Component.default : Component,
        ...checkedOptions.props,
      },
      target,
    },
    cleanupComponent
  )

  componentCache.add(component)

  /**
   * @type {import('@threlte/core').ThrelteContext<import('three').WebGLRenderer>}
   */
  const context = component.threlteContext

  const handlerCtx = component.$$
    ? [...component.$$.context.values()].find((ctx) => {
        return ctx.dispatchers || ctx.handlers
      })
    : component.interactivityContext

  const handlers = handlerCtx.dispatchers || handlerCtx.handlers

  return {
    baseElement,
    camera: context.camera,
    component: component.ref,
    container: target,
    context,
    get frameInvalidated() {
      // @ts-expect-error Not typed
      return context.frameInvalidated
    },
    scene: context.scene,

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
      updateProps(component, props)
      await Svelte.tick()
    },

    unmount: () => {
      cleanupComponent(component)
    },
  }
}

/**
 *
 * @param {HTMLElement} target
 */
const cleanupTarget = (target) => {
  const inCache = targetCache.delete(target)

  if (inCache && target.parentNode === document.body) {
    document.body.removeChild(target)
  }
}

export const cleanup = () => {
  componentCache.forEach(cleanupComponent)
  targetCache.forEach(cleanupTarget)
}

/**
 *
 * @param {((() => Promise<void>) | (() => void))=} fn
 * @returns {Promise<void>}
 */
export const act = async (fn) => {
  if (fn) {
    await fn()
  }
  return Svelte.tick()
}
