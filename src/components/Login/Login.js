import react,{useState} from 'react'
import {Link} from 'react-router-dom'
import './login.css'
const Login = ()=>{
    const [name,setName] = useState('');
    const [room,setRoom] = useState ('');
    
    const Handle = (e)=>{
        if(!name || !room) {
            e.preventDefault();
            alert('Error: Fill all input !!!');
        }
    }
    return (
        <div className="content">
            <p>ROCK PAPER SCISSORS</p>
            <input placeholder="Name" type="text" value={name} onChange={(e)=>{setName(e.target.value)}} />
            <input placeholder="Room" type="text" value={room} onChange={(e)=>{setRoom(e.target.value)}} />
            <Link onClick={Handle} to={`/Game?name=${name}&room=${room}`}>
                <button type="submit">Submit</button>
            </Link>
        </div>
    )
}

export default Login;