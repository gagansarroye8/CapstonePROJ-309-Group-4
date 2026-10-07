/* Star rating. The client asked for a score and a review count
   under each product. A product with no reviews shows nothing. */

export default function Stars({ rating, reviews }) {
  if (!reviews) return null;

  return (
    <div className="stars">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--brand-orange)" aria-hidden="true">
        <path d="M12 2l3 6.6 7 .8-5.2 4.8 1.4 7-6.2-3.5L5.8 21l1.4-7L2 9.4l7-.8L12 2z" />
      </svg>
      <span style={{ fontWeight: 500 }}>{rating.toFixed(1)}</span>
      <span className="stars__count">({reviews})</span>
      <span className="sr-only" style={{ position: "absolute", left: "-9999px" }}>
        {rating} out of 5, {reviews} reviews
      </span>
    </div>
  );
}
