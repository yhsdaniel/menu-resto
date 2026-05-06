-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TableOrder" (
    "id" SERIAL NOT NULL,
    "tableNumber" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TableOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TableOrderMenu" (
    "id" SERIAL NOT NULL,
    "tableOrderId" INTEGER NOT NULL,
    "menuId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TableOrderMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "tableOrderId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "changeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TableOrder_tableNumber_idx" ON "TableOrder"("tableNumber");

-- CreateIndex
CREATE INDEX "TableOrder_status_idx" ON "TableOrder"("status");

-- CreateIndex
CREATE INDEX "TableOrderMenu_tableOrderId_idx" ON "TableOrderMenu"("tableOrderId");

-- CreateIndex
CREATE INDEX "TableOrderMenu_menuId_idx" ON "TableOrderMenu"("menuId");

-- CreateIndex
CREATE UNIQUE INDEX "TableOrderMenu_tableOrderId_menuId_key" ON "TableOrderMenu"("tableOrderId", "menuId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_tableOrderId_key" ON "Payment"("tableOrderId");

-- CreateIndex
CREATE INDEX "Payment_paymentMethod_idx" ON "Payment"("paymentMethod");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- AddForeignKey
ALTER TABLE "TableOrderMenu" ADD CONSTRAINT "TableOrderMenu_tableOrderId_fkey" FOREIGN KEY ("tableOrderId") REFERENCES "TableOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TableOrderMenu" ADD CONSTRAINT "TableOrderMenu_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_tableOrderId_fkey" FOREIGN KEY ("tableOrderId") REFERENCES "TableOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
