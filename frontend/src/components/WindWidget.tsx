import { CircleChevronUp } from 'lucide-react';
import { getWeather } from '@/services/api';
import { useEffect, useState } from 'react';

const WindWidget = () => {
    const [wind, setWind] = useState(null);
    const [windIcon, setWindIcon] = useState(<CircleChevronUp className="text-text" strokeWidth={2} size={50} />);
    const [windDescription, setWindDescription] = useState(null);

    const fetchWind = async () => {
        try {
            const weatherData = await getWeather();
            const windDirection = weatherData.wind_direction;
            setWind(weatherData.wind_speed);
            
            // Set wind icon based on direction
            if (windDirection <= 22.5 && windDirection > 337.5) {
                // North
                setWindIcon(<CircleChevronUp className="text-text" strokeWidth={2} size={50}/>);
            } else if (windDirection > 22.5 && windDirection <= 67.5) {
                // Northeast
                setWindIcon(<CircleChevronUp className="text-text" style={{transform: 'rotate(45deg)'}} strokeWidth={2} size={50}/>);
            } else if (windDirection > 67.5 && windDirection <= 112.5) {
                // East
                setWindIcon(<CircleChevronUp className="text-text" style={{transform: 'rotate(90deg)'}} strokeWidth={2} size={50}/>);
            } else if (windDirection > 112.5 && windDirection <= 157.5) {
                // Southeast
                setWindIcon(<CircleChevronUp className="text-text" style={{transform: 'rotate(135deg)'}} strokeWidth={2} size={50}/>);
            } else if (windDirection > 157.5 && windDirection <= 202.5) {
                // South
                setWindIcon(<CircleChevronUp className="text-text" style={{transform: 'rotate(180deg)'}} strokeWidth={2} size={50}/>);
            } else if (windDirection > 202.5 && windDirection <= 247.5) {
                // Southwest
                setWindIcon(<CircleChevronUp className="text-text" style={{transform: 'rotate(225deg)'}} strokeWidth={2} size={50}/>);
            } else if (windDirection > 247.5 && windDirection <= 292.5) {
                // West
                setWindIcon(<CircleChevronUp className="text-text" style={{transform: 'rotate(270deg)'}} strokeWidth={2} size={50} />);
            } else if (windDirection > 292.5 && windDirection <= 337.5) {
                // Northwest
                setWindIcon(<CircleChevronUp className="text-text" style={{transform: 'rotate(315deg)'}} strokeWidth={2} size={50} />);
            }

            if (weatherData.wind_speed < 4) {
                setWindDescription('Calm Winds');
            } else if (weatherData.wind_speed >= 4 && weatherData.wind_speed <= 8) {
                setWindDescription('Moderate Winds');
            } else {
                setWindDescription('Strong Winds');
            }
        } catch (error) {
            console.error('Error fetching pressure data:', error);
        }
    };

    useEffect(() => {
        fetchWind();

        // Set up an interval to fetch data every 3m
        const intervalId = setInterval(fetchWind, 180000);
        
        // Clean up the interval when component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="transition-transform active:scale-95 bg-foreground/60 border-l border-t border-white/60 backdrop-blur-sm p-3 rounded-[12px] shadow-lg w-full h-36">
            <h2 className="text-[16px] text-text font-sansation font-bold">Wind</h2>
            {wind !== null && (
                <div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="flex flex-col justify-center h-[calc(100%-50px)] mt-3.5">
                            <h1 className="text-[32px] text-text-accent font-sansation font-bold">{wind}</h1>
                            <h3 className="text-[11px] text-text font-bold font-sansation">km/h</h3>
                            <h3 className="text-[11px] text-text-secondary font-sansation mt-2">{windDescription}</h3>
                        </div>
                        <div className="flex flex-col items-center justify-center mt-[-48px] mr-4">
                            <h3 className="text-text text-[12px] font-bold font-sansation">N</h3>
                            {windIcon}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WindWidget;