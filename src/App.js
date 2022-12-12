import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import useLocalStorage from "./utils/useLocalStorage";
import backendNotes from './clients/backendNotes';
import SortingBar from './Components/SortingBar';
import AddNote from "./Components/AddNote";
import Notes from "./Components/Notes";
import Note from './Components/Note';

function getRandomKey() {
  return Math.floor(Math.random() * 100);
}

function App() {
  const navigate = useNavigate();
  const [ jwt ] = useLocalStorage("jwt", '');
  const [ notes, setNotes ] = useState(null);
  const [ selectedTab, setSelectedTab ] = useState("notes");
  const [ selectedNote, setSelectedNote ] = useState(null);
  const [ showModal , setShowModal ] = useState(false);
  const [ forceNotesUpdate, setNotesForceUpdate ] = useState(0);
  const [ forceSortingBarUpdate, setForceSortingBarUpdate] = useState(1);

  const openModal = (note) => {
    setSelectedNote(note);
    setShowModal(true);
  }

  const closeModal = () => {
    setSelectedNote(null);
    setShowModal(false);
  }

  const fetchData = useCallback(async () => {
    const response = await backendNotes('get', `/note`, undefined, jwt);
    setNotes(response.data);
    setForceSortingBarUpdate(getRandomKey());
  }, [jwt])

  const sortBy = useCallback(({target}) => {
    const notesSorted = notes.sort((a, b) => {
        return a[target.value] > b[target.value] ? 1 : -1;
    })

    setNotes(notesSorted);
    setNotesForceUpdate(getRandomKey());
  }, [notes]);

  const filter = useCallback((oldNotes, text) => {
    const notesFiltered = oldNotes.filter(note => {
      return note.title.includes(text) || note.body.includes(text)
    })

    setNotes(notesFiltered);
    setNotesForceUpdate(getRandomKey());
  }, [])

  useEffect(() => {
    if (!notes) {
      console.log('fetching')
      fetchData()
        .catch(console.error)
    }
  }, [fetchData, notes]);

  useEffect(() => {
    if (!jwt) {
      navigate('/login', {replace: true})
    }
  }, [jwt, navigate])

  const data = [
    {
      label: "Notas",
      value: "notes",
      content: (
        <>
          <SortingBar notes={notes} sortBy={sortBy} filter={filter} key={forceSortingBarUpdate}/>
          <Notes openModal={openModal} fetchData={fetchData} notes={notes} key={forceNotesUpdate}/>
        </>
      )
    },
    {
      label: "Agregar nota",
      value: "add-note",
      content: <AddNote token={jwt} fetchData={fetchData} changeTab={setSelectedTab} />
    }
  ]

  return ( 
    <div className="h-[100vh] bg-purple-400 flex flex-row justify-center items-center">
      <div className="h-[90vh] md:h-[80vh] w-[80vw] bg-white rounded-lg border-purple-200 border-2 shadow-lg flex justify-center">
        <div className="w-[65vw] mt-2" value="notes">
          <div className="bg-blue-50 rounded-lg py-1 flex justify-between mb-2">
            {data.map(({ label, value }) => (
              <div className={(value === selectedTab ? 'bg-purple-300 text-white border-2 border-purple-400' : 'text-blue-900' ) + ' rounded-xl hover:cursor-pointer text-center w-[50%] mx-2'} key={value} value={value} onClick={() => {setSelectedTab(value)}}>
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
      {showModal && <Note closeModal={closeModal} fetchData={fetchData} note={selectedNote} />}
    </div>
  );
}

export default App;