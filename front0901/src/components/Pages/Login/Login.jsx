import React, { useState, useContext, useEffect } from 'react'
import { Grid, CssBaseline, Paper, Avatar, Typography, TextField, Button, InputAdornment, IconButton, LinearProgress, Box, Link } from '@mui/material'
import { Visibility, VisibilityOff, DirectionsCar } from '@mui/icons-material' // Importa el ícono de carro
import { useHistory } from 'react-router-dom'
import ApiRequest from '../../../helpers/axiosInstances'
import { MainContext, APP_STATE, AUTH_TYPES } from '../../../Context/MainContext'
import ToastAutoHide from '../../common/ToastAutoHide'
import Page from '../../common/Page'

// Importa la imagen
import loginImage from './logo.png';

const Login = () => {
    const { globalDispatch } = useContext(MainContext)
    const [bodyLogin, setBodyLogin] = useState({ usuario: '', contrasena: '' })
    const [showPass, setShowPass] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null })
    const { push } = useHistory()

    const onChange = e => {
        const { name, value } = e.target
        setBodyLogin({
            ...bodyLogin,
            [name]: value
        })
    }

    const handleSubmit = () => {
        setIsLoading(true)
        ApiRequest().post('/login', bodyLogin)
            .then(({ data }) => {
                globalDispatch({
                    type: AUTH_TYPES.LOGIN_OK,
                    payload: data
                })
                setIsLoading(false)
                push('/app')
            })
            .catch(({ response }) => {
                globalDispatch({ type: AUTH_TYPES.LOGIN_FAIL })
                setMensaje({
                    ident: new Date().getTime(),
                    message: response.data,
                    type: 'error'
                })
                setIsLoading(false)
            })
    }

    const init = () => {
        globalDispatch({
            type: APP_STATE.CLEAR_APP_STATE
        })
        localStorage.clear()
    }

    useEffect(init, [])

    return (
        <Page title="FF | Inicio de sesión">
            <ToastAutoHide message={mensaje} />
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7}
                    sx={{
                        backgroundImage: `url(${loginImage})`, // Se establece la imagen de fondo
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? "#27aae1" : "#27aae1",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={10} square>
                    <Box
                        sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <DirectionsCar /> {/* Reemplaza el ícono del candado con el ícono de carro */}
                        </Avatar>
                        <Typography component="h1" variant="h5">
						Inicio de sesión
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            <TextField
                                required
                                fullWidth
                                autoFocus
                                value={bodyLogin.usuario}
                                onChange={onChange}
                                variant="outlined"
                                margin="normal"
                                label="Usuario"
                                name="usuario"
                            />
                            <TextField
                                required
                                fullWidth
                                variant="outlined"
                                value={bodyLogin.contrasena}
                                onChange={onChange}
                                margin="normal"
                                name="contrasena"
                                label="Contraseña"
                                type={showPass ? "text" : "password"}
                                autoComplete="current-password"
                                onKeyDown={e => { if (e.keyCode === 13) { handleSubmit() } }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPass(!showPass)}
                                                onMouseDown={(event) => {
                                                    event.preventDefault()
                                                }}
                                            >
                                                {showPass ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            {isLoading ? <LinearProgress color='secondary' /> : null}
                            <Button
                                startIcon={<DirectionsCar />}  // Reemplaza el ícono del candado con el ícono de carro
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleSubmit}
                            >
                                Iniciar sesión {/* Cambia el texto del botón a "Iniciar sesión" */}
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="/login" variant="body2">
                                        FF Importadora de vehiculos & Car Wash
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Page>
    )
}

export default Login
