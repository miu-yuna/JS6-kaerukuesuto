var canvas, g;
var maptip;
var map;
var posx, posy;
var imgKaeru, imgMarisa;
var MapWidth = 16;
var MapHeight = 16;
var MapDrawWidth = 9;
var MapDrawHeight = 9;
var DrawSize = 64;
var AnimationNum = 16;
var scrollX, scrollY;
var frameCount;
var currentKey;

onload = function () {
  // 描画コンテキストの取得
  canvas = document.getElementById("gamecanvas");
  g = canvas.getContext("2d");
  // 初期化
  init();
  // 入力処理の指定
  document.onkeydown = keydown;
  document.onkeyup = keyup;
  // ゲームループの設定 60FPS
  setInterval("gameloop()", 16);
};

function init() {
  // マップの定義 0草 1木 2水 3山
  map = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
    [2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
    [2, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 3, 3, 3, 2, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 3, 3, 3, 2, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 3, 3, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2],
  ];
  // マップチップの読込
  maptip = [];
  for (var i = 0; i < 4; i++) {
    maptip[i] = new Image();
    maptip[i].src = "./maptip" + i + ".png";
  }
  // 初期位置
  posx = 5;
  posy = 5;
  // キャラ画像読込
  imgKaeru = [];
  for (var i = 0; i < 2; i++) {
    imgKaeru[i] = new Image();
    imgKaeru[i].src = "./kaeru" + i + ".png";
  }
  // その他
  scrollX = 0;
  scrollY = 0;
  frameCount = 0;
  currentKey = -1;
}

function keydown(e) {
  currentKey = e.keyCode;
}
function keyup(e) {
  currentKey = -1;
}
function inputCheck() {
  if (scrollX != 0 || scrollY != 0) return;

  var x = posx;
  var y = posy;
  var animx = 0;
  var animy = 0;
  if (currentKey == 37) {
    // 左
    x = (posx - 1 + MapWidth) % MapWidth;
    animx = -1;
  } else if (currentKey == 38) {
    // 上
    y = (posy - 1 + MapHeight) % MapHeight;
    animy = -1;
  } else if (currentKey == 39) {
    // 右
    x = (posx + 1) % MapWidth;
    animx = 1;
  } else if (currentKey == 40) {
    // 下
    y = (posy + 1) % MapHeight;
    animy = 1;
  }

  // 当たり判定
  if (map[y][x] == 0 || map[y][x] == 1) {
    // 移動可能なら移動
    posx = x;
    posy = y;
    scrollX = animx * DrawSize;
    scrollY = animy * DrawSize;
  } else {
    // 移動不可なら壁当たりのアニメーション
    scrollX = -1 * animx * ((DrawSize / AnimationNum) * 3);
    scrollY = -1 * animy * ((DrawSize / AnimationNum) * 3);
  }
}
function gameloop() {
  update();
  draw();
}

function update() {
  inputCheck();

  // マップスクロール量の更新
  if (scrollX > 0) scrollX -= DrawSize / AnimationNum;
  if (scrollX < 0) scrollX += DrawSize / AnimationNum;
  if (scrollY > 0) scrollY -= DrawSize / AnimationNum;
  if (scrollY < 0) scrollY += DrawSize / AnimationNum;

  frameCount++;
}

function draw() {
  // マップの描画
  var startX = Math.floor((canvas.width - MapDrawWidth * DrawSize) / 2);
  var startY = Math.floor((canvas.height - MapDrawHeight * DrawSize) / 2);
  for (var i = 0; i < MapDrawHeight; i++) {
    for (var j = 0; j < MapDrawWidth; j++) {
      // 始点の算出
      var x = (posx - Math.floor(MapDrawWidth / 2) + j + MapWidth) % MapWidth;
      var y = (posy - Math.floor(MapDrawHeight / 2) + i + MapHeight) % MapHeight;
      // マップチップの描画
      g.drawImage(
        maptip[map[y][x]],
        startX + j * DrawSize + scrollX,
        startY + i * DrawSize + scrollY,
        DrawSize,
        DrawSize
      );
    }
  }
  // キャラの描画
  g.drawImage(
    imgKaeru[Math.floor(frameCount / 10) % 2],
    Math.floor((canvas.width - DrawSize) / 2),
    Math.floor((canvas.height - DrawSize) / 2) - DrawSize / 6,
    DrawSize,
    DrawSize
  );
}
