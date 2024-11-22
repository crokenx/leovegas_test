import { sequelize } from '../utils';
import { User } from './user.model';

// Define relationships (if any)
const initModels = async () => {
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
};

export { User, initModels };
