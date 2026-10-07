import { Link } from "react-router-dom";
import { useCart, money } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import ShortsIcon from "../components/ShortsIcon";

/* SCRUM-5 — Cart.
   Guest checkout only: the client does not want customer accounts.
   Bundle discount, worldwide shipping and GST are worked out in
   CartContext so the numbers live in one place. */

export default function Cart() {
  const { items, removeItem, setQty, totals } = useCart();
  const { products } = useProducts();

  /* Stand-in for the AI recommendation service (course Requirement 05).
     Today it just suggests live products that are not already in the
     cart. Swap this for a call to ai-service when it exists. */
  const inCart = new Set(items.map((i) => i.productId));
  const recommendations = products
    .filter((p) => p.status === "live" && !inCart.has(p.id))
    .slice(0, 3);

  if (items.length === 0) {
    return (
      <div className="page" style={{ paddingBlock: 64 }}>
        <h1 className="h1" style={{ fontSize: "2rem", marginBottom: 8 }}>
          Your cart
        </h1>
        <div className="panel empty" style={{ marginTop: 32 }}>
          <div style={{ marginBottom: 18, display: "flex", justifyContent: "center" }}>
            <ShortsIcon size={64} />
          </div>
          <p style={{ fontWeight: 500, marginBottom: 6, color: "var(--ink)" }}>
            Nothing in your cart yet
          </p>
          <p style={{ fontSize: 13.5, marginBottom: 22 }}>
            Pick a pair and a size to get started.
          </p>
          <Link to="/" className="btn btn--grad">
            Shop all shorts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingBlock: 44 }}>
      <h1 className="h1" style={{ fontSize: "2rem", marginBottom: 4 }}>
        Your cart
      </h1>
      <p className="muted" style={{ marginBottom: 34 }}>
        {totals.count} {totals.count === 1 ? "item" : "items"} · prices in
        Canadian dollars
      </p>

      <div className="cart-split">
        {/* ---------- LEFT: ITEMS ---------- */}
        <div>
          <div className="panel" style={{ padding: "16px 18px", marginBottom: 22 }}>
            {totals.awayFromFreeShipping > 0 ? (
              <div style={{ fontSize: 13, marginBottom: 10 }}>
                You're{" "}
                <strong style={{ color: "var(--brand-red)" }}>
                  {money(totals.awayFromFreeShipping)}
                </strong>{" "}
                away from free worldwide shipping
              </div>
            ) : (
              <div style={{ fontSize: 13, marginBottom: 10, color: "var(--ok)", fontWeight: 500 }}>
                Free worldwide shipping unlocked
              </div>
            )}
            <div className="progress">
              <div
                className="progress__fill"
                style={{ width: `${totals.shippingProgress}%` }}
              />
            </div>
          </div>

          {items.map((item) => (
            <div key={item.key} className="cart-item">
              <div className="cart-thumb">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <ShortsIcon size={52} stroke={2} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{item.name}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, whiteSpace: "nowrap" }}>
                    {money(item.price * item.qty)}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: "auto" }}>
                  Size {item.size} · {item.sport}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 16,
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div className="qty">
                    <button
                      onClick={() => setQty(item.key, item.qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => setQty(item.key, item.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      fontSize: 12.5,
                      color: "var(--ink-muted)",
                      textDecoration: "underline",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 22 }}>
            {totals.bundleDiscount > 0 ? (
              <div className="notice">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--brand-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>
                    Bundle deal applied — {money(totals.bundleDiscount)} off
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-muted)" }}>
                    Any two pairs. Already included in your total.
                  </div>
                </div>
              </div>
            ) : (
              <div className="notice" style={{ background: "#fff", borderColor: "var(--line)" }}>
                <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                  Add one more pair to save {money(30)} with the bundle deal.
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 26 }}>
            <Link to="/" style={{ fontSize: 13.5, fontWeight: 500, borderBottom: "1px solid var(--ink)" }}>
              ← Continue shopping
            </Link>
          </div>
        </div>

        {/* ---------- RIGHT: SUMMARY ---------- */}
        <div>
          <div className="panel" style={{ padding: 26 }}>
            <h2 className="h3" style={{ marginBottom: 22 }}>
              Order summary
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                paddingBottom: 18,
                borderBottom: "1px solid var(--line)",
              }}
            >
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{money(totals.subtotal)}</span>
              </div>
              {totals.bundleDiscount > 0 && (
                <div className="summary-row" style={{ color: "var(--brand-red)" }}>
                  <span>Bundle discount</span>
                  <span style={{ fontWeight: 500 }}>
                    −{money(totals.bundleDiscount)}
                  </span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping (worldwide)</span>
                <span>{totals.shipping === 0 ? "FREE" : money(totals.shipping)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (GST 5%)</span>
                <span>{money(totals.tax)}</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "18px 0 4px",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600 }}>Total</span>
              <span style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                {money(totals.total)}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 24 }}>
              Canadian dollars · duties calculated at checkout
            </div>

            <button className="btn btn--grad btn--block btn--lg">
              Checkout as guest
            </button>
            <div
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "var(--ink-faint)",
                margin: "10px 0 20px",
              }}
            >
              No account needed — just an email for your receipt
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
              <span style={{ fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.06em" }}>
                OR PAY WITH
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <button className="btn btn--dark btn--block" style={{ height: 44, padding: 0, fontSize: 13.5 }}>
                Apple Pay
              </button>
              <button className="btn btn--quiet btn--block" style={{ height: 44, padding: 0, fontSize: 13.5 }}>
                PayPal
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginTop: 20,
                paddingTop: 18,
                borderTop: "1px solid var(--line)",
                fontSize: 11.5,
                color: "var(--ink-faint)",
                lineHeight: 1.5,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              Secure checkout. Card details are handled by our payment provider
              and never stored by Natela Fit.
            </div>
          </div>
        </div>
      </div>

      {/* ---------- RECOMMENDATIONS (AI slot) ---------- */}
      {recommendations.length > 0 && (
        <div style={{ marginTop: 64, paddingTop: 44, borderTop: "1px solid var(--line)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--brand-red)" aria-hidden="true">
              <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
            </svg>
            <h2 className="h3">Complete your kit</h2>
          </div>
          <p className="muted" style={{ marginBottom: 24 }}>
            Matched to what's in your cart.
          </p>
          <div className="grid grid--3">
            {recommendations.map((p) => (
              <div
                key={p.id}
                className="panel"
                style={{ display: "flex", gap: 16, padding: 14, alignItems: "center" }}
              >
                <div
                  style={{
                    width: 78,
                    height: 92,
                    flexShrink: 0,
                    background: "var(--surface-grey)",
                    borderRadius: "var(--radius)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShortsIcon size={38} stroke={2.4} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 4 }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 11 }}>
                    {money(p.price)}
                  </div>
                  <Link to="/" className="btn btn--quiet">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
