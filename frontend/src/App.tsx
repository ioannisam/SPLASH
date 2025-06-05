import { motion, AnimatePresence } from 'framer-motion';
import background from '@/assets/background.svg';
import logo from '@/assets/logo_index.png';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

import { checkStatus } from '@/services/api';
import { getWave } from '@/services/api';

import WeatherWidget from '@/components/CondWidget';
import TempWidget from '@/components/TempWidget';
import PressWidget from '@/components/PressWidget';
import WindWidget from '@/components/WindWidget';
import StatusWidget from '@/components/StatusWidget';
import WaveWidget from '@/components/WaveWidget';
import AboutWidget from '@/components/AboutWidget';
import AlertWidget from '@/components/AlertWidget';
import ShoreWidget from '@/components/ShoreWidget';
import OriginWidget from '@/components/OriginWidget';

const App = () => {
  const [showConnectionAlert, setShowConnectionAlert] = useState(false);
  const [showTsunamiAlert, setShowTsunamiAlert] = useState(false);
  const [locationName, setLocationName] = useState('Loading...');

  const fetchStatus = async () => {
    try {
      const statusData = await checkStatus();
      if (!statusData) {
        setShowConnectionAlert(true);
        setLocationName('No Connection');
      } else {
        setShowConnectionAlert(false);

        // Get location name from statusData
        const data = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${statusData.lat}&lon=${statusData.lon}&format=json`
        );
        const locationData = await data.json();
        const locationName = `${locationData.address.city}, ${locationData.address.country}`;
        setLocationName(locationName);

      }
    } catch (error) {
      console.error('Error fetching status data:', error);
      setShowConnectionAlert(true);
    }
  };

  const fetchAlert = async () => {
    try {
      const waveData = await getWave();
      
      // Determine alert type based on zone
      if (waveData.zone === 'VE' || waveData.zone === 'V') {
        // Coastal high-risk zones with wave action
        setShowTsunamiAlert(true); // Using same alert for now, could create a separate coastal hazard alert
      } else if (waveData.zone === 'AE' && waveData.runup > 5) {
        // High risk flood zone with significant runup
        setShowTsunamiAlert(true);
      } else if (waveData.inundation > 10) {
        // Extreme inundation regardless of zone
        setShowTsunamiAlert(true);
      } else {
        setShowTsunamiAlert(false);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchAlert();

    // Set up an intervals
    const intervalId = setInterval(fetchStatus, 10000);
    const alertIntervalId = setInterval(fetchAlert, 10000);

    // Clean up the interval when component unmounts
    return () => {
      clearInterval(intervalId);
      clearInterval(alertIntervalId);
    };
  }, []);

  const handleConnectionAlertClose = () => {
    setShowConnectionAlert(false);
  };

  const handleTsunamiAlertClose = () => {
    setShowTsunamiAlert(false);
  };

  return (
    <main
      className="min-h-screen p-4 w-screen bg-cover bg-center lg:w-screen-minus lg:px-[20rem] md:w-screen-minus md:px-[8rem]"
      style={{backgroundImage: `url(${background})` }}>
      <div className="mx-auto">

        {/* Title */}
        <div className="flex items-center font-bold mt-6">
          <img src={logo} alt="Logo" className="mb-2.5 w-8 h-8 mr-4" />
          <h1 className="text-text text-[2.5rem] font-exile pb-2 font-bold">S.P.L.A.S.H</h1>
        </div>
        
        {/* Location */}
        <div className="flex items-center font-bold mt-6">
          <MapPin className="text-text-accent text-[4rem]" strokeWidth={2.5} />
          <h2 className="text-text-accent font-sansation text-[1.1rem] ml-1">{locationName}</h2>
        </div>
          
        {/* Connection Alert */}
        <AnimatePresence> {showConnectionAlert && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 16 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <AlertWidget 
              onClose={handleConnectionAlertClose}
              title="Connection Error"
              severity='low'
              description="The weather station is currently offline. Please check your connection."
            />
           </motion.div>
        )} </AnimatePresence>
        
        {/* Tsunami Alert */}
        <AnimatePresence> {showTsunamiAlert && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 16 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <AlertWidget 
              onClose={handleTsunamiAlertClose}
              title="Tsunami Warning"
              severity='high'
              description="A tsunami warning has been issued for the area. Please evacuate immediately."
            />
          </motion.div>
        )} </AnimatePresence>
        
        {/* Widgets */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <WeatherWidget />
          <TempWidget />
        </div>

        <div className="mt-4">
          <WaveWidget />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <PressWidget />
          <WindWidget />
        </div>

        <div className="mt-4">
          <StatusWidget />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <AboutWidget />
          <ShoreWidget />
        </div>

        {/* Change backend origin */}
        <div className="mt-4">
          <OriginWidget />
        </div>

        <br />
      </div>
    </main>
  )
}

export default App;
