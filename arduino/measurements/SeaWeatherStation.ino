#include "MPU6050.h"    
#include  <Adafruit_BMP280.h>

Adafruit_BMP280 bmp; // I2C Interface

MPU6050 mpu;
int16_t ax, ay, az;
int16_t gx, gy, gz;

struct MyData {
  byte X;
  byte Y;
  byte Z;
  byte GX;
  byte GY;
  byte GZ;
};

MyData data;

//We should calculate offsets!
int offset=16450;

// Generally, you should use "unsigned long" for variables that hold time
// The value will quickly become too large for an int to store
unsigned long previousMillis = 0;
// constants won't change:
const long interval = 1000;

const int analogInPin = A0;  // Analog input pin that the voltage devider is attached to
int sensorValue = 0;  // value read
float battery_level = 0;

float mapfloat(float x, float in_min, float in_max, float out_min, float out_max)
{
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

void setup() {

  Serial.begin(9600);
  
  
  Serial.println(F("BMP280 test"));
  if  (!bmp.begin(0x76)) {
  Serial.println(F("Could not find a valid BMP280 sensor,  check wiring!"));
  //while (1);
  }
  
  /* Default settings from datasheet.  */
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                  Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                  Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                  Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                  Adafruit_BMP280::STANDBY_MS_500);  /* Standby time. */
mpu.initialize();
}

void loop() {
  
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  //data.Z = map(az, -17000, 17000, 0, 255);  // Z axis data
  
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    
    //BATTERY LEVEL (IF USED)
    // read the analog in value:
    //ensorValue = analogRead(analogInPin);
    //sensorValue = map(sensorValue, 0, 1023, 0, 100); // percentage (have to calculate operating window to be useful)
    //battery_level = analogRead(analogInPin)*(9.00 / 1023.00); // actual voltage (adjust to full battery level!)
    //Serial.print(battery_level);
    //Serial.print(":");
    
    //MEASURMENTS
    Serial.print(40.636427, 6); //Latitude
    Serial.print(":");
    Serial.print(22.947077, 6); //Longitude
    Serial.print(":");
    Serial.print(-39); //Signal Strength
    Serial.print(":");
    Serial.print(bmp.readTemperature()); // in *C degrees
    Serial.print(":");
    Serial.print(bmp.readPressure()/100);  //displaying the Pressure in hPa, you can change the unit
    Serial.print(":");
  }
  Serial.print(az);
  Serial.println();
  //delay(1000);
}
