export const config = {
  paddle: {
    width: 60,
    height: 10,
    offset: 10
  },
  player: {
    speed: 7,
  },
  computer: {
    speed: 7,
  },
  ball: {
    size: 10,
    speed: 8,
    deltaAngle: Math.PI / 8,
    acceleration: 1.02,
  },
  court: {
    offset: 10,
  },
  line: {
    height: 5
  },
  points: {
    offset: {
      left: 5,
      centerLine: 7
    },
    font: {
      size: 30,
      name: "Orbitron",
    }
  },
  centerLine: {
    width: 4,
    height: 4,
  },
  secondsPerFrame: 1000 / 70,
  gamePoint: 3,
};
