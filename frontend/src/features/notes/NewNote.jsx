import { useSelector } from "react-redux"
import { selectAllUsers } from "../users/userApiSlice"
import NewNoteForm from './NewNoteForm'


function NewNote() {
  const users = useSelector(selectAllUsers)

  const content = users ? <NewNoteForm users={users}/> : <p>loading ...</p>

  return content
}

export default NewNote 