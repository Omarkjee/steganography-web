const fs = require('fs');

function embedMessage(filePath, message, S, L, C, outputPath, callback) {
  fs.readFile(filePath, (err, buffer) => {
    if (err) return callback(err);

    const bits = Buffer.from(message).reduce((acc, byte) =>
      acc.concat(byte.toString(2).padStart(8, '0').split('')), []);

    let pos = S;
    let step = L;
    for (let i = 0; i < bits.length; i++) {
      if (pos >= buffer.length) break;
      buffer[pos] = (buffer[pos] & 0xFE) | parseInt(bits[i]); // Replace LSB
      if (C === 'double') step *= 2;
      pos += step;
    }

    fs.writeFile(outputPath, buffer, callback);
  });
}

module.exports = { embedMessage };
