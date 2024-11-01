import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateUserMutation, useDeleteUserMutation } from "./userApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

const USER_REGEX = /^[A-Z].{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%].{4,12}$/;

function EditUserForm({user}) {
    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation();

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delError
    }] = useDeleteUserMutation();

    const navigate = useNavigate();

    const [username, setUsername] = useState(user.username);
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(user.roles);
    const [active, setActive] = useState(user.active)

    useEffect(()=>{
        setValidUsername(USER_REGEX.test(username));
    },[username])

    useEffect(()=>{
        setValidPassword(PWD_REGEX.test(password));
    },[password])

    useEffect(()=>{
        if(isSuccess || isDelSuccess){
            setUsername('');
            setPassword('');
            setRoles([]);
            navigate('/dash/users');
        }
    },[isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value);
    const onPasswordChanged = e => setPassword(e.target.value);
    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions, 
            (option) => option.value
        );
        setRoles(values);
    }
    const onActiveChanged = () => setActive(prev => !prev);

    const onSaveUserClicked = async e => {
        e.preventDefault();
        if(password) {
            await updateUser({
                id: user.id,
                username,
                password,
                roles,
                active
            });
        } else {
            await updateUser({
                id: user.id,
                username,
                roles,
                active
            });
        }
    }

    const onDeleteUserClicked = async () => {
        await deleteUser({id: user.id});
    }

    const option = Option.values(ROLES).map(role => {
        return (
            <option key={role} value={role}>
                {role}
            </option>
        )
    })

    let canSave

    if(password) {
        canSave = [roles.length, validPassword,validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen";
    const validUserClass = !validUsername ? "form__input--incomplete" : "";
    const validPwdClass = password && !validPassword ? "form__input--incomplete" : "";
    const validRolesClass = !Boolean(roles.length) ? "form__input--incomplete" : "";

    const errContent = (error?.data?.message || delError?.data?.message) ?? "";

    const content = (
        <>
        <p className={errClass}>{errContent}</p>

        <form className="form" onSubmit={e => e.preventDefault()}>
            <div className="form__title-row">
                <h2>Edit User</h2>
                <div className="form__action-buttons">
                    <button 
                        className="icon-button" 
                        title="Save" 
                        disabled={!canSave}
                        onClick={onSaveUserClicked}
                    >
                        <FontAwesomeIcon icon={faSave} />
                    </button>
                    <button 
                        className="icon-button" 
                        title="Delete" 
                        disabled={!canSave}
                        onClick={onDeleteUserClicked}
                    >
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </div>
            </div>
            <label htmlFor="username" className="form__lable">Username: <span className="nowrap">[3-20 letters]</span></label>
            <input 
                type="text" 
                className={`form__input ${validUserClass}`}
                id="username"
                name="username"
                autoComplete="off"
                value={username}
                onChange={onUsernameChanged}
            />

            <label htmlFor="password" className="form__lable">
                Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
            <input 
                type="password"
                className={`form__input ${validPwdClass}`}
                id="password"
                name="password"
                autoComplete="off"
                value={password}
                onChange={onPasswordChanged}
            />

            <label htmlFor="user-active" className="form__lable">Active: 
            <input 
                className="form__checkbox"
                type="checkbox"
                id="user-active"
                name="user-active"
                checked={active}
                onChange={onActiveChanged}
            />
            </label>
            <label htmlFor="roles" className="form__lable">
                Assigned Roles:</label>
            <select 
                name="roles" 
                id="roles"
                className={`form_select ${validRolesClass}`}
                multiple={true}
                size='3'
                value={roles}    
                onChange={onRolesChanged}
            >
                {option}
                </select>

        </form>
        </>
    )

    return content
}

export default EditUserForm;
