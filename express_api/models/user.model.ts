import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../utils';

class User extends Model {}
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('USER', 'ADMIN'),
    access_token: DataTypes.STRING,
},
{
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: false,
});

export { User };

