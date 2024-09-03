export const createGallery = imgInfo => {
  return `<li class="gallery-item">
  <a class="img-link" href="${imgInfo.largeImageURL}">
  <img class="gallery-img" src="${imgInfo.webformatURL}" alt="${imgInfo.tags}" width="360" height="200"/>
  </a>
  <div class="inf-box">
  <b class="img-prop">Likes: <span class="img-prop-value">${imgInfo.likes}</span></b>
  <b class="img-prop">Views: <span class="img-prop-value">${imgInfo.views}</span></b>
  <b class="img-prop">Comments: <span class="img-prop-value">${imgInfo.comments}</span></b>
  <b class="img-prop">Downloads: <span class="img-prop-value">${imgInfo.downloads}</span></b>
  </div>
  </li>`;
};

export const addElToHTML = (gallery, galleryList) => {
  galleryList.innerHTML = gallery;
};
export const cleanElHTML = galleryList => {
  galleryList.innerHTML = '';
};
