import { useState } from 'react';
import './StreamList.css';
import addButton from '../../assets/add_button.svg'

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
            <div className='enterstreamlistlabel'>
                <h3>Enter movies or shows to your list:</h3>
            </div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder='Enter a movie or show...'
                />
                <button className='image-button'>
                    <img src={addButton} alt='add_button' className='add-button' />
                </button>
            </form>
        </div>
    );
}

export default StreamList;