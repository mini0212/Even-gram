
function getRandomImageURL() {
	const randomId = Math.floor(Math.random() * 1000); // 0~999의 랜덤 ID
	return `https://picsum.photos/id/${randomId}/300/300`;
}

function getCachedImageURL(key, count) {
	let cachedImages = JSON.parse(localStorage.getItem(key));
	// 캐싱된 이미지가 없거나 개수가 부족하면 새로 생성
	if (!cachedImages || cachedImages.length < count) {
		cachedImages = Array.from({ length: count }, () => getRandomImageURL());
		localStorage.setItem(key, JSON.stringify(cachedImages));
	}
	return cachedImages;
}

function fetchUser() {
	fetch("../json/profile.json")
		.then((response) => {
			if (!response.ok) {
				console.log("error");
			}
			return response.json();
		})
		.then((data) => {
			console.log(data);
			renderUser(data.user);
			initializeTabs(".profile__tab-button-container", data.user.post);
		})
		.catch((error) => {
			console.log("JSON Fetching Error: ", error);
		});
}

function renderUser(user) {
	const profileImage = getCachedImageURL("profileImage", 1)[0];
	console.log(profileImage);
	document.querySelector(".nav__profile-name").textContent = user.nickName;
	document.querySelector(".profile__image").src = profileImage;
	document.querySelector(".profile__name").textContent = user.nickName;
	document.querySelector("#profile__post-info-posts").textContent =
		"게시물 " + user.post.posts.length;
	document.querySelector("#profile__post-info-followers").textContent =
		"팔로워 " + user.follower;
	document.querySelector("#profile__post-info-following").textContent =
		"팔로잉 " + user.following;
	document.querySelector(".profile__description-title").textContent =
		user.title;
	document.querySelector(".profile__description-sub-title").textContent =
		user.description;
}

function renderPosts(posts, type) {
	const postContainer = document.querySelector(
		".profile__post-section-container"
	);

	const cachedPostImages = getCachedImageURL(`${type}Images`, posts.length);

	postContainer.innerHTML = ""; // 기존 데이터 초기화
	posts.forEach((post, index) => {
		const postElement = document.createElement("div");
		postElement.className = "profile__post_item-container";

		const postImage = document.createElement("img");
		postImage.className = "profile__post_image";
		postImage.src = cachedPostImages[index];
		postImage.alt = `${type}_image`;

		if (post.image_count > 1) {
			const postImage = document.createElement("img");
			postImage.className = "profile__post_image-multiple";
			postImage.src = "./assets/icons/profile_post_multiple.png";
			postImage.alt = "post_image_multiple";
			postElement.append(postImage);
		}

		const hoverContainer = document.createElement("div");
		hoverContainer.className = "profile__post-hover-container";

		const hoverItem = document.createElement("div");
		hoverItem.className = "profile__post-hover-item";

		const likeIcon = document.createElement("img");
		likeIcon.src = "./assets/icons/profile_post_like.png";
		const likeSpan = document.createElement("span");
		likeSpan.textContent = post.likes;

		const commentIcon = document.createElement("img");
		commentIcon.src = "./assets/icons/profile_post_comment.png";
		const commentSpan = document.createElement("span");
		commentSpan.textContent = post.comments;

		hoverItem.appendChild(likeIcon);
		hoverItem.appendChild(likeSpan);
		hoverItem.appendChild(commentIcon);
		hoverItem.appendChild(commentSpan);

		hoverContainer.appendChild(hoverItem);

		postElement.append(postImage);
		postElement.append(hoverContainer);

		postContainer.appendChild(postElement);
	});
}

document.addEventListener("DOMContentLoaded", () => {
	fetchUser();
});

/* 프로필 탭 클릭 */

function initializeTabs(selector, posts, defaultIndex = 0) {
	const tabContainer = document.querySelectorAll(selector);

	// 초기값 지정
	tabContainer.forEach((tab, index) => {
		if (index === defaultIndex) {
			tab.classList.add("active");
			renderPosts(getFilteredPosts(posts, "posts"));
		} else {
			tab.classList.remove("active");
		}
	});

	tabContainer.forEach((tab) => {
		tab.addEventListener("click", () => {
			console.log(tab);
			tabContainer.forEach((t) => t.classList.remove("active"));
			tab.classList.add("active");
			const dataType = tab.getAttribute("data-type");
			const filteredPosts = getFilteredPosts(posts, dataType);
			 renderPosts(filteredPosts, dataType)
		});
	});
}

function getFilteredPosts(postlist, type) {
	console.log(postlist);
	if (!postlist || !postlist[type]) {
		return [];
	}
	return postlist[type];
}
