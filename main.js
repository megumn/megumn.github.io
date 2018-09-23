let webms = [];

function playVideo(){
    let source = document.createElement('source');
    let webm = webms.shift();
    console.log(webms);
    source.setAttribute('src', webm);
    source.setAttribute('type', 'video/webm');
    let video = document.getElementById('video');

    if(video.firstElementChild != null)
        video.removeChild(video.firstElementChild);
    video.appendChild(source);
    video.load();

    
}

function getWebms(response){
    const postCount = response["threads"]["0"]["posts"].length;
    const posts = response["threads"]["0"]["posts"];

    for(let i = 0, j = 0; i < postCount; i++){
        if(posts[i]["files"].length > 0 &&
           posts[i]["files"]["0"]["path"].match(/.webm/i))
            webms[j++] = 'https://2ch.hk' + posts[i]["files"]["0"]["path"];
        
    }

    playVideo();
}

function getThread(url) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            getWebms(xhr.response);
        }

    }
    xhr.open('GET', 'https://cors.io/?' + url);
    xhr.send();
}


function process(){
    let url = document.getElementsByName("search")[0].value;
    url = url.replace('.html', '.json');
    console.log(url);

    getThread(url, getWebms);
    
}

function nextVideo(){
    playVideo();
}
