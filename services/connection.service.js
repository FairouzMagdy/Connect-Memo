const ConnectionRepository = require("../repos/connection.repo");

class ConnectionService {
  async getConnections(userId, status = "pending") {
    return await ConnectionRepository.getConnections(userId, status);
  }

  async sendConnection(fromUserId, toUserId) {
    return await ConnectionRepository.sendConnection(fromUserId, toUserId);
  }

  async acceptConnection(connectionId, toUserId) {
    return await ConnectionRepository.acceptConnection(connectionId, toUserId);
  }

  async cancelConnection(connectionId) {
    return await ConnectionRepository.cancelConnection(connectionId);
  }

  async blockConnection(connectionId, userId) {
    return await ConnectionRepository.blockConnection(connectionId, userId);
  }
  async unblockConnection(connectionId, userId) {
    return await ConnectionRepository.unblockConnection(connectionId, userId);
  }
}

module.exports = new ConnectionService();
