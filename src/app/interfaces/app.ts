export interface App {
  id: string;
  desc: string;
  downloads: number;
  images: string[];
  owner: string;
  public: boolean;
  rating: {
    numberOfReviews: number;
    stars: number;
  };
  title: string;
  urls: string[];
}
