import { BsPlus, BsFillLightningFill, BsGearFill } from "react-icons/bs";
import { FaFire, FaPoo, FaKey } from "react-icons/fa";
import { getDatabase, ref, push, update, equalTo, get, query } from "firebase/database";
import fire from "./fire-gif.gif";
import peace from "./images/peace-sign.png";
import solo from "./images/chat-icon.png";
import cross from "./images/close.png";
import rightArrow from "./images/right-arrow.png";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useParams } from "react-router-dom";
export default function SideBar() {
  const [hover, setHover] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [formIndex, setFormIndex] = useState(1);
  const [chatName, setChatName] = useState("");
  const auth = getAuth()
  const SidebarIcon = ({ icon, text, type }) => {
    return (
      <div
        className="sidebar-icon group"
        onClick={() => {
          if (type == "plus") {
            setShowModal(true);
            console.log("plus");
          }
          else if(type == 'join'){
            setShowJoinModal(true)
          }
        }}
      >
        {icon}
        <span className="toolip group-hover:scale-100 w-max">
          <p>{text}</p>
        </span>
      </div>
    );
  };
  function handleChange(event) {
    setChatName(event.target.value);
  }
  function ChoiceBox({ message, img, type }) {
    return (
      <div
        className="flex relative justify-between items-center w-full border rounded-lg mt-3 px-3 hover:bg-slate-100 cursor-pointer transition-all duration-300"
        onClick={() => {
          if (type == "duo") {
            setFormIndex((prev) => (prev += 1));
          }
        }}
      >
        <div className="flex items-center gap-2">
          <img src={img} className="w-12"></img>
          <p className="font-semibold">{message}</p>
        </div>
        <img src={rightArrow} className="w-4 mr-3"></img>
      </div>
    );
  }

  return (
    <>
      <div
        className={
          "flex items-center justify-center w-screen h-screen absolute transition-all duration-100 z-50" +
          (showModal ? "" : " hidden")
        }
      >
        <CreateForm
          formIndex={formIndex}
          setShowModal={setShowModal}
          handleChange={handleChange}
          chatName={chatName}
          setFormIndex={setFormIndex}
          ChoiceBox={ChoiceBox}
          setCloseModal={setShowModal}
        />
      </div>
      <div
        className={
          "flex items-center justify-center w-screen h-screen absolute transition-all duration-100 z-50" +
          (showJoinModal ? "" : " hidden")
        }
      >
        <JoinModal
          showJoinModal={showJoinModal}
          setShowJoinModal={setShowJoinModal}
        />
      </div>
      <div className="flex flex-col h-screen bg-bgColor w-16 top-0 m-0 shadow-lg text-white justify-center gap-1 relative ">
        <div
          className="absolute left-1/2 transform -translate-x-1/2
          top-5"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {hover ? (
            <img src={fire} className=""></img>
          ) : (
            <FaFire size="25" className="text-fireColor" />
          )}
        </div>
        <SidebarIcon icon={<FaFire size="28" />} text="toolip💡"></SidebarIcon>
        <SidebarIcon icon={<FaKey size="28" />} text="Join chat 🚀" type='join'></SidebarIcon>
        <SidebarIcon
          icon={<BsPlus size="28" />}
          text={"Create chat💬"}
          type="plus"
        ></SidebarIcon>
        <SidebarIcon
          icon={<BsFillLightningFill size="28" />}
          text={"toolip💡"}
        ></SidebarIcon>
      </div>
    </>
  );
}

function CreateForm({
  formIndex,
  setShowModal,
  handleChange,
  chatName,
  setFormIndex,
  ChoiceBox,
  setCloseModal,
}) {
  const auth = getAuth()
  const [uid, setUid] = useState('')
  function generateUID(){
    const string = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
    const uid = []
    for(let i=0;i<=8;i++){
      uid.push(string[Math.floor(Math.random()*string.length)])
    }
    setUid(uid.join(''))
    return uid.join('')
  }
  if (formIndex == 1) {
    return (
      <div className={"text-center bg-white rounded-lg p-5 w-96 relative"}>
        <img
          src={cross}
          className="absolute w-4 right-5 cursor-pointer"
          onClick={() => {
            setShowModal(false);
          }}
        ></img>
        <div className="">
          <img src={peace} className="w-20 m-auto"></img>
          <p className="font-semibold text-xl mb-2">Create a VibeChat</p>
          <p className="font-normal text-neutral-500 text-sm mb-10">
            Create a VibeChat – Hangout with Friends! Start your chat for 2 or a
            group and enjoy lively conversations.
          </p>
        </div>
        <ChoiceBox message="Initiate a Chat for Two" img={solo} type="duo" />
        <ChoiceBox message="Start a Group Chat" img={solo} type="group" />

        <div></div>
      </div>
    );
  } else if (formIndex == 2) {
    return (
      <div className={"text-center bg-white rounded-lg p-5 w-96 relative"}>
        <img
          src={cross}
          className="absolute w-4 right-5 cursor-pointer"
          onClick={() => {
            setShowModal(false);
          }}
        ></img>
        <div className="">
          <img src={peace} className="w-20 m-auto"></img>
          <p className="font-semibold text-xl mb-2">Create your VibeChat</p>
          <p className="font-normal text-neutral-500 text-sm mb-5">
            Give your chat a personality with a unique name
          </p>
        </div>
        <p className="text-start text-sm mb-2">Chat Name</p>
        <input
          className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none"
          placeholder="John's chat"
          onChange={(event) => handleChange(event)}
          value={chatName}
        ></input>
        <div className="flex gap-2 mt-5">
          <button
            className="flex-1 rounded-lg border-gray-200 border h-10 text-stone-600"
            onClick={() => {
              setFormIndex((prev) => prev - 1);
            }}
          >
            Previous
          </button>
          <button
            className="flex-1 rounded-lg h-10 text-white bg-blue-600"
            onClick={() => {
              const chatRef = ref(getDatabase(), "/chats");
              setFormIndex((prev) => prev + 1);
              const userRef = ref(getDatabase(), `/users/${auth.currentUser.uid}/chats`)
              const codesRef = ref(getDatabase(),'/codes')
              push(chatRef, {
                author: auth.currentUser.uid,
                chatName: chatName,
                participants:{
                  [auth.currentUser.uid]:true
                },
              }).then((value) => {
                update(userRef,{
                  [value.key]:true
                })
                .then((result)=>{
                  update(codesRef,{
                    [generateUID()]:value.key
                  })
                })
              });
            }}
          >
            Create
          </button>
        </div>
        <div></div>
      </div>
    );
  }
  else if(formIndex==3){

    return (
      <div className={"text-center bg-white rounded-lg p-5 w-96 relative"}>
        <img
          src={cross}
          className="absolute w-4 right-5 cursor-pointer"
          onClick={() => {
            setShowModal(false);
          }}
        ></img>
        <div className="">
          <img src={peace} className="w-20 m-auto"></img>
          <p className="font-semibold text-xl mb-2">Chat Code Unleashed!</p>
          <p className="font-normal text-neutral-500 text-sm mb-5">
          Click the key icon on the navbar and paste the code there to join a chat. Share it with friends!
          </p>
        </div>
       <div className='w-5/6 h-20 bg-gray-100 m-auto rounded-lg flex justify-center items-center'>
        <p className=" text-2xl tracking-widest font-light">{uid}</p>
       </div>
        <div className="flex gap-2 mt-5">
          <button
            className="flex-1 rounded-lg border-gray-200 border h-10 text-stone-600"
            onClick={() => {
              setFormIndex((prev) => prev - 1);
            }}
          >
            Previous
          </button>
          <button
            className="flex-1 rounded-lg h-10 text-white bg-blue-600"
            onClick={() => {
              setFormIndex(1)
              setShowModal(false)
            }}
          >
            Done
          </button>
        </div>
        <div></div>
      </div>
    );
  
  }
}
function JoinModal({setShowJoinModal,showJoinModal}){
  const [joinModalIndex, setJoinModalIndex] = useState(1)
  const [code, setCode] = useState('')
  const userRef = ref(getDatabase(), `/users/${getAuth().currentUser.uid}/chats`)

  return(
    <div className={"text-center bg-white rounded-lg p-5 w-96 relative"}>
    <img
      src={cross}
      className="absolute w-4 right-5 cursor-pointer"
      onClick={() => {
        setShowJoinModal(false)
      }}
    ></img>
    <div className="">
      <img src={peace} className="w-20 m-auto"></img>
      <p className="font-semibold text-xl mb-2">Join Chat with Code</p>
      <p className="font-normal text-neutral-500 text-sm mb-5">
      Enter the unique code provided by the group participants to join the chat and connect with others      </p>
    </div>
   <input className='w-5/6 h-20 bg-gray-100 m-auto rounded-lg flex justify-center items-center text-2xl tracking-widest font-light text-center placeholder:tracking-normal' placeholder='Enter your code' value={code} onChange={(event)=>{
    setCode(event.target.value)
   }}>
   </input>
    <div className="flex gap-2 mt-5">
      
      <button
        className="flex-1 rounded-lg h-10 text-white bg-blue-600"
        onClick={() => {
          const codesRef = ref(getDatabase(),`/codes/${code}`)
          get(codesRef)
          .then((snapshot)=>{
            if(snapshot.exists()){
              console.log('Code',snapshot.val())
              const chatRef = ref(getDatabase(),`/chats/${snapshot.val()}/participants`)
              update(chatRef,{
                [getAuth().currentUser.uid]:true
              })
              .then((value)=>{
                update(userRef,{
                  [snapshot.val()]:true
                })
              })
              setJoinModalIndex(1)
              setShowJoinModal(false)
            }
            else{
              console.log('Code does not exist')
            }
          })
        }}
      >
        Done
      </button>
    </div>
    <div></div>
  </div>
  )
}