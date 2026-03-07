import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', authenticate, isAdmin, async (req, res) => {
    try {
        // Total Revenue
        const orders = await Order.find({ status: { $in: ['paid', 'processing', 'shipped', 'delivered'] } });
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

        // Active Products
        const activeProductsCount = await Product.countDocuments({ isActive: true });

        // Total Users
        const totalUsers = await User.countDocuments();

        // Top 5 best selling products globally
        const topProductsAgg = await Order.aggregate([
            { $match: { status: { $in: ['paid', 'processing', 'shipped', 'delivered'] } } },
            { $unwind: "$products" },
            { $group: { _id: "$products.productId", totalSold: { $sum: "$products.quantity" } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        // Populate top products
        const topProductsRaw = await Product.find({ _id: { $in: topProductsAgg.map(p => p._id) } }, 'name images category price');

        const topProducts = topProductsAgg.map(agg => {
            const prod = topProductsRaw.find(p => p._id.toString() === agg._id.toString());
            return {
                _id: agg._id,
                name: prod ? prod.name : 'Producto Eliminado',
                image: prod && prod.images && prod.images[0] ? prod.images[0] : null,
                totalSold: agg.totalSold
            };
        });

        // Last 5 Orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name email');

        // Revenue by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const monthlyRevenueAgg = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                    status: { $in: ['paid', 'processing', 'shipped', 'delivered'] }
                }
            },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    total: { $sum: "$total" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const formatMonth = (m) => ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][m - 1];

        const monthlyRevenue = monthlyRevenueAgg.map(item => ({
            month: `${formatMonth(item._id.month)} ${item._id.year}`,
            total: item.total
        }));

        // Orders by Status
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const statusMapList = ordersByStatus.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        res.json({
            totalRevenue,
            totalOrders: await Order.countDocuments(),
            activeProducts: activeProductsCount,
            totalUsers,
            topProducts,
            recentOrders,
            monthlyRevenue,
            ordersByStatus: statusMapList
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});

export default router;
