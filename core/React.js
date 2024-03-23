const ELEMENT_TYPE = {
    TEXT: 'TEXT',
}

const el = {
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

const render = (el, container) => {
    const dom = el.type === ELEMENT_TYPE.TEXT ? document.createTextNode('') : document.createElement(el.type)
    Object.entries(el.props).forEach(([k, v]) => {
        if (k !== 'children') {
            dom[k] = v
        }
    })
    const children = el.props.children
    if (children && children.length > 0) {
        children.forEach((child) => {
            render(child, dom)
        })
    }
    container.append(dom)
}

const React = {
    render,
    createElement,
}

export default React
