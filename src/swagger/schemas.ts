/**
 * @swagger
 * components:
 *   schemas:
 *     UserRole:
 *       type: string
 *       enum: [user, admin]
 *       example: user
 *     
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         status:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - email
 *         - password
 *     
 *     PetPostStatus:
 *       type: string
 *       enum: [pending, approved, rejected]
 *       example: pending
 *     
 *     PetPost:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         pet_name:
 *           type: string
 *           example: Rex
 *         description:
 *           type: string
 *           example: Perro labrador color dorado, se perdió en el parque central.
 *         image_url:
 *           type: string
 *           nullable: true
 *           example: https://example.com/images/rex.jpg
 *         status:
 *           $ref: '#/components/schemas/PetPostStatus'
 *         hasFound:
 *           type: boolean
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *         user_id:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *     
 *     LoginUserDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *       required:
 *         - email
 *         - password
 *     
 *     RegisterUserDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *       required:
 *         - name
 *         - email
 *         - password
 *     
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *     
 *     CreatePetPostDto:
 *       type: object
 *       properties:
 *         pet_name:
 *           type: string
 *           example: Rex
 *         description:
 *           type: string
 *           example: Perro labrador color dorado, se perdió en el parque central.
 *         image_url:
 *           type: string
 *           example: https://example.com/images/rex.jpg
 *       required:
 *         - pet_name
 *         - description
 *     
 *     UpdatePetPostDto:
 *       type: object
 *       properties:
 *         pet_name:
 *           type: string
 *           example: Rex
 *         description:
 *           type: string
 *           example: Perro labrador color dorado, se perdió en el parque central.
 *         image_url:
 *           type: string
 *           example: https://example.com/images/rex.jpg
 *         hasFound:
 *           type: boolean
 *           example: true
 *     
 *     AuthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Login successful
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             token:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */