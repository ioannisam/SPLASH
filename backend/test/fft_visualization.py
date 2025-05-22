import sys
import os
import time
import numpy as np
import matplotlib.pyplot as plt

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from sensors.handler import SerialHandler
from analysis.wave_analysis import wave_metrics

def capture_test_data(duration=30):
    """Capture live/simulated accelerometer data (raw LSB values)"""
    handler = SerialHandler()
    samples = []
    
    print(f"Capturing {duration} seconds of data...")
    for _ in range(duration*100):  # 100Hz × duration
        samples.extend(handler.get_accel_history())
        time.sleep(0.01)
    
    return np.array(samples)

def plot(test_data, save_path=None):
    """Visualize converted data (m/s²) and FFT results"""
    # convert raw LSB to m/s² (same as wave_analysis.py)
    lsb_to_ms2 = 9.81 / 16384  # MPU6050 ±2g scale
    data_ms2 = test_data * lsb_to_ms2
    data_ms2 = data_ms2 - np.mean(data_ms2)  # remove DC offset

    # time domain plot (m/s²)
    plt.figure(figsize=(12, 6))
    plt.subplot(2, 1, 1)
    plt.plot(np.arange(len(data_ms2))/100, data_ms2)
    plt.title("Accelerometer Data (m/s²)")
    plt.xlabel("Time (s)")
    plt.ylabel("Acceleration (m/s²)")

    # FFT
    n = len(data_ms2)
    yf = np.fft.fft(data_ms2)
    xf = np.linspace(0.0, 100/2, n//2)
    
    # raw LSB data (for consistency)
    metrics = wave_metrics(test_data.tolist())
    
    plt.subplot(2, 1, 2)
    plt.plot(xf, 2.0/n * np.abs(yf[:n//2]))
    plt.title("FFT Analysis")
    plt.xlabel("Frequency (Hz)")
    plt.ylabel("Magnitude")
    plt.axvline(metrics['frequency'], color='r', linestyle='--', 
               label=f"Dominant {metrics['frequency']:.2f} Hz")
    plt.legend()

    # x-axis limit to 10 Hz
    plt.xlim(0, 10)

    plt.tight_layout()
    if save_path:
        plt.savefig(save_path)
        print(f"Figure saved to {save_path}")
    plt.show()

if __name__ == "__main__":
    raw_data = capture_test_data()
    plot(raw_data, save_path="fft_visualization.png")