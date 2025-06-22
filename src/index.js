const BASE_URL = 'http://localhost:3000/posts';
let currentPostId = null;


function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById('post-list');
      postList.innerHTML = '';
      posts.forEach(post => {
        const div = document.createElement('div');
        div.textContent = post.title;
        div.addEventListener('click', () => handlePostClick(post.id));
        postList.appendChild(div);
      });

      
      if (posts.length > 0) {
        handlePostClick(posts[0].id);
      }
    });
}


function handlePostClick(postId) {
  fetch(`${BASE_URL}/${postId}`)
    .then(res => res.json())
    .then(post => {
      currentPostId = post.id;
      const detail = document.getElementById('post-detail');
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <img src="${post.image}" alt="Post image" style="width:600px";"hieght:200px";><br>
        <p>${post.content}</p>
        <p><strong>Author:</strong> ${post.author}</p>
        <button id="edit-button">Edit</button>
        <button id="delete-button">Delete</button>

        <form id="edit-post-form" class="hidden">
          <h4>Edit Post</h4>
          <input type="text" id="edit-title" value="${post.title}" required><br><br>
          <textarea id="edit-content" rows="5" required>${post.content}</textarea><br><br>
          <button type="submit">Update Post</button>
          <button type="button" id="cancel-edit">Cancel</button>
        </form>
      `;

      document.getElementById('edit-button').addEventListener('click', showEditForm);
      document.getElementById('delete-button').addEventListener('click', deletePost);
      document.getElementById('edit-post-form').addEventListener('submit', updatePost);
      document.getElementById('cancel-edit').addEventListener('click', hideEditForm);
    });
}


function showEditForm() {
  document.getElementById('edit-post-form').classList.remove('hidden');
}
function hideEditForm() {
  const confirmCancel = confirm("Are you sure you want to cancel editing?");
  if (confirmCancel) {
    
    document.getElementById('edit-post-form').classList.add('hidden');

    
    document.getElementById('edit-title').value = '';
    document.getElementById('edit-content').value = '';
  }
}



function updatePost(e) {
  e.preventDefault();
  const updatedTitle = document.getElementById('edit-title').value;
  const updatedContent = document.getElementById('edit-content').value;

  fetch(`${BASE_URL}/${currentPostId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: updatedTitle,
      content: updatedContent
    })
  })
    .then(res => res.json())
    .then(() => {
      displayPosts(); 
      handlePostClick(currentPostId); 
    });
}


function deletePost() {
  fetch(`${BASE_URL}/${currentPostId}`, {
    method: 'DELETE'
  })
    .then(() => {
      displayPosts(); 
      const detail = document.getElementById('post-detail');
      detail.innerHTML = `<h2>Select a post to view details</h2>`;
    });
}


function addNewPostListener() {
  const form = document.getElementById("new-post-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const newPost = {
      title: document.getElementById("new-title").value,
      content: document.getElementById("new-content").value,
      author: document.getElementById("new-author").value,
      image: document.getElementById("new-image").value || "" 
    };

    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(addedPost => {
        displayPosts(); 
        form.reset();   
      });
  });
}



function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener('DOMContentLoaded', main);
