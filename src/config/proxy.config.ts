import fs from 'fs';
import yaml from 'js-yaml';

interface ProxyConfig {
  services: Array<{
    nameRoute: string,
    url: string,
    routes: Array<{ path:string }>
  }>
}

export default () : ProxyConfig => {
  try {
    const config: ProxyConfig = yaml.load(fs.readFileSync('proxy.config.yml', 'utf8')) as ProxyConfig;
    return config
  } catch (e: any) {
    throw new Error(`Proxy config file error: ${e.message}`)
  }
}