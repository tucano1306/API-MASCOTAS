import { Request, Response } from 'express';
import { FinderPetPostService } from '../services/finder-pet-post.service';
import { FinderPetPostsService } from '../services/finder-pet-posts.service';
import { CreatorPetPostService } from '../services/creator-pet-post.service';
import { UpdaterPetPostService } from '../services/updater-pet-post.service';
import { EliminatorPetPostService } from '../services/eliminator-pet-post.service';
import { ApproverPetPostService } from '../services/approver-pet-post.service';
import { RejecterPetPostService } from '../services/rejecter-pet-post.service';
import { UserRole } from '../../../data/postgres/models/user.model';

export class PetPostController {
  constructor(
    private readonly finderPetPostService: FinderPetPostService,
    private readonly finderPetPostsService: FinderPetPostsService,
    private readonly creatorPetPostService: CreatorPetPostService,
    private readonly updaterPetPostService: UpdaterPetPostService,
    private readonly eliminatorPetPostService: EliminatorPetPostService,
    private readonly approverPetPostService: ApproverPetPostService,
    private readonly rejecterPetPostService: RejecterPetPostService
  ) {}

  createPetPost = async (req: Request, res: Response) => {
    try {
      // Asignar el usuario autenticado como creador
      const petPostData = {
        ...req.body,
        user_id: req.user!.id
      };
      
      const result = await this.creatorPetPostService.execute(petPostData);
      return res.status(201).json({
        status: 'success',
        message: 'Publicación creada exitosamente',
        data: result
      });
    } catch (error) {
      console.error('Error al crear publicación:', error);
      const message = error instanceof Error ? error.message : 'Error interno del servidor';
      return res.status(500).json({ 
        status: 'error',
        message 
      });
    }
  };

  findPetPosts = async (req: Request, res: Response) => {
    try {
      const result = await this.finderPetPostsService.execute();
      return res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error al buscar publicaciones:', error);
      const message = error instanceof Error ? error.message : 'Error interno del servidor';
      return res.status(500).json({ 
        status: 'error',
        message 
      });
    }
  };

  findPetPost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.finderPetPostService.execute(id);
      
      if (!result) {
        return res.status(404).json({
          status: 'error',
          message: 'Publicación no encontrada'
        });
      }
      
      return res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error al buscar publicación:', error);
      const message = error instanceof Error ? error.message : 'Error interno del servidor';
      return res.status(500).json({ 
        status: 'error',
        message 
      });
    }
  };

  updatePetPost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Verificar si la publicación existe
      const petPost = await this.finderPetPostService.execute(id);
      if (!petPost) {
        return res.status(404).json({
          status: 'error',
          message: 'Publicación no encontrada'
        });
      }
      
      // Verificar permisos: solo el creador o administradores pueden editar
      if (petPost.user_id !== req.user!.id && req.user!.role !== UserRole.ADMIN) {
        return res.status(403).json({
          status: 'error',
          message: 'No tienes permiso para editar esta publicación'
        });
      }
      
      const result = await this.updaterPetPostService.execute(id, req.body);
      
      return res.status(200).json({
        status: 'success',
        message: 'Publicación actualizada exitosamente',
        data: result
      });
    } catch (error) {
      console.error('Error al actualizar publicación:', error);
      const message = error instanceof Error ? error.message : 'Error interno del servidor';
      return res.status(500).json({ 
        status: 'error',
        message 
      });
    }
  };

  deletePetPost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Verificar si la publicación existe
      const petPost = await this.finderPetPostService.execute(id);
      if (!petPost) {
        return res.status(404).json({
          status: 'error',
          message: 'Publicación no encontrada'
        });
      }
      
      // Verificar permisos: solo el creador o administradores pueden eliminar
      if (petPost.user_id !== req.user!.id && req.user!.role !== UserRole.ADMIN) {
        return res.status(403).json({
          status: 'error',
          message: 'No tienes permiso para eliminar esta publicación'
        });
      }
      
      const result = await this.eliminatorPetPostService.execute(id);
      
      return res.status(200).json({
        status: 'success',
        message: 'Publicación eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
      const message = error instanceof Error ? error.message : 'Error interno del servidor';
      return res.status(500).json({ 
        status: 'error',
        message 
      });
    }
  };

  approvePetPost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.approverPetPostService.execute(id);
      
      if (!result) {
        return res.status(404).json({
          status: 'error',
          message: 'Publicación no encontrada'
        });
      }
      
      return res.status(200).json({
        status: 'success',
        message: 'Publicación aprobada exitosamente',
        data: result
      });
    } catch (error) {
      console.error('Error al aprobar publicación:', error);
      const message = error instanceof Error ? error.message : 'Error interno del servidor';
      return res.status(500).json({ 
        status: 'error',
        message 
      });
    }
  };

  rejectPetPost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.rejecterPetPostService.execute(id);
      
      if (!result) {
        return res.status(404).json({
          status: 'error',
          message: 'Publicación no encontrada'
        });
      }
      
      return res.status(200).json({
        status: 'success',
        message: 'Publicación rechazada exitosamente',
        data: result
      });
    } catch (error) {
      console.error('Error al rechazar publicación:', error);
      const message = error instanceof Error ? error.message : 'Error interno del servidor';
      return res.status(500).json({ 
        status: 'error',
        message 
      });
    }
  };
}