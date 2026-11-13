const Greeting=({isLoggedIn})=>{
    return (
        <div>
            {isLoggedIn ?  <h1>Welcome back!</h1>:<h1>Please Sign in.</h1>}
        </div>
    )
}

export default Greeting