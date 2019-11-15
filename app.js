const express = require('express');
const stripe = require('stripe')('sk_test_BhbLdLSunRBUtjvmgHhI9yaz00phkfIPx4');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

//Handlebars 
app.engine('handlebars', exphbs({defaultLayout : 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname+'/public'));

app.get('/', (req, res) => {
    res.render('index');
})

app.post('/charge', (req, res) => {
    const amount = 2500;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount: amount, 
        description: 'My ebook',
        currency: 'usd',
        customer: customer.id
    }))
    .then(charges => res.render('success'));
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server started on ' + PORT);
})