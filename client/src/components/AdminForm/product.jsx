import React from 'react'
import {Table, Button, Container, Modal, FormGroup, Form } from 'react-bootstrap';
import datas from './Data'
import s from '../styles/styles.module.css'
import Menu from './menu'
import axios from 'axios';
import {useState, useEffect} from 'react'

const url = 'localhost:3001'


const Product = ()=> {
    const [date, setData] = useState([])
    const [cat, setCat] = useState([])
    const [form, setForm] = useState({
        name : "",
        description : "",
        price : "",
        stock : "",
        category : "",
        dimentions: "",
        image: "",
    })
    const [show, setShow] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false)


    /*********************** Functions **************************** */
    const getProduct = () => {
        axios.get(`http://${url}/products`)
            .then(res => {
                if(res){
                    console.log(res.data.data)
                    return setData(res.data.data)
                }else{
                    console.log("No hay Datos")
                }
            })
            .catch(err => {
                console.log('Errod')
            })
        //console.log('hola')
    }
    const getCategory = () => {
        axios.get(`http://${url}/products/category`)
            .then(res => {
                if(res){
                    console.log(res.data.result)
                    return setCat(res.data.result)
                }else{
                    console.log("No hay Datos")
                }
            })
            .catch(err => {
                console.log('Errod')
            })
        //console.log('hola')
    }

    useEffect(()=> {
        getProduct();
        getCategory()
    }, [])

    console.log(cat)

    const insertProduct = async () => {
        
        form.sku = Math.random()
        console.log(form)
        await axios.post(`http://${url}/products`, form)
            .then(res => {
                console.log(res.data.data)
                // let dataNew = date
                // dataNew.push({...res.data.data})
                getProduct()
                setShow(false)
            })
    }

    const openModal = ()=> { setShow(true)  }
    const closeModal = ()=> { setShow(false)  }
    const closeModalUpdate = ()=> { setShowUpdate(false)  }
    const handlerChange = (e) => {  setForm({ ...form, [e.target.name]:e.target.value})  }

    const updateProductModal = (product)=> {
        console.log(product)
        let cont = 0;
        let list = date
        console.log(list)
        list.map((dat)=>{
            if(dat.id === product.id) { 
                list[cont].id = product.id
                list[cont].name = product.name
                list[cont].description = product.description
                list[cont].price = product.price
                list[cont].stock = product.stock
                list[cont].category = product.category
            }
            cont++
        })
        setShowUpdate(true)
        setForm(product)
        setData(list)
    }


    const updateProduct = (dat)=>{
        axios.put(`http://${url}/products/${dat.id}`, dat)
            .then(dat => {
                setShowUpdate(false);
                getProduct();
            })
        // console.log(dat)
    }

    const deleteProduct = (id)=>{
        console.log(id)
        if(window.confirm('Are you sure remove this product?')){
            let list = date.filter((dt)=> {
                return dt.id !== id
            })
           return setData(list)
        }

    }

    return (
        <>
        <div>
            <Menu/>
            <div className= {s.cont__table__pr}>
            <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Dimentions</th>
                        <th>Category</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {date.map((dat,index) => {
                            return (
                                <tr key={index}>
        
                                    <td>{dat.name}</td>
                                    <td>{dat.description}</td>
                                    <td>{dat.price}</td>
                                    <td>{dat.stock}</td>
                                    <td>{dat.dimentions}</td>
                                    <td>{dat.category}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => deleteProduct(dat.id)}>Delete</Button>{"  "}
                                        <Button variant="primary" onClick={()=> updateProductModal(dat)}>Update</Button>
                                    </td>
                                    
                                </tr>
                            )
                        })}
                    </tbody>
            </Table>
            <Button variant="success" onClick={openModal}>Add Product</Button>
            </div>
        </div>
        {/**************************** MODAL ADD ******************************** */}
        <div>
            <Modal 
                show={show}
                backdrop="static"
                onHide={closeModal}
                keyboard={false}
                >
                    <Modal.Header>
                        Add Product
                    </Modal.Header>

                    <Modal.Body>
                    <Form.Group>
                            <Form.Label>Id:</Form.Label>
                            <input type="text" name="name" value={date.length+1} readOnly/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Name:</Form.Label>
                            <input type="text" name="name"  onChange={handlerChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description:</Form.Label>
                            <input type="text" name="description" onChange={handlerChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price:</Form.Label>
                            <input type="number" name="price" onChange={handlerChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Stock:</Form.Label>
                            <input type="number" name="stock" onChange={handlerChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Image:</Form.Label>
                            <input type="text" name="image" onChange={handlerChange} placeholder='http://www.image.com'/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Dimention:</Form.Label>
                            <input type="text" name="dimentions" onChange={handlerChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Category: </Form.Label>
                            <select onChange={handlerChange} name="category">
                            <option value="">....</option>
                                {cat.map((d)=>{
                                    return (
                                        <option value={d.name}>{d.name}</option>
                                    )
                                })}

                            </select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={insertProduct}>Add</Button>
                        <Button variant="danger" onClick={closeModal}>Cancel</Button>
                    </Modal.Footer>
            </Modal>
        </div>
         {/**************************** MODAL UPDATE ******************************** */}
        <div>
        <Modal 
                show={showUpdate}
                backdrop="static"
                onHide={closeModalUpdate}
                keyboard={false}
                >
                    <Modal.Header>
                        Update Product
                    </Modal.Header>

                    <Modal.Body>
                    <Form.Group>
                            <Form.Label>Id:</Form.Label>
                            <input type="text" name="name"  readOnly value={form.id} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Name:</Form.Label>
                            <input type="text" name="name"  onChange={handlerChange} value={form.name}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description:</Form.Label>
                            <input type="text" name="description" onChange={handlerChange} value={form.description}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price:</Form.Label>
                            <input type="number" name="price" onChange={handlerChange} value={form.price}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Stock:</Form.Label>
                            <input type="number" name="stock" onChange={handlerChange} value={form.stock}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Image:</Form.Label>
                            <input type="text" name="image" onChange={handlerChange} placeholder='http://www.image.com' value={form.image}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Dimention:</Form.Label>
                            <input type="text" name="dimention" onChange={handlerChange}  value={form.dimentions}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Category: </Form.Label>
                            <select onChange={handlerChange} name="category" value={form.category} >
                            <option value="">....</option>
                                {datas.dataCat.map((d)=>{
                                    return (
                                        <option value={d.name} >{d.name}</option>
                                    )
                                })}

                            </select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => updateProduct(form)}>Update</Button>
                        <Button variant="danger" onClick={closeModalUpdate}>Cancel</Button>
                    </Modal.Footer>
            </Modal>
        </div>
        </>
    )
}


export default Product