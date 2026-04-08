import Midtrans from 'midtrans-client';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const snap = new Midtrans.Snap({
    isProduction: false,
    clientKey: process.env.MIDTRANS_CLIENT_KEY as string,
    serverKey: process.env.MIDTRANS_SERVER_KEY as string,
});

type ItemReqBody = {
    id: string;
    product: Array<{
        name: string;
        price: number;
        quantity: number;
        priceTotal: number;
    }>;
    priceTotal: number;
}

export const generateToken = async (req: Request, res: Response) => {
    const { id, product, priceTotal } = req.body as ItemReqBody

    // Calculate actual sum of all items in the product array
    const itemsSum = product.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    // Calculate any service fees added in the frontend by subtracting from grand total
    const serviceFee = priceTotal - itemsSum;

    // Convert product array into Midtrans item_details format
    const item_details = [
        ...product.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }))
    ];

    // Append service fee as an item if it exists so gross_amount matches the sum
    if (serviceFee > 0) {
        item_details.push({
            name: "Biaya Layanan",
            price: serviceFee,
            quantity: 1
        });
    }

    const parameter = {
        item_details: item_details,
        transaction_details: {
            order_id: id,
            gross_amount: priceTotal,
        },
        credit_card: {
            secure: true
        }
    };

    const snapToken = await snap.createTransaction(parameter)
    res.json(snapToken)
};