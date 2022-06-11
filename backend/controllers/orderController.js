import AsyncHandler from "express-async-handler";
import OrderModel from "../models/orderModel.js";

//? @desc     create new orders
//? @route    POST /api/orders
//? @access     Private

export const addOrderItems = AsyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new OrderModel({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});
//? @desc    get order by id
//? @route    GET /api/orders/:id
//? @access   Private

export const getOrderById = AsyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not Found");
  }
});
//? @desc    Update Order To Paid
//? @route    GET /api/orders/:id/pay
//? @access   Private

export const updateOrderToPaid = AsyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not Found");
  }
});

//? @desc    Update Order To Delivered
//? @route    GET /api/orders/:id/deliver
//? @access   Private

export const updateOrderToDelivered = AsyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
   
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not Found");
  }
});

//? @desc      Get logged in users order
//? @route    GET /api/orders/myorders
//? @access   Private

export const getMyOrders = AsyncHandler(async (req, res) => {
  const orders = await OrderModel.find({ user: req.user._id });
    if(!orders){
      throw new Error("No Orders in your cart")
    }
  res.json(orders);
});


//? @desc    Get all orders
//? @route   GET /api/orders
//? @access  Private/Admin
export const getOrders = AsyncHandler(async (req, res) => {
  const orders = await OrderModel.find({}).populate('user', 'id name')
  res.json(orders)
})

