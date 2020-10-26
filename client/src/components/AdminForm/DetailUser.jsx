import React from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import s from '../../styles/detailUser.module.css';
import { enlacesUser, enlacesUserConAdmin, enlacesUserSinAdmin, enlacesAdmin } from '../../constans/constans';
import Navegacion from '../Navegacion/Navegacion';

const UserDetail = ({ userSelectedP }) => {
	console.log(userSelectedP);
	return (
		<div>
			<Navegacion linksU={enlacesUserSinAdmin} linksA={enlacesAdmin} showSearchbar={false} />
			{userSelectedP.length === 0 || userSelectedP[0].orders.length === 0 ? (
				<div className='container'>
					<h1>No hay Ordenes para este Usuario</h1>
					<Link to='/'>Volver al Home</Link>
				</div>
			) : (
				<div className='container'>
					<h3>
						Ordenes de este {userSelectedP[0].email}: {userSelectedP[0].orders.length}
					</h3>
					<div>
						{userSelectedP.map((x, index) => {
							return (
								<div className={s.contOrder}>
									<h1>Orden No.{index + 1}</h1>
									<Table striped bordered hover>
										<thead>
											<tr>
												<th>User</th>
												<th>Rol</th>
												<th>Status</th>
												<th>Create</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>{x.email}</td>
												<td>{x.role}</td>
												<td>{x.orders[0].status}</td>
												<td>{x.orders[0].createdAt}</td>
											</tr>
											<tr>
												<th colSpan='4' className={s.thStyle}>
													PRODUCTOS DE LA ORDEN
												</th>
											</tr>
											<tr>
												<th>Product</th>
												<th>Cant</th>
												<th>Price</th>
												<th>Total</th>
											</tr>
											{x.orders[0].products.map((p) => {
												return (
													<tr>
														<td>{p.name}</td>
														<td>{p.order_line.quantity}</td>
														<td>$ {p.price}</td>
														<td>$ {p.price * p.order_line.quantity}</td>
													</tr>
												);
											})}
										</tbody>
									</Table>
									<div>
										<Table striped borderless size='sm'>
											<tbody className={s.tabletotal}>
												<tr>
													<td className={s.subinfo1}>Subtotal</td>
													<td className={s.subPrecio}>$ {x.orders[0].products.reduce((a, c) => a + c.order_line.quantity * c.price, 0)}</td>
												</tr>
												<tr>
													<td className={s.subinfo1}>Iva</td>
													<td className={s.subPrecio}>$ {Math.trunc(x.orders[0].products.reduce((a, c) => a + c.order_line.quantity * c.price, 0) * 0.19)}</td>
												</tr>
												<tr>
													<td className={s.subinfo1}>Total</td>
													<td className={s.subPrecio}>$ {Math.trunc(x.orders[0].products.reduce((a, c) => a + c.order_line.quantity * c.price, 0) * 0.19) + x.orders[0].products.reduce((a, c) => a + c.order_line.quantity * c.price, 0)}</td>
												</tr>
											</tbody>
										</Table>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

function mapStateToProps(state) {
	return {
		userSelectedP: state.userSelected,
	};
}

function mapDispatchToProps(dispatch) {
	return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);
