import { useState } from 'react';
import './StreamList.css';

function StreamList() {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('User Input: ', inputValue);
        setInputValue('');
    }

    return (
        <div className='streamlist'>
            <h1>Stream List</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder='Enter a movie or show...'
                />
                <button type='submit'>Add</button>
            </form>
        </div>
    );
}

export default StreamList;