import { _ } from '../i18n';

// Docs

import docsList from './docs';
const _docsMenu = [];

let last_cate = null;

for (let i = 0; i < docsList.length; i++) {
  const item = docsList[i];
  if (item.indexOf('-') === -1) {
    last_cate = null;
    _docsMenu.push({
      label: _(`docs.${item}`),
      key: item,
      action: 'docs',
    });
    continue;
  }

  const cate = item.split('-')[0];
  const name = item.slice(cate.length + 1);
  if (last_cate !== cate) {
    last_cate = cate;
    _docsMenu.push({
      label: _(`docs.${cate}.${cate}`),
      key: cate[0],
      children: [
        {
          label: _(`docs.${cate}.${name}`),
          key: item,
          action: 'docs',
        },
      ],
    });
  } else {
    // @ts-ignore
    _docsMenu[_docsMenu.length - 1].children.push({
      label: _(`docs.${cate}.${name}`),
      key: item,
      action: 'docs',
    });
  }
}

export const docsMenu = _docsMenu;

// Surl

export const surlMenu = [
  {
    label: _('menu.surl.create'),
    key: 'surl-create',
    action: 'route',
  },
  {
    label: _('menu.surl.list'),
    key: 'surl-list',
    action: 'route',
  },
];

// Yiyan

export const yiyanMenu = [
  {
    label: _('menu.yiyan.show'),
    key: 'yiyan-show',
    action: 'route',
  },
  {
    label: _('menu.yiyan.create'),
    key: 'yiyan-create',
    action: 'route',
  },
  {
    label: _('menu.yiyan.list'),
    key: 'yiyan-list',
    action: 'route',
  },
];
