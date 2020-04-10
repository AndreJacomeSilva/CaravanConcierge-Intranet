let testPrivateProps = new WeakMap();

class Test {
  constructor() {
    this.public = "public property";
    testPrivateProps.set(this, { private: 'private property' }); // this is private
  }

  log() {
    Logger.log(this.public);
    Logger.log(testPrivateProps.get(this).private);
  }
}

function testClass() {
  let test = new Test();

  test.log();

  Logger.log("1:" + test.public);
  Logger.log("2:" + test.private);

  Logger.log(JSON.stringify(test));
}