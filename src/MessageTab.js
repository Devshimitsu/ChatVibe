import React, { useState, useContext, useEffect, useRef } from "react";
import { getDatabase, ref, update, push } from "firebase/database";
import send from "./images/send-message.png";
import { MessageContext } from "./App";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FiLink } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
export default function MessageTab() {
  const { messages, setMessages, showCodeModal, setShowCodeModal } =
    useContext(MessageContext);
  const [text, setText] = useState("");
  const containerRef = useRef();
  const { chatId } = useParams();
  const currentChat =
    Object.keys(messages).includes(chatId) && !!messages[chatId].messages
      ? messages[chatId].messages
      : {};
  function handleSubmit() {
    if (text.trim() !== "") {
      const tempObj = {
        content: text,
        sender: getAuth().currentUser.displayName,
        senderUID: getAuth().currentUser.uid,
        timestamp: Date.now(),
      };
      const chatRef = ref(getDatabase(), `/chats/${chatId}/messages`);
      push(chatRef, tempObj);
      setText("");
    }
  }
  function formatDateTime(timestamp) {
    const date = new Date(timestamp);

    // Extract date components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based, so we add 1
    const year = date.getFullYear();

    // Extract time components
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    // Add leading zeros to minutes if needed
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // Format the date and time
    const formattedDateTime = `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;

    return formattedDateTime;
  }
  useEffect(() => {
    if (Object.keys(messages).includes(chatId)) {
      const container = containerRef.current;
      container.scrollTo(0, container.scrollHeight);
    }
    console.log();
  }, [messages]);

  return Object.keys(messages).includes(chatId) ? (
    <div className="flex-1 flex min-w-messageMin w-1/4 flex-col relative break-words">
      <div className="flex gap-2 h-20 min-h-20 items-center pl-5 border-t border-borderColor bg-stone-900 mb-5 shadow-md shadow-slate-700">
        <button
          className=" rounded-xl w-10 h-10 flex items-center justify-center m-auto bg-stone-800"
          onClick={() => {}}
        >
          {<p className=" text-2xl">{messages[chatId].pfp}</p>}
        </button>
        <div className="flex items-center justify-between flex-1 mr-5">
          <p className="text-white">
            {messages[chatId] ? messages[chatId].chatName : ""}
          </p>
          <FiLink
            size={20}
            className="text-white cursor-pointer"
            onClick={() => {
              setShowCodeModal(true);
            }}
          />
        </div>
      </div>
      <div className=" h-4/6 overflow-y-scroll" ref={containerRef}>
        {Object.keys(currentChat).map((value, index) => {
          return (
            <div key={index}>
              {index > 0 ? (
                currentChat[value].senderUID !==
                  currentChat[Object.keys(currentChat)[index - 1]].senderUID ||
                currentChat[value].timestamp -
                  currentChat[Object.keys(currentChat)[index - 1]].timestamp >
                  60000 ? (
                  <MessageBox
                    pfp="https://wallpapers.com/images/hd/shadow-boy-white-eyes-unique-cool-pfp-nft-13yuypusuweug9xn.jpg"
                    name={currentChat[value].sender}
                    msg={currentChat[value].content}
                    date={formatDateTime(currentChat[value].timestamp)}
                  />
                ) : (
                  <p className="text-white pl-5 text-sm font-light mb-2 ml-14">
                    {currentChat[value].content}
                  </p>
                )
              ) : (
                <MessageBox
                  pfp="https://wallpapers.com/images/hd/shadow-boy-white-eyes-unique-cool-pfp-nft-13yuypusuweug9xn.jpg"
                  name={currentChat[value].sender}
                  msg={currentChat[value].content}
                  date={formatDateTime(currentChat[value].timestamp)}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className=" bg-inputColor rounded-xl py-3 text-white pl-4 outline-none placeholder-borderColor absolute bottom-6 left-5 right-5 shadow-slate-600 shadow-lg flex justify-between">
        <input
          className="bg-inputColor outline-none flex-1"
          placeholder="Type message"
          onChange={(event) => {
            setText(event.target.value);
          }}
          value={text}
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              handleSubmit();
            }
          }}
        ></input>
        <div>
          <img
            src={send}
            className="h-6 mr-4 hover:opacity-80 transition-all duration-200"
            onClick={() => {
              handleSubmit();
              console.log("clicked");
            }}
          ></img>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center flex-1">
      <h1 className="text-white text-xl">Start chatting with people!</h1>
    </div>
  );
}

const MessageBox = ({ pfp, name, msg, date }) => {
  const getColorFromLetter = (letter) => {
    const colors = [
      " bg-red-500",
      " bg-yellow-500",
      " bg-green-500",
      " bg-blue-500",
      " bg-indigo-500",
      " bg-purple-500",
      " bg-pink-500",
      " bg-gray-500",
    ];

    // Get the index based on the letter's char code
    const index = letter.charCodeAt(0) % colors.length;
    return colors[index];
  };
  return (
    <div className="flex gap-4 h-16 items-center pl-5">
      <div
        className={
          "rounded-3xl w-10 h-10 flex items-center justify-center" +
          getColorFromLetter(name[0].toUpperCase())
        }
      >
        <p className="text-white">{name[0].toUpperCase()}</p>
      </div>
      <div>
        <div className="flex gap-3 items-center">
          <p className="text-white">{name}</p>
          <p className=" text-subColor text-xs">{date}</p>
        </div>
        <p className="text-white text-sm font-light">{msg}</p>
      </div>
    </div>
  );
};
