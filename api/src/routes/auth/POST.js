const server = require("express").Router();
// const sgMail = require('@sendgrid/mail');
const { Users, Orders, Products } = require("../../db");

// import { sengridEmail } from '../../services/sengridEmail.js'
// import {stateOrder} from '../../services/stateOrder.js'
const stateOrder = require ('../../services/stateOrder.js');
const discountProduct = require ('../../services/discountProduct');
const sengridEmail = require ('../../services/sengridEmail.js');

server.post("/signup", async(req, res) => {

    let { name, orderId, email, state } = req.body;

    if(name === undefined){
        name = "Dear buyer"
    }
    try{
        if(!email || !name || !orderId) return res.status(422).json({message:"please add all the fields"});
        
        var user = await Users.findOne({
            where:{email:email}
        })
        var orders = await Orders.findOne({
            where:{
                // userId: user.id,
                id: orderId,
                state: state
            }, include: [Products]
        })
        if(orders === null || !orders.products){
            
            res.status(422).json({message:`the user does not have an order in ${state} status`});
        }
        else{

            var ordIdDateStateTotal = []

            let orderID = orders.id;
            let date = orders.date;
            let total = orders.total;        
            let state = orders.state;
            ordIdDateStateTotal.push(orderID, date, state, total)

            let prodsImgPrice = []
            let product ={}

            if(ordIdDateStateTotal.length === 4){
                var i = 0
                while(orders.products.length > i ){
                    
                    if(orders.products[i]){

                        product = {
                            product:orders.products[i].name,
                            image: orders.products[i].preview,
                            price:orders.products[i].price,
                            Graldate:ordIdDateStateTotal
                        }
                        prodsImgPrice.push(product)
                    }
                    i++
                }
            }
          
            let msgBody = (stateOrder(name, prodsImgPrice, email))
            // console.log(msgBody)

            sengridEmail(msgBody) 
            //SENDGRID MANDAR EMAIL, NO BORRAR, SOLO 100 EMAILS POR DIA

            return res.status(200).json({message:"email enviado exitosamente"}) 
        }
          
    }catch(error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error", status: 500})
    }
});






server.post("/productOffers", async(req, res) => {

    const { name, orderId, email, state } = req.body;

    let dataOrder = []
    let product ={}
    try{
        if(!email || !name || !orderId && state === "open") return res.status(422).json({message:"please add all the fields"});
        
        var user = await Users.findOne({
            where:{email:email}
        })
        var orders = await Orders.findOne({
            where:{
                userId: user.id,
                id: orderId,
                state: state
            }, include: [Products]
        })
        if(orders === null || !orders.products){
            
            res.status(422).json({message:`the user does not have an order in ${state} status`});
        }
        else{

            var dateBasicOrder = []

            let orderID = orders.id;
            let date = orders.date;
            let total = orders.total;        
            let state = orders.state;

            dateBasicOrder.push(orderID, date, state, total)

            var diez100=(10/100);
            var TotalDiscount = 0;
            var i = 0
            while(orders.products.length > i ){
                
                if(orders.products[i]){

                    var productUser = await Products.findOne({
                        where:{ id:orders.products[i].id}
                    })

                    if(productUser.price === orders.products[i].price){
                        var result = productUser.price  *diez100;
                        var descuento = productUser.price - result;
                        TotalDiscount = TotalDiscount +descuento
                        console.log("VALORES___",TotalDiscount, descuento)

                        product = {

                            product:orders.products[i].name,
                            image: orders.products[i].preview,
                            price:orders.products[i].price,
                            priceDiscount: descuento,
                        }
                    }
                    dateBasicOrder.push(TotalDiscount) 
                    dataOrder.push(product)
                }
                i++
            }
            
            let msgBody = (discountProduct(name, dateBasicOrder, dataOrder))

            //console.log(sengridEmail(msgBody)) //SENDGRID MANDAR EMAIL, NO BORRAR, SOLO 100 EMAILS POR DIA

            return res.status(200).json({message:"email enviado exitosamente"}) 
        }
          
    }catch(error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error", status: 500})
    }
});


module.exports = server;
