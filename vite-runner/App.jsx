import React from './core/React'

// const App = React.createElement('div', { id: 'app' }, 'zivi', 'react')

function Demo() {
    return <div>Demo</div>
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
            {/* <Demo></Demo> */}
            <DemoWrapper></DemoWrapper>
        </div>
    )
}
// const App = () => {
//     return <div id='miao'>mini react</div>
// }

export default App
