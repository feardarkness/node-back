let readBody = (req) => {
  return new Promise((resolve, reject) =>{
    let chunks = [];
    req.on('data', (chunk) => {
      console.log('chunk.toString()=====================================');
      console.log(chunk.toString());
      console.log('=====================================');
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
};

module.exports = readBody;