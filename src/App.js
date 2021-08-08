import telepost from './Assets/telepost.png'
import defaultProfile from './Assets/defaultProfile.png'
import './App.css'
import { Component } from 'react'
import Signup from './Forms/Signup'
import Signin from './Forms/Signin'
import Post from './Post/Post'
import Lottie from 'react-lottie'
import emptyAnimationData from './Assets/emptyLottie.json'
import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import axios from 'axios'

// import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import {
  ALLPOSTS_URL,
  DELETEPOST_URL,
  DISLIKEPOST_URL,
  EDITPOST_URL,
  LIKEPOST_URL,
  POST_URL,
  USERDATA_URL,
} from './config/constants'

class App extends Component {
  state = {
    displayMode: 0, // 0 - SignUp, 1 - SignIn, 2 - Dashboard
    currentUser: {
      id: '52730503',
      name: 'Python',
    },
    inputMode: 'Post',
    posts: [],
    token: '',
    tempPost: {
      id: '',
      text: '',
      author: 'Python',
      authorPic: defaultProfile,
      likes: [],
      dislikes: [],
      currentUserLike: 0,
    },
  }
  defaultLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: emptyAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  showNotification = (message) => {
    store.addNotification({
      content: <div className='notificationDiv'>{message}</div>,
      type: 'success',
      insert: 'bottom',
      container: 'bottom-left',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 2000,
      },
    })
  }

  showPosts = (token) => {
    axios
      .get(ALLPOSTS_URL, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        var tokenPosts = []

        console.log(response.data)
        for (var i = 0; i < response.data.length; i++) {
          tokenPosts[i] = {
            id: response.data[i]._id,
            author: response.data[i].author,
            text: response.data[i].content,
            authorPic: defaultProfile,
            likes: response.data[i].likes,
            dislikes: response.data[i].dislikes,
            currentUserLike: 0,
          }
          if (response.data[i].likes.includes(this.state.currentUser.id)) {
            tokenPosts[i].currentUserLike = 1
          }
          if (response.data[i].dislikes.includes(this.state.currentUser.id)) {
            tokenPosts[i].currentUserLike = -1
          }
        }

        this.setState({
          posts: tokenPosts,
        })
      })
      .catch((error) => console.log(error))
  }

  changeForm = () => {
    var tempDisplayMode = this.state.displayMode
    if (tempDisplayMode === 0) tempDisplayMode = 1
    else tempDisplayMode = 0
    this.setState({
      displayMode: tempDisplayMode,
    })
  }

  formSubmit = (token) => {
    const tokenUser = {}
    this.showNotification('Processing...')

    axios
      .get(USERDATA_URL, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        tokenUser.id = response.data.id
        tokenUser.name = response.data.name
        console.log(
          response.data.email +
            ' | ' +
            response.data.id +
            ' | ' +
            response.data.name
        )

        this.showNotification('Successfully signed in as ' + tokenUser.name)

        this.setState({
          displayMode: 2,
          currentUser: tokenUser,
          token: token,
          tempPost: {
            id: '',
            text: '',
            author: tokenUser.name,
            authorPic: defaultProfile,
            likes: [],
            dislikes: [],
            currentUserLike: 0,
          },
          inputMode: 'Post',
        })
      })
      .catch((error) => console.log(error))
    this.showPosts(token)
  }

  signOut = () => {
    this.setState({
      displayMode: 0,
    })
    this.showNotification('Signed out!')
  }

  inputChangeHandler = (event) => {
    const tempId = this.state.tempPost.id
    const tempAuthor = this.state.tempPost.author
    const tempAuthorPic = this.state.tempPost.authorPic
    const tempLikes = this.state.tempPost.likes
    const tempDislikes = this.state.tempPost.Dislikes
    const tempCurrentUserLike = this.state.tempPost.currentUserLike
    this.setState({
      tempPost: {
        id: tempId,
        text: event.target.value,
        author: tempAuthor,
        authorPic: tempAuthorPic,
        likes: tempLikes,
        dislikes: tempDislikes,
        currentUserLike: tempCurrentUserLike,
      },
    })
  }

  createPost = () => {
    if (this.state.tempPost.text.trim().length === 0) return

    if (this.state.inputMode === 'Post') {
      axios
        .post(
          POST_URL,
          {
            author: this.state.currentUser.name,
            content: this.state.tempPost.text,
          },
          {
            headers: {
              Authorization: this.state.token,
            },
          }
        )
        .then((response) => {
          this.showNotification('Post shared!')
          this.showPosts(this.state.token)
        })
        .catch((error) => console.log(error))
    } else {
      axios
        .post(
          EDITPOST_URL,
          {
            id: this.state.tempPost.id,
            author: this.state.currentUser.name,
            content: this.state.tempPost.text,
          },
          {
            headers: {
              Authorization: this.state.token,
            },
          }
        )
        .then((response) => {
          this.showNotification('Post edited!')
          this.showPosts(this.state.token)
        })
        .catch((error) => console.log(error))
    }
    this.setState({
      inputMode: 'Post',
      tempPost: {
        id: '',
        text: '',
        author: 'Jarvis',
        authorPic: defaultProfile,
        likes: [],
        dislikes: [],
        currentUserLike: 0,
      },
    })
  }

  editPost = (index) => {
    if (this.state.posts[index].author === this.state.currentUser.name) {
      var tempPostsArr = [...this.state.posts]
      var postToEdit = tempPostsArr[index]
      tempPostsArr.splice(index, 1)
      this.setState({
        tempPost: { ...postToEdit },
        posts: tempPostsArr,
        inputMode: 'Edit',
      })
    } else {
      this.showNotification('Only creator of this post can delete this post.')
    }
  }

  deletePost = (index) => {
    if (this.state.posts[index].author === this.state.currentUser.name) {
      axios
        .post(
          DELETEPOST_URL,
          {
            id: this.state.posts[index].id,
            author: this.state.currentUser.name,
          },
          {
            headers: {
              Authorization: this.state.token,
            },
          }
        )
        .then((response) => {
          this.showNotification('Post Deleted!')
          this.showPosts(this.state.token)
        })
        .catch((error) => console.log(error))
    } else {
      this.showNotification('Only creator of this post can delete this post.')
    }
  }

  likePost = (index) => {
    console.log('Like')
    var tempCurrentUserLike = this.state.posts[index].currentUserLike
    var tempAllPosts = [...this.state.posts]
    var postToEdit = { ...this.state.posts[index] }
    if (tempCurrentUserLike === 1) {
      tempCurrentUserLike = 0
      //
      axios
        .post(
          LIKEPOST_URL,
          {
            id: this.state.posts[index].id,
            hasLiked: false,
          },
          {
            headers: {
              Authorization: this.state.token,
            },
          }
        )
        .then((response) => console.log(response))
        .catch((err) => console.log(err))
      //
      postToEdit.likes = postToEdit.likes.filter((value, index, arr) => {
        return value !== this.state.currentUser.id
      })
    } else {
      tempCurrentUserLike = 1
      //
      axios
        .post(
          LIKEPOST_URL,
          {
            id: this.state.posts[index].id,
            hasLiked: true,
          },
          {
            headers: {
              Authorization: this.state.token,
            },
          }
        )
        .then((response) => console.log(response))
        .catch((err) => console.log(err))
      //
      axios
        .post(
          DISLIKEPOST_URL,
          {
            id: this.state.posts[index].id,
            hasDisliked: false,
          },
          {
            headers: {
              Authorization: this.state.token,
            },
          }
        )
        .then((response) => console.log(response))
        .catch((err) => console.log(err))
      //
      postToEdit.dislikes = postToEdit.dislikes.filter((value, index, arr) => {
        return value !== this.state.currentUser.id
      })
      postToEdit.likes.push(this.state.currentUser.id)
    }
    postToEdit.currentUserLike = tempCurrentUserLike
    tempAllPosts[index] = postToEdit
    this.setState({
      posts: tempAllPosts,
    })
  }

  dislikePost = (index) => {
    console.log('Dislike')
    var tempCurrentUserLike = this.state.posts[index].currentUserLike
    var tempAllPosts = [...this.state.posts]
    var postToEdit = { ...this.state.posts[index] }
    if (tempCurrentUserLike === -1) {
      tempCurrentUserLike = 0
      //
      axios
        .post(
          DISLIKEPOST_URL,
          {
            id: this.state.posts[index].id,
            hasDisliked: false,
          },
          {
            headers: {
              Authorization: this.state.token,
            },
          }
        )
        .then((response) => console.log(response))
        .catch((err) => console.log(err))
      //
      postToEdit.dislikes = postToEdit.dislikes.filter((value, index, arr) => {
        return value !== this.state.currentUser.id
      })
    } else {
      tempCurrentUserLike = -1
      //
      axios
        .post(
          LIKEPOST_URL,
          {
            id: this.state.posts[index].id,
            hasLiked: false,
          },
          {
            headers: {
              Authorization: this.state.token,
            },
          }
        )
        .then((response) => console.log(response))
        .catch((err) => console.log(err))
      //
      axios
        .post(
          DISLIKEPOST_URL,
          {
            id: this.state.posts[index].id,
            hasDisliked: true,
          },
          {
            headers: {
              Authorization: this.state.token,
            },
          }
        )
        .then((response) => console.log(response))
        .catch((err) => console.log(err))
      //
      postToEdit.likes = postToEdit.likes.filter((value, index, arr) => {
        return value !== this.state.currentUser.id
      })
      postToEdit.dislikes.push(this.state.currentUser.id)
    }
    postToEdit.currentUserLike = tempCurrentUserLike
    tempAllPosts[index] = postToEdit
    this.setState({
      posts: tempAllPosts,
    })
  }

  render() {
    var loginPageDiv = null
    var loginForm = null
    var dashboardPageDiv = null
    var lottieDiv = null

    if (this.state.posts.length === 0) {
      lottieDiv = (
        <div className='lottie-div'>
          <Lottie
            options={this.defaultLottieOptions}
            height={400}
            width={400}
          ></Lottie>
          <div className='emptyText'>
            Your Timeline is Empty! Create a post to start....
          </div>
        </div>
      )
    }

    if (this.state.displayMode === 0) {
      loginForm = (
        <Signup
          notify={(message) => this.showNotification(message)}
          change={this.changeForm}
          submit={(username) => this.formSubmit(username)}
        ></Signup>
      )
    } else {
      loginForm = (
        <Signin
          notify={(message) => this.showNotification(message)}
          change={this.changeForm}
          submit={(username) => this.formSubmit(username)}
        ></Signin>
      )
    }

    if (this.state.displayMode !== 2) {
      loginPageDiv = (
        <div className='loginPageBackground'>
          <div className='loginPageDiv'>{loginForm}</div>
        </div>
      )
    } else {
      dashboardPageDiv = (
        <div className='dashboardPageDiv'>
          <div className='header'>
            <img src={telepost} className='telepost' alt='telepost'></img>
            <span>
              <h1>PostMe</h1>
            </span>
            <div className='currentUserDiv'>
              <div className='author-div'>
                <i className='fas fa-user-alt'></i>

                <div className='author-name'>{this.state.currentUser.name}</div>
              </div>
            </div>
          </div>
          <div className='createPostDiv'>
            <input
              type='text'
              className='input'
              placeholder='Make Your Post...'
              value={this.state.tempPost.text}
              onChange={(event) => {
                this.inputChangeHandler(event)
              }}
              required
            />

            <button className='createPostButton' onClick={this.createPost}>
              <i class='fas fa-plus'></i>
            </button>
          </div>
          {lottieDiv}
          <div className='timeline-div'>
            {this.state.posts.map((post, index) => {
              return (
                <Post
                  key={post.id}
                  text={post.text}
                  authorName={post.author}
                  authorPic={post.authorPic}
                  likesArr={post.likes}
                  dislikesArr={post.dislikes}
                  edit={this.editPost.bind(this, index)}
                  delete={this.deletePost.bind(this, index)}
                  like={this.likePost.bind(this, index)}
                  dislike={this.dislikePost.bind(this, index)}
                  currentUserLike={post.currentUserLike}
                ></Post>
              )
            })}
          </div>
          <button className='form-btn sign-out-btn' onClick={this.signOut}>
            Sign Out
          </button>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
            <path
              fill='#9A9FFA'
              fill-opacity='1'
              d='M0,224L34.3,218.7C68.6,213,137,203,206,208C274.3,213,343,235,411,213.3C480,192,549,128,617,117.3C685.7,107,754,149,823,154.7C891.4,160,960,128,1029,144C1097.1,160,1166,224,1234,261.3C1302.9,299,1371,309,1406,314.7L1440,320L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z'
            ></path>
          </svg>
        </div>
      )
    }

    return (
      <div className='App'>
        <ReactNotification />
        {loginPageDiv}
        {dashboardPageDiv}
      </div>
    )
  }
}

export default App
