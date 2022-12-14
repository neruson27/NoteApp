import { useState } from "react";

function SortingBar({notes, sortBy, filter}) {
  const [ search, setSearch ] = useState('');
  const [ oldNotes ] = useState(notes);

  return (
    <div className="flex flex-col md:flex-row justify-around items-center">
      <div className="w-[100%] md:w-[40%]">
        <input 
          className=" w-[100%] appearance-none border-2 border-purple-200 rounded-lg py-1 px-3 mb-4 text-black font-bold text-xl leading-tight focus:outline-none focus:shadow-outline"
          id="search"
          type="text"
          placeholder="Buscar"
          onChange={(ev) => {
            filter(oldNotes, ev.target.value.toLowerCase());
            setSearch(ev.target.value);
          }}
          value={search}
        />
      </div>

      <div className="w-[100%] md:w-[40%] flex flex-row justify-around md:justify-end">
        <p className="mt-1 mr-2 font-bold text-slate-400 text-xl leading-tight">Ordernar por: </p>
        <select className="appearance-none border-2 border-purple-200 rounded-lg py-1 px-3 mb-4 focus:outline-none focus:shadow-outline" onChange={sortBy} defaultValue={'createAt'}>
          <option value="title">Titulo</option>
          <option value="body">Contenido</option>
          <option value="createAt">Tiempo</option>
        </select>
      </div>

    </div>
  )
}

export default SortingBar;