import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './testCaseList.css'; // Import the CSS file

const TestCaseList = () => {
    const [testCases, setTestCases] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [editedTestCase, setEditedTestCase] = useState({});

    useEffect(() => {
        axios.get('http://localhost:8000/testcases/')
            .then(response => {
                setTestCases(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the test cases!', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTestCase({ ...editedTestCase, [name]: value });
    };

    const handleEdit = (testCase) => {
        setIsEditing(testCase.id);
        setEditedTestCase(testCase);
    };

    const handleSave = (id) => {
        axios.put(`http://localhost:8000/testcases/${id}/`, editedTestCase)
            .then(response => {
                setTestCases(testCases.map(tc => tc.id === id ? response.data : tc));
                setIsEditing(null);
            })
            .catch(error => {
                console.error('There was an error updating the test case!', error);
            });
    };

    return (
        <div className="test-case-list-container">
            <table className="test-case-list">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Estimate Time (in minutes)</th>
                        <th>Module</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {testCases.length === 0 ? (
                        <tr>
                            <td colSpan="6">No test cases available.</td>
                        </tr>
                    ) : (
                        testCases.map(tc => (
                            <tr key={tc.id}>
                                <td>{isEditing === tc.id ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedTestCase.name}
                                        onChange={handleChange}
                                    />
                                ) : tc.name}</td>
                                <td>{isEditing === tc.id ? (
                                    <input
                                        type="number"
                                        name="estimate_time"
                                        value={editedTestCase.estimate_time}
                                        onChange={handleChange}
                                    />
                                ) : tc.estimate_time}</td>
                                <td>{isEditing === tc.id ? (
                                    <input
                                        type="text"
                                        name="module"
                                        value={editedTestCase.module}
                                        onChange={handleChange}
                                    />
                                ) : tc.module}</td>
                                <td>{isEditing === tc.id ? (
                                    <input
                                        type="text"
                                        name="priority"
                                        value={editedTestCase.priority}
                                        onChange={handleChange}
                                    />
                                ) : tc.priority}</td>
                                <td>{isEditing === tc.id ? (
                                    <select
                                        name="status"
                                        value={editedTestCase.status}
                                        onChange={handleChange}
                                    >
                                        <option value="pass">Pass</option>
                                        <option value="fail">Fail</option>
                                    </select>
                                ) : tc.status}</td>
                                <td>
                                    {isEditing === tc.id ? (
                                        <button onClick={() => handleSave(tc.id)}>Save</button>
                                    ) : (
                                        <button onClick={() => handleEdit(tc)}>Edit</button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TestCaseList;
