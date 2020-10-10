import React from 'react';
import './App.css';
import PrinciapalAdmin from './components/AdminForm/pageP';
import Product from './components/AdminForm/product';
import Category from './components/AdminForm/Categorys';
import Navegacion from './components/Navegacion/Navegacion';
import WellcomeAdmin from './components/AdminForm/WellcomAdmin'
import Slider from './components/Slider/Slider' 
import Footer from './components/Footer/Footer'
import ProductDet from './components/ProductDet/index'
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch, Link } from 'react-router-dom';

function App() {
	return (
		<div>
			<Switch>
				<Route path='/' exact>
					<Navegacion />
					{/* <hr /> */}
					<Slider />
					<Footer></Footer>
				</Route>
        
				<Route path='/admin' exact>
					<PrinciapalAdmin />
					<WellcomeAdmin />
				</Route>
				<Route path='/admin/product' component={Product} />
				<Route path='/admin/category' component={Category} />
        		<Route path='/product/:id' component={ProductDet} />
			</Switch>
		</div>
	);
}

export default App;
