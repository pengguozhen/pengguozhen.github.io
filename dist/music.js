const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: true,
    autoplay: true,
    audio: [
      {
        name: "红玫瑰",
        artist: '陈奕迅',
        url: 'http://fs.open.kugou.com/56e53ea37edef5c0efa88de2486232aa/5cde6a64/G008/M08/07/17/SA0DAFT-vDKAVnOvADqfOLPG3ig724.mp3',
        cover: 'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=559398238b025aafd33279cdc3d6cc59/4a36acaf2edda3ccf85966c308e93901203f9290.jpg',
      
      },
      {
        name: '50 Ways to Say Goodbye',
        artist: 'Train',
        url: 'http://fs.open.kugou.com/c2d9326eb7e4636ebbabeb1a716d1434/5cde6e70/G008/M05/0F/0D/qIYBAFUPK_uAUi_TADy0h6Awamk850.mp3',
        cover: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/69/Train_50_Ways_to_Say_Goodbye.jpg/220px-Train_50_Ways_to_Say_Goodbye.jpg',
      },
      {
        name: '天份',
        artist: '薛之谦',
        url: 'http://fs.open.kugou.com/7225d7673398e4cc24c7d2bff4714a8d/5cde6f44/G111/M05/02/17/rw0DAFwgjH-AI3GZADyYcnfL7lU771.mp3',
        cover: 'https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=e5df4849be1c8701d6b6b5e01f44f912/e1fe9925bc315c60ff049d4280b1cb134854778e.jpg',
      }
    ]
});
