import { Router } from 'express';
import { check } from 'express-validator';
import { createUser, deleteUser, updateUser, getUser, getUsers } from 'controllers';
import { validateAdminRole, validateAdminRoleSelfUser, validateFields, validateJWT } from 'middlewares';
import { avoidSelfDestruction } from 'middlewares';

const usersRouter = Router();

usersRouter.get('/', validateJWT, validateAdminRole, getUsers);
usersRouter.get('/:id', validateJWT, validateAdminRoleSelfUser, getUser);

usersRouter.post( '/',
    [
        check('name', 'Name is mandatory').not().isEmpty(),
        check('password', 'Password is mandatory').not().isEmpty(),
        check('email', 'Email is mandatory').isEmail(),
        check('role', 'Role is mandatory').not().isEmpty(),
        validateFields,
    ], 
    createUser 
);

usersRouter.put( '/:id',
    [
        validateJWT,
        validateAdminRoleSelfUser,
        validateFields,
    ],
    updateUser
);

usersRouter.delete( '/:id',
    [ 
        validateJWT, 
        validateAdminRole, 
        avoidSelfDestruction 
    ],
    deleteUser
);

export { usersRouter };