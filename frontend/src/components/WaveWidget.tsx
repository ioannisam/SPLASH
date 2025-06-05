import { getWave } from '@/services/api';
import { useEffect, useState } from 'react';
import { LineChart, Line, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';

const WaveWidget = () => {
    const [runup, setRunup] = useState(null);
    const [runupHistory, setRunupHistory] = useState([]);

    const fetchPressure = async () => {
        try {
            const waveData = await getWave();
            const newRunup = waveData.runup;
            setRunup(newRunup);
            
            // Add new data point to history (with max 10 points)
            setRunupHistory(prevHistory => {
                const newHistory = [...prevHistory, { value: newRunup, time: new Date().getTime() }];
                return newHistory.slice(-10); // Keep only last 10 readings
            });

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchPressure();

        // Set up an interval to fetch data every second
        const intervalId = setInterval(fetchPressure, 1000);
        
        // Clean up the interval when component unmounts
        return () => clearInterval(intervalId);
    }, []);

    // Function to determine safety status and color
    const getSafetyStatus = () => {
        if (runup === null) return { text: 'Unknown', color: '#999' };
        if (runup < 1) return { text: 'Safe', color: '#22c55e' };
        if (runup < 5) return { text: 'Moderate', color: '#f59e0b' };
        return { text: 'Caution', color: '#ef4444' };
    };
    
    const safety = getSafetyStatus();

    return (
        <div className="transition-transform active:scale-95 bg-foreground/60 border-l border-t border-white/60 backdrop-blur-sm text-text font-bold p-3 rounded-[12px] shadow-lg w-full h-40">
            <div className="flex justify-between items-start">
                <h2 className="text-[16px] text-text font-sansation font-bold">Wave Height</h2>
                {runup !== null && (
                    <div className="flex flex-col items-end">
                        <h1 className="text-[20px] text-text-accent font-sansation font-bold">{runup}m</h1>
                        <span 
                            className="text-[12px] font-sansation px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: safety.color, color: '#000' }}
                        >
                            {safety.text}
                        </span>
                    </div>
                )}
            </div>
            
            {runupHistory.length > 0 && (
                <div className="h-20 mt-3">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={runupHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <YAxis domain={[0, 'auto']} hide={true} />
                            <ReferenceLine y={5} stroke="#ef4444" strokeDasharray="3 3" />
                            <ReferenceLine y={1} stroke="#f59e0b" strokeDasharray="3 3" />
                            <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#8884d8" 
                                dot={false} 
                                strokeWidth={2}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default WaveWidget;