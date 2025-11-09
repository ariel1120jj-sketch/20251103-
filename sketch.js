// Author: tomxor. Translated and extended from https://www.dwitter.net/d/10534
// Original one-liner x.fillRect(0,0,i=2e3,i);for(t+=160;p=i&1,m=t/C(t/i)+p*(t/2+i%t),i--;);x.clearRect(960+m*S(n=t/9+i*i)*C(!p*i/t),540+m*C(n+p*2),s=3-C(n)*3,s)

// sketch.js 放在專案根目錄

let cnv;
const BASE_W = 800;
const BASE_H = 600;
let counter = 100;
let parity_flag = 0;
let menuDiv;
let viewerDiv; // iframe 檢視器容器

function setup() {
  // 全螢幕畫布（固定於 0,0），畫布放在較低的 z-index 讓選單覆蓋在上方
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  cnv.style('z-index', '0');
  stroke(255);

  // 建立左側固定選單（覆蓋在畫布上方）
  menuDiv = createDiv();
  menuDiv.id('p5-left-menu');
  menuDiv.style('position', 'fixed');
  menuDiv.style('left', '0px');
  menuDiv.style('top', '0px');
  menuDiv.style('height', '100%');
  menuDiv.style('width', '320px');
  menuDiv.style('background', 'rgba(18,18,18,0.96)');
  menuDiv.style('color', '#ffffff');
  menuDiv.style('padding', '48px 20px');
  menuDiv.style('box-sizing', 'border-box');
  menuDiv.style('z-index', '9999'); // 高於畫布
  menuDiv.style('pointer-events', 'auto');
  menuDiv.style('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", Arial');

  const items = [
    { text: '第一單元作品', href: '#' },
    { text: '第一單元講義', href: '#' },
    { text: '測驗系統', href: '#' },
    { text: '回到首頁', href: '#' }
  ];

  const ul = createElement('ul').parent(menuDiv);
  ul.style('list-style', 'none');
  ul.style('padding', '0');
  ul.style('margin', '0');

  items.forEach(it => {
    const li = createElement('li').parent(ul);
    li.style('margin-bottom', '18px');

    const a = createA(it.href, it.text).parent(li);
    a.style('color', '#ffffff');
    a.style('text-decoration', 'none');
    a.style('font-size', '32px'); // 要求字體大小
    a.style('line-height', '1');
    a.style('display', 'block');
    a.style('padding', '6px 8px');
    a.style('border-radius', '6px');

    // hover 效果
    a.elt.addEventListener('mouseenter', () => { a.style('background', 'rgba(255,255,255,0.06)'); });
    a.elt.addEventListener('mouseleave', () => { a.style('background', 'transparent'); });

    // 當點選「第一單元作品」時，開啟 iframe 檢視器並載入目標網址
    if (it.text === '第一單元作品') {
      const TARGET_URL = 'https://ariel1120jj-sketch.github.io/20251020-/';
      a.elt.addEventListener('click', (ev) => {
        ev.preventDefault();
        openViewer(TARGET_URL);
      });
    }

    // 點選「第一單元講義」顯示 HackMD
    if (it.text === '第一單元講義') {
      const TARGET_URL = 'https://hackmd.io/@x-szOgytSz69ItDTKuKmRg/BJCiwmCsge';
      a.elt.addEventListener('click', (ev) => {
        ev.preventDefault();
        openViewer(TARGET_URL);
      });
    }

    // 點選「測驗系統」顯示指定網址
    if (it.text === '測驗系統') {
      const TARGET_URL = 'https://ariel1120jj-sketch.github.io/20251103/';
      a.elt.addEventListener('click', (ev) => {
        ev.preventDefault();
        openViewer(TARGET_URL);
      });
    }
  }); // ← 補上 forEach 結尾

  // 建立隱藏的 iframe 檢視器（位於選單右側並覆蓋剩餘區域）
  viewerDiv = createDiv();
  viewerDiv.id('p5-doc-viewer');
  viewerDiv.style('position', 'fixed');
  viewerDiv.style('left', '320px');
  viewerDiv.style('top', '0px');
  viewerDiv.style('width', 'calc(100% - 320px)');
  viewerDiv.style('height', '100%');
  viewerDiv.style('background', '#ffffff');
  viewerDiv.style('z-index', '10000');
  viewerDiv.style('display', 'none');
  viewerDiv.style('box-shadow', '-6px 0 16px rgba(0,0,0,0.25)');
  viewerDiv.style('overflow', 'hidden');

  // 關閉按鈕
  const closeBtn = createButton('關閉').parent(viewerDiv);
  closeBtn.id('p5-doc-close');
  closeBtn.style('position', 'absolute');
  closeBtn.style('right', '18px');
  closeBtn.style('top', '18px');
  closeBtn.style('z-index', '10001');
  closeBtn.style('background', 'rgba(0,0,0,0.6)');
  closeBtn.style('color', '#fff');
  closeBtn.style('border', 'none');
  closeBtn.style('padding', '8px 12px');
  closeBtn.style('font-size', '16px');
  closeBtn.style('cursor', 'pointer');
  closeBtn.style('border-radius', '4px');
  closeBtn.mousePressed(() => closeViewer());

  // iframe 本體
  const iframe = createElement('iframe').parent(viewerDiv);
  iframe.id('p5-doc-iframe');
  iframe.attribute('src', '');
  iframe.attribute('title', '文件檢視器');
  iframe.attribute('allow', 'accelerometer; device-motion; device-orientation');
  iframe.style('width', '100%');
  iframe.style('height', '100%');
  iframe.style('border', '0');
}

function openViewer(url) {
  const iframe = select('#p5-doc-iframe');
  const viewer = select('#p5-doc-viewer');
  if (iframe && viewer) {
    iframe.elt.src = url;
    viewer.style('display', 'block');
  }
}

function closeViewer() {
  const iframe = select('#p5-doc-iframe');
  const viewer = select('#p5-doc-viewer');
  if (iframe && viewer) {
    iframe.elt.src = '';
    viewer.style('display', 'none');
  }
}

function draw() {
  // 背景在畫布上（選單為獨立 DOM）
  background(0);
  counter += 0.01;

  for (let i = 2000; i > 0; i -= 2) {
    parity_flag = 0;
    drawPoints(i);
  }
  for (let i = 1999; i > 0; i -= 2) {
    parity_flag = 1;
    drawPoints(i);
  }
}

function drawPoints(i) {
  let radial_offset = counter / cos(counter / i) + parity_flag * (counter / 2 + i % counter);
  let angular_phase = counter / 9 + i * i;
  let x_position = width / 2 + radial_offset * sin(angular_phase) * cos(!parity_flag * i / counter);
  let y_position = height / 2 + radial_offset * cos(angular_phase + parity_flag * 2);

  let point_size = max(0.1, 1 - cos(angular_phase));
  strokeWeight(point_size);
  point(x_position, y_position);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  // 重新調整 viewer 的寬度以配合視窗
  const viewer = select('#p5-doc-viewer');
  if (viewer) {
    viewer.style('left', '320px');
    viewer.style('width', `calc(100% - 320px)`);
  }
 }