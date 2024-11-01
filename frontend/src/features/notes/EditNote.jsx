import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectNoteById } from "./notesApiSlice"
import { selectAllUsers } from "../users/userApiSlice"
import EditUserForm from "../users/EditUserForm"

function EditNote() {
   const {id} = useParams()

   const note = useSelector(state => selectNoteById(state, id))
   const users = useSelector(selectAllUsers)

   const content = note && users ? <EditUserForm note={note} users={users} /> : <p>Loading ...</p>

   return content
}

export default EditNote