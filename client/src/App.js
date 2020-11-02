import React, { useState, useEffect } from 'react';
import './App.css';
import PrinciapalAdmin from './components/AdminForm/pageP';
import Product from './components/AdminForm/product';
import Category from './components/AdminForm/Categorys';
import Orders from './components/AdminForm/Orders';
import Navegacion from './components/Navegacion/Navegacion';
import WellcomeAdmin from './components/AdminForm/WellcomAdmin';
import Slider from './components/Slider/Slider';
import Footer from './components/Footer/Footer';
import ProductDet from './components/ProductDet/index';
import ProductCard from './components/ProductCard/index';
import Catalogo from './components/Catalogo/index';
import FormUsers from './components/FormUsers/FormUsers.jsx';
import UsersData from './components/AdminForm/UsersData';
import UserDetail from './components/AdminForm/DetailUser.jsx';
import CheckoutSucess from './components/ckeckout/checkoutSucess';
import Faqs from './components/FAQs/Faqs.jsx';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch, Link } from 'react-router-dom';
import axios from 'axios';
import CartShop from './components/Cart/card'; // Redux
import Login from './components/Login/Login';
import ProfileUser from './components/ProfileUser/ProfileUser';
import PrivateAdmin from './components/Routes/PrivateAdmin';
import PrivateRoute from './components/Routes/PrivateRoute';
import DataUserShopping from './components/ckeckout/dataUser';
import PaymentMethod from './components/ckeckout/paymentMethod'
import { enlacesUser, enlacesUserConAdmin, enlacesUserSinAdmin, enlacesAdmin } from './constans/constans';

const url = 'localhost:3001';

function App() {
	const [products, setProduct] = useState([]);

	const onSearch = (search) => {
		//console.log('NOmbre: ' + search)
		axios.get(`http://${url}/products/search?query=${search}`).then((res) => {
			setProduct([]);
			let { data } = res.data;
			console.log(data);
			setProduct(data);
			return;
		});
	};

	return (
		<div>
			<Switch>
				{/* HOME */}
				<Route path='/' exact>
					<Navegacion linksU={enlacesUserSinAdmin} linksA={enlacesUserConAdmin} showSearchbar={true} onSearch={onSearch} />
					<Slider />
					<Footer></Footer>
				</Route>
				{/* HOME */}

				{/* FAQS */}
				<Route path='/faqs' exact>
					<Navegacion linksU={enlacesUserSinAdmin} linksA={enlacesUserConAdmin} showSearchbar={true} onSearch={onSearch} />
					<Faqs></Faqs>
					<Footer></Footer>
				</Route>

				{/* FAQS */}

				{/* ADMIN */}
				<Route path='/admin'>
					<PrivateAdmin path='/admin' exact component={WellcomeAdmin} />
					<PrivateAdmin path='/admin/product' component={Product} />
					<PrivateAdmin path='/admin/category' component={Category} />
					<PrivateAdmin path='/admin/users' component={UsersData} />
					<PrivateAdmin path='/admin/orders' component={Orders} />
				</Route>
				{/* ADMIN */}

				{/* PRODUCTS */}
				<Route path='/products/catalogo'>
					<Navegacion linksU={enlacesUserSinAdmin} linksA={enlacesUserConAdmin} showSearchbar={true} onSearch={onSearch} />
					<Catalogo products={products} onSearch={onSearch} />
					<Footer></Footer>
				</Route>

				<Route path='/products/product/:id'>
					<Navegacion linksU={enlacesUserSinAdmin} linksA={enlacesUserConAdmin} showSearchbar={true} />
					<ProductDet />
				</Route>
				{/* PRODUCTS */}

				{/* USERS */}
				<Route path='/users' exact>
					<Navegacion linksU={enlacesUserSinAdmin} linksA={enlacesUserConAdmin} showSearchbar={true} onSearch={onSearch} />
					<FormUsers></FormUsers>
					<Footer></Footer>
				</Route>

				<Route path='/users/cart'>
					<Navegacion linksU={enlacesUserSinAdmin} linksA={enlacesUserConAdmin} showSearchbar={true} onSearch={onSearch} />
					<CartShop></CartShop>
					<Footer></Footer>
				</Route>

				<Route path='/users/:id' exact component={UserDetail} />
				{/* USERS */}

				{/* PROFILE */}
				<PrivateRoute path='/profile' component={ProfileUser} />
				<PrivateRoute path='/shopping' component={DataUserShopping} />
				<PrivateRoute path='/paymethod' exact component={PaymentMethod} />
				<PrivateRoute path='/paymethod/sucess' component={CheckoutSucess} />
				{/* PROFILE */}

				{/* LOGIN */}
				<Route path='/login' exact>
					<Navegacion linksU={enlacesUserSinAdmin} linksA={enlacesUserConAdmin} showSearchbar={true} onSearch={onSearch} />
					<Login></Login>
					<Footer></Footer>
				</Route>
				{/* LOGIN */}
			</Switch>
		</div>
	);
}

export default App;
