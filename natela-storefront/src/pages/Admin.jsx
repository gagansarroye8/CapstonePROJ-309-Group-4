import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { money } from "../context/CartContext";
import { SIZES } from "../data/products";
import ShortsIcon from "../components/ShortsIcon";

/* SCRUM-12 — Admin page.
   The client's brief: two owners, same permissions, able to add a
   product (name, description, price, photos), edit it, or remove it,
   behind a login customers can't reach. New order alerts by email
   and on this dashboard.

   The login itself belongs to auth-service — this page assumes the
   owner is already signed in. Do NOT rely on this page being hidden:
   every admin endpoint must check the role on the server. */

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  sport: "Muay Thai",
  stock: { S: "", M: "", L: "", XL: "" },
};

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [flash, setFlash] = useState(null);

  const lowStock = products.filter(
    (p) =>
      p.status === "live" &&
      Object.values(p.stock).some((n) => n > 0 && n < 5)
  ).length;

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function setStock(size, value) {
    setForm((f) => ({ ...f, stock: { ...f.stock, [size]: value } }));
  }

  function say(msg) {
    setFlash(msg);
    setTimeout(() => setFlash(null), 2600);
  }

  function handleSave(status = "live") {
    if (!form.name.trim() || !form.price) {
      say("Name and price are required.");
      return;
    }

    const stock = SIZES.reduce(
      (acc, s) => ({ ...acc, [s]: Number(form.stock[s]) || 0 }),
      {}
    );

    if (editingId) {
      updateProduct(editingId, {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        sport: form.sport,
        stock,
        status,
      });
      say(`"${form.name}" updated.`);
    } else {
      addProduct({ ...form, stock, status });
      say(`"${form.name}" is now on the store.`);
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      sport: product.sport,
      stock: SIZES.reduce(
        (acc, s) => ({ ...acc, [s]: String(product.stock[s] ?? 0) }),
        {}
      ),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function confirmDelete(id, name) {
    deleteProduct(id);
    setPendingDelete(null);
    if (editingId === id) cancelEdit();
    say(`"${name}" removed.`);
  }

  const statusColor = (p) => {
    if (p.status === "draft") return "var(--ink-faint)";
    const total = Object.values(p.stock).reduce((a, b) => a + b, 0);
    if (total === 0) return "var(--ink-faint)";
    if (Object.values(p.stock).some((n) => n > 0 && n < 5)) return "var(--brand-red)";
    return "var(--ok)";
  };
  const statusLabel = (p) => {
    if (p.status === "draft") return "Draft";
    const total = Object.values(p.stock).reduce((a, b) => a + b, 0);
    if (total === 0) return "Sold out";
    if (Object.values(p.stock).some((n) => n > 0 && n < 5)) return "Low stock";
    return "Live";
  };

  return (
    <div className="admin">
      {/* ---------- SIDEBAR ---------- */}
      <aside className="admin__side">
        <div style={{ padding: "0 10px", marginBottom: 6 }}>
          <span className="logo logo--sm">NATELA</span>
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.14em",
            color: "var(--ink-faint)",
            padding: "0 10px",
            marginBottom: 26,
          }}
        >
          ADMIN
        </div>

        <div className="admin__nav" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <button className="active">
            <span>Products</span>
          </button>
          <button>
            <span>Orders</span>
            <span className="pill">3</span>
          </button>
          <button>
            <span>Discounts</span>
          </button>
          <button>
            <span>Settings</span>
          </button>
          <Link to="/" style={{ marginTop: 10 }}>
            <span>← View store</span>
          </Link>
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 14,
            borderTop: "1px solid var(--line-soft)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "var(--brand-gradient)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            GS
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500 }}>Gagandeep</div>
            <div style={{ fontSize: 10.5, color: "var(--ink-muted)" }}>Owner</div>
          </div>
        </div>
      </aside>

      {/* ---------- MAIN ---------- */}
      <main className="admin__main">
        <div
          className="notice"
          style={{ borderLeft: "3px solid var(--brand-red)", marginBottom: 24 }}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--brand-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>
              3 new orders since you last checked
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-muted)" }}>
              Email alerts also sent to both owners. Pack and ship within 2
              business days.
            </div>
          </div>
          <button className="btn btn--dark" style={{ padding: "9px 18px", fontSize: 12.5 }}>
            View orders
          </button>
        </div>

        <div className="row-between" style={{ marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: 3 }}>
              Products
            </h1>
            <div className="muted" style={{ fontSize: 12.5 }}>
              {products.length} products · {lowStock} low on stock
            </div>
          </div>
          {flash && (
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 500,
                color: "var(--brand-red)",
                background: "#fff9f0",
                border: "1px solid var(--brand-orange)",
                borderRadius: "var(--radius)",
                padding: "8px 14px",
              }}
              role="status"
            >
              {flash}
            </div>
          )}
        </div>

        <div className="panel" style={{ overflow: "hidden" }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ paddingLeft: 18 }}>PRODUCT</th>
                  <th>PRICE</th>
                  <th>SIZES IN STOCK</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: "right", paddingRight: 18 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td style={{ paddingLeft: 18 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                        <div
                          style={{
                            width: 40,
                            height: 48,
                            flexShrink: 0,
                            background: "var(--surface-grey)",
                            borderRadius: "var(--radius)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ShortsIcon size={20} stroke={3} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 2 }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>
                            {p.sku} · {p.sport}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ fontWeight: 500 }}>{money(p.price)}</td>

                    <td>
                      <div style={{ display: "flex", gap: 5 }}>
                        {SIZES.map((s) => {
                          const n = p.stock[s] ?? 0;
                          return (
                            <span
                              key={s}
                              title={`${n} in stock`}
                              style={{
                                background: n > 0 ? "#fff" : "var(--surface-soft)",
                                border: `1px solid ${n > 0 ? "#ddddda" : "var(--line)"}`,
                                color: n > 0 ? "var(--ink)" : "#c2c2be",
                                fontSize: 11,
                                fontWeight: 500,
                                width: 26,
                                height: 24,
                                borderRadius: "var(--radius)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {s}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          fontWeight: 500,
                          color: statusColor(p),
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: statusColor(p),
                          }}
                        />
                        {statusLabel(p)}
                      </span>
                    </td>

                    <td style={{ paddingRight: 18 }}>
                      {pendingDelete === p.id ? (
                        <div style={{ display: "flex", gap: 7, justifyContent: "flex-end" }}>
                          <button
                            className="btn btn--quiet"
                            style={{ borderColor: "var(--brand-red)", color: "var(--brand-red)" }}
                            onClick={() => confirmDelete(p.id, p.name)}
                          >
                            Delete
                          </button>
                          <button className="btn btn--quiet" onClick={() => setPendingDelete(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 7, justifyContent: "flex-end" }}>
                          <button
                            className="icon-btn"
                            onClick={() => startEdit(p)}
                            aria-label={`Edit ${p.name}`}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3z" />
                            </svg>
                          </button>
                          <button
                            className="icon-btn"
                            onClick={() => setPendingDelete(p.id)}
                            aria-label={`Delete ${p.name}`}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="4 6 20 6" />
                              <path d="M7 6l1 14h8l1-14" />
                              <path d="M10 6V4h4v2" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 12 }}>
          Grey size chips are out of stock. Customers see those sizes disabled on
          the store.
        </div>
      </main>

      {/* ---------- ADD / EDIT PANEL ---------- */}
      <aside className="admin__panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
          <h2 className="h3">{editingId ? "Edit product" : "Add product"}</h2>
          {editingId && (
            <button
              onClick={cancelEdit}
              style={{ background: "none", border: "none", padding: 0, display: "flex" }}
              aria-label="Cancel editing"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <p className="muted" style={{ fontSize: 12.5, marginBottom: 22 }}>
          {editingId
            ? "Changes go live as soon as you save."
            : "Goes live on the store as soon as you save."}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="label" htmlFor="admin-photos">PHOTOS</label>
            <div
              id="admin-photos"
              style={{
                border: "1.5px dashed #ddddda",
                borderRadius: "var(--radius-lg)",
                padding: 22,
                textAlign: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 8px" }}>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="9" cy="10" r="1.6" />
                <path d="M21 15l-5-4-5 4-2-2-3 3" />
              </svg>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 3 }}>
                Drag photos here
              </div>
              <div style={{ fontSize: 11.5, color: "var(--ink-faint)" }}>
                Upload wired up when product-service is live
              </div>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="admin-name">NAME</label>
            <input
              id="admin-name"
              className="fld"
              placeholder="e.g. Flame Muay Thai Shorts"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="admin-desc">DESCRIPTION</label>
            <textarea
              id="admin-desc"
              className="fld"
              rows={4}
              placeholder="Fabric, fit, and what makes this pair different."
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label className="label" htmlFor="admin-price">PRICE (CAD)</label>
              <input
                id="admin-price"
                className="fld"
                inputMode="decimal"
                placeholder="92.00"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="admin-sport">SPORT</label>
              <select
                id="admin-sport"
                className="fld"
                value={form.sport}
                onChange={(e) => setField("sport", e.target.value)}
              >
                <option>Muay Thai</option>
                <option>Boxing</option>
                <option>MMA</option>
                <option>Training</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">STOCK PER SIZE</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {SIZES.map((s) => (
                <div key={s}>
                  <div style={{ fontSize: 11, color: "var(--ink-muted)", textAlign: "center", marginBottom: 4 }}>
                    {s}
                  </div>
                  <input
                    className="fld"
                    inputMode="numeric"
                    placeholder="0"
                    aria-label={`Stock for size ${s}`}
                    style={{ textAlign: "center", padding: "9px 4px" }}
                    value={form.stock[s]}
                    onChange={(e) => setStock(s, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button
              className="btn btn--grad"
              style={{ flex: 1, height: 44, padding: 0, fontSize: 13.5 }}
              onClick={() => handleSave("live")}
            >
              {editingId ? "Save changes" : "Save & publish"}
            </button>
            <button
              className="btn btn--quiet"
              style={{ height: 44, padding: "0 18px", fontSize: 13.5 }}
              onClick={() => handleSave("draft")}
            >
              Draft
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
