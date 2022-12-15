import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// Utils
import useLocalStorage from "../utils/useLocalStorage";
// Service
import backendNotes from '../clients/backendNotes';
// Components
import SortingBar from './Components/SortingBar';
import AddNote from "./Components/AddNote";
import Notes from "./Components/Notes";
import Note from './Components/Note';
import DeleteModal from './Components/DeleteModal';

function getRandomKey() {
  return Math.floor(Math.random() * 1000);
}

function Home() {
  // Navigate
  const navigate = useNavigate();
  // LocalStorage
  const [ jwt, setJwt ] = useLocalStorage('jwt', '');
  const [ user ] = useLocalStorage('user', '');
  // State
  const [ notes, setNotes ] = useState(null);
  const [ selectedTab, setSelectedTab ] = useState('notes');
  const [ selectedNote, setSelectedNote ] = useState(null);
  const [ showNote , setShowNote ] = useState(false);
  const [ showDelete, setShowDelete ] = useState(false);
  const [ forceNotesUpdate, setNotesForceUpdate ] = useState(getRandomKey());
  const [ forceSortingBarUpdate, setForceSortingBarUpdate] = useState(getRandomKey());

  const openNote = (note) => {
    setSelectedNote(note);
    setShowNote(true);
  }

  const closeNote = () => {
    setSelectedNote(null);
    setShowNote(false);
  }

  const openDeteleModal = (note) => {
    setSelectedNote(note);
    setShowDelete(true);
  }

  const closeDeleteModal = () => {
    setSelectedNote(null);
    setShowDelete(false);
  }

  const fetchData = useCallback(async () => {
    const response = await backendNotes('get', `/note`, undefined, jwt)
    setNotes(response?.data ?? []);
    setForceSortingBarUpdate(getRandomKey());
  }, [jwt])

  const deleteData = useCallback(async (id) => {
    const response = await backendNotes('delete', `/note/${id}`, undefined, jwt)
    if (response.status === 200) {
      fetchData();
      closeDeleteModal();
    }
  }, [jwt, fetchData])

  const sortBy = useCallback(({target}) => {
    const notesSorted = notes.sort((a, b) => {
      const condition = target.value === 'createAt' || target.value === 'updateAt';
      const value1 = condition ? new Date(a[target.value]) : a[target.value]?.toLowerCase();
      const value2 = condition ? new Date(b[target.value]) : b[target.value]?.toLowerCase();

      return value1 > value2 ? 1 : -1;
    })

    setNotes(notesSorted);
    setNotesForceUpdate(getRandomKey());
  }, [notes]);

  const filter = useCallback((oldNotes, text) => {
    const notesFiltered = oldNotes.filter(note => {
      return note.title.toLowerCase().includes(text) || note.body.toLowerCase().includes(text)
    })

    setNotes(notesFiltered);
    setNotesForceUpdate(getRandomKey());
  }, [])

  const data = [
    {
      label: "Notas",
      value: "notes",
      content: (
        <>
          <SortingBar notes={notes} sortBy={sortBy} filter={filter} key={forceSortingBarUpdate}/>
          <Notes openNote={openNote} openDeleteModal={openDeteleModal} fetchData={fetchData} notes={notes} key={forceNotesUpdate}/>
        </>
      )
    },
    {
      label: "Agregar nota",
      value: "add-note",
      content: <AddNote token={jwt} fetchData={fetchData} changeTab={setSelectedTab} />
    }
  ]

  useEffect(() => {
    if (!notes) {
      fetchData();
    }
  }, [fetchData, notes]);

  useEffect(() => {
    if (!jwt) {
      navigate('/login', {replace: true})
    }
  }, [jwt, navigate])

  return ( 
    <div className="h-[100vh] bg-purple-400 flex flex-col justify-center items-center">
      <div className="w-[90vw] md:w-[80vw] mb-1 flex flex-row justify-center">
        <p className="text-white mr-2">Bienvenido:</p>
        <p className="text-white">{user}</p>
      </div>
      <div className="h-[90vh] md:h-[80vh] w-[90vw] md:w-[80vw] bg-white rounded-lg border-purple-200 border-2 shadow-lg flex justify-center">
        <div className="w-[80vw] md:w-[65vw] mt-2" value="notes">
          <div className="bg-blue-50 rounded-lg py-1 flex justify-between mb-2">
            {data.map(({ label, value }) => (
              <div className={(value === selectedTab ? 'bg-purple-300 text-white border-2 border-purple-400' : 'text-blue-900' ) + ' rounded-xl hover:cursor-pointer text-center w-[50%] mx-2'} key={value} value={value} onClick={() => {
                fetchData();
                setSelectedTab(value)
              }}>
                {label}
              </div>
            ))}
          </div>
          <div>
            {data.map(({ value, content }) => (
              <div key={value} value={value}>
                {value === selectedTab ? content : <></>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-1 text-white hover:text-slate-200 hover:cursor-pointer" onClick={() => {setJwt('')}}>Desconectarse</p>
      {showNote && <Note closeNote={closeNote} fetchData={fetchData} note={selectedNote} />}
      {showDelete && <DeleteModal closeDeleteModal={closeDeleteModal} deleteData={deleteData} noteId={selectedNote._id}/>}
    </div>
  );
}

export default Home;