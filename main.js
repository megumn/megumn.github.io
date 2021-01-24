let webms = [];
let startCounter = 0;
let endCounter;
let slider = document.createElement('input');
let scontainer = document.getElementById('slidercontainer');
let svalue = document.createElement('span');

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


    slider.setAttribute('type', 'range');
    slider.setAttribute('min', 0);
    slider.setAttribute('max', webms.length-1);
    slider.setAttribute('id', 'slider');
    scontainer.appendChild(slider);

    svalue.setAttribute('id', 'slidervalue');
    scontainer.appendChild(svalue);

    if(document.getElementsByName('position')[0].checked) {
        slider.setAttribute('value', 0);
        slider.value = 0
        svalue.innerHTML = 0;
    }else{
        slider.setAttribute('value', webms.length-1);
        slider.value = webms.length-1;
        svalue.innerHTML = webms.length-1;
    }

    slider.onchange = function() {
        slider.setAttribute('value', this.value);
        slider.value = this.value
        svalue.innerHTML = this.value;
        if(document.getElementsByName('position')[0].checked)
            startCounter = this.value;
        else
            endCounter = this.value;
        playVideo();
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
    let svalue = document.getElementById('slidervalue');
    let slider = document.getElementById('slider');
    if(document.getElementsByName('position')[0].checked && startCounter < webms.length-1){
        ++startCounter;
        slider.setAttribute('value', startCounter);
        slider.value = startCounter;
        svalue.innerHTML = startCounter;
    }else if(endCounter > 0){
        --endCounter;
        slider.setAttribute('value', endCounter);
        slider.value = endCounter;
        svalue.innerHTML = endCounter;
    }

    playVideo();
}

function prevVideo(){
    let svalue = document.getElementById('slidervalue');
    let slider = document.getElementById('slider');
    if(document.getElementsByName('position')[0].checked && startCounter > 0){
        --startCounter;
        slider.setAttribute('value', startCounter);
        slider.value = startCounter;
        svalue.innerHTML = startCounter;
    }else if(endCounter < webms.length-1){
        ++endCounter;
        slider.setAttribute('value', endCounter);
        slider.value = endCounter;
        svalue.innerHTML = endCounter;
    }

    playVideo();
}
