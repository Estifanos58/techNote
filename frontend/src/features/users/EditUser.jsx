import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUserById } from "./userApiSlice"
import EditUserForm from "./EditUserForm";

import { useGetUsersQuery } from "./userApiSlice";
import PulseLoader from 'react-spinners/PulseLoader'
function EditUser() {
  const { id } = useParams();
  // const user = useSelector(state => selectUserById(state, id));

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) =>({
      user: data?.entities[id]
    }),
  })

  if(!user) return <PulseLoader color="#FFF" />
  
  const content = <EditUserForm user={user} /> 

  return content
}

export default EditUser