import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api, { errMsg } from '../api.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Products() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || ''
  const q = params.get('q') || ''
  const sort = params.get('sort') || 'moi_nhat'
  const minPrice = params.get('minPrice') || ''
  const maxPrice = params.get('maxPrice') || ''
  const [search, setSearch] = useState(q)
  const [minInput, setMinInput] = useState(minPrice)
  const [maxInput, setMaxInput] = useState(maxPrice)
  const [products, setProducts] = useState([])
  const [cats, setCats] = useState([])
  const [error, setError] = useState('')

  useEffect(() => { api.get('/categories').then((r) => setCats(r.data)).catch((e) => setError(errMsg(e))) }, [])
  useEffect(() => {
    api.get('/products', { params: { category, q, sort, minPrice, maxPrice } })
      .then((r) => setProducts(r.data)).catch((e) => setError(errMsg(e)))
  }, [category, q, sort, minPrice, maxPrice])

  const update = (next) => {
    const p = { category, q, sort, minPrice, maxPrice, ...next }
    setParams(Object.fromEntries(Object.entries(p).filter(([, v]) => v)))
  }

  return (
    <>
      <h2>Sản phẩm</h2>
      <div className="toolbar">
        <select value={category} onChange={(e) => update({ category: e.target.value })}>
          <option value="">Tất cả danh mục</option>
          {cats.map((c) => <option key={c.MaDM} value={c.MaDM}>{c.TenDM}</option>)}
        </select>
        <select value={sort} onChange={(e) => update({ sort: e.target.value })}>
          <option value="moi_nhat">Mới nhất</option>
          <option value="gia_tang">Giá tăng dần</option>
          <option value="gia_giam">Giá giảm dần</option>
        </select>
        <form className="price-filter" onSubmit={(e) => { e.preventDefault(); update({ minPrice: minInput, maxPrice: maxInput }) }}>
          <input type="number" min="0" placeholder="Giá từ" value={minInput} onChange={(e) => setMinInput(e.target.value)} />
          <span>–</span>
          <input type="number" min="0" placeholder="đến" value={maxInput} onChange={(e) => setMaxInput(e.target.value)} />
          <button className="btn alt">Lọc</button>
        </form>
        <form onSubmit={(e) => { e.preventDefault(); update({ q: search }) }}>
          <input placeholder="Tìm sản phẩm..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn">Tìm</button>
        </form>
      </div>
      {error && <p className="error">{error}</p>}
      {!products.length && !error && <p>Không có sản phẩm phù hợp.</p>}
      <div className="grid">{products.map((p) => <ProductCard key={p.MaSP} p={p} />)}</div>
    </>
  )
}
