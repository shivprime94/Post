import React from 'react'
import './Post.css'

const Post = (props) => {
  var likeClasses = ['im', 'like-img', 'im-thumb-up']
  var dislikeClasses = ['im', 'like-img', 'im-thumb-down']
  var likes = props.likesArr.length - props.dislikesArr.length

  if (props.currentUserLike === 1) {
    likeClasses.push('green-txt')
  }
  if (props.currentUserLike === -1) {
    dislikeClasses.push('red-txt')
  }

  return (
    <div className='post-div'>
      <div className='post-header'>
        <div className='author-div'>
          <i className='fas fa-user-alt'></i>

          <div className='author-name'>{props.authorName}</div>
        </div>
        <div className='edit-btn-div shake-rotate'>
          <button className='edit'>
            <i class='fas fa-edit' aria-hidden='true' onClick={props.edit}></i>
          </button>
          <button class='remove'>
            <i
              class='fas fa-trash-alt'
              aria-hidden='true'
              onClick={props.delete}
            ></i>
          </button>
        </div>
      </div>
      <div className='post-text'>{props.text}</div>
      <div className='post-footer'>
        <div className='like-dislike-div'>
          <div className='like-div'>
            {/* <i className="far fa-thumbs-up" aria-hidden="true" onClick={props.like}></i> */}
            <i onClick={props.like} className={likeClasses.join(' ')}></i>
          </div>
          <div className='like-counter'>{likes}</div>
          <div className='dislike-div'>
            <i onClick={props.dislike} className={dislikeClasses.join(' ')}></i>
          </div>
        </div>
        <div class='share'>
          <i class='fas fa-share' aria-hidden='true'></i>
        </div>
      </div>
    </div>
  )
}

export default Post
