import { Request, RequestHandler, Response } from 'express';
import bcrypt from 'bcryptjs';

import { User } from 'models';
import { generateJWT } from 'utils';
import { AuthenticatedRequest } from 'interfaces';

const getUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await User.findByPk(req.params.id);
        delete user?.dataValues.password;
        delete user?.dataValues.access_token;
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error });
    }
};

const getUsers = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const users = await User.findAll();
        users.map(user => { 
            delete user.dataValues.password;
            delete user.dataValues.access_token;
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error });
    }
};

const createUser: RequestHandler = async(req: Request, res: Response): Promise<void> => {
    const { email, password, name, role } = req.body;

    try {
        const existingEmail = await User.findOne({ where: { email } });

        if (existingEmail) {
            res.status(400).json({
                ok: false,
                msg: 'Email already registered'
            });
            return;
        }

        const user = new User({
            name, email, password, role,
            access_token: '' // Initialize access_token as empty is requirement
        });
    
        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.get().password = bcrypt.hashSync(password, salt);
    
        // Save user
        await user.save();

        // Generate TOKEN - JWT
        const token = await generateJWT(user.toJSON().id);

        await user.update({ access_token: token});

        delete user.dataValues.password;

        res.status(201);
        res.json({
            ok: true,
            user: { ...user.toJSON() },
        });
    } catch (error) {
        console.log(`[error]: ${error}`);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
}


const updateUser: RequestHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const uid = req.uid;
    const id = req.params.id;

    try {
        let userDB = await User.findByPk(uid);

        if ( !userDB ) {
            res.status(404).json({
                ok: false,
                msg: 'User not found with such id'
            });
        }

        const isAdmin = userDB?.toJSON().role === 'ADMIN';

        if(!isAdmin) delete req.body.role;

        userDB = await User.findByPk(id);

        if ( !userDB ) {
            res.status(404).json({
                ok: false,
                msg: 'User not found with such id'
            });
        }

        const { email, password } = req.body;

        if (email && userDB!.get().email !== email ) {
            const emailExist = await User.findOne({ where: { email } });
            if ( emailExist ) {
                res.status(400).json({
                    ok: false,
                    msg: 'Email already taken'
                });
            }
        }
    
        if(password) {
            // Encrypt password
            const salt = bcrypt.genSaltSync();
            req.body.password = bcrypt.hashSync(password, salt);
        }

        userDB!.update(
            { ...req.body }
        );

        const user = userDB?.toJSON();

        delete user.password;
        delete user.access_token;
    
        res.json({
            ok: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        })
    }

}


const deleteUser: RequestHandler = async(req: Request, res: Response): Promise<void> => {
    const uid = req.params.id;

    try {
        const userDB = await User.findByPk(uid);

        if ( !userDB ) {
            res.status(404).json({
                ok: false,
                msg: 'User not found with such id'
            });
        }

        await User.destroy({ where: { id: uid }});

        
        res.json({
            ok: true,
            msg: 'User deleted'
        });

    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact support'
        });

    }
}

export {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser
}
