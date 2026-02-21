import { basic, initTopbar, initNav } from './modules/layouts';

import {
  loadImg,
  imgPopup,
  initLocaleDatetime,
  initClipboard,
  initToc,
  loadMermaid,
  initReadingProgress,
  initCodeWrap
} from './modules/components';

loadImg();
initToc();
imgPopup();
initNav();
initLocaleDatetime();
initClipboard();
initCodeWrap();
initTopbar();
initReadingProgress();
loadMermaid();
basic();
