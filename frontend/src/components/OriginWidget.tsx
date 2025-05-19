import { useState, useEffect } from 'react';
import { updateAPIBaseURL, getBaseURL } from '@/services/api';

const OriginWidget = () => {
    const [isSimMode, setIsSimMode] = useState(false);
    const [inputValue, setInputValue] = useState('');
    
    // Initialize based on current API URL and stored mode
    useEffect(() => {
        const simModeStored = localStorage.getItem('simMode') === 'true';
        setIsSimMode(simModeStored);
        
        const currentURL = getBaseURL();
        if (!simModeStored) {
            setInputValue(currentURL.replace('http://', '').replace('/', ''));
        }
    }, []);
    
    const handleIPSubmit = (value: string) => {
        if (!isSimMode) {
            localStorage.setItem('simMode', 'false');
            updateAPIBaseURL(value.trim());
        }
    };
    
    const enableSimMode = () => {
        setIsSimMode(true);
        localStorage.setItem('simMode', 'true');
        updateAPIBaseURL('https://seaweatherstation.onrender.com/');
    };
    
    const enableLiveMode = () => {
        setIsSimMode(false);
        localStorage.setItem('simMode', 'false');
    };
    
    return (
        <div className="gap-3 flex items-center justify-between bg-foreground/60 border-l border-t border-white/60 backdrop-blur-sm p-3 rounded-[12px] shadow-lg w-full">
            {/* Toggle */}
            <div className="flex items-center bg-background rounded-lg p-0.5">
                <button
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all focus:outline-none
                        ${isSimMode ? 'bg-white text-text-accent' : 'bg-transparent text-white hover:bg-foreground/40'}`}
                    onClick={enableSimMode}
                >Simulated</button>
                <button
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all focus:outline-none
                        ${!isSimMode ? 'bg-white text-text-accent' : 'bg-transparent text-white hover:bg-foreground/40'}`}
                    onClick={enableLiveMode}
                >Live</button>
            </div>

            {/* Input field */}
            <div className={`flex items-center gap-2 transition-all duration-300 ease-in-out w-full
                ${isSimMode ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}
            >
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ex: 192.168.1.1"
                    className={`px-2 py-1 text-sm rounded-md bg-white text-text font-bold font-sansation focus:outline-none transition-all duration-300
                        ${isSimMode ? 'w-0 p-0 border-0' : 'w-full'}`}
                    disabled={isSimMode}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleIPSubmit(e.currentTarget.value);
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default OriginWidget;