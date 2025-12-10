import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from 'src/schemas/orders.schemas';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { User } from 'src/schemas/user.schemas';
import { sendEmail } from '../utils/sendEmail';


@Injectable()
export class OrdersService {
    constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) { }

    async create(createOrderDto: CreateOrderDto, user: any): Promise<Order> {
        const { products, shippingInfo, totalPrice } = createOrderDto;

        const mergedProducts: { productId: string; quantity: number }[] = [];

        for (const item of products) {
            const productId = item.productId.toString(); // always string

            const existing = mergedProducts.find(p => p.productId === productId);
            if (existing) {
                existing.quantity += item.quantity;
            } else {
                mergedProducts.push({ productId, quantity: item.quantity });
            }
        }

        const newOrder = new this.orderModel({
            userId: user.userId,      // JWT user ID
            products: mergedProducts,
            totalPrice,
            shippingInfo,             // shipping info from frontend
        });

        return newOrder.save();
    }




    async findAll(): Promise<Order[]> {
        return this.orderModel.find().populate('userId').populate('products.productId').exec();
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.orderModel.findById(id).populate('userId').populate('products.productId').exec();
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    async findByUser(userId: string): Promise<Order[]> {
        return this.orderModel
            .find({ userId })
            .populate({
                path: 'products.productId',
                select: 'name price image',
                model: 'Product',
            })
            .sort({ createdAt: -1 })
            .exec();
    }

    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
        const updatedOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
        if (!updatedOrder) throw new NotFoundException('Order not found');
        return updatedOrder;
    }

    async delete(id: string): Promise<Order> {
        const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
        if (!deletedOrder) throw new NotFoundException('Order not found');
        return deletedOrder;
    }

    async updateStatus(orderId: string, status: string) {
        const order = await this.orderModel.findById(orderId).populate('userId');
        if (!order) throw new NotFoundException('Order not found');

        order.status = status;
        await order.save();

        // Send email to user
        //         const user = order.userId as User;
        //         await sendEmail(
        //             user.email,
        //             `Your order ${order._id} status updated`,
        //             `<p>Hello ${user.name},</p>
        //    <p>Your order status is now: <b>${status}</b>.</p>
        //    <p>Thank you for shopping with us!</p>`
        //         );


        return order;
    }
}
