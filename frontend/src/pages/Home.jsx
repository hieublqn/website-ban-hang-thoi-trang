import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { errMsg } from '../api.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Home() {
  const [products, setProducts] = useState([])
  const [cats, setCats] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/categories')])
      .then(([p, c]) => { setProducts(p.data.slice(0, 8)); setCats(c.data) })
      .catch((e) => setError(errMsg(e)))
  }, [])

  return (
    <>
      <section className="hero">
        <h1>Thời trang cho mọi phong cách</h1>
        <p>Áo, quần, váy đầm và phụ kiện — giao hàng toàn quốc, thanh toán COD hoặc quét mã QR.</p>
        <Link className="btn" to="/san-pham">Mua sắm ngay</Link>
      </section>
      {error && <p className="error">{error}</p>}
      <div className="chips">
        {cats.map((c) => <Link key={c.MaDM} to={`/san-pham?category=${c.MaDM}`}>{c.TenDM}</Link>)}
      </div>
      <h2>Sản phẩm mới</h2>
      <div className="grid">{products.map((p) => <ProductCard key={p.MaSP} p={p} />)}</div>
    </>
  )
}
