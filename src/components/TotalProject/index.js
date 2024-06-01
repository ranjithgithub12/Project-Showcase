import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import ListOfProject from '../ListOfProject'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class TotalProject extends Component {
  state = {
    projectList: [],
    selectVlaue: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getAllProjects()
  }

  getAllProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})

    const {selectVlaue} = this.state

    const api = `https://apis.ccbp.in/ps/projects?category=${selectVlaue}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(api, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const updatedData = data.projects.map(eachList => ({
        id: eachList.id,
        imageUrl: eachList.image_url,
        name: eachList.name,
      }))
      this.setState({
        projectList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSelectValue = event => {
    this.setState({selectVlaue: event.target.value}, this.getAllProjects)
  }
  onClickRetry = () => {
    this.getAllProjects()
  }
  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="TailSpin" color="blue" height="50" width="50" />
    </div>
  )
  renderSuccessView = () => {
    const {projectList} = this.state

    return (
      <ul className="unorder-project-list">
        {projectList.map(eachList => (
          <ListOfProject key={eachList.id} eachList={eachList} />
        ))}
      </ul>
    )
  }
  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button className="retry-button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderAllProject = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {selectVlaue} = this.state

    return (
      <div className="app-container">
        <Header />
        <div className="project-container">
          <select
            className="select-input"
            value={selectVlaue}
            onChange={this.onChangeSelectValue}
          >
            {categoriesList.map(eachList => (
              <option key={eachList.id} value={eachList.id}>{eachList.displayText}</option>
            ))}
          </select>
          {this.renderAllProject()}
        </div>
      </div>
    )
  }
}

export default TotalProject
