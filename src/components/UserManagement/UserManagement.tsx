import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './UserManagement.module.css'

interface Users {
    id: number;
    name: string;
}


const UserManagement: React.FC = () => {

    const [users, setUsers] = useState<Users[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [filteredUsers, setFilteredUsers] = useState<Users[]>([])
    const [isModal, setIsModal] = useState<boolean>(false)
    const [editingUser, setEditingUser] = useState<Users | null>(null)

    useEffect(() => {
        async function FetchUser() {
            try {
                setLoading(true)
                const response = await axios.get('https://jsonplaceholder.typicode.com/users');
                setUsers(response.data)
                setFilteredUsers(response.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }

        }
        
        FetchUser()
    }, [])

    useEffect(() => {
        const filtered = users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered)
    }, [search, users])

    if (loading) {
        return <div>Loading...</div>
    }

    const handleDeleteUser = (id: number) => {
       const updatedUser = users.filter((user) => user.id !== id)
        setUsers(updatedUser);
        setFilteredUsers(updatedUser);
    }
    
    const handleUpdateUser = (id: number, newName: string) => {
        const editUsers = users.map((user) =>
          user.id === id ? { ...user, name: newName } : user
        );
        setUsers(editUsers);
        setFilteredUsers(editUsers);
    }

    const handleEditUser = (user: Users) => {
        setEditingUser(user);
        setIsModal(true);
    }

    const handleSaveEdit = () => {
      if (editingUser) {
        handleUpdateUser(editingUser.id, editingUser.name);
        setIsModal(false)
        setEditingUser(null)
      }
    }

    const handleCancelEditi = () => {
        setIsModal(false)
        setEditingUser(null)
    }

    return (
      <div>
        <h1>Panel user management</h1>
        <input
        className={styles.inputSearchName}
          type="text"
          placeholder="Write name.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className={styles.list}>
          {filteredUsers.map((user) => (
            <li className={styles.item} key={user.id}>
              {user.name}
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              <button onClick={() => handleEditUser(user)}>Edit</button>
            </li>
          ))}
        </ul>
        {isModal && editingUser && (
          <div className={styles.editWrapper}>
            <h2>Edit user</h2>
            <input
            placeholder='Write name..'
            className={styles.inputEditName}
              type="text"
              value={editingUser.name || ""}
              onChange={(e) =>
                setEditingUser((prevUser) =>
                  prevUser ? { ...prevUser, name: e.target.value } : null
                )
              }
            />
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={handleCancelEditi}>Cancel</button>
          </div>
        )}
      </div>
    );
}

export default UserManagement