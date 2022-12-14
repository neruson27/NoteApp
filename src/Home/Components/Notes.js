import { useEffect, useState } from 'react';
// Utils
import { transforDate } from '../../utils/dateUtils';

function Notes({openNote, openDeleteModal, notes}) {
  // State
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    if (notes) {
      setLoading(false)
    }
  }, [notes])

  return (
    <div className='h-[60vh] grid grid-cols-2 gap-2 overflow-y-auto'>
      {/* <p>{JSON.stringify(notes)}</p> */}
      {!loading && notes.map(note => (
        <div className="bg-slate-50 hover:bg-slate-100 h-[40vh] md:h-[36vh] my-[2vh] w-[100%] md:w-[30vw] p-[4px] rounded overflow-hidden shadow-lg hover:cursor-pointer" key={note._id} onClick={() => openNote(note)}>
          <div className="px-4 py-2 md:px-6 md:py-4 h-[22vh] md:h-[24vh]">
            <div className="font-bold text-xl mb-2">{note.title}</div>
            <p className="min-h-[10vh] max-h-[16vh] text-gray-700 text-base overflow-y-auto">
              {note.body}
            </p>
          </div>
          <div className='w-[100%] p-2 md:p-4 flex flex-col md:flex-row md:justify-between items-center' onClick={e => e.stopPropagation()}>
            <div className="w-[100%] md:w-[45%] p-2">
              <p className='text-gray-300 text-center md:text-start'>{transforDate(note.createAt)}</p>
            </div>
            <div className='w-[100%] flex justify-center md:justify-end md:w-[45%]'>
              <button className='bg-red-400 hover:bg-red-500 rounded p-2 text-white' onClick={() => openDeleteModal(note)}>Eliminar</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notes;