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
    
    for (let i = 0; i < messageBits.length; i++) {
        const byteIndex = Math.floor(currentPosition / 8);
        const bitIndex = 7 - (currentPosition % 8);
        
        if (byteIndex >= carrierBuffer.length) throw new Error('Carrier too small');
        
        carrierBuffer[byteIndex] = (carrierBuffer[byteIndex] & ~(1 << bitIndex)) | (messageBits[i] << bitIndex);
        
        currentPosition += currentL;
        if (c) currentL = (i % 100 === 0) ? currentL + 1 : currentL;
    }
    
    return carrierBuffer;
}

module.exports = { embedMessage };