let webms = [];

function playVideo(){
    let source = document.createElement('source');
    let webm = [];
    if(document.getElementsByName('position')[0].checked)
        webm = webms.shift();
    else
        webm = webms.pop();
    console.log(webms);
    source.setAttribute('src', webm);
    if(webm.match(/.webm/i))
        source.setAttribute('type', 'video/webm');
    else
        source.setAttribute('type', 'video/mp4');
    let video = document.getElementById('video');

    if(video.firstElementChild != null)
        video.removeChild(video.firstElementChild);
    video.appendChild(source);
    video.load();

    
}

function getWebms(response){
    const postCount = response["threads"]["0"]["posts"].length;
    const posts = response["threads"]["0"]["posts"];

       for(let i = 0, j = 0; i < postCount; i++)
        if(posts[i]["files"].length > 0)
          for(let k=0; k<posts[i]["files"].length; k++)
            if(posts[i]["files"][k]["path"].match(/.webm/i) || posts[i]["files"][k]["path"].match(/.mp4/i))
              webms[j++] = 'https://2ch.hk' + posts[i]["files"][k]["path"];
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
