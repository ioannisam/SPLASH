import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import background from '@/assets/background.svg';

const About = () => {
    const navigate = useNavigate();
    
    return (
        <div className="w-screen lg:px-[20rem] md:px-[8rem] min-h-screen p-4 text-text bg-cover bg-center" style={{backgroundImage: `url(${background})`}}>
            <div className="flex justify-between items-center mb-6 mt-6">
                <div className="flex flex-col items-start">
                    <h2 className="text-3xl font-exile">About</h2>
                    <h1 className="text-5xl font-exile">O.C.E.A.N</h1>
                </div>
                
                <button 
                    onClick={() => {
                        setTimeout(() => {
                            navigate('/')
                        }, 300)
                    }}
                    className="bg-foreground/60 transition-transform active:scale-95
                    backdrop-blur-sm flex items-center text-text shadow-lg 
                    border-l border-t border-white/60 font-sansation font-bold focus:outline-none"
                >
                    <ArrowLeft className="mr-2" size={20} />
                    Back
                </button>
            </div>
            
            <div className="bg-foreground/60 backdrop-blur-sm p-6 rounded-[12px] shadow-lg border-l border-t border-white/60">
                <h2 className="text-2xl font-sansation font-bold mb-4">Observation Coastal Environmental Analytics Node</h2>
                
                <p className="mb-4 text-text-secondary">
                    This project implements a remote weather station. The premise is to use multiple Arduino devices to create a network of data nodes. These nodes will monitor temperature, pressure and estimated wave shore impact/height at sea level. Collected data will then be displayed in a web application, to be used by fishermen, researchers or hobbyists.
                </p>
                
                <h3 className="text-xl font-sansation font-bold mt-6 mb-2">Features</h3>
                <ul className="list-disc pl-5 text-text-secondary">
                    <li>Temperature and pressure measurement</li>
                    <li>Wave characteristics estimation</li>
                    <li>Wind speed and direction analysis</li>
                    <li>Coastal inundation and flood risk assessment</li>
                    <li>Early warning system for extreme weather events</li>
                    <li>Real-time data visualization</li>
                </ul>
                
                <h3 className="text-xl font-sansation font-bold mt-6 mb-2">Who we are</h3>
                <ul className="list-disc pl-5 text-text-secondary font-bold font-sansation">
                    <li>Iasonas Lamprinidis</li>
                    <li>Ioannis Michalainas</li>
                    <li>Savvas Tzanetis</li>
                    <li>Vasileios Zoidis</li>
                </ul>
                
                <h3 className="text-xl font-sansation font-bold mt-6 mb-2">Git-Hub Page</h3>
                <p className="text-text-secondary">
                    The entire project is open-source and available on GitHub. You can find the code as well as any documentation 
                    at <a href="https://github.com/ioannisam/SeaWeatherStation" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">github.com/ioannisam/SeaWeatherStation</a>.
                </p>
            </div>
            <br />
        </div>
    );
}

export default About;