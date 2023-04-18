import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react'
import { useAppState } from '../../store'

export default function UsersTable() {

    const [state, dispatch] = useAppState();
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        getUsersList();
    })

    const getUsersList = async () => {
        try {
            const { data } = await axios.get('/api/admin/users/getuserslist', {
                headers: {
                    'Authorization': Cookies.get('user_auth_token')
                }
            })
            setUsersList(data);
        } catch (error) {
            console.error(error);
        }
    }

    const verifyUser = async (id) => {
        try {
            const { data } = await axios.post('/api/admin/verifyuser', {
                "_id": id,
            }, {
                headers: {
                    'Authorization': Cookies.get('user_auth_token')
                }
            })
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (usersList && Array.isArray(usersList) && usersList.length > 0 ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-700 "> {/* dark:text-gray-200 */ ""}
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 "> {/* dark:bg-gray-700 dark:text-gray-400 */ ""}
                    <tr>
                        <th scope="col" className="px-6 py-3">_id</th>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {usersList.map((user, index) => {
                        return (
                            <tr key={index} className={"border-b hover:bg-gray-100 " + (index%2 == 0 ? "bg-white": "bg-gray-50")}> {/* dark:bg-gray-900 dark:border-gray-700 */ ""}
                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{/* dark:text-white */}{user._id}</td>
                                <td className="px-6 py-4">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.isNewUser ? "Unverified" : "Verified"}</td>
                                <td className="px-6 py-4 w-full flex justify-around flex-wrap">
                                    { user.isNewUser ? <button onClick={(e) => {verifyUser(user._id)}} className="px-2 py-1 bg-green text-white rounded-md border-2 border-green hover:bg-transparent hover:text-green">Verify</button> : null}
                                    {/* <button className="px-2 py-1 bg-blue text-white rounded-md border-2 border-blue hover:bg-transparent hover:text-blue">Edit</button>
                                    <button className="px-2 py-1 bg-danger text-white rounded-md border-2 border-danger hover:bg-transparent hover:text-danger">Delete</button> */}
                                    {/* <a href="#" className="font-medium text-blue-600 hover:underline">Edit</a> */}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    ) : <>Empty Table.....</>
    )
}
