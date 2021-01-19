import Reat,{useState,useEffect} from 'react'
import './Game.css'

import paper from '../../img/paper.png'
import rock from '../../img/rock.png'
import scissors from '../../img/scissors.png'

import queryString from 'query-string'
import io from 'socket.io-client'
let socket;

const Game = ({location})=>{
    const [player1,setPlayer1] = useState(()=>{ return {name:'Player',score:0}});
    const [player2,setPlayer2] = useState({name:'Computer',score:0});
    const [room,setRoom] = useState('');
    const [text,setText] = useState('Choose an option');
    const [choosen1,setChoosen1] = useState(rock);
    const [choosen2,setChoosen2] = useState(rock);

    const [clicked,setClicked] = useState(false);
    const ENDPOINT = 'https://rockpaperscissors-online.herokuapp.com/';

    useEffect(()=>{
        const {name,room} = queryString.parse(location.search)
        socket = io(ENDPOINT);
        setPlayer1({name:name,score:0});
        setRoom(room);
        socket.emit('join',{name,room},({error,name})=>{
            if(error){
                alert(error);
                window.location.href = '/';
            }else {
                setPlayer2({name:name,score:0});
            }
        });
        socket.on('otherjoin',({name1,name})=>{
            alert(`Admin: ${name} join room`);
            setPlayer2({name:name,score:0});
            setPlayer1({name:name1,score:0});
        })
        socket.on("left",({name1,name2})=>{
            alert(`Admin: ${name1} left room`);
            setPlayer2({name:'Computer',score:0});
            setPlayer1({name:name2,score:0});
           // setPlayer1({...player1,score:0});
        }) 
        return ()=>{
            socket.disconnect();
            socket.off();
        }
       
    },[ENDPOINT,location])
    useEffect(()=>{
        
    })
    const handleGame = (choice1,choice2)=>{
        let timeout = 3;
        setText(timeout);
        var interval = setInterval(()=>{
            if(timeout<=1){
                clearInterval(interval);
                setChoosen1(choice1);
                setChoosen2(choice2);
                //setText("you win");
                if(choice1==rock){
                    if(choice2==rock){
                        setText('Tie');
                    }else if(choice2==paper){
                        setText(`${player2.name} win`);
                        setPlayer2({...player2,score:player2.score+1});
                    }else {
                        setText("You win");
                        setPlayer1({...player1,score:player1.score+1});
                    }
                }else if(choice1==paper){
                    if(choice2==rock){
                        setText('You win');
                        setPlayer1({...player1,score:player1.score+1});
                    }else if(choice2==paper){
                        setText("Tie");
                    }else {
                        setText(`${player2.name} win`);
                        setPlayer2({...player2,score:player2.score+1});
                    }
                }else if(choice1==scissors){
                    if(choice2==rock){
                        setText(`${player2.name} win`);
                        setPlayer2({...player2,score:player2.score+1});
                    }else if(choice2==paper){
                        setText("You win");
                        setPlayer1({...player1,score:player1.score+1});
                    }else {
                        setText("Tie");
                    }
                }
                setTimeout(()=>{
                    setText("Choose an option");
                    setChoosen1(rock);
                    setChoosen2(rock);
                    setClicked(false);
                },1000)
            }else setText(--timeout);
        }, 1000); // 2000 ms = start after 2sec 
        
    }
   
    const PlayeWithBot=(choice)=>{
        //setClicked(true);
        if(!clicked){
            setClicked(true);
            socket.emit('play',choice);
            socket.on('gamestart',({choiceOne,choiceTwo})=>{
                //alert(choiceOne);
                //alert(choiceTwo);
                let tmp,tmp2;
                if(choiceOne == 'paper'){
                    tmp = paper;
                }else if(choiceOne == 'rock'){
                    tmp=rock;
                }else tmp = scissors;
                if(choiceTwo == 'paper'){
                    tmp2 = paper;
                }else if(choiceTwo =='rock'){
                    tmp2=rock;
                }else tmp2 = scissors;
                handleGame(tmp,tmp2);
            })  
        }
       
    }
    return (
        <section>
            <div className="score">
                <div >
                    <h2>Player1: {player1.name}</h2>
                    <p>Score: {player1.score}</p>
                </div>
                <div >
                    <h2>Player2: {player2.name}</h2>
                    <p>Score: {player2.score}</p>
                </div>
            </div>

            <div className="intro">
                <p style={{color:'white',fontSize:'20px'}}>Room: {room}</p>
                <h1>Rock Paper Scissors</h1>
            </div>

            <div className="handle " >
                <h2 style={{fontSize:'30px'}}>{text}</h2>
                <div >
                    <img className="player-hand" src={choosen1} alt="" />
                    <img src={choosen2} alt="" />
                </div>
            </div>
            <div className="options ">
                    <button className="rock" onClick={()=>{PlayeWithBot('rock')}}>rock</button>
                    <button className="paper" onClick={()=>{PlayeWithBot('paper')}}>paper</button>
                    <button className="scissors" onClick={()=>{PlayeWithBot('scissors')}}>scissors</button>
            </div>
            <div className="me">
                <p>From Nguyễn Ngọc Tiễn With love <i className="fas fa-heart"></i></p>
            </div>
        </section>
    );
}
export default Game;