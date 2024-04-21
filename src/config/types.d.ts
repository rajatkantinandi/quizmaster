export interface IConfig {
  env: 'local' | 'staging' | 'production';
  productName: string;
  productUrl: string;
}
