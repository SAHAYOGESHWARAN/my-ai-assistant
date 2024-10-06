const Gpio = require('onoff').Gpio; // GPIO control for Raspberry Pi

const motor = new Gpio(17, 'out'); // Pin 17

const controlRobot = (command) => {
  if (command.includes('move forward')) {
    motor.writeSync(1); // Turn motor on
    console.log('Moving forward');
  } else if (command.includes('stop')) {
    motor.writeSync(0); // Turn motor off
    console.log('Stopping');
  } else {
    console.log('No valid robot command found');
  }
};

module.exports = { controlRobot };
