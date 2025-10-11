export type PortfolioMedia = {
  'pi-github'?: string;
  'pi-youtube'?: string;
  'pi-external-link'?: string;
}

export type PortfolioEntry = {
  title: string;
  description: string;
  image?: string[];
  media?: PortfolioMedia;
};
