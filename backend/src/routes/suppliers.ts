import express, { Request, Response } from 'express';

const router = express.Router();

// Mock suppliers data
const mockSuppliers = [
  {
    id: 1,
    name: 'Fresh Foods Co',
    category: 'Groceries',
    minOrder: 500,
    rating: 4.8,
    deliveryDays: 2,
    location: 'Mumbai'
  },
  {
    id: 2,
    name: 'Premium Clothing Inc',
    category: 'Clothing',
    minOrder: 1000,
    rating: 4.5,
    deliveryDays: 3,
    location: 'Delhi'
  },
  {
    id: 3,
    name: 'Electronics Plus',
    category: 'Electronics',
    minOrder: 2000,
    rating: 4.7,
    deliveryDays: 2,
    location: 'Bangalore'
  },
  {
    id: 4,
    name: 'Home Essentials Ltd',
    category: 'Home',
    minOrder: 750,
    rating: 4.3,
    deliveryDays: 3,
    location: 'Pune'
  },
  {
    id: 5,
    name: 'Beauty & Personal Care',
    category: 'Beauty',
    minOrder: 300,
    rating: 4.6,
    deliveryDays: 2,
    location: 'Hyderabad'
  }
];

// Get all suppliers
router.get('/all', (req: Request, res: Response) => {
  res.json(mockSuppliers);
});

// Find suppliers by category
router.get('/category/:category', (req: Request, res: Response) => {
  try {
    const category = req.params.category;
    const suppliers = mockSuppliers.filter(s => 
      s.category.toLowerCase().includes(category.toLowerCase())
    );
    res.json(suppliers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Find best suppliers by rating
router.get('/best-rated', (req: Request, res: Response) => {
  try {
    const sorted = [...mockSuppliers].sort((a, b) => b.rating - a.rating);
    res.json(sorted.slice(0, 5));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Search suppliers
router.post('/search', (req: Request, res: Response) => {
  try {
    const { category, maxMinOrder, minRating } = req.body;
    
    let results = mockSuppliers;
    
    if (category) {
      results = results.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (maxMinOrder) {
      results = results.filter(s => s.minOrder <= maxMinOrder);
    }
    if (minRating) {
      results = results.filter(s => s.rating >= minRating);
    }

    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
