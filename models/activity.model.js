const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./user.model");

class Activity extends Model {}

Activity.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
      },
      attachment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      update: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ugc: {
        type: DataTypes.BOOLEAN,
      },
      
    },
    {
      sequelize,
      modelName: "activity",
    }
  );
  
  module.exports = Activity;
  