const ELEMENT_TYPE = {
    TEXT: 'TEXT',
}

const work = {
    type: 'div',
    props: {
        id: 'app',
        children: [
            {
                type: ELEMENT_TYPE.TEXT,
                props: {
                    nodeValue: 'app',
                    children: [],
                },
            },
        ],
    },
}

const createTextNode = (text) => {
    return {
        type: ELEMENT_TYPE.TEXT,
        props: {
            nodeValue: text,
            children: [],
        },
    }
}

const createElement = (type, props, ...children) => {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                const isTextNode = typeof child === 'string' || typeof child === 'number'
                return isTextNode ? createTextNode(child) : child
            }),
        },
    }
}

function render(el, container) {
    workInProgressRoot = {
        dom: container,
        props: {
            children: [el],
        },
    }

    nextWorkOfUnit = workInProgressRoot
}

let workInProgressRoot = null
let currentRoot = null
let nextWorkOfUnit = null
function workLoop(deadline) {
    let shouldYield = false

    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
        shouldYield = deadline.timeRemaining() < 1
    }

    if (!nextWorkOfUnit && workInProgressRoot) {
        commitRoot()
    }
    requestIdleCallback(workLoop)
}

function commitRoot() {
    commitWork(workInProgressRoot.child)
    currentRoot = workInProgressRoot
    workInProgressRoot = null
}

function commitWork(fiber) {
    if (!fiber) return

    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }

    if (fiber.effectTag === 'update') {
        updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
    } else if (fiber.effectTag === 'placement') {
        if (fiber.dom) {
            fiberParent.dom.append(fiber.dom)
        }
    }

    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

requestIdleCallback(workLoop)

function createDom(type) {
    return type === ELEMENT_TYPE.TEXT ? document.createTextNode('') : document.createElement(work.type)
}

function updateProps(dom, nextProps, prevProps) {
    // Object.entries(props).forEach(([k, v]) => {
    //     if (k !== 'children') {
    //         if (k.startsWith('on')) {
    //             const eventType = k.slice(2).toLowerCase()
    //             dom.addEventListener(eventType, v)
    //         } else {
    //             dom[k] = v
    //         }
    //     }
    // })
    Object.keys(prevProps).forEach((key) => {
        if (key !== 'children') {
            if (!(key in nextProps)) {
                dom.removeAttribute(key)
            }
        }
    })

    Object.keys(nextProps).forEach((key) => {
        if (key !== 'children') {
            if (nextProps[key] !== prevProps[key]) {
                if (key.startsWith('on')) {
                    const eventType = key.slice(2).toLowerCase()
                    dom.removeEventListener(eventType, prevProps[key])
                    dom.addEventListener(eventType, nextProps[key])
                } else {
                    dom[key] = nextProps[key]
                }
            }
        }
    })
}

function reconcileChildren(fiber, children) {
    let oldFiber = fiber.alternate?.child
    let prevChild = null
    children.map((child, index) => {
        const isSameType = oldFiber && oldFiber.type === child.type

        let newFiber
        if (isSameType) {
            // update
            newFiber = {
                type: child.type,
                props: child.props,
                child: null,
                sibling: null,
                parent: fiber,
                dom: oldFiber.dom,
                effectTag: 'update',
                alternate: oldFiber,
            }
        } else {
            newFiber = {
                type: child.type,
                props: child.props,
                child: null,
                sibling: null,
                parent: fiber,
                dom: null,
                effectTag: 'placement',
            }
        }

        if (oldFiber) {
            oldFiber = oldFiber.sibling
        }

        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevChild.sibling = newFiber
        }
        prevChild = newFiber
    })
}

function updateFunctionComponent(fiber) {
    const children = [fiber.type(fiber.props)]
    reconcileChildren(fiber, children)
}
function updateHostComponent(fiber) {
    if (!fiber.dom) {
        const dom = createDom(fiber.type)
        fiber.dom = dom

        // fiber.parent.dom.append(dom)
        updateProps(dom, fiber.props, {})
    }
    const children = fiber.props.children
    reconcileChildren(fiber, children)
}

function performWorkOfUnit(fiber) {
    const isFunctionComponent = typeof fiber.type === 'function'

    if (isFunctionComponent) {
        updateFunctionComponent(fiber)
    } else {
        updateHostComponent(fiber)
    }

    if (fiber.child) {
        return fiber.child
    }

    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) return nextFiber.sibling
        nextFiber = nextFiber.parent
    }

    return fiber.parent?.sibling
}

function update() {
    workInProgressRoot = {
        dom: currentRoot.dom,
        props: currentRoot.props,
        alternate: currentRoot,
    }

    nextWorkOfUnit = workInProgressRoot
}

const React = {
    render,
    update,
    createElement,
}

export default React
