export const products = [
  {
    id: 1,
    name: 'Hamburguesa Clásica',
    description: 'Jugosa carne de res con lechuga fresca, tomate y queso, empacada de forma segura para conservar su calor.',
    price: 179.00,
    category: 'burgers',
    image: import.meta.env.BASE_URL + 'images/producto_hamburguesa_clasica.png',
    ingredients: ['Carne de Res', 'Lechuga', 'Tomate', 'Queso'],
  },
  {
    id: 2,
    name: 'Hamburguesa Doble Queso',
    description: 'Doble porción de carne con extra queso y cebolla. Enviada en caja protectora para mantener su frescura.',
    price: 239.00,
    category: 'burgers',
    image: import.meta.env.BASE_URL + 'images/producto_hamburguesa_doble.png',
    ingredients: ['Carne Doble', 'Extra Queso', 'Cebolla', 'Salsa Secreta'],
  },
  {
    id: 3,
    name: 'Papas Fritas Crujientes',
    description: 'Papas a la francesa doradas, en su clásico empaque vertical para que no se esparzan en el camino.',
    price: 69.00,
    category: 'fries',
    image: import.meta.env.BASE_URL + 'images/producto_papas_fritas.png',
  },
  {
    id: 4,
    name: 'Refresco de Cola Helado',
    description: 'Refrescante bebida de cola helada, enviada en vaso sellado antiderrame con tapa hermética.',
    price: 59.00,
    category: 'drinks',
    image: import.meta.env.BASE_URL + 'images/producto_refresco_cola.png',
  },
  {
    id: 5,
    name: 'Brownie de Chocolate',
    description: 'Delicioso brownie de chocolate para terminar tu comida, enviado en una cajita protectora de repostería.',
    price: 89.00,
    category: 'extras',
    image: import.meta.env.BASE_URL + 'images/producto_brownie.png',
  },
  {
    id: 6,
    name: 'Combo Clásico',
    description: 'Nuestra hamburguesa clásica acompañada de tu elección de papas o ensalada y bebida a elegir.',
    price: 249.00,
    category: 'combos',
    image: import.meta.env.BASE_URL + 'images/producto_combo_clasico.png',
    ingredients: ['Carne de Res', 'Lechuga', 'Tomate', 'Queso'],
    singleChoiceOptions: [
      {
        title: 'Elige tu acompañante',
        required: true,
        options: [
          { label: 'Papas Fritas Medianas', priceAdd: 0 },
          { label: 'Aros de Cebolla', priceAdd: 20 },
          { label: 'Ensalada Fresca', priceAdd: 10 },
        ]
      },
      {
        title: 'Elige tu bebida',
        required: true,
        options: [
          { label: 'Refresco de Cola', priceAdd: 0 },
          { label: 'Refresco Limón', priceAdd: 0 },
          { label: 'Agua Natural', priceAdd: 0 },
        ]
      }
    ]
  },
  {
    id: 7,
    name: 'Pizza Pepperoni Artesanal',
    description: 'Pizza de masa madre con salsa de tomate de la casa, mozzarella y pepperoni crujiente.',
    price: 199.00,
    category: 'pizzas',
    image: import.meta.env.BASE_URL + 'images/producto_pizza_pepperoni.png',
    singleChoiceOptions: [
      {
        title: 'Tamaño',
        required: true,
        options: [
          { label: 'Mediana (8 rebanadas)', priceAdd: 0 },
          { label: 'Familiar (12 rebanadas)', priceAdd: 60 },
        ]
      }
    ]
  },
  {
    id: 8,
    name: 'Alitas BBQ (10 pz)',
    description: '10 deliciosas alitas bañadas en nuestra salsa BBQ secreta, acompañadas de aderezo ranch.',
    price: 129.00,
    originalPrice: 189.00,
    category: 'entradas',
    image: import.meta.env.BASE_URL + 'images/producto_alitas_bbq.png',
  }
];
