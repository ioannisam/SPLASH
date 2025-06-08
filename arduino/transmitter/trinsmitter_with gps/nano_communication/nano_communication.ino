#include <Wire.h>
#include <TinyGPS++.h>
#include <SoftwareSerial.h>

static const int RXPin = 2, TXPin = 3;
static const uint32_t GPSBaud = 9600;

TinyGPSPlus gps;
SoftwareSerial ss(RXPin, TXPin);

char gpsData[20] = "00.000000:00.000000"; // Placeholder

void setup() {  
  Serial.begin(9600);
  ss.begin(GPSBaud);

  Wire.begin(0x08);              // I2C slave address
  Wire.onRequest(sendData);     // register request handler
}

void loop() {
  if (ss.available() > 0) {
    gps.encode(ss.read());
    // Update GPS string only if new valid location is available
    if (gps.location.isUpdated()) {
      float lat = gps.location.lat();
      float lon = gps.location.lng();
      
      // Buffers for lat/lon strings
      char latStr[10]; // "xx.xxxxxx" + null
      char lonStr[10];

      // dtostrf(value, width, precision, buffer)
      dtostrf(lat, 9, 6, latStr);  // width=9 includes possible minus sign
      dtostrf(lon, 9, 6, lonStr);

      // Combine into final format: "lat:lon"
      snprintf(gpsData, sizeof(gpsData), "%s:%s", latStr, lonStr);

      // Optional debug
      Serial.print("Updated: ");
      Serial.println(gpsData);
    }
  }
}

void sendData() {
  Wire.write(gpsData, 20); // send latest coordinates
}
