import numpy as np

def period(frequency):
    return 1.0 / frequency

def wavelength(period, g=9.81):
    return g*period**2 / (2*np.pi)

def iribarren(height, wavelength, beta):
    return beta / np.sqrt(height/wavelength)

def runup(Hs, L0, beta):

    Hs = float(Hs)
    L0 = float(L0)

    # surf similarity
    xi = iribarren(Hs, L0, beta)
    if xi < 0.3:
        # dissipative
        R2 = 0.043*np.sqrt(Hs*L0)
    else:
        # reflective/intermediate
        term1 = 0.35*beta*np.sqrt(Hs*L0)
        term2 = 0.5*np.sqrt(Hs*L0*(0.563*beta**2 + 0.004))
        R2 = 1.1*(term1+term2)

    # runup > 0.9m is considered dangerous!
    zone = "VE" if R2 >= 0.9 else "AE"
    return R2, zone

def inundation(metrics, slope=0.05):

    try:
        f  = metrics['frequency']
        Hs = metrics['height']
    except KeyError:
        raise ValueError("Missing wave metrics in input data")
    
    if f == 0:
        return {
            'runup': 0.0,
            'zone': "CALM",
            'inundation': 0.0
        }

    T = period(f)
    L0 = wavelength(T)
    beta = slope

    R2, zone = runup(Hs, L0, beta)
    return {
        'runup': round(R2, 2),
        'zone': zone,
        'inundation': round(R2/slope, 2)
    }