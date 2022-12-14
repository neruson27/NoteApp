import { useState, useEffect, useCallback } from 'react';
// Service
import backendNoteApp from '../../clients/backendNotes';

function AddNote({ token, fetchData, changeTab }) {
  // State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [save, setSave] = useState(false);

  const postData = useCallback(async () => {
    if (title && body) {
      const response = await backendNoteApp('post', '/note', {title, body}, token);
      if (response.data._id) {
        setSave(true);
        fetchData();
        changeTab('notes');
      }
    }
  }, [title, body, token, fetchData, changeTab]);

  useEffect(() => {
    if (save) {
      setTitle('');
      setBody('');
      setSave(false);
    }
  }, [save]);

  return (
    <div className='h-[50vh] grid grid-rows-4 auto-rows-min md:auto-rows-max justify-center content-between'>
      <p className='text-md font-bold justify-self-center'>Crear Nota</p>
      <div className="mb-4 text-start">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Titulo
        </label>
        <input 
          className="appearance-none border-2 border-purple-200 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="title"
          type="text"
          placeholder="Titulo de la Nota"
          onChange={(ev) => {
            setTitle(ev.target.value);
          }}
          value={title}
        />
      </div>
      <div className="mb-6 text-start">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Contenido
        </label>
        <textarea
          className="appearance-none border-2 border-purple-200 rounded-lg w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="body"
          placeholder="Contenido de la Nota"
          onChange={(ev) => {
            setBody(ev.target.value);
          }}
          value={body}
        />
      </div>
      <div className='self-end justify-self-center'>
        <button className="bg-purple-500 disabled:bg-purple-200 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={postData} disabled={!title || !body}>
          Crear Nota
        </button>
      </div>
    </div>
  );
}

export default AddNote;