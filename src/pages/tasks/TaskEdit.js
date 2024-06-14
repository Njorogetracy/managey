import React from 'react';
import editStyles from '../../styles/Edit.module.css';
import { Form, Button } from 'react-bootstrap';

function TaskEdit() {
    return (
        <div className="card">
            <div className="card-body">
                <h3 className="card-title">Create a New Task</h3>
                <Form >
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            className="form-control"                
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            className="form-control"
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date</label>
                        <input
                            type="date"
                            id="dueDate"
                            className="form-control"
                           
                            required
                        />
                    </div>
                    <Button type="submit" className="btn btn-primary mt-3">
                        Create Task
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default TaskEdit