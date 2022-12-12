import { useCallback, useEffect, useState } from 'react';

import backendNotes from '../clients/backendNotes';
import useLocalStorage from '../utils/useLocalStorage';
import { transforDate } from '../utils/dateUtils';

function Notes({openModal, fetchData, notes}) {
  const [jwt] = useLocalStorage('jwt', '');
  const [ loading, setLoading ] = useState(true);

  const deleteData = useCallback(async (id) => {
    const response = await backendNotes('delete', `/note/${id}`, undefined, jwt)
    if (response.status === 200) {
      fetchData()
        .catch(console.error)
    }
  }, [jwt, fetchData])

  useEffect(() => {
    if (notes) {
      setLoading(false)
    }
  }, [notes])

  return (
    <div className='h-[60vh] grid grid-cols-2 gap-2 overflow-y-auto'>
      {/* <p>{JSON.stringify(notes)}</p> */}
      {!loading && notes.map(note => (
        <div className="bg-slate-50 hover:bg-slate-100 h-[36vh] my-[2vh] w-[30vw] p-[4px] rounded overflow-hidden shadow-lg hover:cursor-pointer" key={note._id} onClick={() => openModal(note)}>
          <div className="px-6 py-4 h-[25vh]">
            <div className="font-bold text-xl mb-2">{note.title}</div>
            <p className="min-h-[10vh] max-h-[16vh] text-gray-700 text-base overflow-y-auto">
              {note.body}
            </p>
          </div>
          <div className='w-[100%] p-4 flex flex-row justify-between items-center' onClick={e => e.stopPropagation()}>
            <div className='w-[40%]'>
              <button className='bg-red-400 hover:bg-red-500 rounded p-2 text-white' onClick={() => deleteData(note._id)}>Eliminar</button>
            </div>
            <div className="w-[40%]">
              <p className='text-gray-300 text-end'>{transforDate(note.createAt)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notes;