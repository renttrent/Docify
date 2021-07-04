const Docify = artifacts.require("Docify");

module.exports = function (deployer) {
  deployer.deploy(Docify);
};
