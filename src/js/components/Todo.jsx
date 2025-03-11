import React, { useState, useEffect, useRef } from "react";
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const getDuty = () => {
    const [lista, setLista] = useState([]);
    const [task, setTask] = useState("");
    const inputRef = useRef(null); 

    const getDuty = async () => {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/juan-salazar");
            console.log(response.status, response.statusText);
            if (response.status === 404) {
                await createUser();
                return;
            }
            const data = await response.json();
            console.log(data.todos);
            setLista(data.todos);
        } catch (error) {
            console.error(error);
        }
    };

    const createUser = async () => {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/juan-salazar", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            console.log(response.status, response.statusText);
            if (response.status === 201) {
                await getDuty();
                return;
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!task.trim()) return; 
        try {
            const response = await fetch("https://playground.4geeks.com/todo/todos/juan-salazar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "label": task,
                    "is_done": false
                })
            });
            console.log(response.status, response.statusText);
            if (response.status === 201) {
                await getDuty();
                setTask("");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            console.log(response.status, response.statusText);
            if (response.status === 204) {
                await getDuty();
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getDuty();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            addTask(e);
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (inputRef.current) {
                inputRef.current.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [task]);

    return (
        <>
            <h1>Todo List</h1>
            <div className="container-md">
                <input
                    ref={inputRef}
                    className="mb-3"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    type="text"
                />
                <Button className="mb-2 ms-3 rounded-pill sticky-sm-top" variant="primary" onClick={(e) => addTask(e)}>Agregar Tarea</Button>

                <ListGroup as="ol" numbered>
                    {lista.map((tarea, index) => (
                        <ListGroup.Item as="li" className="mb-2" key={index}>
                            {tarea.label}
                            <Button className="rounded-pill mb-2" onClick={() => deleteTask(tarea.id)}>
                                <FontAwesomeIcon icon={faXmark} />
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <footer>
                    <Alert variant="dark">
                        <Alert.Heading>Tareas pendientes: {lista.length}</Alert.Heading>
                    </Alert>
                </footer>
            </div>
        </>
    );
};

export default getDuty;