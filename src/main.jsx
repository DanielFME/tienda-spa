import React, { createContext, useContext, useMemo, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './styles.css';

const products = [
  { id: 1, name: 'Hoodie Concrete', price: 159900, icon: '🧥', color: 'violet', description: 'Algodón pesado, corte relajado y gris cemento.' },
  { id: 2, name: 'Camiseta After Hours', price: 89900, icon: '👕', color: 'orange', description: 'Gráfico frontal y silueta oversized para la noche.' },
  { id: 3, name: 'Cargo District', price: 179900, icon: '👖', color: 'blue', description: 'Bolsillos utilitarios y fit recto para moverte libre.' },
  { id: 4, name: 'Gorra Asphalt', price: 69900, icon: '🧢', color: 'yellow', description: 'Visera curva y bordado monocromo de Revolate.' },
  { id: 5, name: 'Tote Underground', price: 49900, icon: '👜', color: 'pink', description: 'Lona resistente para cargar tu día sin esfuerzo.' },
];

const CartContext = createContext(null);
const money = (amount) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const addProduct = (product) => setItems((current) => [...current, { ...product, lineId: crypto.randomUUID() }]);
  const removeProduct = (lineId) => setItems((current) => current.filter((item) => item.lineId !== lineId));
  const value = useMemo(() => ({ items, addProduct, removeProduct }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
function useCart() { const cart = useContext(CartContext); if (!cart) throw new Error('useCart debe usarse dentro de CartProvider'); return cart; }

function Navbar() {
  const { items } = useCart();
  return <header className="nav-shell"><nav className="nav container" aria-label="Navegación principal">
    <Link className="brand" to="/"><span className="brand-mark">R</span>Revo<span>late</span></Link>
    <div className="nav-links"><NavLink to="/" end>Inicio</NavLink><NavLink to="/productos">Productos</NavLink><NavLink className="cart-link" to="/carrito">Carrito <span className="badge" aria-label={`${items.length} productos en el carrito`}>{items.length}</span></NavLink></div>
  </nav></header>;
}
function Home() {
  const { items } = useCart();
  return <main><section className="hero container"><div className="hero-copy"><p className="eyebrow">Streetwear sin permiso</p><h1>Tu código,<br /><em>tu uniforme.</em></h1><p className="lede">Prendas urbanas para días largos, noches cortas y una identidad que no se negocia.</p><div className="hero-actions"><Link className="button primary" to="/productos">Explorar productos <span>→</span></Link><Link className="button ghost" to="/carrito">Ver carrito {items.length > 0 && `(${items.length})`}</Link></div></div><div className="hero-art" aria-hidden="true"><div className="orb orb-one" /><div className="orb orb-two" /><div className="product-orbit"><span>✦</span><span>◌</span><div className="hero-card">✦<small>Selección<br />Revolate</small></div></div></div></section><section className="features container"><div><strong>Envío sin costo</strong><span>En compras desde $100.000</span></div><div><strong>Pago seguro</strong><span>Compra con tranquilidad</span></div><div><strong>Estado en vivo</strong><span>Tu carrito siempre actualizado</span></div></section></main>;
}
function Products() {
  const { addProduct } = useCart(); const [notice, setNotice] = useState('');
  const add = (product) => { addProduct(product); setNotice(`${product.name} fue agregado al carrito.`); };
  return <main className="container page"><p className="eyebrow">Colección 2026</p><div className="page-title"><div><h1>Elige tu próximo<br /><em>favorito.</em></h1><p>Una selección de streetwear en escala de grises, hecha para la ciudad.</p></div><span className="product-count">5 productos</span></div><p className="sr-only" aria-live="polite">{notice}</p><section className="product-grid">{products.map((product) => <article className="product-card" key={product.id}><div className={`product-visual ${product.color}`}><span>{product.icon}</span></div><div className="product-info"><p>{product.description}</p><h2>{product.name}</h2><div><strong>{money(product.price)}</strong><button onClick={() => add(product)} aria-label={`Agregar ${product.name} al carrito`}>Agregar <span>+</span></button></div></div></article>)}</section></main>;
}
function Cart() {
  const { items, removeProduct } = useCart(); const total = items.reduce((sum, item) => sum + item.price, 0);
  return <main className="container page"><p className="eyebrow">Tu selección</p><div className="page-title"><div><h1>Tu carrito,<br /><em>en movimiento.</em></h1><p>{items.length ? 'Revisa tus productos antes de continuar.' : 'Aún no has agregado productos.'}</p></div><span className="product-count">{items.length} {items.length === 1 ? 'ítem' : 'ítems'}</span></div>{items.length === 0 ? <section className="empty"><span>🛍️</span><h2>Tu carrito está esperando.</h2><p>Encuentra prendas para construir tu próxima salida.</p><Link className="button primary" to="/productos">Ir a productos <span>→</span></Link></section> : <section className="cart-layout"><div className="cart-items">{items.map((item) => <article className="cart-item" key={item.lineId}><div className={`cart-icon ${item.color}`}>{item.icon}</div><div><h2>{item.name}</h2><p>{item.description}</p></div><strong>{money(item.price)}</strong><button className="remove" onClick={() => removeProduct(item.lineId)} aria-label={`Eliminar ${item.name}`}>×</button></article>)}</div><aside className="summary"><p>Resumen del pedido</p><div><span>Productos ({items.length})</span><strong>{money(total)}</strong></div><div><span>Envío</span><strong className="free">Gratis</strong></div><hr /><div className="total"><span>Total</span><strong>{money(total)}</strong></div><button className="button primary checkout">Finalizar compra <span>→</span></button></aside></section>}</main>;
}
function App() { return <CartProvider><BrowserRouter basename={import.meta.env.BASE_URL}><Navbar /><Routes><Route path="/" element={<Home />} /><Route path="/productos" element={<Products />} /><Route path="/carrito" element={<Cart />} /><Route path="*" element={<Home />} /></Routes><footer className="container">Revolate · Streetwear urbano</footer></BrowserRouter></CartProvider>; }
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
