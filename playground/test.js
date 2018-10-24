const myFunc = () => {
  const mytestPromise = async () => {
    new Promise((resolve, reject) => {
      console.log(`inside my promise`);
      resolve();
    })
  };

  console.log('before timeout');
  const result = setTimeout(mytestPromise, 2000);
  console.log('after timeout');

}




myFunc('dog', 'cat', 'fish');