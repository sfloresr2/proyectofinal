import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0A2C47', // Azul oscuro
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ab003c', // Rojo oscuro
            contrastText: '#ffffff',
        },
        neutral: {
            main: '#64748B', // Gris azulado neutral
            contrastText: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif', // Fuente compacta y moderna
        button: {
            textTransform: 'none', // Evita la transformación a mayúsculas
            fontWeight: 500, // Negrita ligera
            fontSize: '0.875rem', // Tamaño de letra más pequeño
            letterSpacing: '0.025rem', // Espaciado de letras sutil
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 6, // Bordes ligeramente redondeados
                    boxShadow: 'none', // Sin sombra para un diseño más plano
                    padding: '4px 8px', // Acolchado reducido al mínimo
                    transition: 'background-color 0.3s ease, transform 0.3s ease', // Transiciones suaves
                    minWidth: 'auto', // Elimina el ancho mínimo
                    marginRight: '4px', // Espacio mínimo entre los botones
                    '&:hover': {
                        transform: 'translateY(-1px)', // Efecto de elevación sutil en hover
                        backgroundColor: '#092337', // Color de fondo ligeramente más oscuro en hover
                    },
                },
            },
            variants: [
                {
                    props: { variant: 'outlined' },
                    style: {
                        border: `1px solid #0A2C47`, // Borde delgado en azul oscuro
                        color: '#0A2C47',
                        fontFamily: '"Montserrat", sans-serif',
                        padding: '3px 7px', // Acolchado más reducido
                    },
                },
                {
                    props: { variant: 'outlined', color: 'secondary' },
                    style: {
                        border: `1px solid #ab003c`,
                        color: '#ab003c',
                        fontFamily: '"Montserrat", sans-serif',
                        padding: '3px 7px', // Acolchado más reducido
                    },
                },
                {
                    props: { variant: 'contained' },
                    style: {
                        backgroundColor: '#0A2C47', // Color azul oscuro
                        color: '#ffffff',
                        padding: '4px 8px', // Acolchado compacto
                        fontSize: '0.875rem', // Tamaño de letra pequeño
                        '&:hover': {
                            backgroundColor: '#092337', // Color de fondo más oscuro en hover
                        },
                    },
                },
                {
                    props: { variant: 'contained', color: 'secondary' },
                    style: {
                        backgroundColor: '#ab003c',
                        color: '#ffffff',
                        padding: '4px 8px', // Acolchado compacto
                        fontSize: '0.875rem', // Tamaño de letra pequeño
                        '&:hover': {
                            backgroundColor: '#8b002d', // Color de fondo más oscuro en hover
                        },
                    },
                },
            ],
        },
    },
});

export default theme;
