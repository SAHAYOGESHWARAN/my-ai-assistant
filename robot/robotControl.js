const Gpio = require('onoff').Gpio; // For Raspberry Pi

const motor = new Gpio(17, 'out');

const controlRobot = (command) => {
  if (command.includes('move forward')) {
    motor.writeSync(1); // Turn motor on
  } else if (command.includes('stop')) {
    motor.writeSync(0); // Turn motor off
  }
};

module.exports = { controlRobot };
