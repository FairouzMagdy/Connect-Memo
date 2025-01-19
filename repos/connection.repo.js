const Connection = require("../models/connection.model");

class ConnectionRepository {
  async getConnections(userId, status = "pending") {
    try {
      const query = {
        $or: [{ from: userId }, { to: userId }],
      };
      if (status === "pending" || status === "accepted" || status === "blocked")
        query.status = status;

      const connections = await Connection.find(query);
      return connections;
    } catch (error) {
      throw error;
    }
  }

  async sendConnection(fromUserId, toUserId) {
    try {
      const existingConnection = await Connection.findOne({
        $or: [
          { from: fromUserId, to: toUserId },
          { to: fromUserId, from: toUserId },
        ],
      });

      if (existingConnection) {
        if (existingConnection.status === "blocked")
          throw new Error("Can NOT send connection request to a blocked user");
        else
          throw new Error(
            "A connection request already exists between these users"
          );
      }

      const newConnection = await Connection.create({
        from: fromUserId,
        to: toUserId,
        status: "pending",
      });

      if (!newConnection) throw new Error("Failed to create connection");

      return newConnection;
    } catch (error) {
      throw error;
    }
  }

  async acceptConnection(connectionId, toUserId) {
    try {
      const connection = await Connection.findOneAndUpdate(
        { _id: connectionId, to: toUserId, status: "pending" }, // authenticated user
        {
          status: "accepted",
          connectedAt: new Date(),
        },
        { new: true }
      );

      if (!connection) throw new Error("No connection found with this id");

      return connection;
    } catch (error) {
      throw error;
    }
  }

  async cancelConnection(connectionId) {
    try {
      const connection = await Connection.findOneAndDelete({
        _id: connectionId,
        status: { $in: ["pending", "accepted"] },
      });

      if (!connection) throw new Error("No connection found with this id");

      return connection;
    } catch (error) {
      throw error;
    }
  }

  async blockConnection(connectionId, userId) {
    try {
      const connection = await Connection.findOne({
        _id: connectionId,
        $or: [{ from: userId }, { to: userId }],
      });

      if (!connection) throw new Error("No connection found with this id");

      if (connection.status === "blocked") {
        throw new Error("This connection is already blocked");
      }

      connection.status = "blocked";
      await connection.save();

      return connection;
    } catch (error) {
      throw error;
    }
  }

  async unblockConnection(connectionId, userId) {
    try {
      const connection = await Connection.findOne({
        _id: connectionId,
        to: userId,
        status: "blocked",
      });

      if (!connection) throw new Error("No connection found with this id");

      connection.status = "pending";
      connection.requestedAt = new Date();
      await connection.save();

      return connection;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ConnectionRepository();
