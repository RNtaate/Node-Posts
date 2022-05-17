let timelineHeading = document.querySelector(".timeline-div");
let mypostsHeading = document.querySelector(".your-posts-div");
let navbarClickables = document.getElementsByClassName("nav-clickable-item");
if(timelineHeading) {
  for(let element of navbarClickables){
    element.classList.remove('present');
    if(element.classList.contains('timeline-li')) {
      element.classList.add('present')
    }
  };
}

if(mypostsHeading) {
  for(let element of navbarClickables){
    element.classList.remove('present');
    if(element.classList.contains('myposts-li')) {
      element.classList.add('present')
    }
  };
}