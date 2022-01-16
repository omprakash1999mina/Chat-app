import React, { Component } from 'react';
import { io } from 'socket.io-client';
const socket = io(process.env.REACT_APP_API_URL)

// const socket = io(API_URL || '')
var array = [];

// function messages() {
  // for (let x in obj) {
  //   // console.log(obj[x]);
  //   return obj[x]
  // }
// }

// const Home = (props) => {
class Home extends Component {
      constructor(props) {
        super(props)
        this.messagesEnd = React.createRef();
        this.state = {name:'', msg: '', res:{name:'', msg: ''}, modal :true, roomId: '' ,incomming: false, outgoing: false }
      }
      scrollToBottom = () => {
        // this.messagesEnd.current.scrollIntoView({ behavior: "smooth" });
        this.messagesEnd.current.scrollTop = this.messagesEnd.current.scrollHeight;
      }

      componentDidUpdate() {
          // console.log('updated')
          this.scrollToBottom();

      }
        joinHandler = () => {
          // console.log(this.state)
          this.setState({modal: false})
          socket.emit('join-room', this.state.roomId);
        }
        
        sendHandler = (e) =>{
          // console.log(this.state.name)
          const data = {
              name: this.state.name,
              msg: this.state.msg,
            }
            // chat_history = Object.assign({name: this.state.name, msg: this.state.msg})
              array.push(
                <>
                          <label className="leading-7 w-1/2 ml-auto text-sm text-gray-800"> You :</label>
                          <div className="ml-auto mb-2 mx-2 h-52 rounded-lg bg-blue-200 text-right w-1/2">
                            <p id="sender" className="p-2 text-left text-black">{ this.state.msg }</p>
                          </div>
                </> 
              );
              // console.log(array)
              socket.emit('send-message' , data ,this.state.roomId);
              this.setState({msg: '',outgoing: true})

        }
        
        changeHandler = (e) =>{
          this.setState( {[e.target.name]: e.target.value} );
          // console.log('done')
        }
        componentDidMount() {
          this.scrollToBottom();
          socket.on('receive-message', response=>{
          // console.log(response)
          array.push(
            <>
            <label className="ml-2 leading-7 text-sm text-gray-800">{response.name} :</label>
            <div className="mb-2 mx-2 rounded-lg text-left bg-blue-300 w-1/2">
                <p id="Receiver" className="p-2 text-left font-semibold text-black">{response.msg}</p>
            </div>
            </>
          )
          // socket.off('receive-message', 'OFF');  
          this.setState({res: {name: response.name, msg: response.msg}, outgoing: true})
        })
      } 

render() {
        const { name, msg , modal, roomId , outgoing} = this.state;

    return (
      
       <div> 
        <section className="text-gray-600 h-screen max-h-full body-font relative">
        <div className="absolute inset-0 bg-gray-300">
            <h1 className="text-center text-gray-900 pt-4 text-2xl font-semibold">Welcome to Developers-Org </h1>
            <h2 className="text-center text-black">Here you can communicate with developers and start developing something incredible</h2>
        </div>
        <div className="container px-5 pt-24 pb-28 mx-auto flex  justify-center">
          <div className="lg:w-5/6 md:w-1/2 bg-white rounded-lg p-8 flex flex-col justify-between w-full mt-10 md:mt-0 relative z-10 shadow-md">
            <div className="flex flex-row rounded-lg bg-gray-200  w-full ">
              <div className="flex flex-row justify-center">
                <img className="p-1 h-12 w-12" src="logo.ico" alt="logo" />
                <div className="flex flex-col justify-center ">
                    <h2 className=" text-gray-900 text-lg font-medium title-font">oders-House</h2>
                </div>
              </div>
            </div>

            <section ref={this.messagesEnd} id="section" className="h-40 container overflow-auto flex flex-col border-2 border-blue-300 mt-4 rounded-lg w-full relative mb-2">
            { outgoing &&
              <>
                  {/* <label className="leading-7 w-1/2 ml-auto text-sm text-gray-800">{ name } :</label> */}
                  { array.map( chat => { return chat } ) }
              </> 
            }
             {/* <div ref={this.messagesEnd} /> */}
            </section>

            <div className="relative mb-4">
              <label className="leading-7 text-sm text-gray-600">Message</label>
              <textarea autosize={{ minRows: 20, maxRows: 25 }} onKeyPress={(e)=> e.key ==='Enter' && this.sendHandler(e)} id="message" name="msg" value={msg} onChange={this.changeHandler} placeholder="Write a message...." className="h-20 w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
            </div>
            
            <button id="send" onClick={this.sendHandler} className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Send</button>
            <p className="text-xs text-gray-500 mt-3">Chicharrones blog helvetica normcore iceland tousled brook viral artisan.</p>
          </div>
        </div>
      </section>

      { modal && 
            <div  className="min-w-screen shadow-lg bg-opacity-70 bg-gray-100 h-screen fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"   id="modal-id">
              {/* <div  className="fixed inset-0 z-50 bg-gray-100 bg-opacity-50 animated fadeIn faster min-w-screen  outline-none focus:outline-none bg-no-repeat bg-center bg-cover  px-5 py-24 mx-auto flex justify-center"> */}

              <div className="lg:w-1/3 bg-white rounded-lg p-8 flex flex-col w-full mt-10 relative shadow-md">
                <h2 className="text-gray-900 text-lg text-center mb-1 font-medium title-font">Developers-Org</h2>
                <p className="leading-relaxed mb-5 text-gray-600">Please fill the details correctly and enjoy the conversation .</p>
                <div className="relative mb-4">
                    <label className="leading-7 text-sm text-gray-600">Name *</label>
                    <input type="text" id="name" name="name" value={name} onChange={this.changeHandler} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div>
                {/* <div className="relative mb-4">
                  <label className="leading-7 text-sm text-gray-600">Email</label>
                  <input type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div> */}
                <div className="relative mb-4">
                  <label className="leading-7 text-sm text-gray-600">Room</label>
                  <input type="text" id="roomId" name="roomId" value={roomId} onChange={this.changeHandler} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div>
                <button onClick={this.joinHandler} className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Join</button>
                <p className="text-xs text-gray-500 mt-3">Chicharrones blog helvetica normcore iceland tousled brook viral artisan.</p>
              </div>
            </div>
     
      }
           
       </div>
    )
}
}

export default Home;
