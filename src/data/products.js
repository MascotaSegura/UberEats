export const products = [
  {
    id: 1,
    name: 'Hamburguesa Clásica',
    description: 'Jugosa carne de res con lechuga fresca, tomate y queso, empacada de forma segura para conservar su calor.',
    price: 179.00,
    category: 'burgers',
    image: import.meta.env.BASE_URL + 'images/classic_burger_v2.png',
    ingredients: ['Carne de Res', 'Lechuga', 'Tomate', 'Queso'],
  },
  {
    id: 2,
    name: 'Hamburguesa Doble Queso',
    description: 'Doble porción de carne con extra queso y cebolla. Enviada en caja protectora para mantener su frescura.',
    price: 239.00,
    category: 'burgers',
    image: import.meta.env.BASE_URL + 'images/double_burger_v2.png',
    ingredients: ['Carne Doble', 'Extra Queso', 'Cebolla', 'Salsa Secreta'],
  },
  {
    id: 3,
    name: 'Papas Fritas Crujientes',
    description: 'Papas a la francesa doradas, en su clásico empaque vertical para que no se esparzan en el camino.',
    price: 69.00,
    category: 'fries',
    image: import.meta.env.BASE_URL + 'images/crispy_fries_v2.png',
  },
  {
    id: 4,
    name: 'Refresco de Cola Helado',
    description: 'Refrescante bebida de cola helada, enviada en vaso sellado antiderrame con tapa hermética.',
    price: 59.00,
    category: 'drinks',
    image: import.meta.env.BASE_URL + 'images/ice_cola_v4.png',
  },
  {
    id: 5,
    name: 'Brownie de Chocolate',
    description: 'Delicioso brownie de chocolate para terminar tu comida, enviado en una cajita protectora de repostería.',
    price: 89.00,
    category: 'extras',
    image: import.meta.env.BASE_URL + 'images/chocolate_brownie_v2.png',
  }
];
