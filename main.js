let webms = [];
let startCounter = 0;
let endCounter;

function playVideo(){
    let source = document.createElement('source');
    let webm = [];
    if(document.getElementsByName('position')[0].checked)
        webm = webms[startCounter];
    else
        webm = webms[endCounter];

    source.setAttribute('src', webm);
    source.setAttribute('onerror', 'nextVideo()');
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
    endCounter = webms.length-1;
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
    xhr.open('GET', 'https://api.codetabs.com/v1/proxy?quest=' + url);
    xhr.send();
}


function process(){
    let url = document.getElementsByName("search")[0].value;
    url = url.replace('.html', '.json');
    console.log(url);

    getThread(url, getWebms);

}

function nextVideo(){
    if(document.getElementsByName('position')[0].checked && startCounter < webms.length-1)
        ++startCounter;
    else if(endCounter > 0)
        --endCounter;

    playVideo();
}

function prevVideo(){
    if(document.getElementsByName('position')[0].checked && startCounter > 0)
        --startCounter;
    else if(endCounter < webms.length-1)
        ++endCounter;

    playVideo();
}
