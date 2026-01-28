import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './StreamList.css';
import addButton from '../../assets/add_button.svg';
import completeButton from '../../assets/completed_button.svg';
import editButton from '../../assets/edit_button.svg';
import deleteButton from '../../assets/delete_button.svg';
import saveButton from '../../assets/save_button.svg';
import cancelButton from '../../assets/close_button.svg';

const STORAGE_KEY = 'streamlist_items';
const FILTER_KEY = 'streamlist_filter';
const FILTERS = ['all', 'active', 'completed'];

const IconButton = ({ onClick, icon, alt, title, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`icon-button ${className}`}
    title={title}
    aria-label={title}
  >
    <img src={icon} alt={alt} />
  </button>
);

const StreamListItem = ({
  item,
  isEditing,
  editValue,
  onEdit,
  onSave,
  onCancel,
  onComplete,
  onDelete,
  onEditChange,
}) => {
  if (isEditing) {
    return (
      <li className={item.completed ? 'completed' : ''}>
        <div className="edit-mode">
          <input
            type="text"
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            className="edit-input"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSave();
              if (e.key === 'Escape') onCancel();
            }}
          />
          <div className="edit-actions">
            <IconButton
              onClick={onSave}
              icon={saveButton}
              alt="Save"
              title="Save"
              className="save"
            />
            <IconButton
              onClick={onCancel}
              icon={cancelButton}
              alt="Cancel"
              title="Cancel"
              className="cancel"
            />
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={item.completed ? 'completed' : ''}>
      <div className="item-content">
        <span className="item-text">{item.text}</span>
        <div className="item-actions">
          <IconButton
            onClick={onComplete}
            icon={completeButton}
            alt="Toggle complete"
            title={
              item.completed ? 'Mark as incomplete' : 'Mark as complete'
            }
            className="complete"
          />
          <IconButton
            onClick={onEdit}
            icon={editButton}
            alt="Edit"
            title="Edit"
            className="edit"
          />
          <IconButton
            onClick={onDelete}
            icon={deleteButton}
            alt="Delete"
            title="Delete"
            className="delete"
          />
        </div>
      </div>
    </li>
  );
};

const FilterButtons = ({ activeFilter, onFilterChange }) => (
  <div className="filter-buttons">
    {FILTERS.map((filterOption) => (
      <button
        key={filterOption}
        type="button"
        className={activeFilter === filterOption ? 'active' : ''}
        onClick={() => onFilterChange(filterOption)}
      >
        {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
      </button>
    ))}
  </div>
);

const EmptyState = ({ filter, hasItems }) => {
  if (!hasItems) {
    return (
      <p className="empty-message">
        No items yet. Add a movie or show to get started!
      </p>
    );
  }

  if (filter !== 'all') {
    return <p className="empty-message">No {filter} items to display.</p>;
  }

  return null;
};

function StreamList() {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      console.error('Failed to load items from localStorage');
      return [];
    }
  });
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [filter, setFilter] = useState(() => {
    return localStorage.getItem(FILTER_KEY) || 'all';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(FILTER_KEY, filter);
  }, [filter]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    const newItem = {
      id: uuidv4(),
      text: trimmedValue,
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

  const saveEdit = () => {
    const trimmedValue = editValue.trim();
    if (!trimmedValue) return;

    setItems(
      items.map((item) =>
        item.id === editId ? { ...item, text: trimmedValue } : item
      )
    );
    setEditId(null);
    setEditValue('');
  };

  const filteredItems = useMemo(() => {
    if (filter === 'active') return items.filter((item) => !item.completed);
    if (filter === 'completed')
      return items.filter((item) => item.completed);
    return items;
  }, [items, filter]);

  return (
    <div className="streamlist">
      <h1>StreamList</h1>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a movie or show..."
          aria-label="Add new item"
        />
        <button type="submit" className="add-button" aria-label="Add item">
          <img src={addButton} alt="" />
        </button>
      </form>

      <FilterButtons activeFilter={filter} onFilterChange={setFilter} />

      <ul className="items-list">
        {filteredItems.map((item) => (
          <StreamListItem
            key={item.id}
            item={item}
            isEditing={editId === item.id}
            editValue={editValue}
            onEdit={() => startEdit(item.id, item.text)}
            onSave={saveEdit}
            onCancel={cancelEdit}
            onComplete={() => handleComplete(item.id)}
            onDelete={() => handleDelete(item.id)}
            onEditChange={setEditValue}
          />
        ))}
      </ul>

      {filteredItems.length === 0 && (
        <EmptyState filter={filter} hasItems={items.length > 0} />
      )}
    </div>
  );
}

export default StreamList;