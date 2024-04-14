import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider';
import type { LoadingBarApiInjection } from 'naive-ui/es/loading-bar/src/LoadingBarProvider';
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';

interface Naiveui {
  dialog: DialogApiInjection;
  loadingBar: LoadingBarApiInjection;
  message: MessageApiInjection;
}
const naiveui: Naiveui = {
  //@ts-ignore
  dialog: {},
  //@ts-ignore
  loadingBar: {},
  //@ts-ignore
  message: {},
};

export default naiveui;
