import { advancedComponents, basicComponents } from '../../configs/components';
import { parse } from 'query-string';

Page({
  data: {
    tabs: [{ title: 'Basic components' }, { title: 'Advanced components' }],
    activeTab: 0,
    basicComponents,
    advancedComponents,
  },
  onLoad(params) {
    const query = parse(params || '');
    if (query && query.page) {
      my.navigateTo({ url: query.page });
    }
  },
  onTabClick({ index, tabsName }) {
    this.setData({
      [tabsName]: index,
    });
  },
  onTabChange({ index, tabsName }) {
    this.setData({
      [tabsName]: index,
    });
  },
});
