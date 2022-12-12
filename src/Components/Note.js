import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import backendNotes from '../clients/backendNotes';

import closeIcon from '../assets/close.png';
import useLocalStorage from "../utils/useLocalStorage";
import { transforDate } from '../utils/dateUtils';

function Note({closeModal, fetchData, note}) {
  const navigate = useNavigate();
  const [ title, setTitle ] = useState(note.title);
  const [ body, setBody ] = useState(note.body);
  const [ updating, setUpdating ] = useState(false);
  const [ jwt ] = useLocalStorage("jwt", '');

  useEffect(() => {
    if (!jwt) {
      navigate('/login', {replace: true})
    }
  }, [jwt, navigate])

  const updateData = useCallback(async (id) => {
    const response = await backendNotes('put', `/note/${id}`, {title, body}, jwt)
    if (response.status === 200) {
      fetchData();
      closeModal();
    }
  }, [jwt, title, body, fetchData, closeModal])

  return (
    <>
      <div className="bg-slate-800/50 fixed w-[100vw] h-[100vh] flex flex-row justify-center items-center" onClick={(e) => {
        e.stopPropagation();
        closeModal()
      }}>
        <div className="bg-slate-50 hover:bg-slate-100 hover:cursor-pointer rounded p-2 w-6 shadow-lg absolute top-[24%] right-[24%]" onClick={() => closeModal()}>
          <img src={closeIcon} alt="close" className='w-[100%]'/>
        </div>
        <div className=" bg-white rounded p-4 md:inset-0 w-[50vw] h-[50vh] shadow-lg" onClick={(e) => e.stopPropagation()}>
          <div className="p-[4px] rounded">
            <div className="px-6 py-4 h-[35vh]">
              {!updating ? (
                <>
                  <div className="font-bold text-xl mb-2">{title}</div>
                  <p className="min-h-[10vh] max-h-[30vh] text-gray-700 text-base overflow-y-auto">
                    {body}
                  </p>
                </>
              ) : (
                <>
                  <input 
                    className="appearance-none border-2 border-purple-200 rounded-lg w-full py-1 px-3 mb-4 text-black font-bold text-xl leading-tight focus:outline-none focus:shadow-outline"
                    id="title"
                    type="text"
                    placeholder="Titulo de la Nota"
                    onChange={(ev) => {
                      setTitle(ev.target.value);
                    }}
                    value={title}
                  />
                  <textarea
                    className="appearance-none border-2 border-purple-200 rounded-lg w-full py-1 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="body"
                    placeholder="Contenido de la Nota"
                    onChange={(ev) => {
                      setBody(ev.target.value);
                    }}
                    value={body}
                  />
                </>
              )}
            </div>
            <div className='w-[100%] p-4 flex flex-row justify-between items-center'>
              <div className='w-[40%]'>
                {!updating ? (
                  <button className='bg-purple-400 hover:bg-purple-500 rounded p-2 text-white' onClick={() => setUpdating(true)}>Actualizar</button>
                ) : (
                  <div className='flex flex-row justify-around'>
                    <button className='bg-green-400 hover:bg-green-500 disabled:bg-green-300 rounded p-2 text-white' onClick={() => updateData(note._id)} disabled={!title || !body}>Guardar</button>
                    <button className='bg-red-400 hover:bg-red-500 disabled:bg-red-300 rounded p-2 text-white' onClick={() => setUpdating(false)}>Cancelar</button>
                  </div>
                )}
              </div>
              <div className="w-[40%]">
                <p className='text-gray-300 text-end'>{transforDate(note.createAt)}</p>
              </div>
            </div>
          </div>
        </div>
    </div>
    </>
  )
}

export default Note;