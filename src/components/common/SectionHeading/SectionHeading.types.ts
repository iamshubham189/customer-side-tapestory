export interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

export interface SectionHeadingWithViewAllProps {
  eyebrow: string;
  title: string;
  description?: string;
  actionLabel: string;
  actionHref: string;
  className?: string;
}

export interface BreadcrumbProps {
  items: { label: string; href?: string }[];
  className?: string;
}
