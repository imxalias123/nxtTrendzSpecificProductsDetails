// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachProduct} = props
  const {brand, title, imageUrl, price, rating} = eachProduct
  return (
    <li>
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-image"
      />
      <p>{title}</p>
      <p>by {brand}</p>
      <div>
        <p>RS {price}/-</p>
        <div>
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
