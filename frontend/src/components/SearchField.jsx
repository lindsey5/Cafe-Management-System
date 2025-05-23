import MicRoundedIcon from '@mui/icons-material/MicRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton } from '@mui/material';
import { useState, useRef } from 'react';

const SearchField = ({ setSearchTerm, searchTerm }) => {
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef(null);

    const initRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
        alert('Speech Recognition not supported in this browser.');
        return null;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US'; 
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        setSearchTerm(transcript);
        };

        recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
        };

        recognition.onend = () => {
        if (listening) {
            recognition.start(); 
        }
        };

        return recognition;
    };

    const toggleListening = () => {
        if (!listening) {
            const recognition = initRecognition();
            if (recognition) {
                recognition.start();
                recognitionRef.current = recognition;
                setListening(true);
            }
        } else {
            recognitionRef.current?.stop();
            setListening(false);
        }
    };


    return <div className="max-w-[500px] flex-1 relative">
        <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border-1 
            border-gray-400 outline-none px-6 py-3" 
            placeholder="Search item name"
        />
        <IconButton
            onClick={toggleListening}
            sx={{
                position: 'absolute',
                right: 5,
                top: '50%',
                transform: 'translateY(-50%)'
            }}
        >
            {listening ? <CloseRoundedIcon /> : <MicRoundedIcon />}
        </IconButton>
    </div>
}

export default SearchField