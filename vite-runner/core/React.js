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
                return typeof child === 'string' ? createTextNode(child) : child
            }),
        },
    }
}

function render(el, container) {
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el],
        },
    }

    root = nextWorkOfUnit
}

let root = null
let nextWorkOfUnit = null
function workLoop(deadline) {
    let shouldYield = false

    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
        shouldYield = deadline.timeRemaining() < 1
    }

    if (!nextWorkOfUnit && root) {
        commitRoot()
    }
    requestIdleCallback(workLoop)
}

function commitRoot(fiber) {
    commitWork(root.child)
    root = null
}

function commitWork(fiber) {
    if (!fiber) return

    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }

    if (fiber.dom) {
        fiberParent.dom.append(fiber.dom)
    }

    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

requestIdleCallback(workLoop)

function createDom(type) {
    return type === ELEMENT_TYPE.TEXT ? document.createTextNode('') : document.createElement(work.type)
}

function updateProps(dom, props) {
    Object.entries(props).forEach(([k, v]) => {
        if (k !== 'children') {
            dom[k] = v
        }
    })
}

function initChildren(fiber, children) {
    let prevChild = null
    children.map((child, index) => {
        const newFiber = {
            type: child.type,
            props: child.props,
            child: null,
            sibling: null,
            parent: fiber,
            dom: null,
        }
        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevChild.sibling = newFiber
        }
        prevChild = newFiber
    })
}

function performWorkOfUnit(fiber) {
    const isFunctionComponent = typeof fiber.type === 'function'
    if (!isFunctionComponent) {
        if (!fiber.dom) {
            const dom = createDom(fiber.type)
            fiber.dom = dom

            // fiber.parent.dom.append(dom)
            updateProps(dom, fiber.props)
        }
    }

    const children = isFunctionComponent ? [fiber.type()] : fiber.props.children
    initChildren(fiber, children)

    if (fiber.child) {
        return fiber.child
    }

    if (fiber.sibling) {
        return fiber.sibling
    }

    return fiber.parent?.sibling
}

const React = {
    render,
    createElement,
}

export default React
