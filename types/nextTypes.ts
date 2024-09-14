export interface NextPageBaseProps {
  params: NextParams;
  searchParams: NextSearchParams;
}

export type NextParams = { slug: string };
export type NextSearchParams = { [key: string]: string | string[] | undefined };
