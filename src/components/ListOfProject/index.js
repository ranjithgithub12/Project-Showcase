import './index.css'

const ListOfProject = props => {
  const {eachList} = props
  const {id, imageUrl, name} = eachList

  return (
    <li className="list-of-project">
      <img src={imageUrl} alt={name} className="project-image" />
      <p className="name">{name}</p>
    </li>
  )
}

export default ListOfProject
