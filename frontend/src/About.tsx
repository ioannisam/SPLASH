import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import background from '@/assets/background.svg';

const About = () => {
    const navigate = useNavigate();
    
    return (
        <div className="md:w-screen-minus lg:px-[20rem] md:px-[8rem] w-screen min-h-screen p-4 text-text bg-cover bg-center" style={{backgroundImage: `url(${background})`}}>
            <div className="flex justify-between items-center mb-6 mt-6">
                <div className="flex flex-col items-start">
                    <h2 className="text-3xl font-exile">About</h2>
                    <h1 className="text-4xl font-exile">S.P.L.A.S.H</h1>
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
                <h2 className="text-2xl font-sansation font-bold mb-4">Sea Parameter Logging And Sensor Hub</h2>
                <p className="mb-4 text-text-secondary">
                    This project implements a remote weather station. The premise is to use multiple Arduino devices 
                    to create a network of data nodes. These nodes will monitor temperature, pressure and estimated wave 
                    shore impact/height at sea level. Collected data will then be displayed in a web application, to be used 
                    by fishermen, researchers or hobbyists.
                </p>
                
                <h3 className="text-xl font-sansation font-bold mt-6 mb-2">Features</h3>
                <ul className="list-disc pl-5 text-text-secondary space-y-1">
                    <li>Temperature and pressure measurement</li>
                    <li>Wave characteristics estimation</li>
                    <li>Wind speed and direction analysis</li>
                    <li>Coastal inundation and flood risk assessment</li>
                    <li>Early warning system for extreme weather events</li>
                    <li>Real-time data visualization</li>
                </ul>

                <h3 className="text-xl font-sansation font-bold mt-6 mb-2">How to use</h3>
                <p className="text-text-secondary">
                    For testing purposes, you can select the <span className="font-semibold">Simulation</span> option at the bottom of the main page to visualize formatted data.
                </p>
                
                <p className="mt-2 text-text-secondary">To gather actual data:</p>
                <ol className="space-y-1 list-decimal pl-5 text-text-secondary">
                    <li>Set up the Arduino drone and connect it to a computer acting as backend server</li>
                    <li>The server will communicate with the drone through a second Arduino using a pair of RF22 modules</li>
                    <li>Connect the backend server with the web application by selecting the <span className="font-semibold">Live</span> option on the main page</li>
                    <li>Enter the server's local IP address and port</li>
                </ol>

                <div className="bg-foreground/30 p-3 rounded-md mt-3 border-white/40 text-text-secondary">
                    <span className="font-semibold">Note:</span> The backend server will need to have an open port to view the data from different networks.
                </div>
                
                <h3 className="text-xl font-sansation font-bold mt-6 mb-2">Who we are</h3>
                <ul className="space-y-1 list-disc pl-5 text-text-secondary font-bold font-sansation">
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