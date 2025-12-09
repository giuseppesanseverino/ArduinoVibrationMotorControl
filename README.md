# Web app for remote control of vibration motor

## Intro
This project aims to support the investigation of different vibration patters during co-design workshops. 

Contributors: Giuseppe Sanseverino (technical development & hardware implemetnation), Philipp Fabritius (technical development & frontend), Lena Marcella Nischwitz (design of vibration patterns)

In the framework of the [Bitplush](https://www.interaktive-technologien.de/projekte/bitplush) project, a co-design workshop is organized to investigate the effect of different vibration patterns to map emotions of a user that is remotely activiating vibration motors inplemented in a plush toy.

In this repositiory the code written to control a vibration motor using a web app is shared. 

## Material used

1 x Arduino UNO R4 WiFi [link](https://store.arduino.cc/products/uno-r4-wifi)

1 x Seeed studio Grove - Vibration Motor [link](https://wiki.seeedstudio.com/Grove-Vibration_Motor/)

Breakout board & jumper cables

### Connection layout

The connection scheme is shown in the picture below. Please note that in case you use a Grove Vibration Motor from Seeed Studio (as in this project) you will have 4 connections coming out of the breakout board of the motor, make sure to leave the NC not connected.
![ArduinoUNO4-VibrationMot_bb](https://github.com/user-attachments/assets/f427cf47-c015-4b9c-a366-4ac8fb4022e2)

## Code

The Arduino code reported [here](https://github.com/giuseppesanseverino/VibrationMotorControl/blob/main/WebAppVibrationMotor_ArduinoUNO-R4.ino) is doing the following:

1- Connectiong Arduino board to a WiFi network (make sure that the board and the device from where the webapp should be operated are on the same board). IMPORTANT: Arduino Uno R4 WiFi requires a 2.4 GHz network.

2- Once the connection is established, the board will output an IP address in the Arduino IDE Serial Monitor. Copy and paste this in your browser to access the web interface.

3- The buttons in the interface are activating the vibration motor. In the picture below a screen capture of the web application.

<img width="1454" height="681" alt="Screenshot 2025-12-09 160649" src="https://github.com/user-attachments/assets/8c625766-9657-4888-b473-da7db2cbb3f2" />

Defining Different Vibration Patterns
A custom startVibration function is created that takes the vibration duration in ms as input. Note that this motor only supports ON (HIGH) or OFF (LOW) states. Different patterns are achieved by varying durations or sequences of vibrations, with delays for pauses.

### Define different vibration patterns

A custom function is created (startVibration) that requires as input the duration of the vibration in ms. Please note that this specific motor can only work in two status: ON (HIGH), or OFF (LOW). Therefore, the only way to generate different patterns is to provide different duration of the vibration or different sequences of vibrations. A delay can be defined to have pauses between two or more vibrations. 

## Additional info

The code reported here only works for Arduino UNO R4 WiFi boards. It can be used with other UNO boards by adding external WiFi module and by removing the code parts that are making use of the integrated led matrix in the R4 WiFi board.

## Installation
Pre-Built App: (currently not supported)

Building from Source:
1. Clone this repository: `git clone https://github.com/giuseppesanseverino/VibrationMotorControl.git`
2. Install Node.js from [nodejs.org](https://nodejs.org/en).
3. Navigate to the project: cd VibrationMotorControl/vendor
4. Install dependencies: npm install
5. Build the app: `npm run build`
6. The built files will be in `dist` (e.g., `.exe` for Windows, `.dmg` for macOS). -> Currently only tested on win

## Usage
1. Flash the Arduino:
- Open `WebAppVibrationMotor_ArduinoUNO-R4.ino` in Arduino IDE.
- Upload to your Arduino UNO R4 WiFi.
- Note the IP address from the Serial Monitor. (If it shows 0.0.0.0 check your Router)

2. Run the App:
- Launch the installed desktop app.
- The app starts a local server and opens a window with the control interface.

3. Configure and Control:
- Enter the Arduino's IP address in the app's config section. (It is recommended to assign a fixed IP in router settings)
- Test connectivity.
- Use the buttons to trigger predefined vibration patterns or create custom ones.
- The app communicates directly with the Arduino over the network (It just needs power)
