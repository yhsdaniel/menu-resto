import prisma from '../db/prisma.js'

const tableOrderDetailInclude = {
    tableOrderMenus: {
        include: {
            menu: true
        }
    },
    payment: true
};

const menuDetailInclude = {
    tableOrderMenus: {
        include: {
            tableOrder: {
                include: {
                    payment: true
                }
            }
        }
    }
};

const paymentDetailInclude = {
    tableOrder: {
        include: {
            tableOrderMenus: {
                include: {
                    menu: true
                }
            },
            payment: true
        }
    }
};

const allowedOrderStatuses = new Set(['pending', 'paid']);
const allowedPaymentMethods = new Set(['cash', 'qris', 'card']);

const parsePositiveInt = (value) => {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
        return null;
    }

    return parsedValue;
};

const parseAmount = (value) => {
    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
        return null;
    }

    return parsedValue;
};

const buildMenuPayload = (payload) => {
    const {
        name,
        description,
        price,
        imageUrl,
        categoryId,
        isAvailable = true,
        isPopular = false
    } = payload;

    if (typeof name !== 'string' || name.trim() === '') {
        throw new Error('name wajib diisi.');
    }

    if (typeof description !== 'string' || description.trim() === '') {
        throw new Error('description wajib diisi.');
    }

    const parsedPrice = Number(price);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        throw new Error('price harus berupa angka 0 atau lebih.');
    }

    if (typeof imageUrl !== 'string' || imageUrl.trim() === '') {
        throw new Error('imageUrl wajib diisi.');
    }

    if (typeof categoryId !== 'string' || categoryId.trim() === '') {
        throw new Error('categoryId wajib diisi.');
    }

    return {
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        imageUrl: imageUrl.trim(),
        categoryId: categoryId.trim(),
        isAvailable: Boolean(isAvailable),
        isPopular: Boolean(isPopular)
    };
};

const formatTableOrder = (tableOrder) => {
    const { tableOrderMenus, ...tableOrderData } = tableOrder;

    return {
        ...tableOrderData,
        menus: tableOrderMenus.map((tableOrderMenu) => ({
            id: tableOrderMenu.menu.id,
            name: tableOrderMenu.menu.name,
            description: tableOrderMenu.menu.description,
            price: tableOrderMenu.menu.price,
            imageUrl: tableOrderMenu.menu.imageUrl,
            categoryId: tableOrderMenu.menu.categoryId,
            isAvailable: tableOrderMenu.menu.isAvailable,
            isPopular: tableOrderMenu.menu.isPopular,
            createdAt: tableOrderMenu.menu.createdAt,
            updatedAt: tableOrderMenu.menu.updatedAt,
            quantity: tableOrderMenu.quantity,
            notes: tableOrderMenu.notes,
            tableOrderMenuId: tableOrderMenu.id,
        }))
    };
};

const formatMenu = (menu) => {
    const { tableOrderMenus, ...menuData } = menu;

    return {
        ...menuData,
        tableOrders: tableOrderMenus.map((tableOrderMenu) => ({
            id: tableOrderMenu.tableOrder.id,
            tableNumber: tableOrderMenu.tableOrder.tableNumber,
            totalPrice: tableOrderMenu.tableOrder.totalPrice,
            status: tableOrderMenu.tableOrder.status,
            createdAt: tableOrderMenu.tableOrder.createdAt,
            updatedAt: tableOrderMenu.tableOrder.updatedAt,
            payment: tableOrderMenu.tableOrder.payment,
            quantity: tableOrderMenu.quantity,
            tableOrderMenuId: tableOrderMenu.id,
        }))
    };
};

const formatPayment = (payment) => ({
    ...payment,
    tableOrder: formatTableOrder(payment.tableOrder)
});

export const createNewMenu = async (req, res) => {
    try {
        const menu = await prisma.menu.create({
            data: buildMenuPayload(req.body)
        });

        res.status(200).json(menu);
    } catch (error) {
        console.error('ERROR DETAIL', error);
        const statusCode = error.message?.includes('tidak valid') ? 400 : 500;
        res.status(statusCode).json({ error: error.message });
    }
}

export const getAllMenus = async (req, res) => {
    const menu = await prisma.menu.findMany({
        include: menuDetailInclude
        // orderBy: {
        //     createdAt: 'desc'
        // }
    });
    res.status(200).json(menu.map(formatMenu));
}

export const getMenuById = async (req, res) => {
    const parsedId = parsePositiveInt(req.params.id);

    if (!parsedId) {
        return res.status(400).json({ error: 'id menu tidak valid.' });
    }

    const menu = await prisma.menu.findUnique({
        where: {
            id: parsedId,
        },
        include: menuDetailInclude
    });

    if (!menu) {
        return res.status(404).json({ error: 'Menu tidak ditemukan.' });
    }

    res.status(200).json(formatMenu(menu));
}

export const updateMenu = async (req, res) => {
    const parsedId = parsePositiveInt(req.params.id);

    if (!parsedId) {
        return res.status(400).json({ error: 'id menu tidak valid.' });
    }

    try {
        const menu = await prisma.menu.update({
            where: {
                id: parsedId,
            },
            data: buildMenuPayload(req.body)
        });

        res.status(200).json(menu);
    } catch (error) {
        console.error('ERROR DETAIL', error);
        const statusCode = error.message?.includes('wajib') || error.message?.includes('harus')
            ? 400
            : 500;
        res.status(statusCode).json({ error: error.message });
    }
}

export const deleteMenu = async (req, res) => {
    const parsedId = parsePositiveInt(req.params.id);

    if (!parsedId) {
        return res.status(400).json({ error: 'id menu tidak valid.' });
    }

    const menu = await prisma.menu.delete({
        where: {
            id: parsedId
        }
    });

    res.status(200).json(menu);
}

export const createNewOrder = async (req, res) => {
    try {
        const { tableNumber, status = 'pending' } = req.body;
        const rawMenus = req.body.menus ?? req.body.menuIds ?? req.body.orderItems ?? req.body.items;
        const parsedTableNumber = parsePositiveInt(tableNumber);

        if (!parsedTableNumber) {
            return res.status(400).json({
                error: 'tableNumber harus berupa angka bulat lebih dari 0.'
            });
        }

        if (!allowedOrderStatuses.has(status)) {
            return res.status(400).json({
                error: 'status order tidak valid.'
            });
        }

        if (!Array.isArray(rawMenus) || rawMenus.length === 0) {
            return res.status(400).json({
                error: 'menus, menuIds, orderItems, atau items harus berupa array dan minimal berisi 1 menu.'
            });
        }

        const orderLineByMenuId = new Map();

        rawMenus.forEach((item, index) => {
            const candidateMenuId = typeof item === 'object' && item !== null
                ? item.menuId ?? item.id
                : item;
            const candidateQuantity = typeof item === 'object' && item !== null
                ? item.quantity ?? 1
                : 1;
            const candidateNotes = typeof item === 'object' && item !== null
                ? item.notes
                : undefined;

            const parsedMenuId = parsePositiveInt(candidateMenuId);
            const parsedQuantity = parsePositiveInt(candidateQuantity);

            if (!parsedMenuId) {
                throw new Error(`menu pada index ${index} tidak valid.`);
            }

            if (!parsedQuantity) {
                throw new Error(`quantity pada index ${index} tidak valid.`);
            }

            const currentLine = orderLineByMenuId.get(parsedMenuId) ?? {
                quantity: 0,
                notes: null
            };

            orderLineByMenuId.set(parsedMenuId, {
                quantity: currentLine.quantity + parsedQuantity,
                notes: typeof candidateNotes === 'string' && candidateNotes.trim() !== ''
                    ? candidateNotes.trim()
                    : currentLine.notes
            });
        });

        const menuIds = [...orderLineByMenuId.keys()];

        const menus = await prisma.menu.findMany({
            where: {
                id: {
                    in: menuIds
                }
            }
        });

        if (menus.length !== menuIds.length) {
            const foundMenuIds = new Set(menus.map((menu) => menu.id));
            const missingMenuIds = menuIds.filter((menuId) => !foundMenuIds.has(menuId));

            return res.status(404).json({
                error: `Menu tidak ditemukan untuk menuId: ${missingMenuIds.join(', ')}`
            });
        }

        const totalPrice = menus.reduce(
            (total, menu) => total + (menu.price * orderLineByMenuId.get(menu.id).quantity),
            0
        );

        const order = await prisma.tableOrder.create({
            data: {
                tableNumber: parsedTableNumber,
                totalPrice,
                status,
                tableOrderMenus: {
                    create: menus.map((menu) => ({
                        menuId: menu.id,
                        quantity: orderLineByMenuId.get(menu.id).quantity,
                        notes: orderLineByMenuId.get(menu.id).notes,
                    }))
                }
            },
            include: tableOrderDetailInclude
        });

        res.status(201).json(formatTableOrder(order));
    } catch (error) {
        console.error('ERROR DETAIL', error);
        const statusCode = error.message?.includes('tidak valid') ? 400 : 500;
        res.status(statusCode).json({ error: error.message });
    }
}

export const getAllOrders = async (req, res) => {
    const { status } = req.query;

    if (status && !allowedOrderStatuses.has(status)) {
        return res.status(400).json({
            error: 'status order tidak valid.'
        });
    }

    const orders = await prisma.tableOrder.findMany({
        where: status ? { status } : undefined,
        include: tableOrderDetailInclude,
        orderBy: {
            createdAt: 'desc'
        }
    });

    res.status(200).json(orders.map(formatTableOrder));
}

export const getOrder = async (req, res) => {
    const parsedId = parsePositiveInt(req.params.id);

    if (!parsedId) {
        return res.status(400).json({ error: 'id order tidak valid.' });
    }

    const order = await prisma.tableOrder.findUnique({
        where: {
            id: parsedId
        },
        include: tableOrderDetailInclude
    });

    if (!order) {
        return res.status(404).json({ error: 'Order tidak ditemukan.' });
    }

    res.status(200).json(formatTableOrder(order));
}

export const createPayment = async (req, res) => {
    try {
        const parsedTableOrderId = parsePositiveInt(req.body.tableOrderId ?? req.body.orderId);
        const { paymentMethod, status = 'paid' } = req.body;

        if (!parsedTableOrderId) {
            return res.status(400).json({
                error: 'tableOrderId atau orderId harus berupa angka bulat lebih dari 0.'
            });
        }

        if (typeof paymentMethod !== 'string' || !allowedPaymentMethods.has(paymentMethod.trim())) {
            return res.status(400).json({
                error: 'paymentMethod wajib berupa cash, qris, atau card.'
            });
        }

        if (status !== 'paid') {
            return res.status(400).json({
                error: 'status payment untuk kasir harus paid.'
            });
        }

        const order = await prisma.tableOrder.findUnique({
            where: {
                id: parsedTableOrderId
            },
            include: tableOrderDetailInclude
        });

        if (!order) {
            return res.status(404).json({
                error: 'Order tidak ditemukan.'
            });
        }

        if (order.payment || order.status === 'paid') {
            return res.status(409).json({
                error: 'Order ini sudah dibayar.'
            });
        }

        const amount = req.body.amount == null
            ? order.totalPrice
            : Number(req.body.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                error: 'amount harus berupa angka lebih dari 0.'
            });
        }

        const paidAmount = req.body.paidAmount == null
            ? amount
            : parseAmount(req.body.paidAmount);
        const changeAmount = req.body.changeAmount == null
            ? paidAmount - amount
            : parseAmount(req.body.changeAmount);

        if (paidAmount == null || paidAmount <= 0) {
            return res.status(400).json({
                error: 'paidAmount harus berupa angka lebih dari 0.'
            });
        }

        if (changeAmount == null) {
            return res.status(400).json({
                error: 'changeAmount harus berupa angka 0 atau lebih.'
            });
        }

        if (paymentMethod.trim() === 'cash' && paidAmount < amount) {
            return res.status(400).json({
                error: 'paidAmount untuk cash tidak boleh kurang dari amount.'
            });
        }

        if ((paymentMethod.trim() === 'qris' || paymentMethod.trim() === 'card') && paidAmount !== amount) {
            return res.status(400).json({
                error: 'paidAmount untuk qris atau card harus sama dengan amount.'
            });
        }

        if (changeAmount !== Number((paidAmount - amount).toFixed(2))) {
            return res.status(400).json({
                error: 'changeAmount harus sama dengan paidAmount dikurangi amount.'
            });
        }

        const payment = await prisma.$transaction(async (transaction) => {
            await transaction.tableOrder.update({
                where: {
                    id: parsedTableOrderId
                },
                data: {
                    status: 'paid'
                }
            });

            return transaction.payment.create({
                data: {
                    tableOrderId: parsedTableOrderId,
                    amount,
                    paidAmount,
                    changeAmount,
                    status,
                    paymentMethod: paymentMethod.trim()
                },
                include: paymentDetailInclude
            });
        });

        res.status(201).json(formatPayment(payment));
    } catch (error) {
        console.error('ERROR DETAIL', error);

        if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'Payment untuk order ini sudah ada.'
            });
        }

        res.status(500).json({ error: error.message });
    }
}

export const getPayment = async (req, res) => {
    const parsedId = parsePositiveInt(req.params.id);

    if (!parsedId) {
        return res.status(400).json({ error: 'id payment tidak valid.' });
    }

    const payment = await prisma.payment.findUnique({
        where: {
            id: parsedId
        },
        include: paymentDetailInclude
    });

    if (!payment) {
        return res.status(404).json({ error: 'Payment tidak ditemukan.' });
    }

    res.status(200).json(formatPayment(payment));
}