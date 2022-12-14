import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
// Service
import backendNotes from '../../clients/backendNotes';
// Utils
import useLocalStorage from "../../utils/useLocalStorage";
import { transforDate } from '../../utils/dateUtils';
// Assets
import closeIcon from '../../assets/close.png';

function Note({closeNote, fetchData, note}) {
  // Navigate
  const navigate = useNavigate();
  // LocalStorage
  const [ jwt ] = useLocalStorage("jwt", '');
  // State
  const [ title, setTitle ] = useState(note.title);
  const [ body, setBody ] = useState(note.body);
  const [ updating, setUpdating ] = useState(false);

  useEffect(() => {
    if (!jwt) {
      navigate('/login', {replace: true})
    }
  }, [jwt, navigate])

  const updateData = useCallback(async (id) => {
    const response = await backendNotes('put', `/note/${id}`, {title, body}, jwt)
    if (response.status === 200) {
      fetchData();
      closeNote();
    }
  }, [jwt, title, body, fetchData, closeNote])

  return (
    <>
      <div className="bg-slate-800/50 fixed w-[100vw] h-[100vh] flex flex-row justify-center items-center" onClick={(e) => {
        closeNote()
      }}>
        <div className="bg-slate-50 hover:bg-slate-100 hover:cursor-pointer rounded p-2 w-6 shadow-lg absolute top-[14%] right-[14%] md:top-[24%] md:right-[24%]" onClick={() => closeNote()}>
          <img src={closeIcon} alt="close" className='w-[100%]'/>
        </div>
        <div className=" bg-white rounded p-4 md:inset-0 w-[70vw] md:w-[50vw] h-[70vh] md:h-[50vh] shadow-lg" onClick={(e) => e.stopPropagation()}>
          <div className="p-[4px] rounded">
            <div className="px-6 py-4 h-[50vh] md:h-[35vh]">
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
            <div className='w-[100%] p-4 flex flex-col md:flex-row justify-between items-center'>
              <div className='w-[100%] flex justify-center md:justify-start md:w-[40%]'>
                {!updating ? (
                  <button className='bg-purple-400 hover:bg-purple-500 rounded p-2 text-white' onClick={() => setUpdating(true)}>Actualizar</button>
                ) : (
                  <div className='w-[80%] md:w-[90%] flex flex-row justify-around'>
                    <button className='bg-green-400 hover:bg-green-500 disabled:bg-green-300 rounded p-2 text-white' onClick={() => updateData(note._id)} disabled={!title || !body}>Confirmar</button>
                    <button className='bg-red-400 hover:bg-red-500 disabled:bg-red-300 rounded p-2 text-white' onClick={() => setUpdating(false)}>Cancelar</button>
                  </div>
                )}
              </div>
              <div className="w-[100%] md:w-[40%]">
                {!note.updateAt ? <p className='text-gray-300 text-center md:text-end'>{transforDate(note.createAt)}</p> : <p className='text-gray-300 text-center md:text-start'>Ultima actualizacion: {transforDate(note.updateAt)}</p>}
              </div>
            </div>
          </div>
        </div>
    </div>
    </>
  )
}

export default Note;