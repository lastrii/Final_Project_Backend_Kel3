'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.products, {
        foreignKey: 'productId',
        targetKey: 'id'
      })
      this.belongsTo(models.users, {
        foreignKey: 'sellerId',
        targetKey: 'id'
      })
      this.belongsTo(models.users, {
        foreignKey: 'buyerId',
        targetKey: 'id'
      })
    }
  }
  transactions.init({
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'products',
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
    bidPrice: DataTypes.STRING,
    isProductAccepted: DataTypes.BOOLEAN,
    sellerResponse: DataTypes.BOOLEAN,
    isCompleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};