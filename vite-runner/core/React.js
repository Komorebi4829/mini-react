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
}

let nextWorkOfUnit = null
function workLoop(deadline) {
    let shouldYield = false

    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
        shouldYield = deadline.timeRemaining() < 1
    }
    requestIdleCallback(workLoop)
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

function initChildren(fiber) {
    const children = fiber.props.children
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
    if (!fiber.dom) {
        const dom = createDom(fiber.type)
        fiber.dom = dom

        fiber.parent.dom.append(dom)
        updateProps(dom, fiber.props)
    }

    initChildren(fiber)

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
