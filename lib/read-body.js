let readBody = (req) => {
  return new Promise((resolve, reject) =>{
    let chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
};

module.exports = readBody;