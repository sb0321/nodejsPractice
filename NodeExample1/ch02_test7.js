var os = require('os');

console.log('시스템의 hostnam : %s', os.hostname());
console.log('시스템의 메모리 : %d / %d', os.freemem(), os.totalmem());
console.log("시스템의 CPU 정보\n");
console.log(os.cpus());
console.dir(os.networkInterfaces());