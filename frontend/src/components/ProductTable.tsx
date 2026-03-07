import { Product } from "../types/product";

interface Props {
  products: Product[];
}

function ProductTable({ products }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Unit</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.price}</td>
            <td>{product.unit_id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductTable;
