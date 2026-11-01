import { ListingsExplorer } from '../components/ListingsExplorer';

export function Buy() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Buy property</span>
          <h1 className="section-title">Find a home that feels like yours.</h1>
          <p className="section-sub">
            Explore illustrative sample listings across Indian cities.
          </p>
        </div>
        <ListingsExplorer purpose="Buy" />
      </div>
    </section>
  );
}
