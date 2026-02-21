import { back2top, loadTooptip, modeWatcher, initAnalytics, initSearch } from '../components';

export function basic() {
  modeWatcher();
  back2top();
  loadTooptip();
  initAnalytics();
  initSearch();
}
