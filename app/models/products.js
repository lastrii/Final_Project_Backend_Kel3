'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.category, {
        foreignKey: 'categoryId',
        targetKey: 'id'
      })
      this.belongsTo(models.users, {
        foreignKey: 'userId',
        targetKey: 'id'
      })
    }
  }
  products.init({
    name: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'category',
        key: 'id'
      }
    },
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};