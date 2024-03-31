import React from './core/React'
import Todo from './Todo'

function Foo() {
    const [count, setcount] = React.useState(10)
    const [bar, setbar] = React.useState('bar')
    function handleClick() {
        setcount((c) => c + 1)
        // setbar((s) => s + ',bar')
        setbar('bbarbb')
    }

    React.useEffect(() => {
        console.log('init')
        return () => {
            console.log('cleanup 1')
        }
    }, [])

    React.useEffect(() => {
        console.log('update', count)
        return () => {
            console.log('cleanup 2')
        }
    }, [count])

    React.useEffect(() => {
        console.log('update', count)
        return () => {
            console.log('cleanup 3')
        }
    }, [count])

    return (
        <div>
            <h1>Foo</h1>
            {count}
            <br />
            {bar}
            <button onClick={handleClick}>click</button>
        </div>
    )
}

// function App() {
//     return (
//         <div>
//             <div>mini react</div>
//             <Foo></Foo>
//         </div>
//     )
// }
function App() {
    return <Todo></Todo>
}


export default App
