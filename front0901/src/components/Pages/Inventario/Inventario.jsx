import React, { useState, useEffect } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Container, Typography, Grid, Box, Button, Stack, IconButton, Divider, MenuItem, Select, InputLabel } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, EditOutlined, DeleteOutline, PictureAsPdfOutlined } from '@mui/icons-material'; // Importa el ícono para el PDF
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import CommonTable from '../../common/CommonTable';
import jsPDF from 'jspdf'; // Importa jsPDF
import 'jspdf-autotable'; // Importa el plugin autotable para tablas

const Inventario = () => {
    const initialState = {
        id: "",
        nombre: "",
        descripcion: "",
        cantidad: "",
        precio: "",
        id_proveedor: "",
        fecha_compra: "",
        fecha_vencimiento: "",
        numero_factura: "",
        nombre_proveedor: ""
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return d.getFullYear() + '-' + month + '-' + day;
    };

    const [roles, setRoles] = useState([]); // Lista de proveedores
    const [usuariosList, setUsuariosList] = useState([]);
    const [body, setBody] = useState(initialState);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const [idDelete, setIdDelete] = useState(null);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);

    // Función que obtiene la lista de productos
    const init = async () => {
        const { data } = await ApiRequest().get('/productos');
        setUsuariosList(data);
    };

    // Función que obtiene la lista de proveedores
    const fetchProveedores = async () => {
        try {
            const { data } = await ApiRequest().get('/proveedores'); // Asegúrate que la ruta sea la correcta
            setRoles(data); // Actualiza el estado con la lista de proveedores
        } catch (error) {
            console.error('Error al obtener la lista de proveedores:', error);
        }
    };

    const columns = [
        { field: 'id', headerName: 'Codigo', width: 120 },
        { field: 'nombre', headerName: 'Nombre Producto', width: 220 },
        { field: 'descripcion', headerName: 'Descripcion', width: 220 },
        { field: 'cantidad', headerName: 'Cantidad', width: 220 },
        { field: 'precio', headerName: 'Precio', width: 220 },
        { field: 'nombre_proveedor', headerName: 'Proveedor', width: 220 },
        {
            field: 'fecha_compra',
            headerName: 'Fecha Compra',
            width: 220,
            valueFormatter: (params) => {
                const fecha = new Date(params.value);
                const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                return fecha.toLocaleDateString('es-ES', options);
            }
        },
        {
            field: 'fecha_vencimiento',
            headerName: 'Fecha Vencimiento',
            width: 220,
            valueFormatter: (params) => {
                const fecha = new Date(params.value);
                const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                return fecha.toLocaleDateString('es-ES', options);
            }
        },
        { field: 'numero_factura', headerName: 'Numero de Factura', width: 220 },
        {
            field: '',
            headerName: 'Acciones',
            width: 200,
            renderCell: (params) => (
                <Stack direction='row' divider={<Divider orientation="vertical" flexItem />} justifyContent="center" alignItems="center" spacing={2}>
                    <IconButton size='small' onClick={() => {
                        setIsEdit(true);
                        setBody(params.row);
                        handleDialog();
                    }}>
                        <EditOutlined />
                    </IconButton>
                    <IconButton size='small' onClick={() => {
                        handleDialogDelete();
                        setIdDelete(params.id);
                    }}>
                        <DeleteOutline />
                    </IconButton>
                </Stack>
            )
        }
    ];

    const onDelete = async () => {
        try {
            const { data } = await ApiRequest().post('/eliminar_product', { id: idDelete });
            setMensaje({
                ident: new Date().getTime(),
                message: data.message,
                type: 'success'
            });
            handleDialogDelete();
            init();
        } catch ({ response }) {
            setMensaje({
                ident: new Date().getTime(),
                message: response.data.sqlMessage,
                type: 'error'
            });
        }
    };

    const handleDialog = () => {
        setOpenDialog(prev => !prev);
    };

    const handleDialogDelete = () => {
        setOpenDialogDelete(prev => !prev);
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
            handleDialog();
            setBody(initialState);
            setMensaje({
                ident: new Date().getTime(),
                message: data.message,
                type: 'success'
            });
            init();
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
            handleDialog();
            setBody(initialState);
            setMensaje({
                ident: new Date().getTime(),
                message: data.message,
                type: 'success'
            });
            init();
        } catch ({ response }) {
            setMensaje({
                ident: new Date().getTime(),
                message: response.data.sqlMessage,
                type: 'error'
            });
        }
    };

    // Función para generar el reporte PDF con todos los productos
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Inventario", 20, 10);
        doc.autoTable({
            head: [['ID', 'Nombre', 'Descripción', 'Cantidad', 'Precio', 'Proveedor', 'Fecha Compra', 'Fecha Vencimiento', 'Numero Factura']],
            body: usuariosList.map(product => [
                product.id, 
                product.nombre, 
                product.descripcion, 
                product.cantidad, 
                product.precio, 
                product.nombre_proveedor, 
                formatDate(product.fecha_compra), 
                formatDate(product.fecha_vencimiento), 
                product.numero_factura
            ])
        });
        doc.save('reporte_inventario.pdf');
    };

    // Función para generar el reporte de productos de "QuimicosDeLaEra"
    const generatePDFQuimicosDeLaEra = () => {
        const doc = new jsPDF();
        const productosQuimicosDeLaEra = usuariosList.filter(product => product.nombre_proveedor === 'QuimicosDeLaEra');
        doc.text("Reporte de Productos - QuimicosDeLaEra", 20, 10);
        doc.autoTable({
            head: [['ID', 'Nombre', 'Descripción', 'Cantidad', 'Precio', 'Proveedor', 'Fecha Compra', 'Fecha Vencimiento', 'Numero Factura']],
            body: productosQuimicosDeLaEra.map(product => [
                product.id, 
                product.nombre, 
                product.descripcion, 
                product.cantidad, 
                product.precio, 
                product.nombre_proveedor, 
                formatDate(product.fecha_compra), 
                formatDate(product.fecha_vencimiento), 
                product.numero_factura
            ])
        });
        doc.save('reporte_quimicosdelaera.pdf');
    };

    // Función para generar el reporte de productos de "Quimicos FERKICA"
    const generatePDFFerkica = () => {
        const doc = new jsPDF();
        const productosFerkica = usuariosList.filter(product => product.nombre_proveedor === 'Quimicos FERKICA');
        doc.text("Reporte de Productos - Quimicos FERKICA", 20, 10);
        doc.autoTable({
            head: [['ID', 'Nombre', 'Descripción', 'Cantidad', 'Precio', 'Proveedor', 'Fecha Compra', 'Fecha Vencimiento', 'Numero Factura']],
            body: productosFerkica.map(product => [
                product.id, 
                product.nombre, 
                product.descripcion, 
                product.cantidad, 
                product.precio, 
                product.nombre_proveedor, 
                formatDate(product.fecha_compra), 
                formatDate(product.fecha_vencimiento), 
                product.numero_factura
            ])
        });
        doc.save('reporte_quimicos_ferkica.pdf');
    };

    
    // Al cargar el componente, obtenemos los productos y proveedores
    useEffect(() => {
        init();
        fetchProveedores(); // Carga los proveedores
    }, []);

    return (
        <>
            <Dialog maxWidth='xs' open={openDialogDelete} onClose={handleDialogDelete}>
                <DialogTitle>¿Eliminar Producto?</DialogTitle>
                <DialogContent>
                    <Typography variant='h5'>Esta acción no se puede deshacer</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={handleDialogDelete}>Cancelar</Button>
                    <Button variant='contained' color='primary' onClick={onDelete}>Aceptar</Button>
                </DialogActions>
            </Dialog>
            
            <Dialog maxWidth='xs' open={openDialog} onClose={handleDialog}>
                <DialogTitle>{isEdit ? 'Formulario Editar Producto' : 'Formulario Crear Producto'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='nombre'
                                value={body.nombre}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Nombre Producto'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='descripcion'
                                value={body.descripcion}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Descripción Producto'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='cantidad'
                                value={body.cantidad}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Cantidad de Producto'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='precio'
                                value={body.precio}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Precio'
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                        <Grid item xs={12}>
                            <TextField
                                type='date'
                                margin='normal'
                                name='fecha_compra'
                                value={formatDate(body.fecha_compra)}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Fecha de Compra'
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='date'
                                margin='normal'
                                name='fecha_vencimiento'
                                value={formatDate(body.fecha_vencimiento)}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Fecha de Vencimiento'
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='numero_factura'
                                value={body.numero_factura}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Número de Factura'
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={handleDialog}>Cancelar</Button>
                    <Button variant='contained' color='primary' onClick={isEdit ? onEdit : onSubmit}>
                        {isEdit ? 'Editar Producto' : 'Agregar Producto'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Page title="FF| Inventario Productos">
                <ToastAutoHide message={mensaje} />
                <Container maxWidth='lg'>
                    <Box sx={{ pb: 5 }}>
                        <Typography variant="h5">Modulo de Inventario Car Wash</Typography>
                    </Box>
                    <Grid container spacing={2}>

                        {
                        /*

                        <Grid item xs={12} sm={3}>
                           <Button onClick={() => {setIsEdit(false); handleDialog(); setBody(initialState);}} startIcon={<AddOutlined />} variant='contained' color='primary'> Agregar Producto</Button>
                        </Grid> 

                        */

}



                        <Grid item xs={12} sm={3}>
                            <Button onClick={generatePDF} startIcon={<PictureAsPdfOutlined />} variant='contained' color='primary'> Generar Reporte PDF</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={generatePDFQuimicosDeLaEra} startIcon={<PictureAsPdfOutlined />} variant='contained' color='primary'> Reporte QuimicosDeLaEra</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={generatePDFFerkica} startIcon={<PictureAsPdfOutlined />} variant='contained' color='primary'> Reporte Quimicos FERKICA</Button>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <CommonTable data={usuariosList} columns={columns} />
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
}

export default Inventario;
