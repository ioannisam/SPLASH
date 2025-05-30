#include <SPI.h>
#include <RF22.h>
#include <RF22Router.h>
#include "MPU6050.h"    
#include  <Adafruit_BMP280.h>

#define MY_ADDRESS 1
#define DESTINATION_ADDRESS 2
#define FREQUENCY 440.0
#define BAUD_RATE 9600

RF22Router rf22(MY_ADDRESS);  // Initiate the class to talk to my radio with MY_ADDRESS
Adafruit_BMP280 bmp; //  Initiate the temprature and pressure sensor
MPU6050 mpu; //  Initiate the accelerometer
int16_t ax, ay, az; // accelerometer variables
int16_t gx, gy, gz; // gyroscope variables

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
int offset=0; //calculated in backend

float Pr; //Signal Strength

// we send different type of data at different rates to conserve energy
unsigned long previousMillis = 0;
const long interval = 1000;

void setup() {
  Serial.begin(BAUD_RATE);
  if (!rf22.init()) {
    Serial.println("RF22 init failed");
  }

  if (!rf22.setFrequency(FREQUENCY)) {
    Serial.println("setFrequency Fail");
  }

  // Available power modes for the transmitter in dBm: 1, 2, 5, 8, 11, 14, 17, 20
  rf22.setTxPower(RF22_TXPOW_20DBM);
  rf22.setModemConfig(RF22::GFSK_Rb125Fd125);
  rf22.addRouteTo(DESTINATION_ADDRESS, DESTINATION_ADDRESS);
  for(int pinNumber = 4; pinNumber < 6; pinNumber++) {
    pinMode(pinNumber, OUTPUT);
    digitalWrite(pinNumber, LOW);
  }
  
  mpu.initialize();
  
  //Serial.println(F("BMP280 test"));
  
  if  (!bmp.begin(0x76)) {
  Serial.println(F("ERROR"));
  //  while (1);
  }
  
  /* Default settings from datasheet.  */
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                  Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                  Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                  Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                  Adafruit_BMP280::STANDBY_MS_500);  /* Standby time. */
}

void loop() {
  int counter = 0;
  int initial_time = millis();

  char latStr[10];
  char lonStr[10];
  char sigStr[10];
  char tempStr[10];
  char presStr[10];
  char accStr[10];

  // accelerometer measurements
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  //data.Z = map(az, -17000, 17000, 0, 255);  // Z axis data
  
  float lat = 40.636427;
  float lon = 22.947077;
  float sig = Pr;
  float temp = bmp.readTemperature();
  float pres = bmp.readPressure()/100;
  int acc = az-offset;
  
  dtostrf(lat, 9, 6, latStr);   // width=7, precision=2
  dtostrf(lon, 9, 6, lonStr);   // width=6, precision=2
  dtostrf(sig, 5, 1, sigStr);   // width=7, precision=2
  dtostrf(temp, 4, 1, tempStr);   // width=6, precision=2
  dtostrf(pres, 7, 2, presStr);   // width=7, precision=2
  itoa(acc, accStr, 10);          // convert int to string

  // Transform measured value into a uint8_t variable
  char data_read[RF22_ROUTER_MAX_MESSAGE_LEN];
  uint8_t data_send[RF22_ROUTER_MAX_MESSAGE_LEN];
  memset(data_read, '\0', RF22_ROUTER_MAX_MESSAGE_LEN);
  memset(data_send, '\0', RF22_ROUTER_MAX_MESSAGE_LEN);
  
  //Send all data only every second
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    snprintf(data_read, RF22_ROUTER_MAX_MESSAGE_LEN, "%s:%s:%s:%s:%s:%s", latStr, lonStr, sigStr, tempStr, presStr, accStr);
  } else {
    snprintf(data_read, RF22_ROUTER_MAX_MESSAGE_LEN, "%s", accStr);
  }
  Serial.println(data_read);
  data_read[RF22_ROUTER_MAX_MESSAGE_LEN - 1] = '\0';
  memcpy(data_send, data_read, RF22_ROUTER_MAX_MESSAGE_LEN);

  int number_of_bytes = sizeof(data_send);
  //Serial.print("Number of Bytes= ");
  //Serial.println(number_of_bytes);

  // Sending variable data_send to DESTINATION_ADDRESS
  if (rf22.sendtoWait(data_send, sizeof(data_send), DESTINATION_ADDRESS) != RF22_ROUTER_ERROR_NONE) {
    Serial.println("Failed to sent message");
  } else {
    counter=counter+1;
    uint8_t rssi = rf22.rssiRead();
    Pr=((float)rssi-230.0)/1.8;
    /*
    Serial.print("RSSI= ");
    Serial.print(Pr);
    Serial.println(" dBm");
    Serial.println("Message sent successfully");
    */
  }

  int final_time=millis();
  //print measurments
  /*float throughput=(float)counter*number_of_bytes*1000.0/(final_time-initial_time);

  Serial.print("Throughput=");
  Serial.print(throughput);
  Serial.println("Bytes/s");

  Serial.print("Initial time= ");  
  Serial.print(initial_time);

  Serial.print("Final time= ");  
  Serial.println(final_time);
  Serial.println("");
  delay(2000);*/
}

