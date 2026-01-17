import { useState } from 'react';
import './StreamList.css';
import addButton from '../../assets/add_button.svg'
import completeButton from '../../assets/completed_button.svg';
import editButton from '../../assets/edit_button.svg';
import deleteButton from '../../assets/delete_button.svg';
import saveButton from '../../assets/save_button.svg';
import cancelButton from '../../assets/close_button.svg';

function StreamList() {
    const [inputValue, setInputValue] = useState('');
    const [items, setItems] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [filter, setFilter] = useState('all');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputValue.trim() === '') return;
        
        const newItem = {
            id: `${Date.now()}-${Math.random()}`,
            text: inputValue,
            completed: false,
        };

        setItems([...items, newItem]);
        setInputValue('');
    };

    const handleDelete = (id) => {
        setItems(items.filter((item) => item.id !== id));
        if (editId === id) {
            setEditId(null);
            setEditValue('');
        }
    };

    const handleComplete = (id) => {
        setItems(
            items.map((item) => 
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        );
    };

    const startEdit = (id, text) => {
        setEditId(id);
        setEditValue(text);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditValue('');
    };

    const saveEdit = (id) => {
        if (editValue.trim() === '') return;

        setItems(
            items.map((item) =>
                item.id === id ? { ...item, text: editValue } : item
            )
        );
        setEditId(null);
        setEditValue('');
    };

    const getFilteredItems = () => {
        if (filter === 'active') {
            return items.filter((item) => !item.completed);
        }
        if (filter === 'completed') {
            return items.filter((item) => item.completed);
        }
        return items;
    };

    const filteredItems = getFilteredItems();

    return (
        <div className='streamlist'>
            <h1>StreamList</h1>

            <form onSubmit={handleSubmit} className='input-form'>
                <input
                    type='text'
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder='Enter a movie or show...'
                />
                <button type='submit' className='add-button'>
                    <img src={addButton} alt='Add' />
                </button>
            </form>

            <div className='filter-buttons'>
                <button
                    type='button'
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    type='button'
                    className={filter === 'active' ? 'active' : ''}
                    onClick={() => setFilter('active')}
                >
                    Active
                </button>
                <button
                    type='button'
                    className={filter === 'completed' ? 'active' : ''}
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
            </div>

            <ul className='items-list'>
                {filteredItems.map((item) => {
                    const isEditing = editId === item.id;

                    return (
                        <li key={item.id} className={item.completed ? 'completed' : ''}>
                            {isEditing ? (
                                <div className='edit-mode'>
                                    <input
                                        type='text'
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className='edit-input'
                                        autoFocus
                                    />
                                    <div className='edit-actions'>
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                saveEdit(item.id);
                                            }}
                                            className='icon-button save'
                                            title='Save'
                                        >
                                            <img src={saveButton} alt='Save' />
                                        </button>
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                cancelEdit();
                                            }}
                                            className='icon-button cancel'
                                            title='Cancel'
                                        >
                                            <img src={cancelButton} alt='Cancel' />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className='item-content'>
                                    <span className='item-text'>{item.text}</span>
                                    <div className='item-actions'>
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleComplete(item.id);
                                            }}
                                            className='icon-button complete'
                                            title={
                                                item.completed
                                                    ? 'Mark as incomplete'
                                                    : 'Mark as complete'   
                                            }
                                        >
                                            <img src={completeButton} alt='Complete' />
                                        </button>
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEdit(item.id, item.text);
                                            }}
                                            className='icon-button edit'
                                            title='Edit'
                                        >
                                            <img src={editButton} alt='Edit' />
                                        </button>
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(item.id);
                                            }}
                                            className='icon-button delete'
                                            title='Delete'
                                        >
                                            <img src={deleteButton} alt='Delete' />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>

            {filteredItems.length === 0 && items.length === 0 && (
                <p className='empty-message'>
                    No items yet. Add a movie or show to get started!
                </p>
            )}

            {filteredItems.length === 0 && (items.length === 0 || items.length > 0) && (filter === 'active' || filter === 'completed') && (
                <p className='empty-message'>No {filter} items to display.</p>
            )}
        </div>
    );
}

export default StreamList;