// import { useSelector } from "react-redux"
// import { selectAllUsers } from "../users/userApiSlice"
import NewNoteForm from './NewNoteForm'
import { useGetUsersQuery } from "../users/userApiSlice"
import PulseLoader from "react-spinners/PulseLoader"

function NewNote() {
  // const users = useSelector(selectAllUsers)
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id => data?.entities[id])
    })
  })

  if(!users?.length) return <PulseLoader />

  const content = <NewNoteForm users={users}/>

  return content
}

export default NewNote 