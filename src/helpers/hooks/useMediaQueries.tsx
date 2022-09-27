import { useMediaQuery } from "@mantine/hooks";
import theme from "../theme";

export const mobile = theme.breakpoints?.xs;
export const mobileQuery = `(max-width:${mobile}px)`;
export const mobileQueryWithMedia = `@media ${mobileQuery}`;

export const minDesktop = theme.breakpoints?.sm;
export const minDesktopQuery = `(min-width:${minDesktop}px)`;
export const minDesktopQueryWithMedia = `@media ${minDesktopQuery}`;

export const largeDesktop = theme.breakpoints?.lg;
export const largeDesktopQuery = `(min-width:${largeDesktop}px)`;
export const largeDesktopQueryWithMedia = `@media ${largeDesktopQuery}`;

export default function useMediaQueries() {
  const isMobile = useMediaQuery(mobileQuery);
  const isLargerThanTablet = useMediaQuery(minDesktopQuery);
  const isLargeDesktop = useMediaQuery(largeDesktopQuery);
  return {
    isMobile,
    isLargerThanTablet,
    isLargeDesktop,
  };
}

export function useLargerThanTablet(initial?: boolean) {
  const isLargerThanTablet = useMediaQuery(
    minDesktopQuery,
    initial,
    typeof initial === "boolean"
      ? { getInitialValueInEffect: false }
      : undefined
  );
  return isLargerThanTablet;
}
