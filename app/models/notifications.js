'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.transactions, {
        foreignKey: "transactionId"
      })
    }
  }
  notifications.init({
    transactionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'transactions',
        key: 'id'
      }
    },
    sellerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    buyerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    productName: DataTypes.STRING,
    price: DataTypes.INTEGER,
    bidPrice: DataTypes.STRING,
    status: DataTypes.TEXT,
    message: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'notifications',
  });
  
  return notifications;
};