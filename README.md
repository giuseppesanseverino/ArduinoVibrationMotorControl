# Web app for remote control of vibration motor

## Intro
This project aims to support the investigation of different vibration patters during co-design workshops. 

Contributors: Giuseppe Sanseverino (technical development), Philipp Fabritius (technical support), Lena Marcella Nischwitz (design of vibration patterns)

In the framework of the [Bitplush](https://www.interaktive-technologien.de/projekte/bitplush) project, a co-design workshop is organized to investigate the effect of different vibration patterns to map emotions of a user that is remotely activiating vibration motors inplemented in a plush toy.

In this repositiory the code written to control a vibration motor via a webb app is shared. 

## Material used

1 x Arduino UNO R4 WiFi [link](https://store.arduino.cc/products/uno-r4-wifi)

1 x Seeed studio Grove - Vibration Motor [link](https://wiki.seeedstudio.com/Grove-Vibration_Motor/)

Breakout board & jumper cables

### Connection layout

The connection scheme is shown in the picture below. Please note that in case you use a Grove Vibration Motor from Seeed Studio (as in this project) you will have 4 connections coming out of the breakout board of the motor, make sure to leave the NC not connected.
![ArduinoUNO4-VibrationMot_bb](https://github.com/user-attachments/assets/f427cf47-c015-4b9c-a366-4ac8fb4022e2)

## Code

The Arduino code reported here is doing the following:

1- Connectiong Arduino board to a WiFi network (make sure that the board and the device from where the webapp should be operated are on the same board). IMPORTANT: Arduino Uno R4 WiFi requires a 2.4 GHz network.

2- Once the connection is established, the board will output an IP address in the Arduino IDE Serial Monitor. Copy and paste this in your browser to access the web interface.

3- The buttons in the interface are activating the vibration motor. In the picture below a screen capture of the web application.

<img width="312" alt="Screenshot 2025-05-30 at 15 35 59" src="https://github.com/user-attachments/assets/538d08ed-56fa-4cf3-9540-fa67183bdaa0" />

### Define different vibration patterns

A custom function is created (startVibration) that requires as input the duration of the vibration in ms. Please note that this specific motor can only work in two status: ON (HIGH), or OFF (LOW). Therefore, the only way to generate different patterns is to provide different duration of the vibration or different sequences of vibrations. A delay can be defined to have pauses between two or more vibrations. 

## Additional info

The code reported here only works for Arduino UNO R4 WiFi boards. It can be used with other UNO boards by adding external WiFi module and by removing the code parts that are making use of the integrated led matrix in the R4 WiFi board.

