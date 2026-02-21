import { basic, initNav, initTopbar } from './modules/layouts';
import { initLocaleDatetime, loadImg, initHomeFilters, initHomeCarousel } from './modules/components';

loadImg();
initLocaleDatetime();
initNav();
initTopbar();
initHomeFilters();
initHomeCarousel();
basic();
