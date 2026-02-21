import { basic, initNav, initTopbar } from './modules/layouts';
import {
  loadImg,
  imgPopup,
  initClipboard,
  loadMermaid,
  initCodeWrap
} from './modules/components';

loadImg();
imgPopup();
initNav();
initTopbar();
initClipboard();
initCodeWrap();
loadMermaid();
basic();
