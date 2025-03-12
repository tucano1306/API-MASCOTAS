import { Request, Response } from 'express';
import { FinderPetPostService } from '../services/finder-pet-post.service';
import { FinderPetPostsService } from '../services/finder-pet-posts.service';
import { CreatorPetPostService } from '../services/creator-pet-post.service';
import { UpdaterPetPostService } from '../services/updater-pet-post.service';
import { EliminatorPetPostService } from '../services/eliminator-pet-post.service';
import { ApproverPetPostService } from '../services/approver-pet-post.service';
import { RejecterPetPostService } from '../services/rejecter-pet-post.service';

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
      const result = await this.creatorPetPostService.execute(req.body);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  findPetPosts = async (req: Request, res: Response) => {
    try {
      const result = await this.finderPetPostsService.execute();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  findPetPost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.finderPetPostService.execute(id);
      
      if (!result) {
        return res.status(404).json({ message: 'Pet post not found' });
      }
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  updatePetPost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.updaterPetPostService.execute(id, req.body);
      
      if (!result) {
        return res.status(404).json({ message: 'Pet post not found' });
      }
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  deletePetPost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.eliminatorPetPostService.execute(id);
      
      if (!result) {
        return res.status(404).json({ message: 'Pet post not found' });
      }
      
      return res.status(200).json({ message: 'Pet post deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  approvePetPost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.approverPetPostService.execute(id);
      
      if (!result) {
        return res.status(404).json({ message: 'Pet post not found' });
      }
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  rejectPetPost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.rejecterPetPostService.execute(id);
      
      if (!result) {
        return res.status(404).json({ message: 'Pet post not found' });
      }
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}