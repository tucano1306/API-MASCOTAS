/**
 * @swagger
 * /pet-posts:
 *   post:
 *     summary: Crea una nueva publicación de mascota
 *     tags: [PetPosts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePetPostDto'
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Publicación creada exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/PetPost'
 *       400:
 *         description: Error en la validación de datos
 *       401:
 *         description: No autorizado
 *
 *   get:
 *     summary: Obtiene todas las publicaciones de mascotas
 *     tags: [PetPosts]
 *     responses:
 *       200:
 *         description: Lista de publicaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PetPost'
 *       401:
 *         description: No autorizado
 *
 * /pet-posts/{id}:
 *   get:
 *     summary: Obtiene una publicación por ID
 *     tags: [PetPosts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/PetPost'
 *       404:
 *         description: Publicación no encontrada
 *       401:
 *         description: No autorizado
 *
 *   patch:
 *     summary: Actualiza una publicación
 *     tags: [PetPosts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la publicación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePetPostDto'
 *     responses:
 *       200:
 *         description: Publicación actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Publicación actualizada exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/PetPost'
 *       404:
 *         description: Publicación no encontrada
 *       403:
 *         description: No tiene permisos para actualizar esta publicación
 *       401:
 *         description: No autorizado
 *
 *   delete:
 *     summary: Elimina una publicación
 *     tags: [PetPosts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Publicación eliminada exitosamente
 *       404:
 *         description: Publicación no encontrada
 *       403:
 *         description: No tiene permisos para eliminar esta publicación
 *       401:
 *         description: No autorizado
 *
 * /pet-posts/{id}/approve:
 *   patch:
 *     summary: Aprueba una publicación
 *     tags: [PetPosts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación aprobada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Publicación aprobada exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/PetPost'
 *       404:
 *         description: Publicación no encontrada
 *       403:
 *         description: No tiene permisos para aprobar esta publicación
 *       401:
 *         description: No autorizado
 *
 * /pet-posts/{id}/reject:
 *   patch:
 *     summary: Rechaza una publicación
 *     tags: [PetPosts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación rechazada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Publicación rechazada exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/PetPost'
 *       404:
 *         description: Publicación no encontrada
 *       403:
 *         description: No tiene permisos para rechazar esta publicación
 *       401:
 *         description: No autorizado
 */