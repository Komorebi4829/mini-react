import React from './core/React'

// const App = React.createElement('div', { id: 'app' }, 'zivi', 'react')

function Demo({ num }) {
    function handleClick() {
        // num++
        console.log('click')
    }
    return (
        <div>
            Demo: {num} <button onClick={handleClick}>button</button>
        </div>
    )
}

function DemoWrapper() {
    return <Demo></Demo>
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
