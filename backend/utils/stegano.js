function embedMessage(carrierBuffer, message, s, l, c) {
    const messageBits = [];
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message + '\0'.repeat(8)); // Null termination
    
    for (let byte of messageData) {
        for (let i = 7; i >= 0; i--) {
            messageBits.push((byte >> i) & 1);
        }
    }
    
    let currentPosition = s;
    let currentL = l;
    const buffer = Buffer.from(carrierBuffer);
    
    for (let i = 0; i < messageBits.length; i++) {
        const byteIndex = Math.floor(currentPosition / 8);
        const bitIndex = 7 - (currentPosition % 8);
        
        if (byteIndex >= buffer.length) throw new Error('Carrier too small');
        
        buffer[byteIndex] = (buffer[byteIndex] & ~(1 << bitIndex)) | (messageBits[i] << bitIndex);
        
        currentPosition += currentL;
        if (c) currentL = (i % 100 === 0) ? currentL + 1 : currentL;
    }
    
    return buffer;
}

function extractMessage(carrierBuffer, s, l, c) {
    let currentPosition = s;
    let currentL = l;
    const messageBytes = [];
    let byte = 0;
    let bitCount = 0;
    const buffer = Buffer.from(carrierBuffer);

    while (true) {
        const byteIndex = Math.floor(currentPosition / 8);
        const bitIndex = 7 - (currentPosition % 8);
        
        if (byteIndex >= buffer.length) break;
        
        const bit = (buffer[byteIndex] >> bitIndex) & 1;
        byte = (byte << 1) | bit;
        bitCount++;
        
        if (bitCount === 8) {
            messageBytes.push(byte);
            if (byte === 0 && messageBytes.slice(-8).every(b => b === 0)) break;
            byte = 0;
            bitCount = 0;
        }
        
        currentPosition += currentL;
        if (c) currentL = (messageBytes.length % 100 === 0) ? currentL + 1 : currentL;
    }

    while (messageBytes.length > 0 && messageBytes[messageBytes.length - 1] === 0) {
        messageBytes.pop();
    }

    return new TextDecoder().decode(new Uint8Array(messageBytes));
}

module.exports = { embedMessage, extractMessage };