import { RouteRecordRaw } from 'vue-router';
import { MenuOption, MenuDividerOption, MenuGroupOption } from 'naive-ui';
import { _ } from '../i18n';

export default (routes: Array<RouteRecordRaw>) => {
  const menu: Array<MenuOption | MenuDividerOption | MenuGroupOption> = [];
  let cate = '';
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    if (route.meta?.showInMenu === false) continue;
    const option: MenuOption = {
      label: _(`docs.${route.name}`),
      key: route.name,
    };
    if (route.meta?.cate) {
      if (route.meta.cate === cate) {
        menu[menu.length - 1].children.push(option);
      } else {
        cate = route.meta.cate;
        menu.push({
          type: 'group',
          label: _(`docs.${cate}`),
          children: [option],
        });
      }
    } else {
      menu.push(option);
    }
  }
  return menu;
};
