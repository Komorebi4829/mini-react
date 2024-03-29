import React from './core/React'

// const App = React.createElement('div', { id: 'app' }, 'zivi', 'react')

let count = 10
let showBar = true
function Demo({ num }) {
    const update = React.update()

    function handleClick() {
        count++
        update()
    }
    // const foo = <div>foo</div>
    function Foo() {
        return <div>foo</div>
    }
    const bar = <p>bar</p>
    function handleShowBar() {
        showBar = !showBar
        update()
    }
    return (
        <div>
            {/* <div>{showBar ? bar : foo}</div> */}
            <div>{showBar ? bar : <Foo></Foo>}</div>
            <button onClick={handleShowBar}>showBar</button>
        </div>
    )
}

function App() {
    return (
        <div>
            <div>mini react</div>
            <p>mini</p>
            <span>react</span>
            <Demo num={12}></Demo>
            {/* <Demo num={22}></Demo> */}
            {/* <DemoWrapper></DemoWrapper> */}
        </div>
    )
}
// const App = () => {
//     return <div id='miao'>mini react</div>
// }

export default App
