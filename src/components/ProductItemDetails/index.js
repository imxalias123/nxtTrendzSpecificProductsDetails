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
    const response = await fetch(options, apiUrl)
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
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="error-img"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  renderLoader = () => (
    <div className="" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

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
      <div>
        <div>
          <img src={imageUrl} alt="product" />
          <div>
            <h1>{title}</h1>
            <p>RS {price}/- </p>
            <div>
              <div>
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
                <p>{totalReviews} Reviews</p>
              </div>
              <p>{description}</p>
              <div>
                <p>Available:</p>
                <p>{availability}</p>
              </div>
              <div>
                <p>Brand:</p>
                <p>{brand}</p>
              </div>
              <hr />
              <div>
                <button type="button" className="minus">
                  <BsDashSquare />
                </button>
                <p>{quantity}</p>
                <button type="button">
                  <BsPlusSquare />
                </button>
              </div>
              <button type="button">Add To Cart</button>
            </div>
          </div>
        </div>
        <div>
          <h1>Similar Products</h1>
          <ul>
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
