/*=================================
This code demostrates 4-Wire Touch screen 
interfacing with Arduino

blog.circuits4you.com
www.circuits4you.com

4- Wire Touchscreen Connections
A0=====X+
A1=====X-
A2=====Y+
A3=====Y-
=================================*/
//Define your Touch screen connections
#define X1 A0
#define X2 A1 
#define Y1 A2   
#define Y2 A3 

#define MIN_X 50
#define MAX_X 900

#define MIN_Y 120
#define MAX_Y 900

#define PRESSURE_THRESHOLD 500

void setup()
{
  Serial.begin(9600);
}
  
void loop()
{
  int X,Y, PRESSURE; //Touch Coordinates are stored in X,Y variable
  pinMode(Y1,INPUT);
  pinMode(Y2,INPUT);  
  digitalWrite(Y2,LOW);
  pinMode(X1,OUTPUT);
  digitalWrite(X1,HIGH);
  pinMode(X2,OUTPUT);
  digitalWrite(X2,LOW);
  delayMicroseconds(100);
  X = ((float)(analogRead(Y1) - MIN_X) / (MAX_X - MIN_X)) * 100;
  
  
  pinMode(X1,INPUT);
  pinMode(X2,INPUT);
  digitalWrite(X2,LOW);
  pinMode(Y1,OUTPUT);
  digitalWrite(Y1,HIGH);
  pinMode(Y2,OUTPUT);
  digitalWrite(Y2,LOW);
  delayMicroseconds(100);
  Y = ((float)(analogRead(X1) - MIN_Y) / (MAX_Y - MIN_Y)) * 100;
  
  // READ PRESSURE
    // Set X+ to ground
  // Set Y- to VCC
  // Hi-Z X- and Y+
  pinMode(X1, OUTPUT);
  pinMode(Y1, INPUT);
  
  digitalWrite(X1, LOW);
  digitalWrite(Y2, HIGH); 
  
  int z1 = analogRead(X2); 
  int z2 = analogRead(Y1);
  
  PRESSURE = (1023-(z2-z1));
  if (PRESSURE < PRESSURE_THRESHOLD) {
    X = 0;
    Y = 0;
  }
  delayMicroseconds(100);
  //Display X and Y on Serial Monitor
  Serial.print("X = ");  
  Serial.println(X);
  Serial.print("Y = ");
  Serial.println(Y);
  Serial.print("PRESSURE = ");
  Serial.println(PRESSURE);
  delay(200);
}
