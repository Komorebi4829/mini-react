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

function performWorkOfUnit(work) {
    if (!work.dom) {
        const dom = work.type === ELEMENT_TYPE.TEXT ? document.createTextNode('') : document.createElement(work.type)
        work.dom = dom

        work.parent.dom.append(dom)

        Object.entries(work.props).forEach(([k, v]) => {
            if (k !== 'children') {
                dom[k] = v
            }
        })
    }

    const children = work.props.children
    let prevChild = null
    children.map((child, index) => {
        const newWork = {
            type: child.type,
            props: child.props,
            child: null,
            sibling: null,
            parent: work,
            dom: null,
        }
        if (index === 0) {
            work.child = newWork
        } else {
            prevChild.sibling = newWork
        }
        prevChild = newWork
    })

    if (work.child) {
        return work.child
    }

    if (work.sibling) {
        return work.sibling
    }

    return work.parent?.sibling
}

const React = {
    render,
    createElement,
}

export default React
