'use client'

import { lexend } from '@/app/ui/fonts';
import { useEffect, useState } from 'react';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

const randomName = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
  separator: "-",
  style: "lowerCase",
}); 

export type Message = {
  name: string;
  text: string
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState(randomName);
  const [text, setText] = useState("Hello, world");

  function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newMessage = {name: name, text: text};
    setMessages([...messages, newMessage]);
      fetch('/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text: text }),
      }).then(() => {
        fetch('/query')
          .then(res => res.json())
          .then(data => setMessages(data));
      });
  }

  useEffect(() => {
    fetch('/query')
      .then(res => res.json())
      .then(data => setMessages(data));
  }, []);

  return (
    <main className={`${lexend.className} m-8 flex flex-col gap-4`}>
      <div>
        {messages.map((message, i) => {
          const x = Math.random() * (window.innerWidth - 200);
          const y = Math.random() * (window.innerHeight - 200);
          const colors = [
            "bg-red-100",
            "bg-orange-100",
            "bg-amber-100",
            "bg-yellow-100",
            "bg-lime-100",
            "bg-green-100",
            "bg-emerald-100",
            "bg-teal-100",
            "bg-cyan-100",
            "bg-sky-100",
            "bg-blue-100",
            "bg-indigo-100",
            "bg-violet-100",
            "bg-purple-100",
            "bg-fuchsia-100",
            "bg-pink-100",
            "bg-rose-100",
          ];

          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          let additional;

          if (i==0) {
            console.log('hi');
            additional = 'border-8 border-blue-500 z-10';
          }

          return (
            <div 
              key={i} 
              className={`absolute ${randomColor} p-1 w-fit ${additional}`}
              style={{
                left: x,
                top: y
              }}
            >
              {message.name} says "{message.text}"
            </div>
          )
        })}
      </div>

      <div className='flex flex-col gap-4 bg-pink-100 p-10 fixed bottom-0 w-1/3 right-0'>
        <form onSubmit={sendMessage} className='w-full h-full flex flex-col gap-4 p-4 bg-cyan-100'>
          <input 
            id='name'
            type='text'
            onChange={(e) => setName(e.target.value)}
            placeholder='Name:'
            className='w-full border p-3 placeholder-white text-white  bg-purple-700'
          />
          <input 
            autoFocus
            id='message'
            onChange={(e) => setText(e.target.value)}
            placeholder='Message:'
            className='w-full border p-3 placeholder-white text-white bg-blue-700'
          />
          <button type="submit" className='hover:opacity-60 w-full bg-white p-2 '>Submit</button>
        </form>
        <div className='bg-green-100 p-3'>
          Press <span className='bg-blue-700 p-1 text-white'>ENTER</span> to send (defaults to the default msg).
        </div>
      </div>
    </main>
  );
}
