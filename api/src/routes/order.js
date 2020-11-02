const server = require('express').Router(); //Import router from express module.
const { Order, Order_line, Product, User } = require('../db.js'); // Import Categories model.
const { OK, CREATED, ERROR, ERROR_SERVER } = require('../constants/index'); // Import Status constants.
const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = process.env;
const Stripe = require('stripe');
const mailgunLoader = require('mailgun-js');
const juice = require('juice');
const fs = require('fs');
const path = require('path');

const mailgun = mailgunLoader({ apiKey: `${MAILGUN_API_KEY}`, domain: `${MAILGUN_DOMAIN}` });
const emailHtml = fs.readFileSync(path.join(__dirname + '../../../assets/email/email.html')).toString()
const emailCss = fs.readFileSync(path.join(__dirname + '../../../assets/email/email.css')).toString()
const inlineHtml = juice.inlineContent(emailHtml, emailCss);
console.log(inlineHtml);
mailgun.post(`/${MAILGUN_DOMAIN}/templates`, {
	"template": inlineHtml,
	"name": "template.astra",
	"description": "Astra template"}, (error, body) =>  console.log(body) );

const stripe = new Stripe('sk_test_51HhisyJCzko8yllsxOIAH4PuIS3N1PWGAUw1viuWg14gzpQPzJLJi7guXSecwRnf2gpdXiRWISJXQJc3N7ChjvQw00qiH74sAF')

// Start Routes
//// 'Get Orders' route in '/'
server.get('/', function (req, res) {

	Order.findAll({ include: [ { model: User}, {model: Product}  ] })	
	.then(orders => {
		return res.json({
			message: 'Sucess',
			data: orders
		})
	})
	.catch((err) => {
		console.log(err)
	});
});

server.post('/shopping/:userId', function (req, res) {

    // return res.send(req.body)
	 const { userId } = req.params;

	 const { id } = req.body
	 const  qty  = req.body.order_line.quantity
	 console.log(req.body)

	const newOrder = Order.findOrCreate({ where: { userId} });
	const newProduct = Product.findOne({ where: {id: id} });
	Promise.all([ newOrder,  newProduct])
	.then((data) => {
		data[0][0].addProducts(data[1], { through: { price: data[1].price, quantity: qty } })
		.then(()=>{ Order.findOne({ where: { userId }, 	include: [{ model: Product }, { model: User } ] }).then(order => { 			return res.status(OK).json({ 				message: "ítem añadido al carrito", 				data: order 			})
			})
 	   })
	})
	.catch((err) => {
		res.send({errro: 'Error POST'})
	});
});


server.put('/shopping/:id', (req, res)=>{
	//  console.log(req.params.id)
	//  console.log(req.body)
	 const { id } = req.params;
	 const { total, subTotal, iva } = req.body;
	 return Order.findOne({ where: {id: id}})
	 	.then(order => {

			order.status = 'created';
			order.total = total;
			order.iva = iva;
			order.subTotal = subTotal;
			order.save();
			return res.status(OK).json({
			message:`La Orden se ha Creado`,
			data: order
		});
		 })
		.catch( err => {
			return res.status(ERROR).json({
				message: 'Error al Crear la Orden',
				data: err
			})
		});

 })

 server.put('/shoppinginprocess/:id', (req, res)=>{
	//  console.log(req.params.id)
	//  console.log(req.body)
	 const { id } = req.params;
	 const { adress, city, phone, postal } = req.body;
	 return Order.findOne({ where: {id: id}, include:{model: Product}})
	 	.then(order => {

			order.status = 'in_process';
			order.adress = adress;
			order.city = city;
			order.phone = phone;
			order.postal = postal;
			order.save();
			return res.status(OK).json({
			message:`La Orden esta en Proceso`,
			data: order
		});
		 })
		.catch( err => {
			return res.status(ERROR).json({
				message: 'Error en el proceso de la orden',
				data: err
			})
		});

 })

server.delete('/shopping/:id', (req, res)=>{
	console.log(req.params.id)
	const { id } = req.params

	Order.findAll({ where: id })
		.then(res => {
			resdestroy();
			return res.status(OK).json({
				message: 'Orden Cancelada!!',
				data: deletedCart
			});
		})
		.catch(err => {
			return res.status(ERROR_SERVER).json({
				message: 'Error al eliminar Orden',
				data: err
			});
		})
})

server.post('/confirorder/:id', (req, res) => {
	
	const {total, OrderId} = req.body
	const { id } =  req.params
	console.log(total, id, OrderId)

	stripe.paymentIntents.create({
		amount: total,
		currency:'USD',
		payment_method: id,
		confirm : true
	})
	.then(pay => {
		res.send({message: 'sucess Payment', pay:true})
		// return Order.findOne({ where: {id: id}, include:{model: Product}})
	 	// .then(order => {
		// 	order.status = 'fullfilled';
		// 	order.save();
		// 	return res.status(OK).json({
		// 	message:`La Orden fue un exito`,
		// 	data: order
		// 	});
		// });
	})
	.catch(err => {
		res.send({message: err, pay:false})
	})
})

server.put('/checkout/:id', (req, res)=>{
	
	//  const { statuCheckout } = req.body;
	const { id } = req.params;
	console.log('fulled', id)
	return Order.findOne({ where: {id: id}, include:{model: Product}})
	 	.then(order => {
			order.status = 'fullfilled';
			order.save();
		return res.status(OK).json({
			message:`La Orden fue un exito`,
			data: order
		});
		 })
		.catch( err => {
			return res.status(ERROR).json({
				message: 'Error en el proceso de la orden',
				data: err
			})
		});
})

server.put('/checkoutReject/:id', (req, res)=>{
	
	//  const { statuCheckout } = req.body;
	const { id } = req.params;
	console.log('fulled', id)
	return Order.findOne({ where: {id: id}, include:{model: Product}})
	 	.then(order => {
			order.status = 'rejected';
			order.save();
		return res.status(OK).json({
			message:`La Orden fue Rechazada`,
			data: order
		});
		 })
		.catch( err => {
			return res.status(ERROR).json({
				message: 'Error en el proceso de la orden',
				data: err
			})
		});
})

server.post('/checkout/:id', async (req, res)=>{
	const { id } = req.params;
	const { email, name } = req.body;
	console.log(email, name)
	try {
		console.log('ENTRE AL PRIMER PASO DE MAILGUN')
		const order = await Order.findOne({ where: {id: id}, include:{model: Product}})
		const subject = `Astra - Detalles de tu compra!`;
		const data = {
			from: "Astra Team <info@astra.com>",
			to: email,
			subject: subject,
			template: 'template.astra',
			'h:X-Mailgun-Variables': JSON.stringify({
				name: name,
				reference: order.id
			})
		}
		await mailgun.messages().send(data)
		return res.status(OK).json({
			message:`Email sent!`,
			data: order
		});
	} 
	catch (err) {
		console.log(err);
		res.status(500);
	}
	return 
})

//End routes
module.exports = server;