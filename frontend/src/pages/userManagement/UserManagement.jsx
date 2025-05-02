import { useState, useEffect } from "react";
import { getFactoryWorkersByCompanyId, addFactoryWorker, deleteFactoryWorker, updateFactoryWorker } from "../../api/apiService.js";
import "./UserManagement.scss";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [newUserData, setNewUserData] = useState({
        position: "Factory Worker", // Default position
        name: "",
        department: "",
        phone: "",
        email: "",
    });

    const [editingUserId, setEditingUserId] = useState(null);
    const [editedUserData, setEditedUserData] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getFactoryWorkersByCompanyId();
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Failed to fetch factory workers:", error);
            }
        };

        fetchUsers();
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleAddUser = () => {
        setIsAddingUser(true);
    };

    const handleSaveUser = async () => {
        if (Object.values(newUserData).some((value) => value === "")) {
            alert("Please fill in all the fields.");
            return;
        }

        try {
            const addedUser = await addFactoryWorker(newUserData);
            setUsers([...users, addedUser]);
            setIsAddingUser(false);
            setNewUserData({
                position: "Factory Worker", // Reset to default
                name: "",
                department: "",
                phone: "",
                email: "",
            });
        } catch (error) {
            console.error("Failed to add factory worker:", error);
            alert("Failed to add factory worker. Please try again.");
        }
    };

    const handleCancel = () => {
        setIsAddingUser(false);
        setNewUserData({
            position: "Factory Worker", // Reset to default
            name: "",
            department: "",
            phone: "",
            email: "",
        });
        setEditingUserId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleEdit = (userId) => {
        setEditingUserId(userId);
        const userToEdit = users.find((user) => user._id === userId);
        setEditedUserData({ ...userToEdit });
    };

    const handleSaveEditedUser = async () => {
        try {
            const updatedUser = await updateFactoryWorker(editingUserId, editedUserData);
            const updatedUsers = users.map((user) =>
                user._id === updatedUser._id ? updatedUser : user
            );
            setUsers(updatedUsers);
            setEditingUserId(null);
            setEditedUserData({});
        } catch (error) {
            console.error("Failed to update factory worker:", error);
            alert("Failed to update factory worker. Please try again.");
        }
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleDelete = async (userId) => {
        try {
            await deleteFactoryWorker(userId);
            const updatedUsers = users.filter((user) => user._id !== userId);
            setUsers(updatedUsers);
        } catch (error) {
            console.error("Failed to delete factory worker:", error);
            alert("Failed to delete factory worker. Please try again.");
        }
    };

    return (
        <div className="user-management">
            <div className="header">
                <button className="add-user-btn" onClick={handleAddUser}>+ Add New User</button>
                <input className="search-bar" type="text" placeholder="Search" />
            </div>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Position</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Mobile Number</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user, index) => (
                        <tr key={user._id}>
                            {editingUserId === user._id ? (
                                <>
                                    <td>{indexOfFirstUser + index + 1}</td>
                                    <td>
                                        <select
                                            name="position"
                                            value={editedUserData.position}
                                            onChange={handleEditInputChange}
                                        >
                                            <option value="Factory Worker">Factory Worker</option>
                                            <option value="Maintenance Staff">Maintenance Staff</option>
                                        </select>
                                    </td>
                                    <td><input type="text" name="name" value={editedUserData.name} onChange={handleEditInputChange} /></td>
                                    <td><input type="text" name="department" value={editedUserData.department} onChange={handleEditInputChange} /></td>
                                    <td><input type="text" name="phone" value={editedUserData.phone} onChange={handleEditInputChange} /></td>
                                    <td><input type="text" name="email" value={editedUserData.email} onChange={handleEditInputChange} /></td>
                                    <td>
                                        <button className="save-btn" onClick={handleSaveEditedUser}>Save</button>
                                        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{indexOfFirstUser + index + 1}</td>
                                    <td>{user.position}</td>
                                    <td>{user.name}</td>
                                    <td>{user.department}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleEdit(user._id)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(user._id)}>Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                    {isAddingUser && (
                        <tr>
                            <td>{users.length + 1}</td>
                            <td>
                                <select
                                    name="position"
                                    value={newUserData.position}
                                    onChange={handleInputChange}
                                >
                                    <option value="Factory Worker">Factory Worker</option>
                                    <option value="Maintenance Staff">Maintenance Staff</option>
                                </select>
                            </td>
                            <td><input type="text" name="name" value={newUserData.name} onChange={handleInputChange} placeholder="Name" /></td>
                            <td><input type="text" name="department" value={newUserData.department} onChange={handleInputChange} placeholder="Department" /></td>
                            <td><input type="text" name="phone" value={newUserData.phone} onChange={handleInputChange} placeholder="Mobile Number" /></td>
                            <td><input type="text" name="email" value={newUserData.email} onChange={handleInputChange} placeholder="Email" /></td>
                            <td>
                                <button className="save-btn" onClick={handleSaveUser}>Save</button>
                                <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination">
                {[...Array(totalPages).keys()].map((number) => (
                    <button
                        key={number + 1}
                        className={`page-btn ${currentPage === number + 1 ? "active" : ""}`}
                        onClick={() => handlePageChange(number + 1)}
                    >
                        {number + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default UserManagement;
