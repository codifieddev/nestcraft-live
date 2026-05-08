export interface HeaderLink {
  title: string;
  href: string;
}

export interface HeaderSection {
  heading: string;
  links: HeaderLink[];
}

export interface HeaderColumn {
  sections: HeaderSection[];
}

export interface HeaderPromo {
  img?: string;
  href?: string;
}

export interface HeaderCategory {
  key: string;
  title: string;
  columns: HeaderColumn[];
  promo?: HeaderPromo;
}

export type HeaderData = HeaderCategory[];
