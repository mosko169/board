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
#define MAX_Y 870

#define HEIGHT 400
#define WIDTH 800

#define PRESSURE_THRESHOLD 400

char data[100];

void setup()
{
  Serial.begin(9600);
}

float normalize(int value, int minVal, int maxVal) {
  return min(1, max(0, (float)(value - minVal)) / (maxVal - minVal));
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
  X = analogRead(Y1);
  X = normalize(X, MIN_X, MAX_X) * WIDTH;
  
  
  pinMode(X1,INPUT);
  pinMode(X2,INPUT);
  digitalWrite(X2,LOW);
  pinMode(Y1,OUTPUT);
  digitalWrite(Y1,HIGH);
  pinMode(Y2,OUTPUT);
  digitalWrite(Y2,LOW);
  delayMicroseconds(100);
  Y = analogRead(X1);
  Y = normalize(Y, MIN_Y, MAX_Y) * HEIGHT;
  
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
    PRESSURE = 0;
  } else {
    PRESSURE = 1;
  }
  sprintf(data, "%d,%d,%d", X,Y,PRESSURE);
  Serial.println(data);

  delay(20);
}
