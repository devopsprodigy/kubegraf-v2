import { AppPlugin } from '@grafana/data';
import {GlobalSettings} from "./types";
import {ConfigPage} from "./page/Config";
import {App} from "./components/App";

export const plugin = new AppPlugin<GlobalSettings>().setRootPage(App).addConfigPage({
    title: 'Configuration',
    icon: 'cog',
    id: 'config',
    body: ConfigPage,
});

