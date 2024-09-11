import React, { useState, useEffect } from 'react';
import { TextField, Container, Typography, Grid, Box, Button, MenuItem, Select, InputLabel } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';

const Productos = () => {
    const initialState = {
        id: "",
        nombre: "",
        descripcion: "",
        cantidad: "",
        precio: "",
        id_proveedor: "",
        fecha_compra: "",  // No set initial date
        fecha_vencimiento: "",  // No set initial date
        numero_factura: ""
    };

    // Modificación para evitar desfase por zona horaria
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);

        // Ajustar la fecha sumando horas para evitar el desfase por la zona horaria
        d.setHours(d.getHours() + 12);  // Sumar 12 horas para asegurar el día correcto

        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return d.getFullYear() + '-' + month + '-' + day;
    };

    const [roles, setRoles] = useState([]);
    const [body, setBody] = useState(initialState);
    const [isEdit, setIsEdit] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });

    const fetchRoles = async () => {
        try {
            const response = await ApiRequest().get('/proveedores');
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles data:', error);
        }
    };

    const onChange = ({ target }) => {
        const { name, value } = target;
        setBody({
            ...body,
            [name]: value
        });
    };

    const onSubmit = async () => {
        try {
            const { data } = await ApiRequest().post('/guardar_product', body);
            setMensaje({
                ident: new Date().getTime(),
                message: data.message,
                type: 'success'
            });
            setBody(initialState);
            setIsEdit(false);
        } catch ({ response }) {
            setMensaje({
                ident: new Date().getTime(),
                message: response.data.sqlMessage,
                type: 'error'
            });
        }
    };

    const onEdit = async () => {
        try {
            const { data } = await ApiRequest().post('/editar_product', body);
            setMensaje({
                ident: new Date().getTime(),
                message: data.message,
                type: 'success'
            });
            setBody(initialState);
            setIsEdit(false);
        } catch ({ response }) {
            setMensaje({
                ident: new Date().getTime(),
                message: response.data.sqlMessage,
                type: 'error'
            });
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return (
        <Page title="FF | Compras">
            <ToastAutoHide message={mensaje} />
            <Container maxWidth='lg'>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h5">Modulo {isEdit ? 'Editar Producto' : 'Compras de Producto'}</Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='nombre'
                            value={body.nombre}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Nombre Producto'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='descripcion'
                            value={body.descripcion}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Descripción Producto'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='cantidad'
                            value={body.cantidad}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Cantidad de Producto'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='precio'
                            value={body.precio}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Precio'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="id_proveedor">Proveedor</InputLabel>
                        <Select
                            name="id_proveedor"
                            value={body.id_proveedor || ''}
                            onChange={onChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            {roles.map((id_pro) => (
                                <MenuItem key={id_pro.id} value={id_pro.id}>
                                    {id_pro.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            type='date'
                            margin='normal'
                            name='fecha_compra'
                            value={formatDate(body.fecha_compra)}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Fecha Compra'
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            type='date'
                            margin='normal'
                            name='fecha_vencimiento'
                            value={formatDate(body.fecha_vencimiento)}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Fecha de Vencimiento'
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='numero_factura'
                            value={body.numero_factura}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Número de Factura'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant='contained' color='primary' onClick={isEdit ? onEdit : onSubmit}>
                            {isEdit ? 'Editar Producto' : 'Crear Producto'}
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default Productos;
