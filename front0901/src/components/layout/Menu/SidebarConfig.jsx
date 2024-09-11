import React from 'react'
import { PersonOutlined, HomeOutlined, ShoppingCartOutlined, Inventory2Outlined } from '@mui/icons-material' // Importa los nuevos iconos

const sidebarConfig = [
	{
		title: 'inicio',
		path: '/app',
		icon: <HomeOutlined />
	},
	{
		title: 'usuarios',
		path: '/app/usuarios',
		icon: <PersonOutlined />
	},
	{
		title: 'Compras Car Wash',
		path: '/app/productos',
		icon: <ShoppingCartOutlined /> // Cambiado a un icono de compras
	},
	{
		title: 'Inventario Car Wash',
		path: '/app/inventario',
		icon: <Inventory2Outlined /> // Cambiado a un icono de inventario
	}
]

export default sidebarConfig
