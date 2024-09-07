import React, { useState, useEffect } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Container, Typography, Grid, Box, Button, Stack, Avatar, IconButton, Divider, MenuItem, Select, InputLabel } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, EditOutlined, DeleteOutline, PictureAsPdfOutlined } from '@mui/icons-material'; // Importa el ícono para el PDF
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import CommonTable from '../../common/CommonTable';
import jsPDF from 'jspdf'; // Importa jsPDF
import 'jspdf-autotable'; // Importa el plugin autotable para tablas

const Usuarios = () => {
    const initialState = {
        id: "",
        correo: "",
        nombre: "",
        usuario: "",
        contrasena: "",
        descripcion: "",
        estado: "",
        rol: " "
    };

    const [roles, setRoles] = useState([]);
    
    const [usuariosList, setUsuariosList] = useState([]);
    const [body, setBody] = useState(initialState);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const [idDelete, setIdDelete] = useState(null);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    
    const init = async () => {
        const { data } = await ApiRequest().get('/usuarios');
        setUsuariosList(data);
    };



    const columns = [
        { field: 'id', headerName: 'Codigo', width: 120 },
        { field: 'correo', headerName: 'Correo electronico', width: 220 },
        { field: 'nombre', headerName: 'Nombre y Apellido', width: 220 },
        { field: 'usuario', headerName: 'Nombre de Usuario', width: 220 },
        { field: 'contrasena', headerName: 'Contraseña', width: 220 },
        { field: 'descripcion', headerName: 'Rol', width: 220 },
        { field: 'estado', headerName: 'Estado', width: 220 },
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
            const { data } = await ApiRequest().post('/eliminar', { id: idDelete });
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
            const { data } = await ApiRequest().post('/guardar', body);
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
            const { data } = await ApiRequest().post('/editar', body);
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




    
    // Función para generar el reporte PDF con todos los usuarios
    const generatePDF = (usuarios, title) => {
        const doc = new jsPDF();
        doc.text(title, 20, 10);
        doc.autoTable({
            head: [['ID', 'Correo', 'Nombre', 'Usuario', 'Rol', 'Estado']],
            body: usuarios.map(user => [user.id, user.correo, user.nombre, user.usuario, user.rol, user.estado])
        });
        doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    };

    // Generar reporte de todos los usuarios
    const handleGenerateAllUsersReport = () => {
        generatePDF(usuariosList, 'Reporte de Todos los Usuarios');
    };

    // Generar reporte de usuarios activos
    const handleGenerateActiveUsersReport = () => {
        const activeUsers = usuariosList.filter(user => user.estado === 'Activo');
        generatePDF(activeUsers, 'Reporte de Usuarios Activos');
    };

    // Generar reporte de usuarios inactivos
    const handleGenerateInactiveUsersReport = () => {
        const inactiveUsers = usuariosList.filter(user => user.estado === 'Inactivo');
        generatePDF(inactiveUsers, 'Reporte de Usuarios Inactivos');
    };

    // Generar reporte de usuarios con rol ADMIN
    const handleGenerateAdminUsersReport = () => {
        const adminUsers = usuariosList.filter(user => user.rol === 'ADMIN');
        generatePDF(adminUsers, 'Reporte de Usuarios ADMIN');
    };

    // Generar reporte de usuarios con rol User
    const handleGenerateUserUsersReport = () => {
        const userUsers = usuariosList.filter(user => user.rol === 'User');
        generatePDF(userUsers, 'Reporte de Usuarios User');
    };

    const fetchRoles = async () => {
        try {
        const response = await ApiRequest().get('/roles'); 
        setRoles(response.data);
        } catch (error) {
        console.error('Error fetching roles data:', error);
        }
    };


   
    useEffect(() => {
        fetchRoles(); // Fetch marca options when the component mounts.
        init();
    }, []);

    return (
        <>
            <Dialog maxWidth='xs' open={openDialogDelete} onClose={handleDialogDelete}>
                <DialogTitle>
                    ¿Eliminar usuario?
                </DialogTitle>
                <DialogContent>
                    <Typography variant='h5'>Esta acción no se puede deshacer</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={handleDialogDelete}>Cancelar</Button>
                    <Button variant='contained' color='primary' onClick={onDelete}>Aceptar</Button>
                </DialogActions>
            </Dialog>
            
            <Dialog maxWidth='xs' open={openDialog} onClose={handleDialog}>
                <DialogTitle>
                    {isEdit ? 'Formulario Editar Usuario' : 'Formulario Crear Usuario'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='correo'
                                value={body.correo}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Correo Electronico'
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='nombre'
                                value={body.nombre}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Nombre y Apellido'
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='usuario'
                                value={body.usuario}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Nombre de Usuario'
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='contrasena'
                                value={body.contrasena}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Contraseña'
                            />
                        </Grid>
                        <Grid item xs={12}>
                        <InputLabel htmlFor="rol">Rol del usuario</InputLabel>
                        <Select
                            name="rol"
                            value={body.rol || ''}
                            onChange={onChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            {roles.map((rol) => (
                                <MenuItem key={rol.id} value={rol.id}>
                                    {rol.descripcion}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>




                        <Grid item xs={12} sm={12}>
                            <InputLabel htmlFor="estado">Estado de usuario</InputLabel>
                            <Select
                                name='estado'
                                value={body.estado}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                placeholderlabel='Estado'
                            >
                                <MenuItem value="Activo">Activo</MenuItem>
                                <MenuItem value="Inactivo">Inactivo</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={handleDialog}>Cancelar</Button>
                    <Button variant='contained' color='primary' onClick={isEdit ? () => onEdit() : () => onSubmit()}>Guardar Usuario</Button>
                </DialogActions>
            </Dialog>
            <Page title="FF| Usuarios">
                <ToastAutoHide message={mensaje} />
                <Container maxWidth='lg'>
                    <Box sx={{ pb: 5 }}>
                        <Typography variant="h5">Modulo de Usuarios</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={() => {setIsEdit(false); handleDialog(); setBody(initialState);}} startIcon={<AddOutlined />} variant='contained' color='primary'> Agregar Usuario</Button>
                        </Grid>
                        {/* Botones de reporte de PDF con color azul más oscuro */}
                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateAllUsersReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}> Reporte Usuarios (Todos)</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateActiveUsersReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}> Reporte Usuarios (Activos)</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateInactiveUsersReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}> Reporte Usuarios (Inactivos)</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateAdminUsersReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}> Reporte Usuarios (ADMIN)</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateUserUsersReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}> Reporte Usuarios (User)</Button>
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

export default Usuarios;
