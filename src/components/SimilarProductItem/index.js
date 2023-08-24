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

      <p className="similar-title">{title}</p>
      <p>by {brand}</p>
      <div className="similar-rating-price">
        <p className="similar-price">RS {price}/-</p>
        <div className="similar-rating">
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
