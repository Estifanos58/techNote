import { Outlet , Link} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "../../app/api/authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

const PersistLogin = () => {
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)
  return (
    <div>PersistLogin</div>
  )
}

export default PersistLogin