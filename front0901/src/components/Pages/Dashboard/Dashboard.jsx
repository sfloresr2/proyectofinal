import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import Page from '../../common/Page';

// Importar imágenes desde la misma carpeta
import logocw from './logocw.png';
import vehiculos from './vehiculos.jpg';
import carwash from './carwash.jpg';

const Dashboard = () => {
  return (
    <Page title="Sistema Web | Dashboard">
      <Container maxWidth="xl">
        {/* Sección de Encabezado */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
            textAlign: 'center',
            color: '#FFFFFF',
            backgroundColor: '#002A4E', // Azul oscuro del logo
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography sx={{ mt: 3, fontWeight: 'bold' }} variant="h2">
            FF Importadora de Vehículos
          </Typography>
          <Typography sx={{ fontWeight: 'bold' }} variant="h5">
            & Car Wash
          </Typography>
          <Typography
            sx={{
              mt: 2,
              fontWeight: 'medium',
              fontSize: '1.2rem',
              maxWidth: '600px',
              lineHeight: 1.5,
            }}
          >
            ¡Bienvenido!
            <br />
            Tu portal central para gestionar y optimizar todas tus operaciones.
            Aquí podrás acceder a las herramientas clave para llevar el control de nuestros vehículos, productos y los servicios de carwash. Todo lo que necesitas para impulsar el éxito de FF está a un clic de distancia. ¡Vamos a hacer que hoy sea un gran día de trabajo!
          </Typography>
        </Box>

        {/* Sección de Imágenes */}
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <img src={logocw} alt="Logo" style={{ width: '100%', height: 'auto', marginBottom: '20px', borderRadius: '10px' }} />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <img src={vehiculos} alt="Vehículos" style={{ width: '100%', height: 'auto', marginBottom: '20px', borderRadius: '10px' }} />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <img src={carwash} alt="Car Wash" style={{ width: '100%', height: 'auto', marginBottom: '20px', borderRadius: '10px' }} />
            </Box>
          </Grid>
        </Grid>

        {/* Sección de Misión y Visión */}
        <Box
          sx={{
            mt: 4,
            p: 4,
            backgroundColor: '#F1F5F9', // Gris claro
            borderRadius: 2,
            textAlign: 'left',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#002A4E' }}>
            Misión
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#334E68' }}>
            Nuestra misión es proporcionar vehículos de alta calidad y servicios de lavado de autos excepcionales, garantizando la satisfacción total de nuestros clientes. Nos comprometemos a ofrecer una experiencia de compra y servicio personalizada, eficiente y confiable, apoyada en la innovación y la excelencia operativa.
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#002A4E' }}>
            Visión
          </Typography>
          <Typography variant="body1" sx={{ color: '#334E68' }}>
            Ser la empresa líder en la importación de vehículos y servicios de lavado de autos en Guatemala, reconocida por nuestra integridad, calidad y compromiso con la satisfacción del cliente. Aspiramos a crecer y expandirnos, estableciendo nuevos estándares en el sector automotriz y de servicios, y contribuyendo al desarrollo económico y social de nuestra comunidad.
          </Typography>
        </Box>

        {/* Sección de Contacto */}
        <Box
          sx={{
            mt: 4,
            p: 4,
            backgroundColor: '#E2E8F0', // Gris intermedio
            borderRadius: 2,
            textAlign: 'left',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#002A4E' }}>
            Contacto
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: '#334E68' }}>
            <strong>Ubicación:</strong> 0 Calle 0-51 Colonia Modelo Zona 2 Villa Nueva
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: '#334E68' }}>
            <strong>Correo Electrónico:</strong> importadoraycarwashff@gmail.com
          </Typography>
          <Typography variant="body1" sx={{ color: '#334E68' }}>
            <strong>Teléfono:</strong> +502 5229-2059
          </Typography>
        </Box>
      </Container>
    </Page>
  );
};

export default Dashboard;
