// Write your code here
import './index.css'
import Cookies from 'js-cookie'
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productData: {},
    similarProductsData: [],
    quantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getDetails = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
    price: data.price,
    description: data.description,
  })

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const fetchedData = await response.json()
    if (response.ok) {
      const updatedData = this.getDetails(fetchedData)
      const updatedSimilarProducts = fetchedData.similar_products.map(
        eachSimilarProducts => this.getDetails(eachSimilarProducts),
      )
      this.setState({
        apiStatus: apiStatusConstants.success,
        productData: updatedData,
        similarProductsData: updatedSimilarProducts,
      })
    } else if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderFailureView = () => (
    <div className="error-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-img"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoader = () => (
    <div className="" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  onClickIncrement = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  onClickDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  renderProductsDetails = () => {
    const {productData, quantity, similarProductsData} = this.state
    const {
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      availability,
      price,
      description,
    } = productData
    return (
      <div className="wrap">
        <div className="img-text-wrap">
          <img src={imageUrl} alt="product" className="profile" />
          <div className="text">
            <h1 className="title">{title}</h1>
            <p className="price">RS {price}/- </p>
            <div>
              <div className="wrap-rating-review">
                <div className="rating">
                  <p>{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star"
                  />
                </div>
                <p className="review">{totalReviews} Reviews</p>
              </div>

              <p className="description">{description}</p>
              <div className="wrap-left-right">
                <p className="left">Available:</p>
                <p className="right"> {availability}</p>
              </div>
              <div className="wrap-left-right">
                <p className="left">Brand:</p>
                <p className="right"> {brand}</p>
              </div>
              <hr className="hr" />
              <div className="wrap-btn">
                <button
                  type="button"
                  className="button"
                  data-testid="minus"
                  onClick={this.onClickDecrement}
                >
                  <BsDashSquare />
                </button>
                <p>{quantity}</p>
                <button
                  type="button"
                  className="button"
                  data-testid="plus"
                  onClick={this.onClickIncrement}
                >
                  <BsPlusSquare />
                </button>
              </div>
              <button type="button" className="add">
                Add To Cart
              </button>
            </div>
          </div>
        </div>
        <div>
          <h1 className="heading-similar">Similar Products</h1>
          <ul className="unordered">
            {similarProductsData.map(eachSimilarProducts => (
              <SimilarProductItem
                eachProduct={eachSimilarProducts}
                key={eachSimilarProducts.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderProductItem = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderProductItem()}
      </div>
    )
  }
}

export default ProductItemDetails
