const Button=()=>
{
    const handleClick=()=>{
        alert('Button Clicked Test');
    }
    return <button style={{height:"50px",width:"100px",borderRadius:"10px"}}onClick={handleClick}>click me</button>;
}

export default Button