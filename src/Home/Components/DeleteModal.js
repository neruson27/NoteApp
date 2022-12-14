
function DeleteModal({closeDeleteModal, deleteData, noteId}) {
  return (
    <>
      <div className="bg-slate-800/50 fixed w-[100vw] h-[100vh] flex flex-row justify-center items-center" onClick={(e) => {
        closeDeleteModal()
      }}>
        <div className="bg-white rounded p-4 md:inset-0 w-[60vw] md:w-[40vw] h-[30vh] md:h-[40vh] shadow-lg flex flex-col justify-center items-center" onClick={(e) => e.stopPropagation()}>
          <p className="font-bold text-xl mb-4 text-center">¿Estas seguro que quieres eliminar esta nota?</p>
          <div className='w-[80%] md:w-[40%] flex flex-row justify-around'>
            <button className='bg-green-400 hover:bg-green-500 disabled:bg-green-300 rounded p-2 text-white mr-2' onClick={() => deleteData(noteId)}>Confirmar</button>
            <button className='bg-red-400 hover:bg-red-500 disabled:bg-red-300 rounded p-2 text-white' onClick={() => closeDeleteModal()}>Cancelar</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteModal;