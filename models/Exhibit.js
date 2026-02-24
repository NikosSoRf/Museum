module.exports = (sequelize, DataTypes) => {
    const Exhibit = sequelize.define('Exhibit', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      creationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      collectionType: {
        type: DataTypes.ENUM('painting', 'sculpture', 'artifact', 'document', 'other'),
        allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      isOnDisplay: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      addedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'exhibits',
      timestamps: false
    });
  
    return Exhibit;
  };