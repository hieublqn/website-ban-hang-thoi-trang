import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { errMsg, money } from '../../api.js'

const STATUS = { moi: 'Mới', dang_giao: 'Đang giao', hoan_thanh: 'Hoàn thành', huy: 'Đã hủy' }
const vi = (n, d = 1) => Number(n).toLocaleString('vi-VN', { maximumFractionDigits: d })

// Số gọn cho trục: 1,5 tr / 500k
function compact(n) {
  if (n >= 1e9) return `${vi(n / 1e9)} tỷ`
  if (n >= 1e6) return `${vi(n / 1e6)} tr`
  if (n >= 1e3) return `${vi(n / 1e3)}k`
  return String(n)
}

// Làm tròn trần trục lên số "đẹp" (1, 2, 5 × 10^k)
function niceMax(v) {
  if (v <= 0) return 1
  const p = 10 ** Math.floor(Math.log10(v))
  const m = v / p
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p
}

function Kpi({ label, value, big }) {
  return (
    <div className={`kpi${big ? ' big' : ''}`}>
      <div className="k-label">{label}</div>
      <div className="k-value">{value}</div>
    </div>
  )
}

// Biểu đồ cột: 1 màu, cột mảnh, nhãn giá trị chỉ ở cột cao nhất, chú giải khi rê chuột / focus bàn phím
function ColumnChart({ data }) {
  const [hover, setHover] = useState(null)
  const max = niceMax(Math.max(100000, ...data.map((d) => d.revenue))) // trục tối thiểu 100k để lúc chưa có đơn vẫn đọc được
  const top = data.reduce((best, d, i) => (d.revenue > data[best].revenue ? i : best), 0)
  const ticks = [max / 2, max]
  return (
    <>
      <div className="chart" role="group" aria-label="Biểu đồ cột doanh thu 7 ngày gần nhất">
        <div className="plot">
          {ticks.map((t) => (
            <div className="gl" key={t} style={{ bottom: `${(t / max) * 100}%` }}><span>{compact(t)}</span></div>
          ))}
          <span className="gl-zero">0</span>
          <div className="cols">
            {data.map((d, i) => {
              const pct = (d.revenue / max) * 100
              return (
                <div
                  className="col" key={d.date} tabIndex={0}
                  onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)} onBlur={() => setHover(null)}
                >
                  {i === top && hover !== i && d.revenue > 0 && <span className="cap" style={{ bottom: `calc(${pct}% + 4px)` }}>{compact(d.revenue)}</span>}
                  <div className="bar" style={{ height: `${pct}%` }} />
                  {hover === i && (
                    <div className="tip" style={{ bottom: `calc(${pct}% + 10px)` }}>
                      <b>{money(d.revenue)}</b>
                      <span>{d.label} · {d.orders} đơn</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        <div className="xlabels">{data.map((d) => <span key={d.date}>{d.label}</span>)}</div>
      </div>
      <details className="table-view">
        <summary>Xem dạng bảng</summary>
        <table>
          <thead><tr><th>Ngày</th><th>Số đơn</th><th>Doanh thu</th></tr></thead>
          <tbody>{data.map((d) => <tr key={d.date}><td>{d.label}</td><td>{d.orders}</td><td>{money(d.revenue)}</td></tr>)}</tbody>
        </table>
      </details>
    </>
  )
}

// Thanh ngang: 1 màu, giá trị ghi ở đầu thanh
function HBars({ items, empty }) {
  if (!items.length) return <p className="muted">{empty}</p>
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <ul className="hbars">
      {items.map((it) => {
        const w = it.value > 0 ? Math.max((it.value / max) * 86, 1.5) : 0
        return (
          <li key={it.key}>
            <span className="hb-label" title={it.label}>{it.label}</span>
            <span className="hb-track">
              <span className="hb-bar" style={{ width: `${w}%` }} />
              <b className="hb-val" style={{ left: `calc(${w}% + 8px)` }}>{it.value}</b>
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default function AdminDashboard() {
  const nav = useNavigate()
  const [s, setS] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/stats').then((r) => setS(r.data)).catch((e) => {
      if (e.response?.status === 401) { localStorage.removeItem('token'); nav('/admin/login') }
      else setError(errMsg(e))
    })
  }, [nav])

  if (error) return <p className="error">{error}</p>
  if (!s) return <p>Đang tải thống kê...</p>

  const t = s.totals
  return (
    <>
      <h2>Thống kê</h2>
      <p className="muted">Doanh thu tính trên các đơn chưa bị hủy.</p>

      <div className="kpis">
        <Kpi big label="Doanh thu" value={money(t.revenue)} />
        <Kpi label="Đã thanh toán" value={money(t.paid)} />
        <Kpi label="Đơn hàng" value={t.orders} />
        <Kpi label="Khách hàng" value={t.customers} />
        <Kpi label="Sản phẩm" value={t.products} />
        <Kpi label="Liên hệ chưa xử lý" value={t.newContacts} />
      </div>

      <div className="dash-grid">
        <section className="panel">
          <h3>Doanh thu 7 ngày gần nhất</h3>
          <ColumnChart data={s.daily} />
        </section>

        <section className="panel">
          <h3>Đơn hàng theo trạng thái</h3>
          <HBars
            items={s.byStatus.map((x) => ({ key: x.status, label: STATUS[x.status], value: x.n }))}
            empty="Chưa có đơn hàng."
          />
        </section>

        <section className="panel">
          <h3>Sản phẩm bán chạy</h3>
          <HBars
            items={s.topProducts.map((p) => ({ key: p.MaSP, label: p.TenSP, value: p.daBan }))}
            empty="Chưa có sản phẩm nào được bán."
          />
        </section>

        <section className="panel">
          <h3>Tồn kho thấp nhất</h3>
          <HBars
            items={s.lowStock.map((p) => ({ key: p.MaSP, label: p.TenSP, value: p.SoLuongTon }))}
            empty="Chưa có sản phẩm."
          />
        </section>
      </div>

      <section className="panel">
        <h3>Đơn hàng gần đây <Link className="more" to="/admin/don-hang">Xem tất cả →</Link></h3>
        {s.recent.length ? (
          <table>
            <thead><tr><th>Mã</th><th>Khách</th><th>Ngày</th><th>Tổng</th><th>Trạng thái</th></tr></thead>
            <tbody>
              {s.recent.map((o) => (
                <tr key={o.MaHD}>
                  <td>#{o.MaHD}</td><td>{o.HoTen}</td>
                  <td>{new Date(o.NgayLap).toLocaleString('vi-VN')}</td>
                  <td>{money(o.TongTien)}</td><td>{STATUS[o.TrangThaiDon]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="muted">Chưa có đơn hàng.</p>}
      </section>
    </>
  )
}
